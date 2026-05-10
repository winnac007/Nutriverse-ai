import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')

class Settings:
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    DB_NAME: str = os.environ.get('DB_NAME', 'nutriverse')
    JWT_SECRET: str = os.environ.get('JWT_SECRET', 'nutriverse-dev-secure-key-32-chars-long')
    JWT_ALG: str = "HS256"
    ANTHROPIC_API_KEY: str = os.environ.get('ANTHROPIC_API_KEY', '')
    SPOONACULAR_API_KEY: str = os.environ.get('SPOONACULAR_API_KEY', '')
    GEMINI_API_KEY: str = os.environ.get('GEMINI_API_KEY', '')
    CORS_ORIGINS: str = os.environ.get('CORS_ORIGINS', '*')
    PROMPTS_DIR: Path = ROOT_DIR / "prompts"

settings = Settings()
