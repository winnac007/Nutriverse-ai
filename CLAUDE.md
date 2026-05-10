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

### Request Flow
1. All API calls go through `frontend/src/lib/api.ts` — a single Axios instance that auto-injects `Authorization: Bearer <token>` from `localStorage.nv_token`
2. Backend validates the JWT in `get_current_user()` (FastAPI dependency), fetches user from MongoDB, and passes the full user object to the route handler
3. Every protected route uses `user=Depends(get_current_user)`

### Auth & Routing Guards
- `AuthProvider` (`frontend/src/lib/auth.tsx`) exposes `useAuth()` → `{ user, loading, login, register, logout, refresh }`
- Auth redirection is handled in `frontend/src/app/(app)/layout.tsx` for protected routes.
- Standard Next.js `middleware.ts` or client-side layout checks ensure `/app/*` routes are only reachable after auth and onboarding.

### Onboarding Flow (7 steps)
The `frontend/src/app/onboarding/page.tsx` wizard collects everything needed to personalise the app:
1. Basic metrics (age, gender, weight, height, activity, location)
2. Health condition multi-select (up to 5)
3. Condition-specific Q&A — dynamic per selected conditions
4. Lifestyle & diet (dietary type, allergies, cooking ability, budget)
5. Taste preferences (cuisines, spice level, disliked ingredients, meal pattern)
6. 30-day goal
7. AI plan generation loading screen — calls `POST /api/onboarding/generate-plan`

On completion, the user profile has `conditions[]`, `condition_answers{}`, `preferences{}`, `health_plan{}` (AI-generated), and `onboarded: true`.

### Recipe Personalisation Pipeline
`GET /api/recipes/personalized` runs in three stages:
1. **Spoonacular API** (`spoonacular.py`) — queries with user's cuisine preference, diet type, etc.
2. **Condition rule engine** (`condition_rules.py`) — applies clinical rules to real nutritional values.
3. **`generate_why_this_works()`** — produces human-readable per-condition explanations.

### AI Integration (Anthropic)
- `POST /api/ai/smart-plan` — generates 7-day meal plan.
- `POST /api/ai/coach` — premium-only conversational coach.
- `POST /api/onboarding/generate-plan` — runs once at onboarding to output health rules and macros.

### Styling Conventions
- Tailwind utility classes throughout; custom gradient classes (`nv-gradient-hc`, etc.) and card styles defined in `globals.css`
- Radix-based `shadcn/ui` components live in `frontend/src/components/ui/`
