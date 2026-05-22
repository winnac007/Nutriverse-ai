// Brand-wide chapter definitions for Zenplato
import { Sprout, Dumbbell, Globe2, ChefHat } from "lucide-react";

export const CHAPTERS = [
  {
    id: "healthcare",
    number: "01",
    overline: "Healthcare",
    title: "Heal & Restore",
    desc: "PCOS, diabetes, thyroid, gut — translated to everyday meals.",
    icon: Sprout,
    to: "/app/healthcare",
    // Lentil dal / nourishing bowl
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=1200&q=85",
    variant: "sage",
  },
  {
    id: "fitness",
    number: "02",
    overline: "Fitness",
    title: "Strength & Fuel",
    desc: "High protein and balanced macros that fit your week.",
    icon: Dumbbell,
    to: "/app/category/fitness",
    // Chicken + grains + greens plate
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85",
    variant: "cream",
  },
  {
    id: "cultural",
    number: "03",
    overline: "Discover",
    title: "Travel the Plate",
    desc: "Global cuisines, gently adapted to how you live.",
    icon: Globe2,
    to: "/app/storymap",
    // Asian noodle bowl with chopsticks
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=85",
    variant: "dark",
  },
  {
    id: "chef-special",
    number: "04",
    overline: "Indulgence",
    title: "Chef Specials",
    desc: "Mindful desserts & bakery — moments worth slowing for.",
    icon: ChefHat,
    to: "/app/category/chef-special",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&q=85",
    variant: "warm",
  },
];

export const BRAND = {
  name: "Zenplato",
  tagline: "Mindful nutrition. Balanced living.",
  microTagline: "You are the zen for your body.",
};
