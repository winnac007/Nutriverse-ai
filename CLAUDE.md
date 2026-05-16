# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend
```bash
cd frontend
yarn install          # install deps (uses yarn 1.22)
yarn dev              # dev server on http://localhost:3000
yarn build            # production build
yarn lint             # ESLint/TypeScript check
```

### Backend
```bash
cd backend
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run backend tests
```bash
cd backend && pytest tests/
```

### Backend linting
```bash
cd backend && black app/ && flake8 app/
```

## Environment Variables

**`frontend/.env`**
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**`backend/.env`** (create manually — not committed)
```
ANTHROPIC_API_KEY=sk-ant-...
SPOONACULAR_API_KEY=...
MONGO_URL=mongodb+srv://...
DB_NAME=nutriverse
JWT_SECRET=dev-secret-key
CORS_ORIGINS=http://localhost:3000
```

## Architecture

### Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI, Framer Motion, Axios
- **Backend**: FastAPI (async), MongoDB via Motor, JWT auth (PyJWT + bcrypt), Anthropic SDK
- **Build**: Next.js native — path alias `@` maps to `frontend/src/`

### Backend Structure
The backend uses a feature-based directory layout under `backend/app/`:
- `main.py` — FastAPI app entry point; all routers mounted at `/api` prefix
- `api/` — Route handlers: `ai.py`, `recipes.py`, `meal_plans.py`, `tracking.py`, `healthcare.py`, `auth.py`
- `services/` — Business logic: `recipe_service.py` (Spoonacular), `ai_service.py`, `clinical_service.py`
- `data/` — `healthcare_data.py` (conditions), `condition_rules.py` (clinical taggers + conflict resolution)
- `core/` — `database.py`, `security.py`, `config.py`, `prompts.py`
- `models/schema.py` — Pydantic request/response models

### Recipe Data Source
**All recipes come from Spoonacular API only** — there is no seed data. `backend/app/data/seed_data.py` is an empty stub.
- Spoonacular results are cached in MongoDB (`spoonacular_cache` collection, 30-day TTL)
- Recipe IDs use `sp-{id}` format (e.g., `sp-716429`)
- `recipe_service.py` provides `search_recipes()`, `fetch_personalized_recipes()`, `get_spoonacular_recipe_by_id()`, `normalize_spoonacular_recipe()`
- Allowed Spoonacular image domains are whitelisted in `frontend/next.config.ts`

### Request Flow
1. All API calls go through `frontend/src/lib/api.ts` — a single Axios instance that auto-injects `Authorization: Bearer <token>` from `localStorage.nv_token`
2. Backend validates the JWT in `get_current_user()` (FastAPI dependency), fetches user from MongoDB, and passes the full user object to the route handler
3. Every protected route uses `user=Depends(get_current_user)`

### Auth & Routing Guards
- `AuthProvider` (`frontend/src/lib/auth.tsx`) exposes `useAuth()` → `{ user, loading, login, register, logout, refresh }`
- Auth redirection is handled in `frontend/src/app/(app)/layout.tsx` for protected routes
- `/app/*` routes are only reachable after auth and onboarding (`user.onboarded === true`)

### Onboarding Flow — Adaptive Questionnaire
`frontend/src/app/onboarding/page.tsx` is a single-page adaptive questionnaire (no separate sub-pages):

**Phases:**
1. **Intro** — Branded splash, "Begin →"
2. **Gateway** (3 Qs) — Detects user persona from what brought them here + health track + journey duration
3. **Persona Reveal** — Animated reveal of archetype: Healer / Guardian / Listener / Architect
4. **Deep** (4 Qs per persona) — Persona-specific questions about condition, symptoms, lifestyle
5. **Shared** (7 Qs) — Cuisine, diet type, allergies, cooking time, budget, 30-day goal, reflection
6. **Biometrics** — Age, gender, weight (kg), height (cm), activity level
7. **Generating** — Calls `POST /api/ai/onboarding/generate-plan`, then `refresh()`, then `router.push("/app")`

**Persona detection:** g1 answer → direct `personaHint`; g2 track selection → `TRACKS[track].persona`
**`/onboarding/personalize`** — redirects to `/onboarding` (old page, superseded)

On completion, the user document has: `conditions[]`, `condition_answers{}`, `dietary_type`, `allergies[]`, `cooking_ability`, `budget`, `goal_30day`, `age`, `gender`, `weight_kg`, `height_cm`, `activity_level`, `health_plan{}` (AI-generated), `onboarded: true`.

### Condition & Clinical System
- `healthcare_data.py` — `COMMON_CONDITIONS` list with id, label, category, description
- `condition_rules.py` — `filter_for_conditions()`, `generate_why_this_works()`, `resolve_macro_conflicts()`
- `resolve_macro_conflicts(conditions, macros)` returns adjusted macros + trade-off notes when conditions conflict (e.g., PCOS high-protein vs. CKD low-protein); uses priority-based matrix

### Recipe Personalisation Pipeline
`fetch_personalized_recipes(user, db)` in `recipe_service.py`:
1. **Spoonacular API** — queries with user's cuisine preference, diet type, conditions as keywords
2. **Condition rule engine** — `filter_for_conditions()` applies clinical rules to nutritional values
3. **`generate_why_this_works()`** — per-condition human-readable explanations

### AI Integration (Anthropic)
- `POST /api/ai/smart-plan` — generates 7-day meal plan (premium saves full plan to DB)
- `POST /api/ai/coach` — premium-only conversational coach
- `POST /api/ai/onboarding/generate-plan` — runs at onboarding end; saves `health_plan` + all profile fields

### Frontend Pages (under `frontend/src/app/app/`)
- `page.tsx` — Home dashboard
- `explore/page.tsx` — Recipe search/browse
- `meal-plan/page.tsx` — Weekly meal plan
- `daily-plan/page.tsx` — Today's B/L/D with swap
- `food-guidelines/page.tsx` — Foods to eat/avoid per condition
- `grocery/page.tsx` — Weekly grocery checklist
- `progress/page.tsx` — Weight trend + streak + nutrient compliance
- `track/page.tsx` — Meal logging
- `recipe/[id]/page.tsx` — Recipe detail
- `story-map/page.tsx` — Visual meal journey
- `profile/page.tsx` — User settings

### Styling Conventions
- Tailwind utility classes throughout; custom gradient classes and card styles in `globals.css`
- Radix-based `shadcn/ui` components live in `frontend/src/components/ui/`
- Onboarding uses inline styles (dark themed, persona-colored) — intentional, not Tailwind
- All recipe images use `loading="lazy"` + `onError` fallback to Unsplash placeholder

### MongoDB Collections
- `users` — user profile + `health_plan`, `onboarded`, `conditions`, `preferences`
- `meal_plans` — AI-generated weekly plan items
- `meal_logs` — per-meal nutrition logs
- `coach_messages` — AI coach conversation history
- `spoonacular_cache` — 30-day Spoonacular API response cache
- `weight_logs` — `{user_id, weight_kg, date, note}` for weight tracking
