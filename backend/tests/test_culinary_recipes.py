import unittest
from unittest.mock import AsyncMock, patch

from app.api.recipes import list_recipes, recipe_detail
from app.data.culinary_recipes import (
    CULINARY_DESTINATIONS,
    CURATED_RECIPES,
    get_curated_recipe,
    search_curated_recipes,
)


class CuratedRecipeCatalogTests(unittest.TestCase):
    def test_catalog_covers_every_passport_destination(self):
        destination_slugs = {
            destination["slug"] for destination in CULINARY_DESTINATIONS
        }
        self.assertEqual(
            {recipe["destination_slug"] for recipe in CURATED_RECIPES},
            destination_slugs,
        )

    def test_reference_recipes_have_complete_detail_contracts(self):
        for recipe_id in ("curated-tonkotsu-ramen", "curated-chhena-poda"):
            recipe = get_curated_recipe(recipe_id)
            self.assertIsNotNone(recipe)
            self.assertTrue(recipe["ingredients"])
            self.assertTrue(recipe["steps"])
            self.assertEqual(len(recipe["steps"]), len(recipe["step_details"]))
            self.assertTrue(recipe["nutrition"]["calories"])

        tonkotsu = get_curated_recipe("curated-tonkotsu-ramen")
        self.assertEqual(tonkotsu["prep_minutes"] + tonkotsu["cook_time"], 40)
        self.assertEqual(tonkotsu["image"], "/landing/tonkotsu-ramen.png")
        self.assertEqual(
            [ingredient["name"] for ingredient in tonkotsu["ingredients"]],
            [
                "pork bones",
                "ramen noodles",
                "soy sauce",
                "garlic",
                "green onion",
                "boiled egg",
                "bamboo shoots",
                "nori",
            ],
        )
        self.assertEqual(
            [step["title"] for step in tonkotsu["step_details"]],
            ["Prepare the Broth", "Cook the Noodles", "Assemble", "Serve Hot"],
        )

    def test_total_times_match_the_curated_frontend_cards(self):
        expected_totals = {
            "curated-tonkotsu-ramen": 40,
            "curated-chhena-poda": 60,
            "curated-dalma": 45,
            "curated-ribollita": 55,
            "curated-mole-negro": 75,
            "curated-tom-yum-goong": 35,
            "curated-aegean-fish": 32,
            "curated-jeonju-bibimbap": 45,
            "curated-moroccan-tagine": 60,
            "curated-world-harvest-bowl": 40,
        }

        for recipe_id, expected_total in expected_totals.items():
            recipe = get_curated_recipe(recipe_id)
            self.assertEqual(
                recipe["prep_minutes"] + recipe["cook_time"],
                expected_total,
                recipe_id,
            )

    def test_catalog_copies_are_not_shared_between_requests(self):
        first = get_curated_recipe("curated-tonkotsu-ramen")
        first["title"] = "Changed"
        second = get_curated_recipe("curated-tonkotsu-ramen")
        self.assertEqual(second["title"], "Tonkotsu Ramen")

    def test_filters_by_cuisine_region_state_and_search(self):
        japanese = search_curated_recipes(cuisine="Japanese")
        odisha = search_curated_recipes(cuisine="Indian", region="Odisha")
        ramen = search_curated_recipes(query="ramen")
        greek = search_curated_recipes(cuisine="Greek")

        self.assertEqual(
            [recipe["id"] for recipe in japanese], ["curated-tonkotsu-ramen"]
        )
        self.assertEqual(
            {recipe["id"] for recipe in odisha},
            {"curated-chhena-poda", "curated-dalma"},
        )
        self.assertEqual([recipe["id"] for recipe in ramen], ["curated-tonkotsu-ramen"])
        self.assertEqual([recipe["id"] for recipe in greek], ["curated-aegean-fish"])


class CuratedRecipeApiTests(unittest.IsolatedAsyncioTestCase):
    async def test_explicit_country_keeps_live_results_and_surfaces_curated_first(self):
        live_recipe = {
            "id": "sp-100",
            "title": "Live Japanese recipe",
            "cuisine": "Japanese",
            "source": "local",
            "nutrition": {"calories": 410},
            "tags": [],
        }
        with patch(
            "app.api.recipes.search_recipes", new=AsyncMock(return_value=[live_recipe])
        ):
            results = await list_recipes(country="Japanese")

        self.assertEqual(results[0]["id"], "curated-tonkotsu-ramen")
        self.assertIn("sp-100", [recipe["id"] for recipe in results])

    async def test_unfiltered_list_preserves_live_order(self):
        live_recipe = {
            "id": "sp-101",
            "title": "Live discovery recipe",
            "source": "local",
            "nutrition": {"calories": 390},
            "tags": [],
        }
        with patch(
            "app.api.recipes.search_recipes", new=AsyncMock(return_value=[live_recipe])
        ):
            results = await list_recipes()

        self.assertEqual(results[0]["id"], "sp-101")
        self.assertIn("curated-tonkotsu-ramen", [recipe["id"] for recipe in results])

    async def test_curated_detail_is_directly_addressable(self):
        recipe = await recipe_detail("curated-chhena-poda")
        self.assertEqual(recipe["title"], "Chhena Poda")
        self.assertEqual(recipe["source"], "curated")


if __name__ == "__main__":
    unittest.main()
