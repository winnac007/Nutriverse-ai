import unittest
from unittest.mock import patch

from app.api.passport import (
    DESTINATIONS,
    build_passport_payload,
    complete_recipe,
    resolve_destination,
)


class _UpdateResult:
    def __init__(self, upserted_id):
        self.upserted_id = upserted_id


class _PassportCursor:
    def __init__(self, events):
        self.events = events

    async def to_list(self, length):
        return list(self.events[:length])


class _PassportEvents:
    def __init__(self):
        self.events = []

    async def update_one(self, selector, update, upsert=False):
        existing = next(
            (
                event
                for event in self.events
                if all(event.get(key) == value for key, value in selector.items())
            ),
            None,
        )
        if existing:
            return _UpdateResult(None)
        event = dict(update.get("$setOnInsert", {}))
        self.events.append(event)
        return _UpdateResult(f"event-{len(self.events)}")

    def find(self, selector, projection):
        matches = [
            event
            for event in self.events
            if all(event.get(key) == value for key, value in selector.items())
        ]
        return _PassportCursor(matches)


class _PassportDb:
    def __init__(self):
        self.passport_events = _PassportEvents()


class PassportPayloadTests(unittest.TestCase):
    def test_resolves_known_and_unknown_cuisines(self):
        self.assertEqual(resolve_destination("Japanese")["slug"], "japan")
        self.assertEqual(resolve_destination("Greek")["slug"], "mediterranean")
        self.assertEqual(resolve_destination("Spanish")["slug"], "mediterranean")
        self.assertEqual(resolve_destination("Latin American")["slug"], "mexico")
        self.assertEqual(resolve_destination("Unknown cuisine")["slug"], "global")

    def test_destination_contract_contains_all_frontend_destinations(self):
        self.assertEqual(
            [destination["slug"] for destination in DESTINATIONS],
            [
                "japan",
                "india",
                "italy",
                "mexico",
                "thailand",
                "mediterranean",
                "korea",
                "morocco",
                "global",
            ],
        )

    def test_builds_stats_stamps_and_next_progress(self):
        events = [
            {
                "event_type": "explore",
                "target_id": "japan",
                "destination_slug": "japan",
                "created_at": "2026-08-01T08:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "jp-1",
                "destination_slug": "japan",
                "title": "Miso bowl",
                "cuisine": "Japanese",
                "created_at": "2026-08-01T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "jp-2",
                "destination_slug": "japan",
                "title": "Soba salad",
                "cuisine": "Japanese",
                "created_at": "2026-08-02T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "jp-3",
                "destination_slug": "japan",
                "title": "Salmon donburi",
                "cuisine": "Japanese",
                "created_at": "2026-08-03T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "jp-4",
                "destination_slug": "japan",
                "title": "Onigiri",
                "cuisine": "Japanese",
                "created_at": "2026-08-04T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "jp-5",
                "destination_slug": "japan",
                "title": "Okonomiyaki",
                "cuisine": "Japanese",
                "created_at": "2026-08-05T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "th-1",
                "destination_slug": "thailand",
                "title": "Green curry",
                "cuisine": "Thai",
                "created_at": "2026-08-06T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "th-2",
                "destination_slug": "thailand",
                "title": "Pad kra pao",
                "cuisine": "Thai",
                "created_at": "2026-08-07T09:00:00+00:00",
            },
            {
                "event_type": "complete",
                "target_id": "th-3",
                "destination_slug": "thailand",
                "title": "Tom yum",
                "cuisine": "Thai",
                "created_at": "2026-08-08T09:00:00+00:00",
            },
        ]

        payload = build_passport_payload(events)

        self.assertEqual(
            payload["summary"],
            {"countries_explored": 2, "dishes_cooked": 8, "stamps_earned": 1},
        )
        self.assertEqual(payload["recent_stamps"][0]["slug"], "japan")
        self.assertEqual(payload["next_stamp"]["slug"], "thailand")
        self.assertEqual(payload["next_stamp"]["remaining"], 2)
        self.assertEqual(payload["recent_dishes"][0]["recipe_id"], "th-3")


class PassportCompletionTests(unittest.IsolatedAsyncioTestCase):
    async def test_curated_recipe_completion_is_idempotent(self):
        database = _PassportDb()
        with patch("app.api.passport.db", database):
            first = await complete_recipe(
                "curated-chhena-poda",
                user={"id": "traveller-1"},
            )
            second = await complete_recipe(
                "curated-chhena-poda",
                user={"id": "traveller-1"},
            )

        self.assertTrue(first["completion"]["created"])
        self.assertFalse(second["completion"]["created"])
        self.assertEqual(first["completion"]["destination"]["slug"], "india")
        self.assertEqual(second["summary"]["dishes_cooked"], 1)
        self.assertEqual(second["recent_dishes"][0]["title"], "Chhena Poda")


if __name__ == "__main__":
    unittest.main()
