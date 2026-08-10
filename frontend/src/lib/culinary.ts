export type CulinaryDestination = {
  slug: string;
  name: string;
  cuisine: string;
  flag: string;
  note: string;
  image: string;
  mapPosition: { x: number; y: number };
  cuisineAliases: readonly string[];
};

export type CulinaryRegion = {
  slug: string;
  name: string;
  destinationSlug: string;
  note: string;
};

export type CulinaryState = {
  slug: string;
  name: string;
  destinationSlug: string;
  regionSlug: string;
  note: string;
  description: string;
  image: string;
  recipeIds: readonly string[];
};

export type CuratedRecipeReference = {
  id: string;
  title: string;
  destinationSlug: string;
  regionSlug: string;
  stateSlug?: string;
  cuisine: string;
  image: string;
  description: string;
  cookTime: number;
  calories: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  rating: number;
  ratingCount: number;
};

export const CULINARY_DESTINATIONS: readonly CulinaryDestination[] = [
  {
    slug: "japan",
    name: "Japan",
    cuisine: "Japanese",
    flag: "🇯🇵",
    note: "Umami, ritual, and the sea.",
    image: "/landing/japan-fuji.png",
    mapPosition: { x: 88, y: 38 },
    cuisineAliases: ["Japanese", "Japan"],
  },
  {
    slug: "india",
    name: "India",
    cuisine: "Indian",
    flag: "🇮🇳",
    note: "Spice, balance, and regional tradition.",
    image: "/landing/dish-india.jpg",
    mapPosition: { x: 65, y: 49 },
    cuisineAliases: ["Indian", "India"],
  },
  {
    slug: "italy",
    name: "Italy",
    cuisine: "Italian",
    flag: "🇮🇹",
    note: "Simple ingredients, generous tables.",
    image: "/landing/hero-bowl.jpg",
    mapPosition: { x: 48, y: 31 },
    cuisineAliases: ["Italian", "Italy"],
  },
  {
    slug: "mexico",
    name: "Mexico",
    cuisine: "Mexican",
    flag: "🇲🇽",
    note: "Maize, fire, citrus, and slow-cooked depth.",
    image: "/landing/footer-still.jpg",
    mapPosition: { x: 19, y: 45 },
    cuisineAliases: ["Mexican", "Mexico", "Latin American"],
  },
  {
    slug: "thailand",
    name: "Thailand",
    cuisine: "Thai",
    flag: "🇹🇭",
    note: "Bright herbs, heat, sweetness, and sourness.",
    image: "/landing/discover-bowl.jpg",
    mapPosition: { x: 80, y: 56 },
    cuisineAliases: ["Thai", "Thailand"],
  },
  {
    slug: "mediterranean",
    name: "Mediterranean",
    cuisine: "Mediterranean",
    flag: "🌊",
    note: "Olive oil, coastal produce, and shared tables.",
    image: "/landing/dish-greece.jpg",
    mapPosition: { x: 54, y: 43 },
    cuisineAliases: ["Mediterranean", "Greek", "Spanish"],
  },
  {
    slug: "korea",
    name: "Korea",
    cuisine: "Korean",
    flag: "🇰🇷",
    note: "Fermentation, contrast, and deeply seasoned comfort.",
    image: "/landing/journey-discover.jpg",
    mapPosition: { x: 77, y: 30 },
    cuisineAliases: ["Korean", "Korea"],
  },
  {
    slug: "morocco",
    name: "Morocco",
    cuisine: "Middle Eastern",
    flag: "🇲🇦",
    note: "Fragrant spice, preserved citrus, and slow-cooked warmth.",
    image: "/landing/dish-morocco.jpg",
    mapPosition: { x: 39, y: 43 },
    cuisineAliases: ["Moroccan", "Morocco", "Middle Eastern"],
  },
  {
    slug: "global",
    name: "World Table",
    cuisine: "International",
    flag: "🌍",
    note: "Recipes that travel, mingle, and find a new home.",
    image: "/landing/map-details.jpg",
    mapPosition: { x: 50, y: 53 },
    cuisineAliases: ["International", "Global", "World"],
  },
] as const;

export const CULINARY_REGIONS: readonly CulinaryRegion[] = [
  { slug: "kanto", name: "Kanto", destinationSlug: "japan", note: "Tokyo kitchens, clear broths, and precise seasonal cooking." },
  { slug: "kansai", name: "Kansai", destinationSlug: "japan", note: "Osaka comfort food and Kyoto's quiet refinement." },
  { slug: "kyushu", name: "Kyushu", destinationSlug: "japan", note: "Rich pork broths and the southern island pantry." },
  { slug: "hokkaido", name: "Hokkaido", destinationSlug: "japan", note: "Cold-water seafood, dairy, corn, and warming bowls." },
  { slug: "north-india", name: "North India", destinationSlug: "india", note: "Clay ovens, wheat breads, legumes, and layered spice." },
  { slug: "south-india", name: "South India", destinationSlug: "india", note: "Rice, coconut, tamarind, curry leaf, and fermented batters." },
  { slug: "east-india", name: "East India", destinationSlug: "india", note: "Mustard, river fish, temple cooking, and delicate sweets." },
  { slug: "west-india", name: "West India", destinationSlug: "india", note: "Coastal curries, farsan, millet, and bold vegetarian tables." },
  { slug: "north-east-india", name: "North-East India", destinationSlug: "india", note: "Smoked foods, herbs, bamboo shoot, and gentle heat." },
  { slug: "central-india", name: "Central India", destinationSlug: "india", note: "Forest ingredients, wheat, lentils, and rustic regional plates." },
  { slug: "tuscany", name: "Tuscany", destinationSlug: "italy", note: "Beans, bread, olive oil, and generous farmhouse cooking." },
  { slug: "oaxaca", name: "Oaxaca", destinationSlug: "mexico", note: "Moles, maize, smoke, and generations of technique." },
  { slug: "central-thailand", name: "Central Thailand", destinationSlug: "thailand", note: "Aromatic soups and a careful balance of hot, sour, salty, and sweet." },
  { slug: "aegean", name: "Aegean", destinationSlug: "mediterranean", note: "Citrus, herbs, seafood, legumes, and olive oil." },
  { slug: "jeonju", name: "Jeonju", destinationSlug: "korea", note: "A celebrated table of rice, vegetables, ferments, and banchan." },
  { slug: "marrakech-safi", name: "Marrakech-Safi", destinationSlug: "morocco", note: "Tagines, preserved lemon, toasted spice, and market produce." },
  { slug: "crossroads", name: "Global Crossroads", destinationSlug: "global", note: "Flexible recipes inspired by more than one culinary home." },
] as const;

export const CULINARY_STATES: readonly CulinaryState[] = [
  {
    slug: "fukuoka",
    name: "Fukuoka",
    destinationSlug: "japan",
    regionSlug: "kyushu",
    note: "Birthplace of Hakata-style tonkotsu ramen.",
    description: "A port city whose yatai stalls serve thin noodles in intensely savoury pork broth.",
    image: "/landing/tonkotsu-ramen.png",
    recipeIds: ["curated-tonkotsu-ramen"],
  },
  {
    slug: "odisha",
    name: "Odisha",
    destinationSlug: "india",
    regionSlug: "east-india",
    note: "Land of temples, traditions, and soulful cuisine.",
    description: "Odisha's cooking balances gentle spice, seasonal produce, temple traditions, and distinctive milk sweets.",
    image: "/landing/odisha-temple.png",
    recipeIds: ["curated-chhena-poda", "curated-dalma"],
  },
] as const;

export const CURATED_RECIPE_REFERENCES: readonly CuratedRecipeReference[] = [
  {
    id: "curated-tonkotsu-ramen",
    title: "Tonkotsu Ramen",
    destinationSlug: "japan",
    regionSlug: "kyushu",
    stateSlug: "fukuoka",
    cuisine: "Japanese",
    image: "/landing/tonkotsu-ramen.png",
    description: "A rich, creamy pork-bone broth with springy noodles, egg, and scallions.",
    cookTime: 40,
    calories: 620,
    difficulty: "Medium",
    rating: 4.8,
    ratingCount: 2400,
  },
  {
    id: "curated-chhena-poda",
    title: "Chhena Poda",
    destinationSlug: "india",
    regionSlug: "east-india",
    stateSlug: "odisha",
    cuisine: "Indian",
    image: "/landing/chhena-poda.png",
    description: "Odisha's caramelised baked chhena cake, fragrant with cardamom and nuts.",
    cookTime: 60,
    calories: 380,
    difficulty: "Medium",
    rating: 4.7,
    ratingCount: 1300,
  },
  {
    id: "curated-dalma",
    title: "Dalma",
    destinationSlug: "india",
    regionSlug: "east-india",
    stateSlug: "odisha",
    cuisine: "Indian",
    image: "/landing/dish-india.jpg",
    description: "A comforting Odia lentil stew with vegetables and toasted cumin.",
    cookTime: 45,
    calories: 310,
    difficulty: "Easy",
    rating: 4.6,
    ratingCount: 820,
  },
  {
    id: "curated-ribollita",
    title: "Tuscan Ribollita",
    destinationSlug: "italy",
    regionSlug: "tuscany",
    cuisine: "Italian",
    image: "/landing/hero-bowl.jpg",
    description: "A bread-thickened Tuscan soup of beans, greens, and olive oil.",
    cookTime: 55,
    calories: 410,
    difficulty: "Easy",
    rating: 4.7,
    ratingCount: 940,
  },
  {
    id: "curated-mole-negro",
    title: "Oaxacan Mole Negro",
    destinationSlug: "mexico",
    regionSlug: "oaxaca",
    cuisine: "Mexican",
    image: "/landing/footer-still.jpg",
    description: "A deep, toasted chile sauce layered with spice, fruit, seeds, and cacao.",
    cookTime: 75,
    calories: 540,
    difficulty: "Advanced",
    rating: 4.9,
    ratingCount: 1600,
  },
  {
    id: "curated-tom-yum-goong",
    title: "Tom Yum Goong",
    destinationSlug: "thailand",
    regionSlug: "central-thailand",
    cuisine: "Thai",
    image: "/landing/discover-bowl.jpg",
    description: "Hot-and-sour prawn soup scented with lemongrass, galangal, and lime leaf.",
    cookTime: 35,
    calories: 290,
    difficulty: "Easy",
    rating: 4.8,
    ratingCount: 1800,
  },
  {
    id: "curated-aegean-fish",
    title: "Aegean Lemon-Herb Fish",
    destinationSlug: "mediterranean",
    regionSlug: "aegean",
    cuisine: "Mediterranean",
    image: "/landing/dish-greece.jpg",
    description: "Flaky fish baked with lemon, oregano, tomatoes, and extra-virgin olive oil.",
    cookTime: 32,
    calories: 430,
    difficulty: "Easy",
    rating: 4.7,
    ratingCount: 760,
  },
  {
    id: "curated-jeonju-bibimbap",
    title: "Jeonju Bibimbap",
    destinationSlug: "korea",
    regionSlug: "jeonju",
    cuisine: "Korean",
    image: "/landing/journey-discover.jpg",
    description: "Rice arranged with seasoned vegetables, egg, sesame, and gochujang.",
    cookTime: 45,
    calories: 510,
    difficulty: "Medium",
    rating: 4.8,
    ratingCount: 1500,
  },
  {
    id: "curated-moroccan-tagine",
    title: "Moroccan Vegetable Tagine",
    destinationSlug: "morocco",
    regionSlug: "marrakech-safi",
    cuisine: "Middle Eastern",
    image: "/landing/dish-morocco.jpg",
    description: "Slow-cooked vegetables with chickpeas, preserved lemon, and warm spice.",
    cookTime: 60,
    calories: 390,
    difficulty: "Easy",
    rating: 4.7,
    ratingCount: 1100,
  },
  {
    id: "curated-world-harvest-bowl",
    title: "World Harvest Bowl",
    destinationSlug: "global",
    regionSlug: "crossroads",
    cuisine: "International",
    image: "/landing/map-details.jpg",
    description: "A flexible grain bowl of roasted vegetables, legumes, herbs, and tahini.",
    cookTime: 40,
    calories: 470,
    difficulty: "Easy",
    rating: 4.6,
    ratingCount: 620,
  },
] as const;

const DESTINATION_BY_SLUG = new Map(CULINARY_DESTINATIONS.map((destination) => [destination.slug, destination]));
const DESTINATION_BY_CUISINE = new Map(
  CULINARY_DESTINATIONS.flatMap((destination) =>
    destination.cuisineAliases.map((alias) => [alias.toLocaleLowerCase(), destination] as const),
  ),
);
const STATE_BY_SLUG = new Map(CULINARY_STATES.map((state) => [state.slug, state]));
const RECIPE_BY_ID = new Map(CURATED_RECIPE_REFERENCES.map((recipe) => [recipe.id, recipe]));

export function getCulinaryDestination(slug: string | null | undefined): CulinaryDestination | undefined {
  return slug ? DESTINATION_BY_SLUG.get(slug.toLocaleLowerCase()) : undefined;
}

export function getCulinaryDestinationByCuisine(cuisine: string | null | undefined): CulinaryDestination | undefined {
  return cuisine ? DESTINATION_BY_CUISINE.get(cuisine.trim().toLocaleLowerCase()) : undefined;
}

export function getCulinaryRegions(destinationSlug: string): CulinaryRegion[] {
  return CULINARY_REGIONS.filter((region) => region.destinationSlug === destinationSlug);
}

export function getCulinaryStates(regionSlug: string): CulinaryState[] {
  return CULINARY_STATES.filter((state) => state.regionSlug === regionSlug);
}

export function getCulinaryState(slug: string | null | undefined): CulinaryState | undefined {
  return slug ? STATE_BY_SLUG.get(slug.toLocaleLowerCase()) : undefined;
}

export function getCuratedRecipeReference(id: string | null | undefined): CuratedRecipeReference | undefined {
  return id ? RECIPE_BY_ID.get(id) : undefined;
}

export function getRecipeArticle(cuisine: string): "a" | "an" {
  return /^[aeiou]/i.test(cuisine.trim()) ? "an" : "a";
}

export type PassportDestinationProgress = {
  slug: string;
  name: string;
  cuisine: string;
  explored: boolean;
  dishes_cooked: number;
  stamp_goal: number;
  stamp_earned: boolean;
  earned_at: string | null;
};

export type PassportDish = {
  recipe_id: string;
  title: string;
  image: string;
  cuisine: string;
  destination_slug: string;
  completed_at: string;
};

export type PassportProgress = {
  summary: {
    countries_explored: number;
    dishes_cooked: number;
    stamps_earned: number;
  };
  destinations: PassportDestinationProgress[];
  recent_stamps: PassportDestinationProgress[];
  recent_dishes: PassportDish[];
  next_stamp: PassportDestinationProgress & { remaining: number };
  completion?: {
    created: boolean;
    stamp_awarded: boolean;
    destination: PassportDestinationProgress;
  };
};
