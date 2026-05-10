from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.users import router as user_router
from app.api.recipes import router as recipe_router
from app.api.healthcare import router as healthcare_router
from app.api.tracking import router as tracking_router
from app.api.meal_plans import router as meal_plan_router
from app.api.ai import router as ai_router
import logging

app = FastAPI(title="NutriVerse API", version="2.0")

# CORS
origins = ["*"] if settings.CORS_ORIGINS == "*" else [o.strip().rstrip('/') for o in settings.CORS_ORIGINS.split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(recipe_router, prefix="/api")
app.include_router(healthcare_router, prefix="/api")
app.include_router(tracking_router, prefix="/api")
app.include_router(meal_plan_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

@app.get("/api")
async def root():
    return {
        "message": "NutriVerse API", 
        "version": "2.0",
        "spoonacular_configured": bool(settings.SPOONACULAR_API_KEY)
    }

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    if not settings.SPOONACULAR_API_KEY:
        logger.warning("SPOONACULAR_API_KEY is not set in environment!")
    else:
        logger.info(f"SPOONACULAR_API_KEY is configured (starts with: {settings.SPOONACULAR_API_KEY[:4]}...)")
