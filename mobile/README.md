# Zenplato Mobile App (React Native for iOS & Android)

A premium botanical wellness and clinical nutrition mobile application built with **React Native** and **Expo**, designed to deliver an identical editorial aesthetic and experience across iOS and Android.

---

## 📱 Complete Screen Implementations & UI Flow

The app faithfully reproduces the exact designs from the web platform and all high-fidelity mobile mockups:

---

### 🌿 The 6-Step Goal Setting Sequential Journey

1. **Step 1 of 6: Goal Setting Focus (`GoalSettingFocusScreen.tsx`)**
   - Header: Back arrow, Zenplato brand leaf, and `1 of 6` progress tracker.
   - Banner: *"Your goal helps us create a personalized plan"*.
   - 7 Focus Goal Cards with Specialty Badges:
     - **Manage PCOS symptoms** (selected by default): *Balance hormones, regulate cycles and improve overall wellbeing* (`[Hormonal balance]`, `[Better cycles]`, `[Clearer skin]`).
     - **Weight management**: *Lose, maintain or gain weight in a healthy way* (`[Lose weight]`, `[Maintain weight]`, `[Healthy gain]`).
     - **Improve fitness & strength**: *Build stamina, increase energy and feel stronger* (`[More energy]`, `[Build strength]`, `[Better endurance]`).
     - **Better sleep**: *Improve sleep quality and daily energy* (`[Fall asleep faster]`, `[Stay asleep longer]`, `[Feel rested]`).
     - **Better digestion**: *Reduce bloating, manage acidity and improve gut health* (`[Less bloating]`, `[Regular digestion]`, `[Gut comfort]`).
     - **Improve overall health**: *Build sustainable healthy habits for long-term wellbeing* (`[More energy]`, `[Stronger immunity]`, `[Balanced lifestyle]`).
     - **Other goal**: *Tell us your specific goal*.
   - CTA: `Continue →` transitions to Step 2.

2. **Step 2 of 6: Symptoms & Priority Selection (`GoalSettingSymptomsScreen.tsx`)**
   - Header: `2 of 6` progress tracker with Zenplato botanical header.
   - Selected Goal Summary Banner: "Manage PCOS symptoms" with `✎ Change` button.
   - 12-Symptom Grid with Custom Botanical Emojis & Selection Toggles:
     - Irregular periods, Acne, Hair fall, Weight gain, Bloating, Mood swings, Excess hair growth, Low energy, Sleep issues, Sugar cravings, Digestive issues, Others.
   - "What would you like to improve the most?" (Choose up to 3 priorities):
     - Interactive checklist: Regulate menstrual cycle (1), Reduce acne (2), Manage weight (3), Improve energy levels (4), Reduce bloating (5).
   - Character artwork: Serene smiling woman illustration with botanical sprigs.
   - CTA: `Continue →` transitions to Step 3.

3. **Step 3 of 6: Current Profile & Lifestyle (`GoalSettingProfileScreen.tsx`)**
   - Header: `3 of 6` progress tracker.
   - Title: "Your Current Profile" — *Help us understand where you are now*.
   - Basic Details: Age (`26 years`), Height (`162 cm`), Current weight (`68 kg`), Target weight (`55 kg`), Activity level (`Lightly active ∨`).
   - Health Conditions (Multi-select pills): `[ ✓ PCOS ]`, `[ Thyroid ]`, `[ Diabetes ]`, `[ PCOD ]`, `[ None ]`, `[ Others ]`.
   - Lifestyle Snapshot: Sleep duration (`6–7 hours ∨`), Water intake (`1.5–2 litres ∨`), Work routine (`Student ∨`), Stress level (`Moderate ∨`).
   - Menstrual Cycle (PCOS Support): Regular / Irregular (selected) / No periods / Unknown, Average cycle length (`35 days`), Period duration (`5 days`).
   - Medications: Current medications or supplements input.
   - CTA: `Continue →` transitions to Step 4.

4. **Step 4 of 6: Food Preferences (`GoalSettingFoodPrefsScreen.tsx`)**
   - Header: `4 of 6` progress tracker with bowl and avocado graphic.
   - Cuisine Preferences: Indian (selected), Continental, Mixed, + Others.
   - Diet Type: `[ ✓ Vegetarian ]`, `[ Eggetarian ]`, `[ Non-veg ]`, `[ Vegan ]`.
   - Foods You Love (Removable tags + Add custom): Paneer `✕`, Oats `✕`, Quinoa `✕`, Sprouts `✕`, Fruits `✕`, Makhana `✕`, Dal `✕`, Curd `✕`, Seasonal vegetables `✕`.
   - Foods to Avoid (Removable tags + Add custom): Refined flour `✕`, Deep fried food `✕`, Excess sugar `✕`, Processed food `✕`, Red meat `✕`.
   - Eating Out Options: Switch toggle (`ON`), Homemade meals (selected), Occasional eating out, Frequent eating out.
   - Meal Pattern: `3 meals + 2 snacks ∨`.
   - CTA: `Continue →` transitions to Step 5.

5. **Step 5 of 6: Build Your Plan (`GoalSettingPlanStructureScreen.tsx`)**
   - Header: `5 of 6` progress tracker with chef & salad graphic.
   - Plan Format:
     - **Day-based plan** (Structured daily plan Monday through Sunday, selected).
     - **Meal-option-based plan** (Interchangeable pool of recipe options).
   - Plan Duration:
     - 7 days (1 week) [Recommended for start]
     - 15 days (2 weeks) [Habit forming]
     - Custom duration (4–12 weeks) [Long-term goal]
   - Meals to Include (Checklist):
     - Breakfast (checked), Lunch (checked), Dinner (checked), Snacks (checked), Pre/Post workout.
   - Clinical Flexibility Toggles:
     - Include alternatives (`Show 2–3 alternative options per meal`)
     - Eating out flexibility (`Add healthy eating-out and restaurant suggestions`)
     - Seasonal & local suitability (`Prioritise in-season, locally fresh produce`)
   - Assurance Banner: Expert reviewed by Zenplato AI & Dr. Meera.
   - CTA: `Continue →` transitions to Step 6 / Summary.

6. **Step 6 of 6: Goal Plan Summary & Ready (`GoalSettingFlowScreen.tsx`)**
   - Plan generation synthesis with animated checkmarks, macro targets breakdown, and immediate sync with the Meal Plans Hub.

---

### 🧑‍⚕️ Nutritionist Meal Plan Editor (`NutritionistMealPlanEditorScreen.tsx`)

- **Top Navigation**: `< Back to client`, Title: *"Edit Meal Plan — Customize meals, portions and timings for Riya"*, and `[ 👁️ View as Client ]` action.
- **Client Banner**: Riya Sharma (`26 years • PCOS • Weight management`) with `[ View full profile → ]`.
- **Sub-Navigation Tabs**: `[ Meal Plan ]` (active), `[ Nutrition Targets ]`, `[ Progress ]`, `[ Notes ]`, `[ Consultations ]`.
- **Date Navigator**: `< [ Mon 12 Oct ] [ Tue 13 Oct ] ... [ Sun 18 Oct ] >`.
- **Expanded Breakfast Editor**:
  - Actions: `✎ Replace`, `📋 Copy`, `🗑 Remove`.
  - Dish Info: High-res dish image, Moong Dal Chilla, *"With mint chutney and fresh fruits"*.
  - **Inline Ingredients Table**:
    - Moong dal (soaked) `½ cup` `✕`
    - Onion (chopped) `2 tbsp` `✕`
    - Tomato (chopped) `2 tbsp` `✕`
    - Coriander `2 tbsp` `✕`
    - Spices `½ tsp` `✕`
    - Mint chutney `2 tbsp` `✕`
    - `+ Add ingredient` button.
  - Dropdown Selectors: `⏱️ 15 mins ∨`, `📊 350 kcal ∨`.
  - Macros: Protein `18 g`, Carbs `45 g`, Fat `12 g`.
  - `Update meal` button.
- **Other Daily Meal Cards**:
  - Mid-morning: Greek Yogurt Bowl (`⏱️ 5 mins`, `200 kcal`).
  - Lunch: Quinoa Buddha Bowl (`⏱️ 20 mins`, `420 kcal`).
  - Evening Snack: Masala Buttermilk (`⏱️ 5 mins`, `120 kcal`).
  - Dinner: Paneer & Vegetable Stir Fry (`⏱️ 20 mins`, `400 kcal`).
- **Sidebar & Plan Parameters**:
  - Plan Settings: Plan type dropdown, Cuisine preference dropdown, Diet pattern dropdown.
  - Daily Nutrition Targets: Calories `2,000 kcal`, Protein `100 g (20%)`, Carbs `250 g (50%)`, Fat `67 g (30%)`.
  - Sync with Client App Switch: `ON` (*"Changes will be visible to client after approval"*).
  - AI Suggestions: Iron-rich foods for PCOS support, Increase fibre at dinner, Suggest seasonal alternatives.
  - Client Notes & Consultant Internal Notes (with character counters).
- **Bottom Action Bar**:
  - Dr. Meera (Nutritionist) profile pill with menu dots `•••`.
  - Actions: `[ 👁️ Preview ]`, `[ 🔖 Save ]`, and `[ Send to client for approval → ]`.

---

### 🥗 Meal Plans Hub (`MealPlansScreen.tsx`)

- **Header**: Title, subtitle, and `ⓘ How it works` action.
- **Category Filter Pills**: `[ My Plan ]` (active), `[ PCOS ]`, `[ Diabetes ]`, `[ Thyroid ]`, `[ Heart Health ]`, `[ Weight Loss ]`.
- **Hero Banner Card**:
  - Kicker: `YOUR PERSONALIZED PLAN`.
  - Title: "Balanced for your unique needs".
  - Subtitle: "Meals crafted around your goals, nutrition targets and food preferences."
  - 3 Badges: `Wholesome ingredients`, `Easy to cook`, `Culturally familiar`.
  - Mediterranean bowl photograph.
- **Today's Plan Schedule**:
  - Date navigator: `< Mon, 12 Oct 2026 >` with calendar icon.
  - 5 Meals (Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner) with macros, prep time, calories, and `View Recipe ›`.
- **Daily Nutrition Summary**:
  - Segmented macro line: `76 g Protein`, `177 g Carbs`, `52 g Fat`, `2,000 kcal`.
  - `View full breakdown →` action.
- **Dual Bottom Actions**:
  - `[ ⚙️ Customize my plan ]` -> Opens `EditMyPlanScreen`.
  - `[ Use this plan ]` -> Activates daily plan.

---

### 🍳 Meal Plan Details (`MealPlanDetailScreen.tsx`)

- **Hero Header**: Tag pill `BREAKFAST`, title "Moong Dal Chilla", badges `15 mins Prep time`, `350 kcal Calories`, `Easy To cook`.
- **Nutrition per serving**: `18 g Protein`, `45 g Carbs`, `12 g Fat`, `8 g Fiber`.
- **Ingredients List with Adjustable Servings**:
  - `[ 👤 Adjust servings ]` toggle (1, 2, 4 servings with dynamic multiplier).
  - 6 Ingredient cards with photographic thumbnails and measured quantities.
- **Step by Step Cooking Method**:
  - `▷ Watch video` action.
  - 4 Numbered circular steps with detailed instructions and botanical corner leaf art.
- **More Options for You (Swaps & Variations)**:
  - 4 Cards: `Swap veggies`, `Gluten-free`, `Higher protein`, `Low oil option`.
- **Bottom Actions**:
  - `[ 🔖 Save to favorites ]` toggle.
  - `[ ⊕ Add to my plan ]` action.

---

### ⚙️ Edit My Plan (`EditMyPlanScreen.tsx`)

- **Care Team Shared Access Banner**: Dr. Ananya Sharma avatar, shared access indicator (You, Nutritionist, Consultant).
- **Day Selector Tabs**: `Mon 12 Oct` through `Sun 18 Oct`.
- **Editable Meal Cards**: Time header, tags (`High protein`, `Gut friendly`, `Balanced`), and buttons (`✎ Edit`, `⇄ Swap`, `🗑 Remove`).
- **Daily Nutrition Donut Summary**: Donut calorie gauge (`2,000 kcal`), macro distribution, and `Adjust daily targets`.
- **Action Bar**: `[ + Add meal ]`, `[ ⇄ Swap meal ]`, `[ 📋 Copy from another day ]`, `[ 📖 Browse recipes ]`.
- **Bottom Actions**: `[ Save changes ]` & `[ ✈️ Submit for review ]`.

---

### 📊 Nutrition Calculations & Modals (`NutritionCalculationsScreen.tsx`)

- Real-time biometrics calculation engine (Mifflin–St Jeor BMR, BMI, TDEE, IBW).
- 2×2 metric grid with colored badge headers.
- Macronutrient distribution guide with consultant review indicator.
- Interactive Modals:
  - `EditProfileModal.tsx`: Real-time biometrics editor.
  - `AboutBmiModal.tsx`: BMI formula and range breakdown.
  - `AboutBmrModal.tsx`: Resting energy expenditure calculation explainer.

---

## 🚀 Running the App

### 1. Start the Metro Bundler
```bash
cd mobile
yarn start
# or: npm start
```

### 2. Launch on Target Platform
- **iOS Simulator**: Press `i` in the terminal.
- **Android Emulator**: Press `a` in the terminal.
- **Physical Device**: Scan the QR code with **Expo Go** on Android or the iOS Camera.
- **Web Preview**: Press `w` in the terminal.

### 3. Production Compilation & Export Verification
```bash
cd mobile
npx tsc --noEmit      # TypeScript check: 0 errors
npx expo export       # Generates Hermes bytecode bundles for iOS and Android
```
