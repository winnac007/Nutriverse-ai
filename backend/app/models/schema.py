from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    conditions: Optional[List[str]] = None
    condition_answers: Optional[Dict[str, Any]] = None
    goal: Optional[str] = None
    goal_30day: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    body_type: Optional[str] = None
    activity_level: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    dietary_type: Optional[str] = None
    dietary_prefs: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    timeline_weeks: Optional[int] = None
    cooking_ability: Optional[str] = None
    budget: Optional[str] = None
    challenges: Optional[str] = None
    health_plan: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    onboarded: Optional[bool] = None

class TDEERequest(BaseModel):
    age: int
    gender: str
    weight_kg: float
    height_cm: float
    activity_level: str
    goal: str = "maintain"

class MealLog(BaseModel):
    recipe_id: str
    meal_type: str
    servings: float = 1.0

class MealPlanItem(BaseModel):
    day: str
    meal_type: str
    recipe_id: str

class SaveMealPlan(BaseModel):
    items: List[MealPlanItem]

class AIPlanRequest(BaseModel):
    context: Optional[str] = ""

class CoachAsk(BaseModel):
    question: str

class MealSwapRequest(BaseModel):
    day: str
    meal_type: str
    current_recipe_id: str

class UpdateMealRequest(BaseModel):
    day: str
    meal_type: str
    recipe_id: str

class WeightLog(BaseModel):
    weight_kg: float
    note: Optional[str] = None

class LifestyleLog(BaseModel):
    sleep_hours: Optional[float] = None
    water_ml: Optional[int] = None
    mood: Optional[str] = None  # great | ok | low
    workout_minutes: Optional[int] = None
    notes: Optional[str] = None

class PremiumEbookRequest(BaseModel):
    aspiration: str
    flavor: str
    time: str
    why: Optional[str] = None

class OnboardingPlanRequest(BaseModel):
    conditions: List[str]
    condition_answers: Dict[str, Any]
    dietary_type: str
    allergies: List[str]
    cooking_ability: str
    budget: str
    goal_30day: str
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    activity_level: Optional[str] = None
