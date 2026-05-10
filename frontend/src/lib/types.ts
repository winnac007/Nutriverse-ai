export interface User {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
  onboarded: boolean;
  category: string;
  conditions: string[];
  condition_answers: Record<string, any>;
  preferences: Record<string, any>;
  health_plan: any;
  dietary_type: string;
  allergies: string[];
  cooking_ability: string;
  budget: string;
  goal_30day: string;
  saved_recipes: string[];
  location?: string;
  age?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  goal?: string;
  body_type?: string;
  timeline_weeks?: number;
  condition?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  cuisine: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    gi?: number;
  };
  ingredients: RecipeIngredient[];
  steps: string[];
  description: string;
  image: string;
  cook_time: number;
  servings: number;
  is_premium: boolean;
  country?: string;
  region?: string;
  tags?: string[];
  chef?: {
    name: string;
    credentials: string;
  };
  avoid?: string[];
}
