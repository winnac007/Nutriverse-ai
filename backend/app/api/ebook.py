from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
import json
from datetime import datetime, timezone
from app.core.database import db
from app.core.security import get_current_user, calc_tdee
from app.data.healthcare_data import CONDITIONS

from app.models.schema import PremiumEbookRequest

router = APIRouter(prefix="/ebook", tags=["ebook"])

VALID_CONDITIONS = ["pcos", "diabetes", "thyroid", "gut-health", "anti-inflammatory", "menopause"]

@router.post("/craft")
async def generate_premium_ebook(answers: Dict[str, Any], user=Depends(get_current_user)):
    """Generate a hyper-personalised AI ebook on-demand."""
    if not user.get("is_premium"):
        raise HTTPException(403, "Premium feature required")

    from app.services.ai_service import call_ai, user_profile_text, extract_json
    
    primary = _resolve_primary_condition(user)
    condition_label = "General Wellness"
    if primary:
        rec = _condition_record(primary)
        condition_label = rec["label"] if rec else primary.replace("-", " ").title()

    profile = user_profile_text(user)
    
    system_prompt = f"""You are a master clinical nutritionist and wellness alchemist. 
    You create hyper-personalised, high-end nutritional blueprints.
    Your tone is sophisticated, empathetic, and scientifically rigorous yet accessible.
    
    OUTPUT FORMAT: Return a JSON object with:
    {{
      "condition_id": "premium",
      "condition_label": "Personalised Blueprint",
      "is_premium": true,
      "summary": {{
        "greeting": "...",
        "condition_blurb": "...",
        "personalized_welcome": "A warm 2-3 paragraph note written directly to the user.",
        "health_snapshot": "A concise narrative summary of the user's current health context.",
        "nutrition_insights": "Personalized nutrition insight paragraph for the Health Snapshot narrative page.",
        "lifestyle_insights": "Personalized lifestyle insight paragraph covering sleep, stress, movement, hydration, or routine patterns.",
        "triggers_patterns": "Personalized paragraph describing likely triggers and repeating patterns from their answers.",
        "path_forward": "A short next-step paragraph for the Health Snapshot narrative page.",
        "understanding_items": [
          {{ "title": "What It Means", "body": "A personalized explanation of what the user's primary condition means in plain language.", "icon": "leaf" }},
          {{ "title": "Why It Matters", "body": "A personalized explanation of why understanding this condition matters for their goals and symptoms.", "icon": "balance" }},
          {{ "title": "How It May Affect Daily Life", "body": "A personalized explanation of daily-life patterns the user may recognize.", "icon": "sun" }}
        ],
        "symptom_flow_steps": [
          {{ "number": "01.", "title": "Hormonal Changes", "body": "Personalized explanation of hormonal changes connected to the user's symptoms.", "icon": "hormone" }},
          {{ "number": "02.", "title": "Blood Sugar Fluctuations", "body": "Personalized explanation of glucose or energy fluctuations.", "icon": "bloodSugar" }},
          {{ "number": "03.", "title": "Cravings & Energy Dips", "body": "Personalized explanation of cravings, fatigue, irritability, or fuel instability.", "icon": "cravings" }},
          {{ "number": "04.", "title": "Daily Challenges", "body": "Personalized explanation of how the cycle may show up in daily life.", "icon": "daily" }}
        ],
        "symptom_flow_takeaway": "One elegant sentence about understanding the why behind symptoms.",
        "nutrition_influence_items": [
          {{ "number": "01.", "title": "Energy", "body": "Personalized explanation of how nutrition can support energy.", "icon": "energy" }},
          {{ "number": "02.", "title": "Cravings", "body": "Personalized explanation of how nutrition can support cravings and satiety.", "icon": "cravings" }},
          {{ "number": "03.", "title": "Hormonal Balance", "body": "Personalized explanation of how nutrition can support hormone balance.", "icon": "balance" }},
          {{ "number": "04.", "title": "Long-Term Health", "body": "Personalized explanation of how nutrition can support long-term health.", "icon": "leaf" }}
        ],
        "nutrition_influence_takeaway": "One elegant sentence about food as information for the body.",
        "foods_to_prioritize": [
          {{ "title": "A personalized food category to prioritize", "description": "Why this food category supports the user's condition, symptoms, preferences, and goal." }},
          {{ "title": "A second personalized food category", "description": "Specific, concise benefit tied to blood sugar, hormones, digestion, inflammation, energy, or satiety." }},
          {{ "title": "A third personalized food category", "description": "..." }},
          {{ "title": "A fourth personalized food category", "description": "..." }},
          {{ "title": "A fifth personalized food category", "description": "..." }},
          {{ "title": "A sixth personalized food category", "description": "..." }},
          {{ "title": "A seventh personalized food category", "description": "..." }},
          {{ "title": "An eighth personalized food category", "description": "..." }}
        ],
        "foods_to_be_mindful_of": [
          {{ "title": "A food category to be mindful of", "description": "Why moderation may support the user's condition, symptoms, preferences, and goal." }},
          {{ "title": "A second mindful food category", "description": "Specific, concise reason tied to blood sugar, hormones, digestion, inflammation, energy, sleep, or cravings." }},
          {{ "title": "A third mindful food category", "description": "..." }},
          {{ "title": "A fourth mindful food category", "description": "..." }},
          {{ "title": "A fifth mindful food category", "description": "..." }},
          {{ "title": "A sixth mindful food category", "description": "..." }},
          {{ "title": "A seventh mindful food category", "description": "..." }},
          {{ "title": "An eighth mindful food category", "description": "..." }}
        ],
        "hydration_guidance": {{
          "intro": "A personalized hydration paragraph tied to the user's symptoms, routine, goal, and climate/activity context if known.",
          "daily_goal": "A concise daily target such as 8-10 glasses or a personalized range.",
          "morning_ritual": "A specific morning hydration habit.",
          "evening_ritual": "A specific evening hydration habit.",
          "steps": [
            {{ "title": "Daily Goal", "body": "Personalized guidance for total daily fluids." }},
            {{ "title": "Sip Consistently", "body": "Personalized guidance for spacing water through the day." }},
            {{ "title": "Start & End Your Day", "body": "Personalized morning and evening ritual guidance." }},
            {{ "title": "Enhance Naturally", "body": "Personalized infusion or electrolyte guidance based on preferences." }},
            {{ "title": "Listen To Your Body", "body": "Personalized signs to watch for and a gentle rehydration cue." }}
          ],
          "tips": ["Short practical tip 1", "Short practical tip 2", "Short practical tip 3", "Short practical tip 4"],
          "quote": "One elegant hydration quote written in the user's supportive tone."
        }},
        "meal_timing_guidance": {{
          "intro": "A personalized paragraph explaining why meal timing matters for the user's symptoms, energy, hunger, sleep, and goals.",
          "entries": [
            {{ "time": "7:00 - 8:30 AM", "title": "Breakfast", "body": "Personalized breakfast timing guidance with protein, fiber, and blood sugar support." }},
            {{ "time": "10:30 - 11:00 AM", "title": "Mid-Morning Snack", "body": "Personalized snack guidance if the user needs steadier energy before lunch." }},
            {{ "time": "12:30 - 1:30 PM", "title": "Lunch", "body": "Personalized lunch timing guidance for focus, cravings, and sustained energy." }},
            {{ "time": "4:00 - 4:30 PM", "title": "Evening Snack", "body": "Personalized late-afternoon snack guidance for blood sugar and dinner appetite." }},
            {{ "time": "6:30 - 7:30 PM", "title": "Dinner", "body": "Personalized dinner timing guidance for digestion, sleep, and recovery." }}
          ],
          "consistency_title": "Consistency Is Key",
          "consistency_body": "A concise personalized paragraph about a sustainable eating rhythm.",
          "quote": "One elegant quote about consistency and rhythm."
        }},
        "food_swaps": {{
          "intro": "A personalized paragraph explaining how small swaps can support the user's condition, preferences, and goal.",
          "swaps": [
            {{ "before_title": "A less supportive food choice", "before_body": "Why this may be worth reducing.", "after_title": "A more supportive replacement", "after_body": "Why this supports the user's body." }},
            {{ "before_title": "Second less supportive choice", "before_body": "...", "after_title": "Second replacement", "after_body": "..." }},
            {{ "before_title": "Third less supportive choice", "before_body": "...", "after_title": "Third replacement", "after_body": "..." }},
            {{ "before_title": "Fourth less supportive choice", "before_body": "...", "after_title": "Fourth replacement", "after_body": "..." }}
          ],
          "quote": "One elegant quote about small repeated choices."
        }},
        "stress_insight": "A personalized stress insight paragraph explaining how the user's stress, sleep, energy, cravings, or routine may affect consistency.",
        "daily_habits": [
          {{ "title": "Morning Hydration", "body": "Personalized habit guidance for starting the day with hydration.", "icon": "bottle" }},
          {{ "title": "Balanced Breakfast", "body": "Personalized habit guidance for a balanced first meal.", "icon": "bowl" }},
          {{ "title": "Daily Movement", "body": "Personalized habit guidance for approachable movement.", "icon": "shoe" }},
          {{ "title": "Recovery Habits", "body": "Personalized habit guidance for sleep, stress regulation, and downtime.", "icon": "lotus" }}
        ],
        "recipe_collection_intro": "A personalized paragraph introducing why this recipe collection fits the user's condition, food preferences, time limit, and wellness goals.",
        "breakfast_recipes": [
          {{
            "name": "A hormone-supportive breakfast recipe name",
            "subtitle": "A concise sentence explaining the benefit of this breakfast.",
            "prep_time": "10 mins",
            "servings": "2",
            "difficulty": "Easy",
            "ingredients": ["Ingredient 1 with amount", "Ingredient 2 with amount", "Ingredient 3 with amount"],
            "method": [
              {{ "title": "Prepare", "body": "Step 1 instruction." }},
              {{ "title": "Mix", "body": "Step 2 instruction." }},
              {{ "title": "Chill", "body": "Step 3 instruction." }},
              {{ "title": "Prepare Toppings", "body": "Step 4 instruction." }},
              {{ "title": "Assemble", "body": "Step 5 instruction." }}
            ],
            "make_it_yours_title": "Make It Yours",
            "make_it_yours_body": "A short customization tip based on user preferences.",
            "nutrition_highlights": [
              {{ "title": "High In Fiber", "body": "Personalized benefit.", "icon": "leaf" }},
              {{ "title": "Hormone Balancing", "body": "Personalized benefit.", "icon": "balance" }},
              {{ "title": "Steady Energy", "body": "Personalized benefit.", "icon": "energy" }},
              {{ "title": "Rich In Antioxidants", "body": "Personalized benefit.", "icon": "heart" }}
            ],
            "benefits": [
              {{ "title": "Hormone Balance", "body": "Personalized benefit.", "icon": "balance" }},
              {{ "title": "Gut Health", "body": "Personalized benefit.", "icon": "leaf" }},
              {{ "title": "Immune Support", "body": "Personalized benefit.", "icon": "heart" }},
              {{ "title": "Mood & Stress", "body": "Personalized benefit.", "icon": "leaf" }},
              {{ "title": "Sustained Energy", "body": "Personalized benefit.", "icon": "energy" }},
              {{ "title": "Skin Glow", "body": "Personalized benefit.", "icon": "heart" }}
            ],
            "protein_summary_title": "Protein",
            "protein_summary_body": "Short explanation of the protein mix.",
            "nutrition_breakdown": [
              {{ "ingredient": "Protein source 1", "amount": "5 g" }},
              {{ "ingredient": "Protein source 2", "amount": "3 g" }},
              {{ "ingredient": "Protein source 3", "amount": "2 g" }},
              {{ "ingredient": "Protein source 4", "amount": "1 g" }},
              {{ "ingredient": "Protein source 5", "amount": "1 g" }}
            ],
            "total_protein": "12 g"
          }},
          {{
            "name": "Second breakfast recipe name",
            "subtitle": "Concise benefit sentence.",
            "prep_time": "10 mins",
            "servings": "2",
            "difficulty": "Easy",
            "ingredients": ["..."],
            "method": [{{ "title": "Prepare Matcha", "body": "..." }}, {{ "title": "Make Pudding", "body": "..." }}, {{ "title": "Chill", "body": "..." }}, {{ "title": "Prepare Toppings", "body": "..." }}, {{ "title": "Assemble", "body": "..." }}, {{ "title": "Top & Enjoy", "body": "..." }}],
            "make_it_yours_title": "Tip",
            "make_it_yours_body": "A short customization tip.",
            "nutrition_highlights": [
              {{ "title": "Hormone Balance", "body": "...", "icon": "balance" }},
              {{ "title": "Gut Health", "body": "...", "icon": "leaf" }},
              {{ "title": "Immune Support", "body": "...", "icon": "heart" }},
              {{ "title": "Sustained Energy", "body": "...", "icon": "energy" }}
            ],
            "benefits": [
              {{ "title": "Hormone Balance", "body": "...", "icon": "balance" }},
              {{ "title": "Gut Health", "body": "...", "icon": "leaf" }},
              {{ "title": "Immune Support", "body": "...", "icon": "heart" }},
              {{ "title": "Mood & Stress", "body": "...", "icon": "leaf" }},
              {{ "title": "Sustained Energy", "body": "...", "icon": "energy" }},
              {{ "title": "Skin Glow", "body": "...", "icon": "heart" }}
            ],
            "protein_summary_title": "Protein",
            "protein_summary_body": "Short protein summary.",
            "nutrition_breakdown": [
              {{ "ingredient": "Protein source 1", "amount": "5 g" }},
              {{ "ingredient": "Protein source 2", "amount": "3 g" }},
              {{ "ingredient": "Protein source 3", "amount": "2 g" }},
              {{ "ingredient": "Protein source 4", "amount": "1 g" }},
              {{ "ingredient": "Protein source 5", "amount": "1 g" }}
            ],
            "total_protein": "12 g"
          }}
        ],
        "snack_recipes": [
          {{
            "name": "Personalized smart snack recipe name",
            "subtitle": "Short sentence explaining the snack benefit.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5"],
            "prep_time": "5 mins",
            "chill_time": "Overnight",
            "servings": "1",
            "icon": "moon"
          }},
          {{
            "name": "Second smart snack recipe name",
            "subtitle": "Short benefit sentence.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5"],
            "prep_time": "10 mins",
            "store_in": "Fridge",
            "servings": "2",
            "icon": "energy"
          }},
          {{
            "name": "Third smart snack recipe name",
            "subtitle": "Short benefit sentence.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5"],
            "prep_time": "5 mins",
            "bake_time": "25 mins",
            "servings": "2",
            "icon": "leaf"
          }}
        ],
        "snack_features": [
          {{ "title": "Nutrient Dense", "body": "Short personalized benefit.", "icon": "leaf" }},
          {{ "title": "Energy Boost", "body": "Short personalized benefit.", "icon": "energy" }},
          {{ "title": "Satisfying", "body": "Short personalized benefit.", "icon": "heart" }},
          {{ "title": "Good For You", "body": "Short personalized benefit.", "icon": "heart" }}
        ],
        "snack_benefits": [
          {{ "title": "Stabilizes Blood Sugar", "body": "Short personalized benefit.", "icon": "leaf" }},
          {{ "title": "Improves Focus", "body": "Short personalized benefit.", "icon": "energy" }},
          {{ "title": "Supports Healthy Digestion", "body": "Short personalized benefit.", "icon": "leaf" }},
          {{ "title": "Strengthens Immunity", "body": "Short personalized benefit.", "icon": "heart" }},
          {{ "title": "Helps Manage Weight", "body": "Short personalized benefit.", "icon": "balance" }},
          {{ "title": "Keeps You Full", "body": "Short personalized benefit.", "icon": "protein" }}
        ],
        "beverage_recipes": [
          {{
            "name": "Personalized smoothie or beverage name",
            "subtitle": "Short sentence explaining the beverage benefit.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
            "prep_time": "5 mins",
            "blend_time": "1 min",
            "servings": "1",
            "accent": "berry",
            "icon": "berry"
          }},
          {{
            "name": "Second personalized beverage name",
            "subtitle": "Short benefit sentence.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
            "prep_time": "5 mins",
            "cook_time": "5 mins",
            "servings": "1",
            "accent": "gold",
            "icon": "cup"
          }},
          {{
            "name": "Third personalized beverage name",
            "subtitle": "Short benefit sentence.",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
            "prep_time": "5 mins",
            "blend_time": "1 min",
            "servings": "1",
            "accent": "green",
            "icon": "leaf"
          }}
        ],
        "beverage_features": [
          {{ "title": "Nutrient Rich", "body": "Short personalized benefit.", "icon": "leaf" }},
          {{ "title": "Energizing", "body": "Short personalized benefit.", "icon": "energy" }},
          {{ "title": "Immunity Support", "body": "Short personalized benefit.", "icon": "heart" }},
          {{ "title": "Hydrating", "body": "Short personalized benefit.", "icon": "leaf" }}
        ],
        "beverage_benefits": [
          {{ "title": "Rich in Antioxidants", "body": "Short personalized benefit.", "icon": "balance" }},
          {{ "title": "Supports Digestion", "body": "Short personalized benefit.", "icon": "leaf" }},
          {{ "title": "Promotes Healthy Skin", "body": "Short personalized benefit.", "icon": "heart" }},
          {{ "title": "Helps Manage Weight", "body": "Short personalized benefit.", "icon": "protein" }},
          {{ "title": "Improves Mood", "body": "Short personalized benefit.", "icon": "heart" }}
        ],
        "grocery_list": {{
          "intro": "One concise personalized grocery intro sentence.",
          "protein_sources": {{
            "title": "Protein Sources",
            "summary": "Short personalized category summary.",
            "items": [
              {{ "name": "Protein item 1", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }},
              {{ "name": "Protein item 2", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }},
              {{ "name": "Protein item 3", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }},
              {{ "name": "Protein item 4", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }},
              {{ "name": "Protein item 5", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }},
              {{ "name": "Protein item 6", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }}
            ]
          }},
          "vegetables": {{
            "title": "Vegetables",
            "summary": "Short personalized category summary.",
            "items": [
              {{ "name": "Vegetable overview item 1", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }}
            ]
          }},
          "fruits": {{
            "title": "Fruits",
            "summary": "Short personalized category summary.",
            "items": [
              {{ "name": "Fruit overview item 1", "description": "Short reason it fits this user.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }}
            ]
          }},
          "fruit_catalog": [
            {{ "name": "Fruit item 1", "description": "Short benefit.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }}
          ],
          "vegetable_catalog": [
            {{ "name": "Vegetable item 1", "description": "Short benefit.", "tags": ["Benefit 1", "Benefit 2", "Benefit 3"] }}
          ]
        }},
        "week_1_plan": {{
          "week": "Week 1",
          "title": "Build Momentum",
          "range": "Days 1-7",
          "focus": "Awareness & small wins",
          "days": [
            {{ "day": 1, "action": "Short personalized daily action." }},
            {{ "day": 2, "action": "Short personalized daily action." }},
            {{ "day": 3, "action": "Short personalized daily action." }},
            {{ "day": 4, "action": "Short personalized daily action." }},
            {{ "day": 5, "action": "Short personalized daily action." }},
            {{ "day": 6, "action": "Short personalized daily action." }},
            {{ "day": 7, "action": "Short personalized daily action." }}
          ]
        }},
        "week_2_plan": {{
          "week": "Week 2",
          "title": "Strengthen Habits",
          "range": "Days 8-14",
          "focus": "Meal structure & routine",
          "days": [
            {{ "day": 8, "action": "Short personalized daily action." }},
            {{ "day": 9, "action": "Short personalized daily action." }},
            {{ "day": 10, "action": "Short personalized daily action." }},
            {{ "day": 11, "action": "Short personalized daily action." }},
            {{ "day": 12, "action": "Short personalized daily action." }},
            {{ "day": 13, "action": "Short personalized daily action." }},
            {{ "day": 14, "action": "Short personalized daily action." }}
          ]
        }},
        "week_3_plan": {{
          "week": "Week 3",
          "title": "Elevate & Challenge",
          "range": "Days 15-21",
          "focus": "Confidence & momentum",
          "days": [
            {{ "day": 15, "action": "Short personalized daily action." }},
            {{ "day": 16, "action": "Short personalized daily action." }},
            {{ "day": 17, "action": "Short personalized daily action." }},
            {{ "day": 18, "action": "Short personalized daily action." }},
            {{ "day": 19, "action": "Short personalized daily action." }},
            {{ "day": 20, "action": "Short personalized daily action." }},
            {{ "day": 21, "action": "Short personalized daily action." }}
          ]
        }},
        "week_4_plan": {{
          "week": "Week 4",
          "title": "Sustain & Thrive",
          "range": "Days 22-30",
          "focus": "Maintaining progress",
          "days": [
            {{ "day": 22, "action": "Short personalized daily action." }},
            {{ "day": 23, "action": "Short personalized daily action." }},
            {{ "day": 24, "action": "Short personalized daily action." }},
            {{ "day": 25, "action": "Short personalized daily action." }},
            {{ "day": 26, "action": "Short personalized daily action." }},
            {{ "day": 27, "action": "Short personalized daily action." }},
            {{ "day": 28, "action": "Short personalized daily action." }},
            {{ "day": 29, "action": "Short personalized daily action." }},
            {{ "day": 30, "action": "Short personalized daily action." }}
          ]
        }},
        "action_plan_tips": ["Short success tip 1", "Short success tip 2", "Short success tip 3", "Short success tip 4", "Short success tip 5"],
        "action_plan_remember": "One concise encouraging reminder sentence.",
        "closing_message": "A warm personalized closing paragraph that helps the user feel empowered and supported.",
        "next_chapter_steps": [
          {{ "title": "Stay Consistent", "body": "Short personalized next step.", "icon": "leaf" }},
          {{ "title": "Track Your Signals", "body": "Short personalized next step.", "icon": "balance" }},
          {{ "title": "Adjust Gently", "body": "Short personalized next step.", "icon": "energy" }},
          {{ "title": "Get Support", "body": "Short personalized next step.", "icon": "heart" }}
        ],
        "faq_items": [
          {{ "question": "A likely personalized nutrition question?", "answer": "Concise useful answer." }},
          {{ "question": "A likely lifestyle question?", "answer": "Concise useful answer." }},
          {{ "question": "A likely progress question?", "answer": "Concise useful answer." }},
          {{ "question": "A likely long-term success question?", "answer": "Concise useful answer." }}
        ],
        "finding_1": "Title: personalized finding description",
        "finding_2": "Title: personalized finding description",
        "finding_3": "Title: personalized finding description",
        "finding_4": "Title: personalized finding description",
        "core_takeaway": "One elegant takeaway sentence from the key findings.",
        "key_health_focus_areas": [
          {{ "eyebrow": "01 | Hormonal Balance", "title": "Hormonal Balance", "status": "Needs Attention", "description": "...", "icon": "balance", "progress": 48 }},
          {{ "eyebrow": "02 | Insulin Sensitivity", "title": "Insulin Sensitivity", "status": "Needs Attention", "description": "...", "icon": "avocado", "progress": 49 }},
          {{ "eyebrow": "03 | Digestive Health", "title": "Digestive Health", "status": "Moderate", "description": "...", "icon": "gut", "progress": 68 }},
          {{ "eyebrow": "04 | Stress & Recovery", "title": "Stress & Recovery", "status": "Needs Attention", "description": "...", "icon": "stress", "progress": 40 }},
          {{ "eyebrow": "05 | Sleep Quality", "title": "Sleep Quality", "status": "Needs Attention", "description": "...", "icon": "sleep", "progress": 49 }},
          {{ "eyebrow": "06 | Inflammation Level", "title": "Inflammation Level", "status": "Moderate", "description": "...", "icon": "leaf", "progress": 63 }}
        ],
        "at_glance": [
          {{ "label": "Focus Areas Analyzed", "value": "6", "description": "Key areas of your health have been assessed based on your responses.", "icon": "search" }},
          {{ "label": "Priority Needs", "value": "3", "description": "Areas that need your immediate attention and consistent support.", "icon": "star" }},
          {{ "label": "Moderate Status", "value": "2", "description": "Areas showing moderate balance with room for improvement.", "icon": "trend" }},
          {{ "label": "Strong Areas", "value": "1", "description": "Areas where your body is functioning well and showing good resilience.", "icon": "heart" }}
        ],
        "next_best_step_headline": "Personalized. Practical. Powerful.",
        "next_best_step_body": "A short paragraph explaining why the user's plan is the next right step.",
        "next_best_step_cta": "View Your Plan",
        "biggest_opportunities": [
          {{ "number": "01", "title": "The user's highest leverage opportunity", "paragraphs": ["A warm paragraph explaining why this area has the greatest potential.", "A paragraph connecting this opportunity to their answers and body signals.", "A paragraph describing what could improve with small consistent support.", "A closing paragraph about awareness becoming action."] }},
          {{ "number": "02", "title": "The user's second opportunity", "paragraphs": ["...", "...", "..."] }},
          {{ "number": "03", "title": "The user's third opportunity", "paragraphs": ["...", "...", "..."] }}
        ],
        "focus_points": ["...", "...", "..."],
        "stats": [{{ "label": "...", "value": "..." }}]
      }},
      "chapters": [
        {{ "id": 1, "title": "Your Biological North Star", "html_content": "..." }},
        {{ "id": 2, "title": "The Alchemist's Kitchen", "html_content": "..." }},
        {{ "id": 3, "title": "90-Day Transformation Protocol", "html_content": "..." }},
        {{ "id": 4, "title": "Signature Recipes for {answers.get('aspiration', 'wellness')}", "html_content": "..." }},
        {{ "id": 5, "title": "The Daily Rituals", "html_content": "..." }}
      ]
    }}
    
    STYLING RULES:
    - Use <div class="callout insight">, <div class="compare">, <div class="pillars"> as defined in our design system.
    - Each chapter should be 500+ words of rich, specific advice.
    - Populate every summary field above because the premium ebook pages render these as personalized live text.
    - key_health_focus_areas.progress must be a number from 8 to 92, where lower means more attention needed and higher means stronger status.
    - key_health_focus_areas.icon must be one of: balance, avocado, gut, stress, sleep, leaf.
    - at_glance must contain exactly four objects and use icons only from: search, star, trend, heart.
    - biggest_opportunities must contain exactly three objects with numbers 01, 02, 03. Each title should be a concise personalized health opportunity, not a generic chapter name.
    - biggest_opportunities[0].paragraphs should contain four short paragraphs because it renders on the first opportunity page.
    - understanding_items must contain exactly three objects titled "What It Means", "Why It Matters", and "How It May Affect Daily Life"; icons must be leaf, balance, and sun in that order.
    - symptom_flow_steps must contain exactly four objects titled "Hormonal Changes", "Blood Sugar Fluctuations", "Cravings & Energy Dips", and "Daily Challenges"; icons must be hormone, bloodSugar, cravings, and daily in that order.
    - nutrition_influence_items must contain exactly four objects titled "Energy", "Cravings", "Hormonal Balance", and "Long-Term Health"; icons must be energy, cravings, balance, and leaf in that order.
    - foods_to_prioritize must contain exactly eight objects with short title and description fields. Make them personalized food categories, not long recipes.
    - foods_to_be_mindful_of must contain exactly eight objects with short title and description fields. Use a balanced, non-shaming tone and avoid calling foods "bad".
    - hydration_guidance must include intro, daily_goal, morning_ritual, evening_ritual, exactly five steps, exactly four tips, and a short quote.
    - meal_timing_guidance must include intro, exactly five entries, consistency_title, consistency_body, and quote.
    - food_swaps must include intro, exactly four swaps with before_title, before_body, after_title, after_body, and quote.
    - stress_insight must be one concise personalized paragraph. It should connect stress, sleep, cravings, energy, routine, and consistency without sounding clinical or alarming.
    - daily_habits must contain exactly four objects titled Morning Hydration, Balanced Breakfast, Daily Movement, Recovery Habits; icons must be bottle, bowl, shoe, lotus in that order.
    - recipe_collection_intro must be one concise personalized paragraph that fits inside a small insight card.
    - breakfast_recipes must contain at least two complete recipe objects. Method objects should include short title and body fields. Use icons only from: leaf, balance, energy, heart, protein. Keep ingredients concise because they render in fixed recipe layouts. benefits should contain exactly six concise benefit cards.
    - snack_recipes must contain exactly three complete snack objects. Use icon values only from: moon, energy, leaf. Keep each snack to five short ingredients. Include prep_time and either chill_time, bake_time, or store_in plus servings.
    - snack_features must contain exactly four concise objects. snack_benefits must contain exactly six concise objects. Use highlight icons only from: leaf, balance, energy, heart, protein.
    - beverage_recipes must contain exactly three complete beverage objects. Use accent values berry, gold, green in that order and icon values berry, cup, leaf. Keep each beverage to six short ingredients.
    - beverage_features must contain exactly four concise objects and beverage_benefits exactly five concise objects. Use highlight icons only from: leaf, balance, energy, heart, protein.
    - grocery_list must include intro, protein_sources, vegetables, fruits, fruit_catalog, and vegetable_catalog. protein_sources, vegetables, and fruits must each contain exactly six overview items. fruit_catalog must contain exactly fifteen fruit items. vegetable_catalog must contain exactly twenty vegetable items. Each grocery item needs a short name, one concise description, and exactly three short benefit tags.
    - week_1_plan, week_2_plan, week_3_plan, and week_4_plan must be complete objects with week, title, range, focus, and days arrays. Weeks 1-3 must each contain exactly seven day objects; week_4_plan must contain exactly nine day objects for days 22-30.
    - Every action-plan day object must include the correct numeric day and a short action under 64 characters so it fits the fixed 30-day layout.
    - action_plan_tips must contain exactly five short practical tips. action_plan_remember must be one concise encouraging sentence.
    - closing_message must be one warm personalized paragraph under 45 words.
    - next_chapter_steps must contain exactly four objects. Use icons only from: leaf, balance, energy, heart, protein.
    - faq_items must contain exactly four question/answer objects covering nutrition, lifestyle, progress, and long-term success. Keep each answer concise.
    - Focus heavily on the user's aspiration: {answers.get('aspiration', 'wellness')}
    - Respect their flavor palette: {answers.get('flavor', 'balanced')}
    - Keep cooking times under: {answers.get('time', '30m')}
    """

    user_prompt = f"""User Profile:
    {profile}
    
    Premium Questionnaire Answers:
    {json.dumps(answers)}
    
    Primary Condition to address: {condition_label}
    
    Generate a 5-chapter masterpiece tailored ONLY to this person. 
    Make them feel like this was written specifically for their soul and body.
    Include a chapter on recipes that fit their flavor palette and time constraints.
    """

    try:
        raw_response = await call_ai(system_prompt, user_prompt, max_tokens=8192)
        ebook_data = extract_json(raw_response)
        
        if not ebook_data:
            raise HTTPException(500, "Failed to parse AI response.")
            
        ebook_data["user_id"] = user["id"]
        ebook_data["generated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Merge stats from general summary if missing
        general_summary = _build_summary(user, {"condition_label": condition_label}, primary)
        if "summary" not in ebook_data: ebook_data["summary"] = {}
        if "stats" not in ebook_data["summary"] or not ebook_data["summary"]["stats"]:
            ebook_data["summary"]["stats"] = general_summary["stats"]
        
        # Add other missing fields for frontend compatibility
        ebook_data["summary"]["all_conditions"] = general_summary["all_conditions"]
        ebook_data["summary"]["goal_30day"] = user.get("goal_30day")
        ebook_data["summary"]["diet"] = general_summary["diet"]
        
        await db.premium_ebooks.update_one(
            {"user_id": user["id"]},
            {"$set": ebook_data},
            upsert=True
        )
        
        return ebook_data
    except Exception as e:
        import logging
        logging.exception("Premium ebook generation failed")
        raise HTTPException(500, f"Generation failed: {str(e)}")

# Default book used when a user has no condition, or their condition maps to nothing.
DEFAULT_EBOOK = "anti-inflammatory"

# Maps every condition in healthcare_data.py to one of the 6 generated ebooks.
# Many conditions → one book; anything unmapped falls back to DEFAULT_EBOOK.
CONDITION_TO_EBOOK = {
    # Metabolic / blood-sugar / weight
    "diabetes": "diabetes",
    "diabetes-t1": "diabetes",
    "prediabetes": "diabetes",
    "insulin-resistance": "diabetes",
    "fatty-liver": "diabetes",
    "obesity": "diabetes",
    "weight-management": "diabetes",
    # PCOS
    "pcos": "pcos",
    # Thyroid
    "thyroid": "thyroid",
    "hyperthyroid": "thyroid",
    "hashimotos": "thyroid",
    # Gut / digestive
    "gut-health": "gut-health",
    "ibs": "gut-health",
    "gerd": "gut-health",
    "gastritis": "gut-health",
    "celiac": "gut-health",
    "gluten-intolerance": "gut-health",
    "lactose-intolerance": "gut-health",
    # Menopause
    "menopause": "menopause",
    # Cardio / inflammatory / mood / immune → anti-inflammatory
    "heart-disease": "anti-inflammatory",
    "hypertension": "anti-inflammatory",
    "high-cholesterol": "anti-inflammatory",
    "high-triglycerides": "anti-inflammatory",
    "rheumatoid-arthritis": "anti-inflammatory",
    "gout": "anti-inflammatory",
    "migraine": "anti-inflammatory",
    "depression": "anti-inflammatory",
    "immunity": "anti-inflammatory",
}

CHAPTER_TITLES = {
    "1": "Introduction",
    "2": "Understanding the Condition",
    "3": "The Nutrition Connection",
    "4": "Symptom Assessment",
    "5": "Nutrition Foundations",
    "6": "Foods to Prioritize",
    "7": "Foods to Limit",
    "8": "Building Your Plate",
    "9": "Recipes",
    "10": "Meal Plans",
    "11": "Lifestyle Support",
    "12": "Common Challenges & Solutions",
    "13": "Progress Tracking",
    "14": "FAQs",
    "15": "Key Takeaways",
    "16": "References",
}


@router.get("/conditions")
async def list_conditions():
    """List available ebook conditions with their generation status."""
    result = []
    for slug in VALID_CONDITIONS:
        doc = await db.ebooks.find_one({"condition_id": slug}, {"condition_label": 1, "status": 1, "generated_at": 1})
        result.append({
            "id": slug,
            "label": doc["condition_label"] if doc else slug.replace("-", " ").title(),
            "status": doc["status"] if doc else "not_generated",
            "generated_at": doc.get("generated_at") if doc else None,
        })
    return result


def _condition_record(cid):
    """Look up a condition by id in healthcare_data.CONDITIONS."""
    for c in CONDITIONS:
        if c["id"] == cid:
            return c
    return None


def _resolve_primary_condition(user):
    """Pick the user's most book-relevant condition.

    Prefers the first condition that maps to a *specific* ebook (not the
    anti-inflammatory catch-all), so e.g. [hypertension, pcos] → pcos.
    Returns a condition id, or None if the user has no conditions.
    """
    conds = list(user.get("conditions") or [])
    if not conds and user.get("condition"):
        conds = [user["condition"]]
    for cid in conds:
        slug = CONDITION_TO_EBOOK.get(cid)
        if slug and slug != DEFAULT_EBOOK:
            return cid
    return conds[0] if conds else None


def _bmi(weight_kg, height_cm):
    if not weight_kg or not height_cm:
        return None
    h = height_cm / 100.0
    if h <= 0:
        return None
    return round(weight_kg / (h * h), 1)


def _bmi_band(bmi):
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Healthy"
    if bmi < 30:
        return "Overweight"
    return "Higher range"


def _build_summary(user, ebook_doc, primary_cid):
    """Profile-based personalised summary — no AI, built from the user doc."""
    name = (user.get("name") or "").strip()
    first = name.split()[0] if name else "there"

    rec = _condition_record(primary_cid) if primary_cid else None

    conds = list(user.get("conditions") or [])
    if not conds and user.get("condition"):
        conds = [user["condition"]]
    all_labels = []
    for cid in conds:
        r = _condition_record(cid)
        all_labels.append(r["label"] if r else cid.replace("-", " ").title())

    age = user.get("age")
    gender = user.get("gender")
    weight = user.get("weight_kg")
    height = user.get("height_cm")
    activity = user.get("activity_level")
    goal = user.get("goal")

    stats = []
    if age:
        stats.append({"label": "Age", "value": str(age)})
    bmi = _bmi(weight, height)
    if bmi:
        stats.append({"label": "BMI", "value": f"{bmi} · {_bmi_band(bmi)}"})
    if activity:
        stats.append({"label": "Activity", "value": str(activity).replace("_", " ").title()})
    if age and gender and weight and height:
        try:
            t = calc_tdee(age, gender, weight, height, activity, goal or "maintain")
            stats.append({"label": "Daily target", "value": f"{t['target_calories']:,} kcal"})
        except Exception:
            pass

    focus = []
    if rec and rec.get("food_rules"):
        focus = rec["food_rules"][:3]
    else:
        focus = [
            "A balanced, whole-food foundation tailored to you.",
            "Anti-inflammatory staples to support long-term wellness.",
            "Steady energy and simple, sustainable habits.",
        ]

    diet_type = (user.get("dietary_type") or "").replace("_", " ").title() or None

    return {
        "greeting": f"Welcome, {first}",
        "headline": ebook_doc["condition_label"],
        "condition_label": rec["label"] if rec else (all_labels[0] if all_labels else "General Wellness"),
        "condition_blurb": (rec.get("blurb") if rec else None)
        or "A personalised nutrition guide built around your profile.",
        "all_conditions": all_labels,
        "goal_30day": user.get("goal_30day"),
        "stats": stats,
        "diet": {"type": diet_type, "allergies": user.get("allergies") or []},
        "focus_points": focus,
    }


@router.get("/me")
async def get_my_ebook(type: Optional[str] = None, user=Depends(get_current_user)):
    """The single ebook for the logged-in user. 
    If type='premium', fetches their personalised AI guide."""
    if type == "premium":
        if not user.get("is_premium"):
            raise HTTPException(403, "Premium feature required")

        doc = await db.premium_ebooks.find_one({"user_id": user["id"]})
        if not doc:
            raise HTTPException(404, "No premium guide found.")
        doc.pop("_id", None)
        doc["is_premium"] = True
        return doc

    primary = _resolve_primary_condition(user)
    slug = CONDITION_TO_EBOOK.get(primary, DEFAULT_EBOOK) if primary else DEFAULT_EBOOK

    doc = await db.ebooks.find_one({"condition_id": slug})
    # If their mapped book isn't ready, fall back to the default book.
    if (not doc or doc.get("status") != "ready") and slug != DEFAULT_EBOOK:
        slug = DEFAULT_EBOOK
        doc = await db.ebooks.find_one({"condition_id": slug})

    if not doc:
        raise HTTPException(404, "No ebook available yet. Run generate_ebooks.py script.")
    if doc.get("status") != "ready":
        raise HTTPException(202, "Your guide is still being prepared. Check back shortly.")

    chapters = []
    for cid in [str(i) for i in range(1, 17)]:
        chapters.append({
            "id": int(cid),
            "title": CHAPTER_TITLES.get(cid, f"Chapter {cid}"),
            "html_content": doc.get("chapters", {}).get(cid, ""),
        })

    return {
        "condition_id": doc["condition_id"],
        "condition_label": doc["condition_label"],
        "is_premium": False,
        "generated_at": doc.get("generated_at"),
        "chapters": chapters,
        "summary": _build_summary(user, doc, primary),
    }


@router.get("/{condition_id}")
async def get_ebook(condition_id: str):
    if condition_id not in VALID_CONDITIONS:
        raise HTTPException(400, f"Unknown condition. Valid: {VALID_CONDITIONS}")

    doc = await db.ebooks.find_one({"condition_id": condition_id})
    if not doc:
        raise HTTPException(404, "Ebook not yet generated. Run generate_ebooks.py script.")

    if doc.get("status") != "ready":
        raise HTTPException(202, "Ebook is still being generated. Try again in a moment.")

    # Build ordered chapter list
    chapters = []
    for cid in [str(i) for i in range(1, 17)]:
        content = doc.get("chapters", {}).get(cid, "")
        chapters.append({
            "id": int(cid),
            "title": CHAPTER_TITLES.get(cid, f"Chapter {cid}"),
            "html_content": content,
        })

    if "_id" in doc:
        doc["_id"] = str(doc["_id"])

    return {
        "condition_id": doc["condition_id"],
        "condition_label": doc["condition_label"],
        "generated_at": doc.get("generated_at"),
        "chapters": chapters,
    }
