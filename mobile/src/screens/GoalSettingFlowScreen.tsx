import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { GoalSettingState } from '../types';
import {
  ChevronLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  WaterIcon,
  BriefcaseIcon,
  BrainIcon,
  DumbbellIcon,
  TargetIcon,
  CalendarIcon,
  ShareIcon,
  LeafIcon,
  ScaleIcon,
  FlameIcon,
  SparkleIcon,
  SproutIcon,
  UtensilsCrossed,
  BowlIcon,
  MealIcon,
  UserIcon,
  BellIcon,
  ActivityIcon,
} from '../components/Icons';

interface GoalSettingFlowScreenProps {
  initialStep?: number;
  onBackToExplore: () => void;
  onNavigateToMealPlan: () => void;
  onNavigateToCalculations: () => void;
  onBackToPlanStructure?: () => void;
}

export const GoalSettingFlowScreen: React.FC<GoalSettingFlowScreenProps> = ({
  initialStep = 1,
  onBackToExplore,
  onNavigateToMealPlan,
  onNavigateToCalculations,
  onBackToPlanStructure,
}) => {
  // Current active step (1 to 9)
  const [step, setStep] = useState(initialStep);

  // Form State
  const [state, setState] = useState<GoalSettingState>({
    primaryGoal: 'Manage PCOS symptoms',
    currentWeight: 68,
    targetWeight: 55,
    heightCm: 162,
    age: 26,
    activityLevel: 'Lightly active',
    conditions: ['PCOS'],
    goalCategory: 'Health goal',
    selectedGoals: [
      'Regulate menstrual cycle',
      'Reduce PCOS symptoms (acne, hair fall, etc.)',
      'Improve hormonal balance',
    ],
    cycleRegularity: 'Every 28-32 days',
    symptomsTarget: 'Less acne & bloating',
    timeline: '6 months',
    sleepDuration: '6–7 hours',
    waterIntake: '1.5–2 litres',
    workRoutine: 'Student',
    stressLevel: 'Moderate',
    exerciseRoutine: '1–3 days/week',
    cuisine: 'Indian',
    dietType: 'Vegetarian',
    likedFoods: ['Paneer', 'Oats', 'Dal', 'Millets', 'Fruits', 'Curd'],
    avoidFoods: ['Refined flour', 'Deep fried food'],
  });

  const goNext = () => {
    if (step < 9) {
      setStep((prev) => prev + 1);
    } else {
      onNavigateToMealPlan();
    }
  };

  const goBack = () => {
    if (step === 7 && onBackToPlanStructure) {
      onBackToPlanStructure();
      return;
    }
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      onBackToExplore();
    }
  };

  const toggleCondition = (cond: string) => {
    setState((prev) => {
      const exists = prev.conditions.includes(cond);
      return {
        ...prev,
        conditions: exists
          ? prev.conditions.filter((c) => c !== cond)
          : [...prev.conditions, cond],
      };
    });
  };

  const toggleGoal = (goal: string) => {
    setState((prev) => {
      const exists = prev.selectedGoals.includes(goal);
      return {
        ...prev,
        selectedGoals: exists
          ? prev.selectedGoals.filter((g) => g !== goal)
          : [...prev.selectedGoals, goal],
      };
    });
  };

  const toggleLikedFood = (food: string) => {
    setState((prev) => {
      const exists = prev.likedFoods.includes(food);
      return {
        ...prev,
        likedFoods: exists
          ? prev.likedFoods.filter((f) => f !== food)
          : [...prev.likedFoods, food],
      };
    });
  };

  const toggleAvoidFood = (food: string) => {
    setState((prev) => {
      const exists = prev.avoidFoods.includes(food);
      return {
        ...prev,
        avoidFoods: exists
          ? prev.avoidFoods.filter((f) => f !== food)
          : [...prev.avoidFoods, food],
      };
    });
  };

  return (
    <View style={styles.container}>
      {/* ── Top Header Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={goBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        {step > 1 && step <= 6 && (
          <Text style={styles.stepCounterText}>{step}/6</Text>
        )}
        {step === 1 && (
          <Text style={styles.headerTitle}>Goal Setting</Text>
        )}
        {step > 6 && <View style={{ width: 36 }} />}
      </View>

      {/* Progress Bar for Steps 2 to 6 */}
      {step >= 2 && step <= 6 && (
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((step - 1) / 5) * 100}%` },
            ]}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── STEP 1: Where would you like to begin? ── */}
        {step === 1 && (
          <View>
            <Text style={styles.pageTitle}>Where would you like to begin?</Text>
            <Text style={styles.pageSubtitle}>
              Choose your primary goal. You can always add more later.
            </Text>

            <View style={styles.optionsList}>
              {[
                {
                  id: 'Manage PCOS symptoms',
                  title: 'Manage PCOS symptoms',
                  desc: 'Balance hormones and cycles',
                  icon: '',
                },
                {
                  id: 'Weight management',
                  title: 'Weight management',
                  desc: 'Lose, maintain or gain weight',
                  icon: '',
                },
                {
                  id: 'Improve energy levels',
                  title: 'Improve energy levels',
                  desc: 'Feel active and less fatigued',
                  icon: '',
                },
                {
                  id: 'Better digestion',
                  title: 'Better digestion',
                  desc: 'Reduce bloating and discomfort',
                  icon: '',
                },
                {
                  id: 'Build healthier habits',
                  title: 'Build healthier habits',
                  desc: 'Create sustainable routines',
                  icon: '',
                },
                {
                  id: 'Improve fitness & strength',
                  title: 'Improve fitness & strength',
                  desc: 'Support overall wellness',
                  icon: '',
                },
              ].map((opt) => {
                const isSelected = state.primaryGoal === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                    onPress={() => setState({ ...state, primaryGoal: opt.id })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.radioCardIconWrapper}>
                      <Text style={{ fontSize: 20 }}>{opt.icon}</Text>
                    </View>
                    <View style={styles.radioCardTextContent}>
                      <Text style={styles.radioCardTitle}>{opt.title}</Text>
                      <Text style={styles.radioCardDesc}>{opt.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioIndicator,
                        isSelected && styles.radioIndicatorSelected,
                      ]}
                    >
                      {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── STEP 2 (2/6): Your Current Profile ── */}
        {step === 2 && (
          <View>
            <Text style={styles.pageTitle}>Your Current Profile</Text>
            <Text style={styles.pageSubtitle}>Help us understand where you are now.</Text>

            {/* Current Weight & Height Steppers */}
            <View style={styles.dualFieldRow}>
              {/* Weight */}
              <View style={styles.dualCol}>
                <Text style={styles.inputLabel}>Current weight</Text>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      setState((p) => ({ ...p, currentWeight: Math.max(30, p.currentWeight - 1) }))
                    }
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{state.currentWeight} <Text style={styles.stepperUnit}>kg</Text></Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      setState((p) => ({ ...p, currentWeight: p.currentWeight + 1 }))
                    }
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Height */}
              <View style={styles.dualCol}>
                <Text style={styles.inputLabel}>Height</Text>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      setState((p) => ({ ...p, heightCm: Math.max(100, p.heightCm - 1) }))
                    }
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{state.heightCm} <Text style={styles.stepperUnit}>cm</Text></Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      setState((p) => ({ ...p, heightCm: p.heightCm + 1 }))
                    }
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Age & Activity Level */}
            <View style={styles.dualFieldRow}>
              <View style={styles.dualCol}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.infoInputBox}>
                  <Text style={styles.stepperValue}>{state.age} <Text style={styles.stepperUnit}>years</Text></Text>
                </View>
              </View>

              <View style={styles.dualCol}>
                <Text style={styles.inputLabel}>Activity level</Text>
                <TouchableOpacity
                  style={styles.dropdownInputBox}
                  onPress={() => {
                    const next =
                      state.activityLevel === 'Lightly active'
                        ? 'Moderately active'
                        : state.activityLevel === 'Moderately active'
                        ? 'Very active'
                        : 'Lightly active';
                    setState({ ...state, activityLevel: next });
                  }}
                >
                  <Text style={styles.dropdownInputText}>{state.activityLevel}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Any medical conditions? */}
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>
              Any medical conditions? <Text style={styles.labelHint}>(Select all that apply)</Text>
            </Text>
            <View style={styles.pillsWrap}>
              {[
                'PCOS',
                'Thyroid',
                'Diabetes',
                'Hormonal imbalance',
                'None',
                'Others',
              ].map((cond) => {
                const isSelected = state.conditions.includes(cond);
                return (
                  <TouchableOpacity
                    key={cond}
                    style={[styles.conditionPill, isSelected && styles.conditionPillActive]}
                    onPress={() => toggleCondition(cond)}
                    activeOpacity={0.8}
                  >
                    {isSelected && <Text style={styles.checkMarkWhite}>✓ </Text>}
                    <Text
                      style={[
                        styles.conditionPillText,
                        isSelected && styles.conditionPillTextActive,
                      ]}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── STEP 3 (3/6): Set Your Goal ── */}
        {step === 3 && (
          <View>
            <Text style={styles.pageTitle}>Set Your Goal</Text>
            <Text style={styles.pageSubtitle}>Make it realistic and achievable.</Text>

            {/* Category Tabs */}
            <View style={styles.categoryTabs}>
              {(['Weight goal', 'Health goal', 'Lifestyle goal'] as const).map((tab) => {
                const isActive = state.goalCategory === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                    onPress={() => setState({ ...state, goalCategory: tab })}
                  >
                    <Text
                      style={[
                        styles.categoryTabText,
                        isActive && styles.categoryTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Checklist */}
            <View style={styles.checklist}>
              {[
                'Regulate menstrual cycle',
                'Reduce PCOS symptoms (acne, hair fall, etc.)',
                'Improve hormonal balance',
                'Reduce bloating',
                'Increase energy levels',
                'Improve overall metabolic health',
                'Others (add your own)',
              ].map((item) => {
                const isChecked = state.selectedGoals.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.checkItemRow}
                    onPress={() => toggleGoal(item)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.checkboxSquare, isChecked && styles.checkboxSquareChecked]}
                    >
                      {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={styles.checkItemText}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Callout */}
            <View style={styles.calloutCard}>
              <LeafIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
              <Text style={styles.calloutText}>
                Your plan will focus on nutrition, lifestyle and habits that support hormonal balance and long-term wellbeing.
              </Text>
            </View>
          </View>
        )}

        {/* ── STEP 4 (4/6): Set Your Target & Timeline ── */}
        {step === 4 && (
          <View>
            <Text style={styles.pageTitle}>Set Your Target & Timeline</Text>
            <Text style={styles.pageSubtitle}>Define your key targets.</Text>

            <Text style={[styles.inputLabel, { marginTop: 8 }]}>Target areas</Text>

            {/* Target 1: Weight */}
            <View style={styles.targetCard}>
              <View style={styles.targetIconCircle}>
                <LeafIcon size={16} color="#3D5C3E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.targetItemLabel}>Weight</Text>
                <TouchableOpacity
                  style={styles.targetSelector}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      targetWeight: p.targetWeight === 55 ? 58 : 55,
                    }))
                  }
                >
                  <Text style={styles.targetSelectorText}>{state.targetWeight} kg</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
              <View style={styles.checkCircleGreen}>
                <CheckIcon size={12} color="#FFFFFF" />
              </View>
            </View>

            {/* Target 2: Cycle regularity */}
            <View style={styles.targetCard}>
              <View style={styles.targetIconCircle}>
                <Text style={{ fontSize: 16 }}>⏱️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.targetItemLabel}>Cycle regularity</Text>
                <TouchableOpacity
                  style={styles.targetSelector}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      cycleRegularity:
                        p.cycleRegularity === 'Every 28-32 days'
                          ? 'Every 30-35 days'
                          : 'Every 28-32 days',
                    }))
                  }
                >
                  <Text style={styles.targetSelectorText}>{state.cycleRegularity}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
              <View style={styles.radioEmptyCircle} />
            </View>

            {/* Target 3: Reduce symptoms */}
            <View style={styles.targetCard}>
              <View style={styles.targetIconCircle}>
                <SparkleIcon size={16} color="#3D5C3E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.targetItemLabel}>Reduce symptoms</Text>
                <TouchableOpacity
                  style={styles.targetSelector}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      symptomsTarget:
                        p.symptomsTarget === 'Less acne & bloating'
                          ? 'Less fatigue & mood swings'
                          : 'Less acne & bloating',
                    }))
                  }
                >
                  <Text style={styles.targetSelectorText}>{state.symptomsTarget}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
              <View style={styles.checkCircleGreen}>
                <CheckIcon size={12} color="#FFFFFF" />
              </View>
            </View>

            {/* Timeline Selection */}
            <Text style={[styles.inputLabel, { marginTop: 18 }]}>Target timeline</Text>
            <View style={styles.timelineRow}>
              {(['3 months', '6 months', '12 months'] as const).map((t) => {
                const isSelected = state.timeline === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.timelinePill, isSelected && styles.timelinePillActive]}
                    onPress={() => setState({ ...state, timeline: t })}
                  >
                    <Text
                      style={[
                        styles.timelinePillText,
                        isSelected && styles.timelinePillTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Realistic timeline info box */}
            <View style={styles.calloutCard}>
              <CalendarIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
              <Text style={styles.calloutText}>
                A realistic timeline helps us create a sustainable plan for your goals.
              </Text>
            </View>
          </View>
        )}

        {/* ── STEP 5 (5/6): Lifestyle & Habits ── */}
        {step === 5 && (
          <View>
            <Text style={styles.pageTitle}>Lifestyle & Habits</Text>
            <Text style={styles.pageSubtitle}>Help us personalize your plan further.</Text>

            {/* Habit Rows */}
            <View style={styles.habitRowsContainer}>
              {/* Sleep */}
              <View style={styles.habitRow}>
                <View style={styles.habitIconBox}>
                  <MoonIcon size={18} color="#4A4E46" />
                </View>
                <Text style={styles.habitLabel}>Sleep duration</Text>
                <TouchableOpacity
                  style={styles.habitDropdown}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      sleepDuration: p.sleepDuration === '6–7 hours' ? '7–8 hours' : '6–7 hours',
                    }))
                  }
                >
                  <Text style={styles.habitDropdownText}>{state.sleepDuration}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              {/* Water Intake */}
              <View style={styles.habitRow}>
                <View style={styles.habitIconBox}>
                  <WaterIcon size={18} color="#3B82F6" />
                </View>
                <Text style={styles.habitLabel}>Water intake</Text>
                <TouchableOpacity
                  style={styles.habitDropdown}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      waterIntake: p.waterIntake === '1.5–2 litres' ? '2–3 litres' : '1.5–2 litres',
                    }))
                  }
                >
                  <Text style={styles.habitDropdownText}>{state.waterIntake}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              {/* Work routine */}
              <View style={styles.habitRow}>
                <View style={styles.habitIconBox}>
                  <BriefcaseIcon size={18} color="#4A4E46" />
                </View>
                <Text style={styles.habitLabel}>Work routine</Text>
                <TouchableOpacity
                  style={styles.habitDropdown}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      workRoutine: p.workRoutine === 'Student' ? 'Desk Job' : 'Student',
                    }))
                  }
                >
                  <Text style={styles.habitDropdownText}>{state.workRoutine}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              {/* Stress level */}
              <View style={styles.habitRow}>
                <View style={styles.habitIconBox}>
                  <BrainIcon size={18} color="#4A4E46" />
                </View>
                <Text style={styles.habitLabel}>Stress level</Text>
                <TouchableOpacity
                  style={styles.habitDropdown}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      stressLevel: p.stressLevel === 'Moderate' ? 'Low' : 'Moderate',
                    }))
                  }
                >
                  <Text style={styles.habitDropdownText}>{state.stressLevel}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              {/* Exercise routine */}
              <View style={styles.habitRow}>
                <View style={styles.habitIconBox}>
                  <DumbbellIcon size={18} color="#4A4E46" />
                </View>
                <Text style={styles.habitLabel}>Exercise routine</Text>
                <TouchableOpacity
                  style={styles.habitDropdown}
                  onPress={() =>
                    setState((p) => ({
                      ...p,
                      exerciseRoutine:
                        p.exerciseRoutine === '1–3 days/week' ? '3–5 days/week' : '1–3 days/week',
                    }))
                  }
                >
                  <Text style={styles.habitDropdownText}>{state.exerciseRoutine}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 6 (6/6): Food Preferences ── */}
        {step === 6 && (
          <View>
            <Text style={styles.pageTitle}>Food Preferences</Text>
            <Text style={styles.pageSubtitle}>Tell us what you like and what to avoid.</Text>

            {/* Cuisine preference */}
            <Text style={[styles.inputLabel, { marginTop: 8 }]}>Cuisine preference</Text>
            <View style={styles.cuisineGrid}>
              {[
                { name: 'Indian', emoji: '' },
                { name: 'Continental', emoji: '' },
                { name: 'Mixed', emoji: '' },
                { name: '+ Others', emoji: '' },
              ].map((c) => {
                const isSelected = state.cuisine === c.name;
                return (
                  <TouchableOpacity
                    key={c.name}
                    style={[styles.cuisineCard, isSelected && styles.cuisineCardSelected]}
                    onPress={() => setState({ ...state, cuisine: c.name })}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 26, marginBottom: 4 }}>{c.emoji}</Text>
                    <Text style={styles.cuisineName}>{c.name}</Text>
                    {isSelected && (
                      <View style={styles.cuisineCheck}>
                        <CheckIcon size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Diet type */}
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Diet type</Text>
            <View style={styles.dietRow}>
              {['Vegetarian', 'Egg', 'Non-veg', 'Vegan'].map((d) => {
                const isSelected = state.dietType === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dietPill, isSelected && styles.dietPillActive]}
                    onPress={() => setState({ ...state, dietType: d })}
                  >
                    {isSelected && <Text style={styles.checkMarkWhite}>✓ </Text>}
                    <Text
                      style={[styles.dietPillText, isSelected && styles.dietPillTextActive]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Foods you love */}
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Foods you love</Text>
            <View style={styles.pillsWrap}>
              {[
                'Paneer',
                'Oats',
                'Dal',
                'Millets',
                'Fruits',
                'Curd',
                'Makhana',
                'Quinoa',
                'Sprouts',
                '+ Add more',
              ].map((food) => {
                const isSelected = state.likedFoods.includes(food);
                return (
                  <TouchableOpacity
                    key={food}
                    style={[styles.loveFoodPill, isSelected && styles.loveFoodPillActive]}
                    onPress={() => toggleLikedFood(food)}
                  >
                    <Text
                      style={[
                        styles.loveFoodPillText,
                        isSelected && styles.loveFoodPillTextActive,
                      ]}
                    >
                      {food}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Foods to avoid */}
            <Text style={[styles.inputLabel, { marginTop: 16, color: '#9B382A' }]}>
              Foods to avoid
            </Text>
            <View style={styles.pillsWrap}>
              {[
                'Refined flour',
                'Deep fried food',
                'Excess sugar',
                'Processed food',
                '+ Add more',
              ].map((food) => {
                const isSelected = state.avoidFoods.includes(food);
                return (
                  <TouchableOpacity
                    key={food}
                    style={[styles.avoidFoodPill, isSelected && styles.avoidFoodPillActive]}
                    onPress={() => toggleAvoidFood(food)}
                  >
                    <Text
                      style={[
                        styles.avoidFoodPillText,
                        isSelected && styles.avoidFoodPillTextActive,
                      ]}
                    >
                      {food}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── STEP 7: Your Goal Plan Summary ── */}
        {step === 7 && (
          <View>
            <Text style={styles.pageTitle}>Your Goal Plan Summary</Text>
            <Text style={styles.pageSubtitle}>
              Review your details before we create your plan.
            </Text>

            <View style={styles.summaryCard}>
              {/* Primary goal */}
              <View style={styles.summaryItemRow}>
                <TargetIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Primary goal</Text>
                  <Text style={styles.summaryItemValue}>{state.primaryGoal}</Text>
                </View>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Text style={styles.changeLinkText}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryDivider} />

              {/* Weight */}
              <View style={styles.summaryItemRow}>
                <ScaleIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Current → Target weight</Text>
                  <Text style={styles.summaryItemValue}>
                    {state.currentWeight} kg → {state.targetWeight} kg
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Timeline */}
              <View style={styles.summaryItemRow}>
                <CalendarIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Timeline</Text>
                  <Text style={styles.summaryItemValue}>{state.timeline}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Cycle Goal */}
              <View style={styles.summaryItemRow}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>⏱️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Cycle goal</Text>
                  <Text style={styles.summaryItemValue}>{state.cycleRegularity}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Focus areas */}
              <View style={styles.summaryItemRow}>
                <SparkleIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Focus areas</Text>
                  <Text style={styles.summaryItemValue}>
                    Hormonal balance, Reduce bloating, More energy
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Diet & Cuisine */}
              <View style={styles.summaryItemRow}>
                <SproutIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Diet type</Text>
                  <Text style={styles.summaryItemValue}>
                    {state.dietType} ({state.cuisine})
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Activity Level */}
              <View style={styles.summaryItemRow}>
                <DumbbellIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Activity level</Text>
                  <Text style={styles.summaryItemValue}>{state.activityLevel}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Key Preferences */}
              <View style={styles.summaryItemRow}>
                <LeafIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Key preferences</Text>
                  <Text style={styles.summaryItemValue}>
                    {state.likedFoods.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* Foods to avoid */}
              <View style={styles.summaryItemRow}>
                <TargetIcon size={18} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryItemLabel}>Foods to avoid</Text>
                  <Text style={styles.summaryItemValue}>
                    {state.avoidFoods.join(', ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 8: Your Plan is Ready! ── */}
        {step === 8 && (
          <View style={styles.readyStepContainer}>
            {/* Serene Character Illustration */}
            <View style={styles.readyIllustrationWrapper}>
              <View style={{ alignItems: "center", marginVertical: 12 }}><LeafIcon size={48} color="#3D5C3E" /></View>
            </View>

            <Text style={styles.readyTitle}>Your Plan is Ready!</Text>
            <Text style={styles.readySubtitle}>
              A personalized nutrition and lifestyle plan based on your goals and preferences.
            </Text>

            {/* Feature Bullets */}
            <View style={styles.featureBulletsCard}>
              {[
                '7-day meal plan with multiple options',
                'Recipes using your preferred foods',
                'Lifestyle & habit recommendations',
                'Weekly progress tracking',
                'Can be reviewed and edited by your nutritionist or consultant',
              ].map((bullet, idx) => (
                <View key={idx} style={styles.featureBulletRow}>
                  <View style={styles.featureCheckCircle}>
                    <CheckIcon size={11} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureBulletText}>{bullet}</Text>
                </View>
              ))}
            </View>

            {/* Share With Nutritionist Outlined Button */}
            <TouchableOpacity
              style={styles.shareNutritionistButton}
              onPress={() =>
                Alert.alert(
                  'Shared with Dr. Ananya',
                  'Your blueprint has been sent for professional clinical review.'
                )
              }
              activeOpacity={0.8}
            >
              <UserIcon size={16} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.shareNutritionistText}>Share with Nutritionist</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 9: Your Plan is Connected ── */}
        {step === 9 && (
          <View>
            <Text style={styles.pageTitle}>Your Plan is Connected</Text>
            <Text style={styles.pageSubtitle}>Now explore related sections.</Text>

            <View style={styles.connectedCardsList}>
              {/* Item 1 */}
              <TouchableOpacity
                style={styles.connectedCard}
                onPress={onNavigateToMealPlan}
                activeOpacity={0.8}
              >
                <View style={[styles.connectedIconWrapper, { backgroundColor: '#F9F1E7' }]}>
                  <UtensilsCrossed size={22} color="#3D5C3E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedCardTitle}>View / Edit Meal Plan</Text>
                  <Text style={styles.connectedCardDesc}>
                    Day-wise and option-based plans
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#8D9188" />
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity
                style={styles.connectedCard}
                onPress={onNavigateToCalculations}
                activeOpacity={0.8}
              >
                <View style={[styles.connectedIconWrapper, { backgroundColor: '#EAF5EC' }]}>
                  <ActivityIcon size={22} color="#3D5C3E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedCardTitle}>Nutrition Targets</Text>
                  <Text style={styles.connectedCardDesc}>
                    Calories & macros for your goal
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#8D9188" />
              </TouchableOpacity>

              {/* Item 3 */}
              <TouchableOpacity
                style={styles.connectedCard}
                onPress={() =>
                  Alert.alert('Progress Tracker', 'Track weight, cycle, energy and more.')
                }
                activeOpacity={0.8}
              >
                <View style={[styles.connectedIconWrapper, { backgroundColor: '#EBF4F6' }]}>
                  <ScaleIcon size={22} color="#3D5C3E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedCardTitle}>Progress Tracker</Text>
                  <Text style={styles.connectedCardDesc}>
                    Track weight, cycle, energy and more
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#8D9188" />
              </TouchableOpacity>

              {/* Item 4 */}
              <TouchableOpacity
                style={styles.connectedCard}
                onPress={() =>
                  Alert.alert(
                    'Care Team Consultation',
                    'Discuss and refine targets with Dr. Ananya.'
                  )
                }
                activeOpacity={0.8}
              >
                <View style={[styles.connectedIconWrapper, { backgroundColor: '#FAF3E8' }]}>
                  <Image
                    source={require('../../assets/images/nutritionist-ananya.webp')}
                    style={{ width: 28, height: 28, borderRadius: 14 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedCardTitle}>Consultation</Text>
                  <Text style={styles.connectedCardDesc}>
                    Discuss and refine with your nutritionist
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#8D9188" />
              </TouchableOpacity>

              {/* Item 5 */}
              <TouchableOpacity
                style={styles.connectedCard}
                onPress={() =>
                  Alert.alert('Reminders', 'Stay on track with mindful eating notifications.')
                }
                activeOpacity={0.8}
              >
                <View style={[styles.connectedIconWrapper, { backgroundColor: '#FDF0ED' }]}>
                  <BellIcon size={22} color="#3D5C3E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedCardTitle}>Reminders</Text>
                  <Text style={styles.connectedCardDesc}>
                    Stay on track with habit reminders
                  </Text>
                </View>
                <ChevronRightIcon size={18} color="#8D9188" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Bottom Action Button ── */}
        <View style={styles.bottomCtaContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={goNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionText}>
              {step === 7
                ? 'Create My Plan  →'
                : step === 8
                ? 'View My Plan  →'
                : step === 9
                ? 'Go to My Plan  →'
                : 'Continue  →'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7EE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  stepCounterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737970',
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: '#EAE5DB',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5C6E52',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 36,
  },
  pageTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#686B63',
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE8DF',
    borderRadius: 16,
    padding: 14,
  },
  radioCardSelected: {
    borderColor: '#5C6E52',
    backgroundColor: '#FAFBF9',
  },
  radioCardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCardTextContent: {
    flex: 1,
  },
  radioCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  radioCardDesc: {
    fontSize: 11.5,
    color: '#686B63',
    marginTop: 2,
  },
  radioIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1CDC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicatorSelected: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  dualFieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dualCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#262923',
    marginBottom: 6,
  },
  labelHint: {
    fontSize: 11,
    color: '#737970',
    fontWeight: '400',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262923',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  stepperUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#737970',
  },
  infoInputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  dropdownInputText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  conditionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  conditionPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  conditionPillText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#343831',
  },
  conditionPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkMarkWhite: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#EFEAE2',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#5C6E52',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555850',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  checklist: {
    gap: 12,
    marginBottom: 20,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#C5C1B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxSquareChecked: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  checkItemText: {
    fontSize: 13,
    color: '#262923',
    flex: 1,
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: '#E6E0D4',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  calloutText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#555850',
  },
  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  targetIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  targetItemLabel: {
    fontSize: 11,
    color: '#737970',
  },
  targetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  targetSelectorText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  checkCircleGreen: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioEmptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C5C1B8',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  timelinePill: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelinePillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  timelinePillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#444740',
  },
  timelinePillTextActive: {
    color: '#FFFFFF',
  },
  habitRowsContainer: {
    gap: 12,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    padding: 10,
  },
  habitIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  habitLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#262923',
  },
  habitDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBF9F5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  habitDropdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  cuisineGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  cuisineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  cuisineCardSelected: {
    borderColor: '#5C6E52',
  },
  cuisineName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  cuisineCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dietPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    backgroundColor: '#FFFFFF',
  },
  dietPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  dietPillText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#343831',
  },
  dietPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loveFoodPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  loveFoodPillActive: {
    backgroundColor: '#EAF0E6',
    borderColor: '#5C6E52',
  },
  loveFoodPillText: {
    fontSize: 12,
    color: '#343831',
  },
  loveFoodPillTextActive: {
    color: '#264428',
    fontWeight: '600',
  },
  avoidFoodPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3D2CC',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  avoidFoodPillActive: {
    backgroundColor: '#FDEEEB',
    borderColor: '#EF4444',
  },
  avoidFoodPillText: {
    fontSize: 12,
    color: '#9B382A',
  },
  avoidFoodPillTextActive: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryItemLabel: {
    fontSize: 11,
    color: '#737970',
  },
  summaryItemValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginTop: 2,
  },
  changeLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C6E52',
    textDecorationLine: 'underline',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0ECE4',
    marginVertical: 4,
  },
  readyStepContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  readyIllustrationWrapper: {
    marginVertical: 12,
  },
  readyTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1D1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  readySubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#686B63',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  featureBulletsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 16,
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  featureBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureBulletText: {
    flex: 1,
    fontSize: 12.5,
    color: '#262923',
    lineHeight: 17,
  },
  shareNutritionistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#5C6E52',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  shareNutritionistText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C6E52',
  },
  connectedCardsList: {
    gap: 10,
  },
  connectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 14,
  },
  connectedIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  connectedCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  connectedCardDesc: {
    fontSize: 11.5,
    color: '#737970',
    marginTop: 2,
  },
  bottomCtaContainer: {
    marginTop: 24,
  },
  primaryActionButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6E52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

