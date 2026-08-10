"""Small, always-available culinary catalog for the Discover journey.

These recipes complement the recipes stored in MongoDB. They are deliberately
kept as ordinary normalized recipe dictionaries so the list, detail, save, and
Passport flows can use the same contract for curated and Spoonacular content.
"""

from copy import deepcopy
from typing import Any, Dict, Iterable, List, Optional, Sequence

Recipe = Dict[str, Any]

CULINARY_DESTINATIONS: tuple[Dict[str, str], ...] = (
    {"slug": "japan", "name": "Japan", "cuisine": "Japanese"},
    {"slug": "india", "name": "India", "cuisine": "Indian"},
    {"slug": "italy", "name": "Italy", "cuisine": "Italian"},
    {"slug": "mexico", "name": "Mexico", "cuisine": "Mexican"},
    {"slug": "thailand", "name": "Thailand", "cuisine": "Thai"},
    {
        "slug": "mediterranean",
        "name": "Mediterranean",
        "cuisine": "Mediterranean",
    },
    {"slug": "korea", "name": "Korea", "cuisine": "Korean"},
    {"slug": "morocco", "name": "Morocco", "cuisine": "Middle Eastern"},
    {"slug": "global", "name": "World Table", "cuisine": "International"},
)

CULINARY_CUISINE_ALIASES = {
    "japan": "japan",
    "japanese": "japan",
    "india": "india",
    "indian": "india",
    "italy": "italy",
    "italian": "italy",
    "mexico": "mexico",
    "mexican": "mexico",
    "latin american": "mexico",
    "thailand": "thailand",
    "thai": "thailand",
    "mediterranean": "mediterranean",
    "greece": "mediterranean",
    "greek": "mediterranean",
    "spain": "mediterranean",
    "spanish": "mediterranean",
    "korea": "korea",
    "korean": "korea",
    "morocco": "morocco",
    "middle eastern": "morocco",
    "moroccan": "morocco",
    "world": "global",
    "world table": "global",
    "global": "global",
    "international": "global",
}


def _recipe(
    *,
    recipe_id: str,
    title: str,
    description: str,
    image: str,
    cuisine: str,
    country: str,
    destination_slug: str,
    region: str,
    region_slug: str,
    ingredients: Sequence[Dict[str, Any]],
    step_details: Sequence[Dict[str, str]],
    nutrition: Dict[str, float],
    prep_minutes: int,
    cook_time: int,
    servings: int,
    difficulty: str,
    rating: float,
    rating_count: int,
    tags: Sequence[str],
    story: str,
    state: Optional[str] = None,
    state_slug: Optional[str] = None,
    diets: Sequence[str] = (),
) -> Recipe:
    return {
        "id": recipe_id,
        "title": title,
        "description": description,
        "image": image,
        "category": "culinary",
        "cuisine": cuisine,
        "country": country,
        "destination_slug": destination_slug,
        "region": region,
        "region_slug": region_slug,
        "state": state,
        "state_slug": state_slug,
        "prep_minutes": prep_minutes,
        "cook_time": cook_time,
        "servings": servings,
        "cooking_ability": difficulty,
        "difficulty": difficulty,
        "rating": rating,
        "rating_count": rating_count,
        "nutrition": nutrition,
        "ingredients": list(ingredients),
        "steps": [step["description"] for step in step_details],
        "step_details": list(step_details),
        "tags": list(tags),
        "diets": list(diets),
        "tier": "free",
        "is_premium": False,
        "featured": True,
        "source": "curated",
        "story": story,
        "why_this_works": {},
    }


CURATED_RECIPES: tuple[Recipe, ...] = (
    _recipe(
        recipe_id="curated-tonkotsu-ramen",
        title="Tonkotsu Ramen",
        description="A rich, creamy pork-bone broth with springy noodles, egg, scallions, and bamboo shoots.",
        image="/landing/tonkotsu-ramen.png",
        cuisine="Japanese",
        country="Japan",
        destination_slug="japan",
        region="Kyushu",
        region_slug="kyushu",
        state="Fukuoka",
        state_slug="fukuoka",
        prep_minutes=10,
        cook_time=30,
        servings=2,
        difficulty="Medium",
        rating=4.8,
        rating_count=2400,
        nutrition={
            "calories": 620,
            "protein": 32,
            "carbs": 68,
            "fat": 24,
            "fiber": 4,
            "sodium": 980,
        },
        diets=(),
        tags=("ramen", "noodles", "comfort food", "pork"),
        ingredients=(
            {"name": "pork bones", "amount": 500, "unit": "g"},
            {"name": "ramen noodles", "amount": 200, "unit": "g"},
            {"name": "soy sauce", "amount": 2, "unit": "tbsp"},
            {"name": "garlic", "amount": 3, "unit": "cloves"},
            {"name": "green onion", "amount": 2, "unit": "stalks"},
            {"name": "boiled egg", "amount": 1, "unit": ""},
            {"name": "bamboo shoots", "amount": 50, "unit": "g"},
            {"name": "nori", "amount": 2, "unit": "sheets"},
        ),
        step_details=(
            {
                "title": "Prepare the Broth",
                "description": "Cover the small-cut bones with boiling water for 5 minutes, drain, then rinse the bones and pressure-cooker insert clean.",
            },
            {
                "title": "Cook the Noodles",
                "description": "Pressure-cook the bones with 750 ml hot water and garlic on high for 25 minutes. Meanwhile, boil the ramen noodles separately until just tender.",
            },
            {
                "title": "Assemble",
                "description": "Release pressure according to the appliance instructions, strain the broth, and season with soy sauce. Divide the noodles between two bowls and ladle over the broth.",
            },
            {
                "title": "Serve Hot",
                "description": "Top with the halved egg, green onion, bamboo shoots, and nori, then serve immediately while piping hot.",
            },
        ),
        story="Tonkotsu ramen grew from Fukuoka's yatai culture, where an intensely boiled pork broth became the signature partner for thin Hakata noodles.",
    ),
    _recipe(
        recipe_id="curated-chhena-poda",
        title="Chhena Poda",
        description="Odisha's caramelised baked chhena cake, fragrant with cardamom, cashews, and raisins.",
        image="/landing/chhena-poda.png",
        cuisine="Indian",
        country="India",
        destination_slug="india",
        region="East India",
        region_slug="east-india",
        state="Odisha",
        state_slug="odisha",
        prep_minutes=10,
        cook_time=50,
        servings=8,
        difficulty="Medium",
        rating=4.7,
        rating_count=1300,
        nutrition={
            "calories": 380,
            "protein": 14,
            "carbs": 38,
            "fat": 19,
            "fiber": 1,
            "sodium": 240,
        },
        diets=("vegetarian",),
        tags=("dessert", "baked", "Odia", "vegetarian"),
        ingredients=(
            {
                "name": "fresh chhena or well-drained ricotta",
                "amount": 500,
                "unit": "g",
            },
            {"name": "fine semolina", "amount": 35, "unit": "g"},
            {"name": "jaggery, grated", "amount": 120, "unit": "g"},
            {"name": "ground cardamom", "amount": 0.5, "unit": "tsp"},
            {"name": "cashews, chopped", "amount": 30, "unit": "g"},
            {"name": "raisins", "amount": 25, "unit": "g"},
            {"name": "ghee", "amount": 1, "unit": "tbsp"},
        ),
        step_details=(
            {
                "title": "Make the chhena",
                "description": "Knead the chhena until smooth, then work in the semolina, jaggery, cardamom, cashews, and raisins.",
            },
            {
                "title": "Prepare the tin",
                "description": "Heat the oven to 180°C. Grease a 20 cm tin with ghee and line the base with baking paper.",
            },
            {
                "title": "Bake",
                "description": "Press the mixture evenly into the tin and bake for 45 to 50 minutes until deeply caramelised at the edges and set in the centre.",
            },
            {
                "title": "Rest and serve",
                "description": "Cool for at least 20 minutes before turning out. Serve warm or at room temperature.",
            },
        ),
        story="Chhena Poda means 'burnt cheese' in Odia. Its dark caramelised crust and soft centre have made it one of Odisha's most cherished sweets.",
    ),
    _recipe(
        recipe_id="curated-dalma",
        title="Dalma",
        description="A comforting Odia lentil stew with vegetables, ginger, and toasted cumin.",
        image="/landing/dish-india.jpg",
        cuisine="Indian",
        country="India",
        destination_slug="india",
        region="East India",
        region_slug="east-india",
        state="Odisha",
        state_slug="odisha",
        prep_minutes=10,
        cook_time=35,
        servings=4,
        difficulty="Easy",
        rating=4.6,
        rating_count=820,
        nutrition={
            "calories": 310,
            "protein": 14,
            "carbs": 49,
            "fat": 7,
            "fiber": 12,
            "sodium": 390,
        },
        diets=("vegan", "vegetarian", "gluten-free"),
        tags=("lentils", "stew", "Odia", "vegan", "gluten-free"),
        ingredients=(
            {"name": "toor dal", "amount": 220, "unit": "g"},
            {"name": "pumpkin, cubed", "amount": 250, "unit": "g"},
            {"name": "green papaya, cubed", "amount": 180, "unit": "g"},
            {"name": "aubergine, cubed", "amount": 180, "unit": "g"},
            {"name": "fresh ginger, grated", "amount": 1, "unit": "tbsp"},
            {"name": "cumin seeds", "amount": 1, "unit": "tsp"},
            {"name": "dried red chillies", "amount": 2, "unit": ""},
        ),
        step_details=(
            {
                "title": "Simmer the dal",
                "description": "Rinse the dal, then simmer it with turmeric and 750 ml water for 15 minutes.",
            },
            {
                "title": "Add the vegetables",
                "description": "Add the pumpkin, papaya, aubergine, ginger, and salt. Cook until the dal is creamy and the vegetables are tender.",
            },
            {
                "title": "Toast the spice",
                "description": "Dry-toast cumin and chillies, cool, and grind coarsely.",
            },
            {
                "title": "Finish",
                "description": "Fold the toasted spice through the dalma and serve hot with rice.",
            },
        ),
        story="Dalma is closely associated with Odisha's home and temple kitchens, combining dal and vegetables in one gently spiced, nourishing pot.",
    ),
    _recipe(
        recipe_id="curated-ribollita",
        title="Tuscan Ribollita",
        description="A rustic bread-thickened Tuscan soup of white beans, cavolo nero, and olive oil.",
        image="/landing/hero-bowl.jpg",
        cuisine="Italian",
        country="Italy",
        destination_slug="italy",
        region="Tuscany",
        region_slug="tuscany",
        prep_minutes=15,
        cook_time=40,
        servings=4,
        difficulty="Easy",
        rating=4.7,
        rating_count=940,
        nutrition={
            "calories": 410,
            "protein": 17,
            "carbs": 62,
            "fat": 11,
            "fiber": 15,
            "sodium": 520,
        },
        diets=("vegan", "vegetarian"),
        tags=("soup", "beans", "Tuscan", "vegan"),
        ingredients=(
            {"name": "cannellini beans, cooked", "amount": 500, "unit": "g"},
            {"name": "cavolo nero, sliced", "amount": 250, "unit": "g"},
            {"name": "stale country bread", "amount": 240, "unit": "g"},
            {"name": "carrots, diced", "amount": 2, "unit": ""},
            {"name": "celery stalks, diced", "amount": 2, "unit": ""},
            {"name": "tomatoes, crushed", "amount": 400, "unit": "g"},
            {"name": "extra-virgin olive oil", "amount": 3, "unit": "tbsp"},
        ),
        step_details=(
            {
                "title": "Build the base",
                "description": "Soften carrot, celery, and onion in olive oil until sweet and translucent.",
            },
            {
                "title": "Simmer",
                "description": "Add tomatoes, beans, cavolo nero, and 750 ml water. Simmer for 25 minutes.",
            },
            {
                "title": "Add the bread",
                "description": "Tear in the bread and simmer until it breaks down and thickens the soup.",
            },
            {
                "title": "Rest and serve",
                "description": "Rest for 10 minutes, then finish with black pepper and a generous thread of olive oil.",
            },
        ),
        story="Ribollita means 'reboiled'. Tuscan cooks traditionally transformed yesterday's bread and vegetable soup into an even richer meal the next day.",
    ),
    _recipe(
        recipe_id="curated-mole-negro",
        title="Oaxacan Mole Negro",
        description="A deep, toasted chile sauce layered with spice, fruit, seeds, and cacao.",
        image="/landing/footer-still.jpg",
        cuisine="Mexican",
        country="Mexico",
        destination_slug="mexico",
        region="Oaxaca",
        region_slug="oaxaca",
        prep_minutes=20,
        cook_time=55,
        servings=6,
        difficulty="Advanced",
        rating=4.9,
        rating_count=1600,
        nutrition={
            "calories": 540,
            "protein": 35,
            "carbs": 41,
            "fat": 27,
            "fiber": 8,
            "sodium": 670,
        },
        diets=("gluten-free",),
        tags=("mole", "chicken", "Oaxacan", "gluten-free"),
        ingredients=(
            {"name": "dried ancho chillies", "amount": 4, "unit": ""},
            {"name": "dried mulato chillies", "amount": 3, "unit": ""},
            {"name": "sesame seeds", "amount": 45, "unit": "g"},
            {"name": "almonds", "amount": 45, "unit": "g"},
            {"name": "ripe plantain, sliced", "amount": 1, "unit": ""},
            {"name": "dark chocolate", "amount": 30, "unit": "g"},
            {"name": "cooked chicken pieces", "amount": 900, "unit": "g"},
        ),
        step_details=(
            {
                "title": "Toast",
                "description": "Stem and seed the chillies. Toast them briefly, then soak in hot water. Separately toast the seeds, nuts, and spices.",
            },
            {
                "title": "Blend",
                "description": "Blend the drained chillies, toasted mixture, plantain, tomato, and enough stock into a very smooth sauce.",
            },
            {
                "title": "Cook the mole",
                "description": "Fry the sauce carefully in a heavy pot, then add stock and simmer for 45 minutes, stirring often.",
            },
            {
                "title": "Finish",
                "description": "Melt in the chocolate, season, and warm the cooked chicken in the mole before serving.",
            },
        ),
        story="Mole negro is one of Oaxaca's celebrated moles, valued for the patient toasting and blending that turns many ingredients into one harmonious sauce.",
    ),
    _recipe(
        recipe_id="curated-tom-yum-goong",
        title="Tom Yum Goong",
        description="Hot-and-sour prawn soup scented with lemongrass, galangal, lime leaf, and fresh lime.",
        image="/landing/discover-bowl.jpg",
        cuisine="Thai",
        country="Thailand",
        destination_slug="thailand",
        region="Central Thailand",
        region_slug="central-thailand",
        prep_minutes=15,
        cook_time=20,
        servings=4,
        difficulty="Easy",
        rating=4.8,
        rating_count=1800,
        nutrition={
            "calories": 290,
            "protein": 29,
            "carbs": 18,
            "fat": 11,
            "fiber": 4,
            "sodium": 890,
        },
        diets=("gluten-free", "pescatarian"),
        tags=("soup", "prawns", "hot and sour", "gluten-free"),
        ingredients=(
            {"name": "raw prawns, peeled", "amount": 450, "unit": "g"},
            {"name": "lemongrass stalks, bruised", "amount": 2, "unit": ""},
            {"name": "galangal, sliced", "amount": 30, "unit": "g"},
            {"name": "makrut lime leaves", "amount": 6, "unit": ""},
            {"name": "oyster mushrooms", "amount": 200, "unit": "g"},
            {"name": "fish sauce", "amount": 3, "unit": "tbsp"},
            {"name": "fresh lime juice", "amount": 4, "unit": "tbsp"},
        ),
        step_details=(
            {
                "title": "Infuse the broth",
                "description": "Simmer 1 litre of water with lemongrass, galangal, and lime leaves for 8 minutes.",
            },
            {
                "title": "Add mushrooms",
                "description": "Add the mushrooms and chillies and simmer until just tender.",
            },
            {
                "title": "Cook the prawns",
                "description": "Add the prawns and cook for 2 to 3 minutes, until opaque and cooked through.",
            },
            {
                "title": "Balance and serve",
                "description": "Remove from the heat, then stir in fish sauce and lime juice. Taste for a vivid hot-sour-salty balance.",
            },
        ),
        story="Tom yum is built around balance rather than heaviness: fresh aromatics perfume the broth while lime and fish sauce sharpen every spoonful.",
    ),
    _recipe(
        recipe_id="curated-aegean-fish",
        title="Aegean Lemon-Herb Fish",
        description="Flaky fish baked with lemon, oregano, tomatoes, and extra-virgin olive oil.",
        image="/landing/dish-greece.jpg",
        cuisine="Mediterranean",
        country="Greece",
        destination_slug="mediterranean",
        region="Aegean",
        region_slug="aegean",
        prep_minutes=12,
        cook_time=20,
        servings=4,
        difficulty="Easy",
        rating=4.7,
        rating_count=760,
        nutrition={
            "calories": 430,
            "protein": 39,
            "carbs": 18,
            "fat": 23,
            "fiber": 5,
            "sodium": 410,
        },
        diets=("gluten-free", "pescatarian"),
        tags=("fish", "baked", "Aegean", "gluten-free"),
        ingredients=(
            {"name": "firm white fish fillets", "amount": 700, "unit": "g"},
            {"name": "cherry tomatoes", "amount": 300, "unit": "g"},
            {"name": "lemon", "amount": 1, "unit": ""},
            {"name": "extra-virgin olive oil", "amount": 3, "unit": "tbsp"},
            {"name": "dried oregano", "amount": 2, "unit": "tsp"},
            {"name": "butter beans, drained", "amount": 400, "unit": "g"},
        ),
        step_details=(
            {
                "title": "Prepare",
                "description": "Heat the oven to 210°C. Arrange beans and tomatoes in a baking dish with half the olive oil and oregano.",
            },
            {
                "title": "Season the fish",
                "description": "Place the fish on top, season, and add lemon zest, lemon slices, and the remaining oil.",
            },
            {
                "title": "Bake",
                "description": "Bake for 15 to 20 minutes, until the fish flakes easily and is opaque through the centre.",
            },
            {
                "title": "Finish",
                "description": "Spoon the tomato and bean juices over the fish and finish with fresh lemon juice.",
            },
        ),
        story="Across the Aegean, fish is often treated simply so the quality of the catch, olive oil, citrus, and wild herbs can remain unmistakable.",
    ),
    _recipe(
        recipe_id="curated-jeonju-bibimbap",
        title="Jeonju Bibimbap",
        description="Rice arranged with seasoned vegetables, egg, sesame, and gochujang.",
        image="/landing/journey-discover.jpg",
        cuisine="Korean",
        country="Korea",
        destination_slug="korea",
        region="Jeonju",
        region_slug="jeonju",
        prep_minutes=30,
        cook_time=15,
        servings=4,
        difficulty="Medium",
        rating=4.8,
        rating_count=1500,
        nutrition={
            "calories": 510,
            "protein": 21,
            "carbs": 74,
            "fat": 15,
            "fiber": 9,
            "sodium": 720,
        },
        diets=("vegetarian",),
        tags=("rice", "vegetables", "gochujang", "vegetarian"),
        ingredients=(
            {"name": "short-grain rice", "amount": 300, "unit": "g"},
            {"name": "spinach", "amount": 200, "unit": "g"},
            {"name": "bean sprouts", "amount": 200, "unit": "g"},
            {"name": "carrots, julienned", "amount": 2, "unit": ""},
            {"name": "shiitake mushrooms, sliced", "amount": 180, "unit": "g"},
            {"name": "eggs", "amount": 4, "unit": ""},
            {"name": "gochujang", "amount": 4, "unit": "tbsp"},
        ),
        step_details=(
            {
                "title": "Cook the rice",
                "description": "Cook the rice until tender and keep it warm.",
            },
            {
                "title": "Season the vegetables",
                "description": "Cook each vegetable separately until just tender, seasoning lightly with sesame oil, garlic, and salt.",
            },
            {
                "title": "Fry the eggs",
                "description": "Fry the eggs sunny-side up so the yolks remain soft.",
            },
            {
                "title": "Arrange and mix",
                "description": "Divide the rice between bowls, arrange the vegetables and egg on top, and serve with gochujang to mix at the table.",
            },
        ),
        story="Jeonju is renowned for bibimbap. Its careful arrangement preserves each ingredient's character until everything is mixed just before eating.",
    ),
    _recipe(
        recipe_id="curated-moroccan-tagine",
        title="Moroccan Vegetable Tagine",
        description="Slow-cooked vegetables with chickpeas, preserved lemon, olives, and warm spice.",
        image="/landing/dish-morocco.jpg",
        cuisine="Middle Eastern",
        country="Morocco",
        destination_slug="morocco",
        region="Marrakech-Safi",
        region_slug="marrakech-safi",
        prep_minutes=20,
        cook_time=40,
        servings=4,
        difficulty="Easy",
        rating=4.7,
        rating_count=1100,
        nutrition={
            "calories": 390,
            "protein": 14,
            "carbs": 58,
            "fat": 13,
            "fiber": 14,
            "sodium": 590,
        },
        diets=("vegan", "vegetarian", "gluten-free"),
        tags=("tagine", "chickpeas", "vegan", "gluten-free"),
        ingredients=(
            {"name": "chickpeas, cooked", "amount": 480, "unit": "g"},
            {"name": "carrots, thickly sliced", "amount": 3, "unit": ""},
            {"name": "courgettes, thickly sliced", "amount": 2, "unit": ""},
            {"name": "butternut squash, cubed", "amount": 400, "unit": "g"},
            {"name": "preserved lemon", "amount": 1, "unit": ""},
            {"name": "green olives", "amount": 100, "unit": "g"},
            {"name": "ras el hanout", "amount": 2, "unit": "tsp"},
        ),
        step_details=(
            {
                "title": "Build the base",
                "description": "Soften onion in olive oil, then stir in garlic, ginger, ras el hanout, cumin, and turmeric.",
            },
            {
                "title": "Layer the vegetables",
                "description": "Add the squash, carrots, tomatoes, and 350 ml water. Cover and simmer for 20 minutes.",
            },
            {
                "title": "Finish cooking",
                "description": "Add the courgettes and chickpeas and cook until every vegetable is tender but holds its shape.",
            },
            {
                "title": "Brighten",
                "description": "Fold in rinsed preserved lemon, olives, and coriander just before serving.",
            },
        ),
        story="The tagine's conical lid returns condensation to the pot, making slow, fragrant cooking possible with very little liquid.",
    ),
    _recipe(
        recipe_id="curated-world-harvest-bowl",
        title="World Harvest Bowl",
        description="A flexible grain bowl of roasted vegetables, legumes, herbs, and lemon-tahini sauce.",
        image="/landing/map-details.jpg",
        cuisine="International",
        country="World Table",
        destination_slug="global",
        region="Global Crossroads",
        region_slug="crossroads",
        prep_minutes=15,
        cook_time=25,
        servings=4,
        difficulty="Easy",
        rating=4.6,
        rating_count=620,
        nutrition={
            "calories": 470,
            "protein": 17,
            "carbs": 69,
            "fat": 16,
            "fiber": 13,
            "sodium": 380,
        },
        diets=("vegan", "vegetarian", "gluten-free"),
        tags=("grain bowl", "vegetables", "vegan", "gluten-free"),
        ingredients=(
            {"name": "quinoa", "amount": 250, "unit": "g"},
            {"name": "chickpeas, drained", "amount": 400, "unit": "g"},
            {"name": "seasonal vegetables, chopped", "amount": 700, "unit": "g"},
            {"name": "tahini", "amount": 70, "unit": "g"},
            {"name": "lemon", "amount": 1, "unit": ""},
            {"name": "mixed soft herbs", "amount": 1, "unit": "handful"},
        ),
        step_details=(
            {
                "title": "Roast",
                "description": "Heat the oven to 220°C. Toss the vegetables and chickpeas with olive oil and roast until browned and tender.",
            },
            {
                "title": "Cook the grain",
                "description": "Rinse the quinoa and simmer until tender. Rest covered for 5 minutes, then fluff.",
            },
            {
                "title": "Whisk the sauce",
                "description": "Whisk tahini with lemon juice, a pinch of salt, and enough cold water to make a pourable sauce.",
            },
            {
                "title": "Build the bowls",
                "description": "Layer quinoa, roasted vegetables, and chickpeas, then finish with herbs and tahini sauce.",
            },
        ),
        story="The World Harvest Bowl is intentionally adaptable: a dependable method that welcomes the grains, vegetables, legumes, and herbs available wherever you cook.",
    ),
)


CURATED_RECIPE_BY_ID = {recipe["id"]: recipe for recipe in CURATED_RECIPES}


def get_curated_recipe(recipe_id: str) -> Optional[Recipe]:
    """Return a copy so request-level mutation cannot alter the catalog."""
    recipe = CURATED_RECIPE_BY_ID.get(recipe_id)
    return deepcopy(recipe) if recipe else None


def _matches(value: Optional[str], candidates: Iterable[Optional[str]]) -> bool:
    if not value:
        return True
    expected = value.strip().lower()
    return any(
        expected == str(candidate or "").strip().lower() for candidate in candidates
    )


def _matches_cuisine(value: Optional[str], recipe: Recipe) -> bool:
    if not value:
        return True
    expected = value.strip().lower()
    destination_slug = CULINARY_CUISINE_ALIASES.get(expected)
    if destination_slug:
        return destination_slug == recipe.get("destination_slug")
    return _matches(value, (recipe.get("cuisine"), recipe.get("country")))


def search_curated_recipes(
    *,
    query: Optional[str] = None,
    cuisine: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    diet: Optional[str] = None,
    tag: Optional[str] = None,
    tier: Optional[str] = None,
    max_calories: Optional[int] = None,
) -> List[Recipe]:
    """Filter the curated catalog using the public recipes endpoint vocabulary."""
    search_term = (query or "").strip().lower()
    matches: List[Recipe] = []

    for recipe in CURATED_RECIPES:
        if not _matches_cuisine(cuisine, recipe):
            continue
        if not _matches(
            region,
            (
                recipe.get("region"),
                recipe.get("region_slug"),
                recipe.get("state"),
                recipe.get("state_slug"),
            ),
        ):
            continue
        if category and category != "all" and recipe.get("category") != category:
            continue
        if diet and diet.lower() not in {
            item.lower() for item in recipe.get("diets", [])
        }:
            continue
        if tag and tag.lower() not in {item.lower() for item in recipe.get("tags", [])}:
            continue
        if tier and tier != "all" and recipe.get("tier") != tier:
            continue
        if (
            max_calories is not None
            and recipe.get("nutrition", {}).get("calories", 0) > max_calories
        ):
            continue

        if search_term:
            ingredient_names = " ".join(
                item.get("name", "") for item in recipe.get("ingredients", [])
            )
            searchable = " ".join(
                str(recipe.get(field) or "")
                for field in (
                    "title",
                    "description",
                    "cuisine",
                    "country",
                    "region",
                    "state",
                    "story",
                )
            )
            searchable = f"{searchable} {' '.join(recipe.get('tags', []))} {ingredient_names}".lower()
            if search_term not in searchable:
                continue

        matches.append(deepcopy(recipe))

    return matches
