import { BodyProfile, NutritionCalculations } from '../types';

export function calculateNutrition(profile: BodyProfile): NutritionCalculations {
  const heightM = profile.heightCm / 100;
  const bmiRaw = profile.weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let bmiStatus: NutritionCalculations['bmiStatus'] = 'Normal';
  if (bmi < 18.5) bmiStatus = 'Underweight';
  else if (bmi < 25) bmiStatus = 'Normal';
  else if (bmi < 30) bmiStatus = 'Overweight';
  else if (bmi < 35) bmiStatus = 'Obesity I';
  else bmiStatus = 'Obesity II';

  // Mifflin-St Jeor Equation
  let bmrRaw: number;
  if (profile.gender === 'Female') {
    bmrRaw = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
  } else if (profile.gender === 'Male') {
    bmrRaw = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  } else {
    bmrRaw = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 78;
  }
  const bmr = Math.round(bmrRaw);

  // Activity multipliers
  const activityMap: Record<string, number> = {
    'Sedentary': 1.2,
    'Lightly active': 1.375,
    'Moderately active': 1.55,
    'Very active': 1.725,
    'Extra active': 1.9,
  };
  const multiplier = activityMap[profile.activityLevel] || 1.55;
  const tdee = Math.round((bmr * multiplier) / 50) * 50; // round to nearest 50 for clean display

  // Ideal Body Weight range (BMI 18.5 to 24.9)
  const ibwMin = Math.round(18.5 * (heightM * heightM));
  const ibwMax = Math.round(24.9 * (heightM * heightM));

  // Daily target (adjusted for hormonal balance or weight goal)
  let dailyCalories = 2000;
  if (profile.healthGoal.toLowerCase().includes('weight loss')) {
    dailyCalories = Math.max(1400, tdee - 400);
  } else if (profile.healthGoal.toLowerCase().includes('muscle') || profile.healthGoal.toLowerCase().includes('strength')) {
    dailyCalories = tdee + 200;
  } else {
    dailyCalories = Math.min(2400, Math.max(1600, Math.round(tdee / 100) * 100));
  }

  // 20% protein, 50% carbs, 30% fat
  const proteinGrams = Math.round((dailyCalories * 0.20) / 4);
  const carbsGrams = Math.round((dailyCalories * 0.50) / 4);
  const fatGrams = Math.round((dailyCalories * 0.30) / 9);

  return {
    bmi,
    bmiStatus,
    bmr,
    tdee,
    ibwMin,
    ibwMax,
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

