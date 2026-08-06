export type CulinaryDestination = {
  slug: string;
  name: string;
  cuisine: string;
  flag: string;
  note: string;
  image: string;
};

export const CULINARY_DESTINATIONS: CulinaryDestination[] = [
  {
    slug: "japan",
    name: "Japan",
    cuisine: "Japanese",
    flag: "🇯🇵",
    note: "Umami, ritual, and the sea.",
    image: "/landing/dish-japan.jpg",
  },
  {
    slug: "india",
    name: "India",
    cuisine: "Indian",
    flag: "🇮🇳",
    note: "Spice, balance, and regional tradition.",
    image: "/landing/dish-india.jpg",
  },
  {
    slug: "italy",
    name: "Italy",
    cuisine: "Italian",
    flag: "🇮🇹",
    note: "Simple ingredients, generous tables.",
    image: "/landing/dish-greece.jpg",
  },
  {
    slug: "mexico",
    name: "Mexico",
    cuisine: "Mexican",
    flag: "🇲🇽",
    note: "Maize, fire, citrus, and slow-cooked depth.",
    image: "/landing/hero-bowl.jpg",
  },
  {
    slug: "thailand",
    name: "Thailand",
    cuisine: "Thai",
    flag: "🇹🇭",
    note: "Bright herbs, heat, sweetness, and sourness.",
    image: "/landing/discover-bowl.jpg",
  },
];

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
