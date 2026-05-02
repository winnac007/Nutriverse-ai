# NutriVerse - Product Requirements Document

## Overview
NutriVerse is a globally intelligent food/nutrition/wellness app supporting Healthcare patients, Fitness enthusiasts, Cultural explorers, and Chef-Special / Bakery, with Basic + Premium tiers.

## Tech
- React (frontend, light-default), FastAPI (backend), MongoDB
- Auth: JWT email/password
- AI: Claude Sonnet 4.5 via Emergent Universal LLM Key
- Payments: MOCK ₹300/mo upgrade endpoint (no real payment integration yet)
- Fonts: Cabinet Grotesk + Satoshi

## Implemented (Iteration 2 - Feb 2026)
- Landing, Auth (register/login), Onboarding (3-step) flow
- 4 categories: Healthcare, Fitness, Cultural, Chef Specials (desserts/bakery)
- 31 seeded recipes incl. Idli Sambar, Masala Dosa, Bengali Macher Jhol, Pav Bhaji, Pho, Paella, Tiramisu, Macarons, Gulab Jamun
- Each recipe has: ingredient images, cooking video URL (YouTube embed), region, country, tier (budget/premium)
- Recipe detail: hero, chef card, video player, nutrition label, ingredient cards w/ images, step-by-step method
- Explore: search, category tabs, country/region/tier filters, tag chips
- Story Map: parchment/ancient-brown country → region drill-down with recipe links
- Smart AI Meal Planner (Claude Sonnet 4.5):
  - Body-type aware analysis + calorie estimate + 1 sample meal preview (free)
  - Full 7-day plan + grocery list + variations (premium)
- Adaptive AI Coach (premium): floating widget, ask-anything, persisted history
- Lifestyle Engine (premium): sleep/water/workout/mood logging
- Nutrition Tracker: TDEE-based targets, today macros, 7-day calorie chart, meal log
- Profile: body type, body details, cooking ability, budget, timeline, theme + logout
- Premium upgrade: mock POST /user/upgrade (₹300/mo)

## Endpoints
- POST /api/auth/register | login, GET /auth/me
- PUT /api/user/profile, POST /api/user/upgrade, POST /api/user/save-recipe/{id}
- GET /api/recipes (filters: category, country, region, condition, goal, tag, tier, search)
- GET /api/recipes/countries, /api/recipes/regions, /api/recipes/{id}
- POST /api/tdee/calculate
- POST/GET /api/nutrition/log | today | week, DELETE /api/nutrition/log/{id}
- GET/POST /api/meal-plan, POST /api/ai/smart-plan
- POST /api/ai/coach, GET /api/ai/coach/history
- POST/GET /api/lifestyle/log | today

## Backlog (P0/P1)
- P0: Razorpay/Stripe ₹300 real payment
- P0: True AI-generated cooking videos (currently YouTube embeds)
- P1: Animated brown-ancient world-map with continent → country → region zoom + parallax
- P1: Adaptive engine that auto-adjusts plan based on logged weight/mood/lifestyle
- P1: Lab report upload & analysis for healthcare premium
- P2: Multilingual support + RTL
- P2: Expert marketplace, video chef tutorials in-app, B2B licensing
- P2: PWA / native mobile builds
