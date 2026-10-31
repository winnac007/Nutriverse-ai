import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';
import { RootTab } from './src/types';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreToolsScreen } from './src/screens/ExploreToolsScreen';
import { NutritionCalculationsScreen } from './src/screens/NutritionCalculationsScreen';
import { HealthRestoreScreen } from './src/screens/HealthRestoreScreen';

// 6-Step Goal Setting Sequential Journey
import { GoalSettingFocusScreen } from './src/screens/GoalSettingFocusScreen';
import { GoalSettingSymptomsScreen } from './src/screens/GoalSettingSymptomsScreen';
import { GoalSettingProfileScreen } from './src/screens/GoalSettingProfileScreen';
import { GoalSettingFoodPrefsScreen } from './src/screens/GoalSettingFoodPrefsScreen';
import { GoalSettingPlanStructureScreen } from './src/screens/GoalSettingPlanStructureScreen';
import { GoalSettingFlowScreen } from './src/screens/GoalSettingFlowScreen';
import { GoalPlanSummaryScreen, PlanSummaryData } from './src/screens/GoalPlanSummaryScreen';

// Meal Plans & Client Experience
import { MealPlansScreen } from './src/screens/MealPlansScreen';
import { MealPlanDetailScreen } from './src/screens/MealPlanDetailScreen';
import { EditMyPlanScreen } from './src/screens/EditMyPlanScreen';

// Nutritionist Portal & Editor
import { PlanReviewApprovalScreen } from './src/screens/PlanReviewApprovalScreen';
import { NutritionistMealPlanEditorScreen } from './src/screens/NutritionistMealPlanEditorScreen';
import { CareTeamScreen } from './src/screens/CareTeamScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SignInScreen } from './src/screens/SignInScreen';
import { AuthService, AuthUser } from './src/services/api';

type Subscreen =
  | 'health-restore'
  | 'nutrition-calculations'
  | 'goal-setting-focus' // Step 1 of 6
  | 'goal-setting-symptoms' // Step 2 of 6
  | 'goal-setting-profile' // Step 3 of 6
  | 'goal-setting-foodprefs' // Step 4 of 6
  | 'goal-setting-planstructure' // Step 5 of 6
  | 'goal-plan-summary' // Step 6 of 6 (Modern Botanical Plan Summary)
  | 'goal-setting-flow' // Legacy fallback
  | 'meal-plans'
  | 'meal-plan-detail'
  | 'edit-my-plan'
  | 'plan-review-approval'
  | 'nutritionist-meal-plan-editor'
  | 'care-team'
  | null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    name: 'Riya Sharma',
    email: 'riya.sharma@zenplato.com',
  });
  const [activeTab, setActiveTab] = useState<RootTab>('Home');
  const [navigationStack, setNavigationStack] = useState<Subscreen[]>([]);
  const [selectedMealId, setSelectedMealId] = useState('moong-dal-chilla');

  // Active subscreen is the top of the navigation history stack
  const activeSubscreen = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : null;

  // Push new screen to history stack
  const pushScreen = (screen: Subscreen) => {
    if (!screen) return;
    setNavigationStack((prev) => [...prev, screen]);
  };

  // Pop screen from history stack to return to the exact previous screen
  const popScreen = () => {
    setNavigationStack((prev) => {
      if (prev.length <= 1) {
        return [];
      }
      return prev.slice(0, prev.length - 1);
    });
  };

  // Reset navigation stack to a root tab
  const resetToTab = (tab: RootTab) => {
    setNavigationStack([]);
    setActiveTab(tab);
  };

  // Centralized Onboarding & Goal Plan Data State
  const [onboardingData, setOnboardingData] = useState<PlanSummaryData>({
    goal: 'Manage PCOS symptoms',
    symptoms: ['irregular-periods', 'acne', 'bloating', 'low-energy', 'digestive-issues'],
    priorities: ['regulate-menstrual-cycle', 'reduce-acne', 'manage-weight'],
    profile: {
      age: '26',
      height: '162',
      weight: '68',
      targetWeight: '55',
      activityLevel: 'Lightly active',
      selectedConditions: ['PCOS'],
      sleepDuration: '6–7 hours',
      waterIntake: '1.5–2 litres',
      workRoutine: 'Student',
      stressLevel: 'Moderate',
      cycleType: 'Irregular',
      cycleLength: '35',
      periodDuration: '5',
      medications: '',
    },
    foodPrefs: {
      cuisines: ['Indian'],
      dietType: 'Vegetarian',
      likedFoods: [
        'Paneer',
        'Oats',
        'Quinoa',
        'Sprouts',
        'Fruits',
        'Makhana',
        'Dal',
        'Curd',
        'Seasonal vegetables',
      ],
      avoidFoods: [
        'Refined flour',
        'Deep fried food',
        'Excess sugar',
        'Processed food',
        'Red meat',
      ],
      eatingOutEnabled: true,
      eatingOutOption: 'Homemade meals',
      mealPattern: '3 meals + 2 snacks',
    },
    planStructure: {
      planFormat: 'day_based',
      duration: '7',
      selectedMeals: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
      includeAlternatives: true,
      eatingOutFlexibility: true,
      seasonalSuitability: true,
    },
  });

  // Tool selection handler from ExploreToolsScreen
  const handleSelectTool = (toolId: string) => {
    if (toolId === 'health-restore') {
      pushScreen('health-restore');
    } else if (toolId === 'nutrition-calc') {
      pushScreen('nutrition-calculations');
    } else if (toolId === 'goal-setting') {
      pushScreen('goal-setting-focus');
    } else if (toolId === 'symptom-tracker') {
      pushScreen('goal-setting-symptoms');
    } else if (toolId === 'water-lifestyle') {
      pushScreen('goal-setting-profile');
    } else if (toolId === 'log-meal') {
      pushScreen('edit-my-plan');
    } else if (toolId === 'progress-tracker') {
      pushScreen('nutrition-calculations');
    } else if (toolId === 'meal-builder') {
      pushScreen('meal-plans');
    } else if (toolId === 'recipe-library') {
      setSelectedMealId('moong-dal-chilla');
      pushScreen('meal-plan-detail');
    } else if (toolId === 'nutritionist-editor') {
      pushScreen('nutritionist-meal-plan-editor');
    } else {
      pushScreen('health-restore');
    }
  };

  const handleTabSelect = (tab: RootTab) => {
    setNavigationStack([]);
    if (tab === 'Add') {
      pushScreen('goal-setting-focus');
    } else {
      setActiveTab(tab);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <SignInScreen
          onSuccess={(user, isNewUser) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            if (isNewUser) {
              pushScreen('goal-setting-focus');
            } else {
              resetToTab('Home');
            }
          }}
          onExploreGuest={() => {
            setCurrentUser({ name: 'Guest Explorer', email: 'guest@zenplato.com' });
            setIsAuthenticated(true);
            resetToTab('Explore');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* ── Subscreens ── */}

        {/* Health & Restore Screen (Mirroring Web Healthcare Landing & Tools) */}
        {activeSubscreen === 'health-restore' && (
          <HealthRestoreScreen
            onBack={popScreen}
            onNavigateToCalculations={() => pushScreen('nutrition-calculations')}
            onNavigateToGoalSetting={(initialCond) => {
              if (initialCond) {
                setOnboardingData((prev) => ({
                  ...prev,
                  goal: `Manage ${initialCond} symptoms`,
                  profile: {
                    ...prev.profile,
                    selectedConditions: [initialCond],
                  },
                }));
              }
              pushScreen('goal-setting-focus');
            }}
            onNavigateToSymptoms={() => pushScreen('goal-setting-symptoms')}
            onNavigateToLifestyle={() => pushScreen('goal-setting-profile')}
            onNavigateToMealPlans={() => pushScreen('meal-plans')}
            onNavigateToMealDetail={(mealId) => {
              if (mealId) setSelectedMealId(mealId);
              pushScreen('meal-plan-detail');
            }}
            onNavigateToEditPlan={() => pushScreen('edit-my-plan')}
            onNavigateToCareTeam={() => pushScreen('care-team')}
            onNavigateToProgress={() => pushScreen('nutrition-calculations')}
          />
        )}

        {/* Nutrition Calculations Screen */}
        {activeSubscreen === 'nutrition-calculations' && (
          <NutritionCalculationsScreen
            onBack={popScreen}
            onNavigateToMealPlan={() => pushScreen('meal-plans')}
          />
        )}

        {/* ── 6-Step Goal Setting Sequential Journey ── */}

        {/* Step 1 of 6: Goal Setting Focus Screen */}
        {activeSubscreen === 'goal-setting-focus' && (
          <GoalSettingFocusScreen
            initialGoal={onboardingData.goal}
            onBack={popScreen}
            onContinue={(goal) => {
              setOnboardingData((prev) => ({ ...prev, goal }));
              pushScreen('goal-setting-symptoms');
            }}
          />
        )}

        {/* Step 2 of 6: Symptoms & Priority Selection */}
        {activeSubscreen === 'goal-setting-symptoms' && (
          <GoalSettingSymptomsScreen
            selectedGoal={onboardingData.goal}
            initialSymptoms={onboardingData.symptoms}
            initialPriorities={onboardingData.priorities}
            onBack={popScreen}
            onChangeGoal={() => pushScreen('goal-setting-focus')}
            onContinue={(symptomData) => {
              setOnboardingData((prev) => ({
                ...prev,
                symptoms: symptomData.selectedSymptoms,
                priorities: symptomData.topPriorities,
              }));
              pushScreen('goal-setting-profile');
            }}
          />
        )}

        {/* Step 3 of 6: Current Profile & Lifestyle */}
        {activeSubscreen === 'goal-setting-profile' && (
          <GoalSettingProfileScreen
            initialProfile={onboardingData.profile}
            onBack={popScreen}
            onContinue={(profileData) => {
              setOnboardingData((prev) => ({ ...prev, profile: profileData }));
              pushScreen('goal-setting-foodprefs');
            }}
          />
        )}

        {/* Step 4 of 6: Dietary & Food Preferences */}
        {activeSubscreen === 'goal-setting-foodprefs' && (
          <GoalSettingFoodPrefsScreen
            initialPrefs={onboardingData.foodPrefs}
            onBack={popScreen}
            onContinue={(prefsData) => {
              setOnboardingData((prev) => ({ ...prev, foodPrefs: prefsData }));
              pushScreen('goal-setting-planstructure');
            }}
          />
        )}

        {/* Step 5 of 6: Plan Structure & Flexibility */}
        {activeSubscreen === 'goal-setting-planstructure' && (
          <GoalSettingPlanStructureScreen
            initialPlan={onboardingData.planStructure}
            onBack={popScreen}
            onContinue={(planData) => {
              setOnboardingData((prev) => ({ ...prev, planStructure: planData }));
              pushScreen('goal-plan-summary');
            }}
          />
        )}

        {/* Step 6 of 6: Goal Plan Summary (Modern Botanical Plan Overview) */}
        {activeSubscreen === 'goal-plan-summary' && (
          <GoalPlanSummaryScreen
            data={onboardingData}
            onBack={popScreen}
            onChangeGoal={() => pushScreen('goal-setting-focus')}
            onChangeSymptoms={() => pushScreen('goal-setting-symptoms')}
            onChangeProfile={() => pushScreen('goal-setting-profile')}
            onChangeFoodPrefs={() => pushScreen('goal-setting-foodprefs')}
            onChangePlanStructure={() => pushScreen('goal-setting-planstructure')}
            onGeneratePlan={() => pushScreen('meal-plans')}
            onNavigateToCalculations={() => pushScreen('nutrition-calculations')}
          />
        )}

        {/* ── Meal Planning & Recipes ── */}

        {/* Meal Plans Screen (Bespoke 7-Day Protocol via Stack Navigation) */}
        {activeSubscreen === 'meal-plans' && (
          <MealPlansScreen
            onBack={popScreen}
            onViewRecipe={(id) => {
              setSelectedMealId(id);
              pushScreen('meal-plan-detail');
            }}
            onCustomizePlan={() => pushScreen('edit-my-plan')}
            onViewBreakdown={() => pushScreen('nutrition-calculations')}
          />
        )}

        {/* Meal Plan Detail Screen (Recipe Breakdown, Ingredients, Directions) */}
        {activeSubscreen === 'meal-plan-detail' && (
          <MealPlanDetailScreen
            mealId={selectedMealId}
            onBack={popScreen}
            onAddToPlan={() => pushScreen('meal-plans')}
          />
        )}

        {/* Edit My Plan Screen (Customize Meals & Portions) */}
        {activeSubscreen === 'edit-my-plan' && (
          <EditMyPlanScreen
            onBack={popScreen}
            onViewAsClient={() => pushScreen('meal-plans')}
            onSetTargets={() => pushScreen('nutrition-calculations')}
          />
        )}

        {/* ── Nutritionist Portal & Extended Editor ── */}

        {/* Plan Review & Approvals */}
        {activeSubscreen === 'plan-review-approval' && (
          <PlanReviewApprovalScreen
            onBack={popScreen}
            onPreviewForClient={() => {
              setSelectedMealId('moong-dal-chilla');
              pushScreen('meal-plan-detail');
            }}
            onEditTargets={() => pushScreen('nutrition-calculations')}
            onOpenEditor={() => pushScreen('nutritionist-meal-plan-editor')}
          />
        )}

        {/* Extended Nutritionist Meal Plan Editor */}
        {activeSubscreen === 'nutritionist-meal-plan-editor' && (
          <NutritionistMealPlanEditorScreen
            onBack={popScreen}
            onPreviewForClient={() => {
              setSelectedMealId('moong-dal-chilla');
              pushScreen('meal-plan-detail');
            }}
          />
        )}

        {/* Care Team Screen */}
        {activeSubscreen === 'care-team' && (
          <CareTeamScreen onBack={popScreen} />
        )}

        {/* ── Root Tabs ── */}
        {!activeSubscreen && activeTab === 'Home' && (
          <HomeScreen
            userName={currentUser?.name || 'Riya Sharma'}
            conditionName={onboardingData.goal.includes('PCOS') ? 'PCOS' : 'Wellness'}
            onNavigateToExplore={() => resetToTab('Explore')}
            onNavigateToMealPlan={() => pushScreen('meal-plans')}
            onNavigateToCalculations={() => pushScreen('nutrition-calculations')}
            onNavigateToCareTeam={() => pushScreen('care-team')}
            onNavigateToHealthRestore={() => pushScreen('health-restore')}
            onNavigateToEditPlan={() => pushScreen('edit-my-plan')}
            onNavigateToProfile={() => resetToTab('You')}
            onNavigateToMealDetail={(mealId) => {
              if (mealId) setSelectedMealId(mealId);
              pushScreen('meal-plan-detail');
            }}
          />
        )}

        {!activeSubscreen && activeTab === 'Explore' && (
          <ExploreToolsScreen
            onSelectTool={handleSelectTool}
            onOpenNotifications={() => pushScreen('care-team')}
            onOpenProfile={() => resetToTab('You')}
          />
        )}

        {!activeSubscreen && activeTab === 'Plans' && (
          <MealPlansScreen
            onBack={() => setActiveTab('Home')}
            onViewRecipe={(id) => {
              setSelectedMealId(id);
              pushScreen('meal-plan-detail');
            }}
            onCustomizePlan={() => pushScreen('edit-my-plan')}
            onViewBreakdown={() => pushScreen('nutrition-calculations')}
          />
        )}

        {!activeSubscreen && activeTab === 'You' && (
          <ProfileScreen
            onNavigateToCalculations={() => pushScreen('nutrition-calculations')}
            onNavigateToGoalSetting={() => pushScreen('goal-setting-focus')}
            onNavigateToCareTeam={() => pushScreen('care-team')}
            onNavigateToHealthRestore={() => pushScreen('health-restore')}
            onNavigateToNutritionistPortal={() => pushScreen('plan-review-approval')}
            onNavigateToNutritionistEditor={() => pushScreen('nutritionist-meal-plan-editor')}
            onSignOut={() => {
              AuthService.logout();
              setIsAuthenticated(false);
            }}
          />
        )}

        {/* ── Bottom Navigation Bar ── */}
        {!activeSubscreen && (
          <BottomNav
            activeTab={activeTab}
            onSelectTab={handleTabSelect}
            onPressAction={() => pushScreen('goal-setting-focus')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7EE',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF7EE',
  },
});
