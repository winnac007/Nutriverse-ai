# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend
```bash
cd frontend
yarn install          # install deps (uses yarn 1.22)
yarn start            # dev server on http://localhost:3000
yarn build            # production build
yarn test             # Jest test runner
```

### Backend
```bash
cd backend
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Run backend tests
```bash
cd backend && pytest tests/
```

### Backend linting
```bash
black server.py && flake8 server.py && mypy server.py
```

## Environment Variables

**`frontend/.env`**
```
REACT_APP_BACKEND_URL=http://localhost:8000
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
- **Frontend**: React 19, React Router 7, Tailwind CSS, Radix UI, Framer Motion, Axios
- **Backend**: FastAPI (async), MongoDB via Motor, JWT auth (PyJWT + bcrypt), Anthropic SDK
- **Build**: Craco (CRA wrapper) — path alias `@` maps to `frontend/src/`

### Request Flow
1. All API calls go through `frontend/src/lib/api.js` — a single Axios instance that auto-injects `Authorization: Bearer <token>` from `localStorage.nv_token`
2. Backend validates the JWT in `get_current_user()` (FastAPI dependency), fetches user from MongoDB, and passes the full user object to the route handler
3. Every protected route uses `user=Depends(get_current_user)`

### Auth & Routing Guards
- `AuthProvider` (`frontend/src/lib/auth.jsx`) exposes `useAuth()` → `{ user, loading, login, register, logout, refresh }`
- `OnboardingGuard` in `App.js` redirects unauthenticated users to `/auth`
- `AppLayout.jsx` redirects users with `onboarded: false` to `/onboarding`
- The `/app/*` routes are only reachable after both auth and onboarding are complete

### Onboarding Flow (7 steps)
The `Onboarding.jsx` wizard collects everything needed to personalise the app:
1. Basic metrics (age, gender, weight, height, activity, location)
2. Health condition multi-select (up to 3 from 8: diabetes, heart-disease, thyroid, pcos, weight-management, gut-health, kidney-disease, immunity)
3. Condition-specific Q&A — dynamic per selected conditions, driven by `CONDITION_QUESTIONS` map
4. Lifestyle & diet (dietary type, allergies, cooking ability, budget)
5. Taste preferences (cuisines, spice level, disliked ingredients, meal pattern)
6. 30-day goal
7. AI plan generation loading screen — calls `POST /api/onboarding/generate-plan`

On completion, the user profile has `conditions[]`, `condition_answers{}`, `preferences{}`, `health_plan{}` (AI-generated), and `onboarded: true`.

### Recipe Personalisation Pipeline
`GET /api/recipes/personalized` runs in three stages:
1. **Spoonacular API** (`spoonacular.py`) — queries with user's cuisine preference (derived from location or explicit cuisines), diet type, intolerances, max ready time, excluded ingredients. Results cached in `db.spoonacular_cache` for 30 days by query hash.
2. **Condition rule engine** (`condition_rules.py`) — applies clinical rules to real nutritional values (sodium, carbs, fiber, potassium, etc.) sourced from ADA/AHA/KDOQI guidelines. No AI involved — pure deterministic filtering.
3. **`generate_why_this_works()`** — produces human-readable per-condition explanations from actual nutritional numbers (not AI-generated).

Falls back to `seed_data.py` if Spoonacular is unconfigured or returns nothing.

### AI Integration (Anthropic)
Both AI endpoints use `anthropic.AsyncAnthropic` (model `claude-sonnet-4-6`) with JSON output parsing via `_extract_json()`:
- `POST /api/ai/smart-plan` — generates 7-day meal plan. Free users get analysis + preview meal only; premium users get the full plan saved to `db.meal_plans`.
- `POST /api/ai/coach` — premium-only conversational coach. Receives user profile + today's nutrition logs; returns plain text (no JSON).
- `POST /api/onboarding/generate-plan` — runs once at onboarding. Outputs `summary`, `food_rules[]`, `foods_to_eat[]`, `foods_to_avoid[]`, `macros`, `daily_calories`, `first_week_recipe_ids[]`. All saved to `user.health_plan`.

All AI endpoints have rule-based fallbacks if the API call fails.

### Premium Gating
- `user.is_premium` (boolean in MongoDB) controls access
- Backend raises `HTTPException(403)` for premium-only routes
- `PremiumGate` component wraps premium UI sections
- Mock upgrade: `POST /api/user/upgrade` sets `is_premium: true` with no real payment

### Data Models
**User** (MongoDB `users` collection): `id`, `email`, `name`, `is_premium`, `onboarded`, `category` (always `"healthcare"`), `conditions[]`, `condition_answers{}`, `preferences{}`, `health_plan{}`, `dietary_type`, `allergies[]`, `cooking_ability`, `budget`, `goal_30day`, `saved_recipes[]`

**Recipe** (in-memory from `seed_data.py` or normalised from Spoonacular): `id`, `title`, `category`, `cuisine`, `nutrition{calories, protein, carbs, fat, fiber, sodium}`, `ingredients[]`, `conditions[]`, `why_this_works{}`

**Collections**: `users`, `meal_logs`, `meal_plans`, `coach_messages`, `lifestyle`, `spoonacular_cache`

### Backend Module Layout
All routes live in a single `server.py` with an `api_router` (prefix `/api`) registered at the bottom. Supporting modules:
- `seed_data.py` — static curated recipe database
- `healthcare_data.py` — conditions list and ingredient swap suggestions
- `condition_rules.py` — clinical rule engine (deterministic, no AI)
- `spoonacular.py` — Spoonacular API client + MongoDB caching + recipe normalisation

### Styling Conventions
- Tailwind utility classes throughout; custom gradient classes (`nv-gradient-hc`, `nv-gradient-ft`, etc.) and card styles (`nv-card`, `nv-shadow`) defined in `index.css`
- Radix-based `shadcn/ui` components live in `frontend/src/components/ui/`
- `OptionCard` pattern: reusable selection card (label, description, selected state with checkmark) — defined locally in pages that need it
