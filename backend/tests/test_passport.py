import unittest

from app.api.passport import build_passport_payload, resolve_destination


class PassportPayloadTests(unittest.TestCase):
    def test_resolves_known_and_unknown_cuisines(self):
        self.assertEqual(resolve_destination("Japanese")["slug"], "japan")
        self.assertEqual(resolve_destination("Greek")["slug"], "mediterranean")
        self.assertEqual(resolve_destination("Unknown cuisine")["slug"], "global")

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


if __name__ == "__main__":
    unittest.main()
