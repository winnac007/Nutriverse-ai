import logging
from app.core.config import settings

def load_prompt(name: str) -> str:
    """Load a system prompt from the prompts directory."""
    try:
        path = settings.PROMPTS_DIR / f"{name}.txt"
        if path.exists():
            return path.read_text().strip()
    except Exception:
        logging.error(f"Failed to load prompt: {name}")
    return ""
