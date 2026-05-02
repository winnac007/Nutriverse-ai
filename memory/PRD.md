# NutriVerse - Product Requirements Document

## Overview
NutriVerse is a globally intelligent food/nutrition/wellness app supporting Healthcare patients, Fitness enthusiasts, Cultural explorers, and Chef-Special / Bakery, with Basic + Premium tiers.

## Tech
- React (frontend, light-default), FastAPI (backend), MongoDB
- Auth: JWT email/password
- AI: Claude Sonnet 4.5 via Emergent Universal LLM Key
- Payments: MOCK ₹300/mo upgrade endpoint (no real payment integration yet)
- Fonts: Cabinet Grotesk + Satoshi

## Implemented (Iteration 3 - Feb 2026 - Healthcare Hub redesign)
- New dedicated Healthcare experience at `/app/healthcare` (Home tile re-routes here)
- 8-condition picker (Heart Health, Diabetes, Thyroid, PCOS, Weight Management, Blood Pressure, Gut Health, Immunity) with recipe counts
- Condition hub with: header, in-condition smart search, meal-type tabs (All/Breakfast/Lunch/Dinner/Snack), Browse-recipes vs Day-meal-plan toggle, 15-min quick-meals filter
- Health-score badges (Heart Friendly · Diabetes Safe · PCOS Friendly · Gut Friendly · Immunity Boost · Anti-inflammatory · Post-surgery Safe …)
- Recipe cards include nutritional tags, calories, prep-minutes, "Why it works for you" condition-specific explanation
- 7 new healthcare recipes: hc-006 Beetroot Smoothie, hc-007 Greek Yogurt + Walnuts, hc-008 Spinach + Egg, hc-009 Roasted Chickpea Crunch, hc-010 Lemon Ginger Tea, hc-011 Quinoa Tabbouleh, hc-012 Sweet Potato + Black Bean Bowl
- Smart Ingredient Swaps card (Sugar→Dates, Cream→Yogurt, Frying→Bake, Salt→Lemon+Herbs …)
- Motivation streak card (current streak, meals this week, distinct recipes)
- New endpoints: /api/healthcare/{conditions, recipes, swaps, streak}

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
