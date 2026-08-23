import unittest

import jwt

from app.api.professionals import ChefSpecialCreate, build_chef_special
from app.core.security import create_refresh_token, create_token, decode_token


class ProfessionalSessionTests(unittest.TestCase):
    def test_access_and_refresh_tokens_are_role_scoped(self):
        access = decode_token(
            create_token("professional-1", kind="professional"),
            expected_type="access",
            expected_kind="professional",
        )
        refresh = decode_token(
            create_refresh_token("professional-1", kind="professional"),
            expected_type="refresh",
            expected_kind="professional",
        )
        self.assertEqual(access["sub"], "professional-1")
        self.assertEqual(refresh["sub"], "professional-1")

        with self.assertRaises(jwt.PyJWTError):
            decode_token(
                create_token("user-1", kind="user"),
                expected_type="access",
                expected_kind="professional",
            )


class ChefSpecialContractTests(unittest.TestCase):
    def test_uploaded_recipe_is_available_to_chef_special_filters(self):
        body = ChefSpecialCreate(
            title="Cardamom pear tart",
            description="A gently sweet tart with cardamom, pears and toasted almonds.",
            ingredients=["2 ripe pears", "ground cardamom", "almond flour"],
            steps=["Slice the pears.", "Bake until golden."],
            tags=["vegetarian", "dessert"],
            tier="premium",
        )
        recipe = build_chef_special(
            body,
            {
                "id": "chef-1",
                "name": "Chef Mira Sen",
                "credentials": "Pastry chef",
            },
        )
        self.assertEqual(recipe["category"], "chef-special")
        self.assertEqual(recipe["chef_id"], "chef-1")
        self.assertTrue(recipe["is_premium"])
        self.assertEqual(recipe["chef"]["name"], "Chef Mira Sen")
        self.assertEqual(recipe["ingredients"][0]["name"], "2 ripe pears")


if __name__ == "__main__":
    unittest.main()
