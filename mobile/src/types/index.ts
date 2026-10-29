export type Gender = 'Female' | 'Male' | 'Other';

export interface BodyProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  activityDescription?: string;
  healthGoal: string;
  healthGoalDescription?: string;
  bodyFatPercent?: string;
  muscleMassKg?: string;
}

export interface NutritionCalculations {
  bmi: number;
  bmiStatus: 'Underweight' | 'Normal' | 'Overweight' | 'Obesity I' | 'Obesity II';
  bmr: number;
  tdee: number;
  ibwMin: number;
  ibwMax: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface GoalSettingState {
  primaryGoal: string;
  currentWeight: number;
  targetWeight: number;
  heightCm: number;
  age: number;
  activityLevel: string;
  conditions: string[];
  goalCategory: 'Weight goal' | 'Health goal' | 'Lifestyle goal';
  selectedGoals: string[];
  cycleRegularity: string;
  symptomsTarget: string;
  timeline: '3 months' | '6 months' | '12 months';
  sleepDuration: string;
  waterIntake: string;
  workRoutine: string;
  stressLevel: string;
  exerciseRoutine: string;
  cuisine: string;
  dietType: string;
  likedFoods: string[];
  avoidFoods: string[];
}

export type RootTab = 'Home' | 'Explore' | 'Add' | 'Plans' | 'You';

