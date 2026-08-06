from collections import Counter
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import db
from app.core.security import get_current_user


router = APIRouter(prefix="/passport", tags=["passport"])

STAMP_GOAL = 5

DESTINATIONS: tuple[Dict[str, str], ...] = (
    {"slug": "japan", "name": "Japan", "cuisine": "Japanese"},
    {"slug": "india", "name": "India", "cuisine": "Indian"},
    {"slug": "italy", "name": "Italy", "cuisine": "Italian"},
    {"slug": "mexico", "name": "Mexico", "cuisine": "Mexican"},
    {"slug": "thailand", "name": "Thailand", "cuisine": "Thai"},
    {"slug": "mediterranean", "name": "Mediterranean", "cuisine": "Mediterranean"},
    {"slug": "korea", "name": "Korea", "cuisine": "Korean"},
    {"slug": "morocco", "name": "Morocco", "cuisine": "Middle Eastern"},
    {"slug": "global", "name": "World Table", "cuisine": "International"},
)

DESTINATION_BY_SLUG = {destination["slug"]: destination for destination in DESTINATIONS}
CUISINE_ALIASES = {
    "japanese": "japan",
    "indian": "india",
    "italian": "italy",
    "mexican": "mexico",
    "thai": "thailand",
    "mediterranean": "mediterranean",
    "greek": "mediterranean",
    "korean": "korea",
    "middle eastern": "morocco",
    "moroccan": "morocco",
    "international": "global",
}
NEXT_STAMP_ORDER = ("thailand", "japan", "india", "italy", "mexico", "mediterranean", "korea", "morocco", "global")


def resolve_destination(cuisine: Optional[str]) -> Dict[str, str]:
    """Map recipe cuisine labels onto the destinations shown in the app."""
    slug = CUISINE_ALIASES.get((cuisine or "").strip().lower(), "global")
    return DESTINATION_BY_SLUG[slug]


def _event_timestamp(event: Dict[str, Any]) -> str:
    value = event.get("created_at")
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value or "")


def build_passport_payload(events: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    """Derive user-facing passport stats from idempotent exploration/completion events."""
    event_list = list(events)
    completed = [event for event in event_list if event.get("event_type") == "complete"]

    explored_slugs = {
        event.get("destination_slug")
        for event in event_list
        if event.get("event_type") in {"explore", "complete"}
        and event.get("destination_slug") in DESTINATION_BY_SLUG
    }
    completed_counts = Counter(event.get("destination_slug") for event in completed)

    destinations: List[Dict[str, Any]] = []
    earned_stamps: List[Dict[str, Any]] = []

    for destination in DESTINATIONS:
        slug = destination["slug"]
        destination_events = sorted(
            (event for event in completed if event.get("destination_slug") == slug),
            key=_event_timestamp,
        )
        dishes_cooked = completed_counts.get(slug, 0)
        stamp_earned = dishes_cooked >= STAMP_GOAL
        earned_at = _event_timestamp(destination_events[STAMP_GOAL - 1]) if stamp_earned else None
        item = {
            **destination,
            "explored": slug in explored_slugs,
            "dishes_cooked": dishes_cooked,
            "stamp_goal": STAMP_GOAL,
            "stamp_earned": stamp_earned,
            "earned_at": earned_at,
        }
        destinations.append(item)
        if stamp_earned:
            earned_stamps.append(item)

    earned_stamps.sort(key=lambda item: item.get("earned_at") or "", reverse=True)

    active_candidates = [
        item
        for item in destinations
        if not item["stamp_earned"] and item["dishes_cooked"] > 0
    ]
    if active_candidates:
        next_stamp = max(active_candidates, key=lambda item: item["dishes_cooked"])
    else:
        destination_lookup = {item["slug"]: item for item in destinations}
        next_slug = next(
            (slug for slug in NEXT_STAMP_ORDER if not destination_lookup[slug]["stamp_earned"]),
            "global",
        )
        next_stamp = destination_lookup[next_slug]

    recent_dishes = sorted(completed, key=_event_timestamp, reverse=True)[:6]

    return {
        "summary": {
            "countries_explored": len(explored_slugs - {"global"}),
            "dishes_cooked": len(completed),
            "stamps_earned": len(earned_stamps),
        },
        "destinations": destinations,
        "recent_stamps": earned_stamps[:6],
        "recent_dishes": [
            {
                "recipe_id": event.get("target_id"),
                "title": event.get("title") or "Untitled recipe",
                "image": event.get("image") or "",
                "cuisine": event.get("cuisine") or "International",
                "destination_slug": event.get("destination_slug") or "global",
                "completed_at": _event_timestamp(event),
            }
            for event in recent_dishes
        ],
        "next_stamp": {
            **next_stamp,
            "remaining": max(0, STAMP_GOAL - next_stamp["dishes_cooked"]),
        },
    }


async def _get_passport(user_id: str) -> Dict[str, Any]:
    events = await db.passport_events.find(
        {"user_id": user_id},
        {"_id": 0, "user_id": 0},
    ).to_list(length=500)
    return build_passport_payload(events)


@router.get("")
async def get_passport(user=Depends(get_current_user)):
    return await _get_passport(user["id"])


@router.post("/explore/{destination_slug}")
async def explore_destination(destination_slug: str, user=Depends(get_current_user)):
    destination = DESTINATION_BY_SLUG.get(destination_slug.lower())
    if not destination:
        raise HTTPException(404, "Destination not found")

    now = datetime.now(timezone.utc)
    await db.passport_events.update_one(
        {
            "user_id": user["id"],
            "event_type": "explore",
            "target_id": destination["slug"],
        },
        {
            "$setOnInsert": {
                "user_id": user["id"],
                "event_type": "explore",
                "target_id": destination["slug"],
                "destination_slug": destination["slug"],
                "cuisine": destination["cuisine"],
                "created_at": now,
            }
        },
        upsert=True,
    )
    return await _get_passport(user["id"])


@router.post("/complete/{recipe_id}")
async def complete_recipe(recipe_id: str, user=Depends(get_current_user)):
    recipe = await db.recipes.find_one({"id": recipe_id}, {"_id": 0})
    if not recipe:
        raise HTTPException(404, "Recipe not found")

    destination = resolve_destination(recipe.get("cuisine"))
    now = datetime.now(timezone.utc)
    result = await db.passport_events.update_one(
        {
            "user_id": user["id"],
            "event_type": "complete",
            "target_id": recipe_id,
        },
        {
            "$setOnInsert": {
                "user_id": user["id"],
                "event_type": "complete",
                "target_id": recipe_id,
                "destination_slug": destination["slug"],
                "cuisine": recipe.get("cuisine") or destination["cuisine"],
                "title": recipe.get("title") or "Untitled recipe",
                "image": recipe.get("image") or "",
                "created_at": now,
            }
        },
        upsert=True,
    )

    payload = await _get_passport(user["id"])
    destination_progress = next(
        item for item in payload["destinations"] if item["slug"] == destination["slug"]
    )
    payload["completion"] = {
        "created": result.upserted_id is not None,
        "stamp_awarded": result.upserted_id is not None
        and destination_progress["dishes_cooked"] == STAMP_GOAL,
        "destination": destination_progress,
    }
    return payload
