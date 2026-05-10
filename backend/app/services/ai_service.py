import logging
import json
import re
import anthropic
from google import genai
from google.genai import types
from typing import Dict, Any, Optional
from app.core.config import settings

anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
gemini_client = None
if settings.GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def call_ai(system_prompt: str, user_prompt: str, max_tokens: int = 2048, model_gemini: str = "gemini-2.0-flash", model_anthropic: str = "claude-3-5-sonnet-20240620", response_mime_type: str = None):
    """
    Tries Gemini first, falls back to Anthropic.
    """
    if gemini_client:
        try:
            config = {
                "system_instruction": system_prompt,
                "max_output_tokens": max_tokens,
            }
            if response_mime_type:
                config["response_mime_type"] = response_mime_type

            response = await gemini_client.aio.models.generate_content(
                model=model_gemini,
                contents=user_prompt,
                config=types.GenerateContentConfig(**config)
            )
            return response.text
        except Exception:
            logging.exception("Gemini AI failed, falling back to Anthropic")

    if settings.ANTHROPIC_API_KEY:
        try:
            response = await anthropic_client.messages.create(
                model=model_anthropic,
                max_tokens=max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return response.content[0].text
        except Exception:
            logging.exception("Anthropic AI failed")

    raise Exception("All AI providers failed")

def extract_json(text: str):
    """
    Robustly extracts and parses JSON from text, handling markdown fences and common AI errors.
    """
    if not text:
        return None
        
    text = re.sub(r"```(?:json)?", "", text).strip("` \n")
    
    start_brace = text.find('{')
    start_bracket = text.find('[')
    
    if start_brace == -1 and start_bracket == -1:
        return None
        
    start = start_brace if (start_bracket == -1 or (start_brace != -1 and start_brace < start_bracket)) else start_bracket
    
    end_brace = text.rfind('}')
    end_bracket = text.rfind(']')
    end = end_brace if (end_bracket == -1 or (end_brace != -1 and end_brace > end_bracket)) else end_bracket
    
    if start != -1 and end != -1:
        text = text[start:end+1]
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            fixed = re.sub(r'("[\w]+"\s*:\s*(?:"[^"]*"|\d+|true|false|null))\s*("\w+"\s*:)', r'\1,\2', text)
            return json.loads(fixed)
        except Exception:
            logging.error(f"JSON extraction failed for text: {text[:200]}...")
            return None

def user_profile_text(user: Dict[str, Any]) -> str:
    conditions = user.get("conditions") or ([user["condition"]] if user.get("condition") else [])
    return (
        f"name: {user.get('name')}\n"
        f"age: {user.get('age')} | gender: {user.get('gender')} | "
        f"weight: {user.get('weight_kg')}kg | height: {user.get('height_cm')}cm | "
        f"body_type: {user.get('body_type') or 'unknown'}\n"
        f"category: {user.get('category')} | goal: {user.get('goal')}\n"
        f"conditions: {conditions}\n"
        f"activity: {user.get('activity_level')} | location: {user.get('location') or user.get('city')}, {user.get('country')}\n"
        f"dietary_prefs: {user.get('dietary_prefs')} | allergies: {user.get('allergies')}\n"
        f"timeline_weeks: {user.get('timeline_weeks')} | cooking: {user.get('cooking_ability')} | budget: {user.get('budget')}\n"
        f"challenges: {user.get('challenges')}"
    )
