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
  | 'nutrition-calculations'
  | 'goal-setting-focus' // Step 1 of 6
  | 'goal-setting-symptoms' // Step 2 of 6
  | 'goal-setting-profile' // Step 3 of 6
  | 'goal-setting-foodprefs' // Step 4 of 6
  | 'goal-setting-planstructure' // Step 5 of 6
  | 'goal-plan-summary' // Step 6 of 6 (Modern Botanical Plan Summary)
  | 'goal-setting-flow' // Legacy fallback
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
  const [activeTab, setActiveTab] = useState<RootTab>('Explore');
  const [activeSubscreen, setActiveSubscreen] = useState<Subscreen>(null);
  const [selectedMealId, setSelectedMealId] = useState('moong-dal-chilla');
  const [editorReturnScreen, setEditorReturnScreen] = useState<Subscreen>(null);
  const [detailReturnScreen, setDetailReturnScreen] = useState<Subscreen>(null);
  const [returnToSummary, setReturnToSummary] = useState(false);

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
    if (toolId === 'nutrition-calc') {
      setActiveSubscreen('nutrition-calculations');
    } else if (toolId === 'goal-setting') {
      setActiveSubscreen('goal-setting-focus');
    } else if (toolId === 'meal-builder') {
      setActiveTab('Plans');
    } else if (toolId === 'recipe-library') {
      setSelectedMealId('moong-dal-chilla');
      setDetailReturnScreen(null);
      setActiveSubscreen('meal-plan-detail');
    } else if (toolId === 'nutritionist-editor') {
      setEditorReturnScreen(null);
      setActiveSubscreen('nutritionist-meal-plan-editor');
    } else {
      setActiveSubscreen('nutrition-calculations');
    }
  };

  const handleTabSelect = (tab: RootTab) => {
    setActiveSubscreen(null);
    if (tab === 'Add') {
      setActiveSubscreen('goal-setting-focus');
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
              setActiveSubscreen('goal-setting-focus');
            } else {
              setActiveTab('Home');
              setActiveSubscreen(null);
            }
          }}
          onExploreGuest={() => {
            setCurrentUser({ name: 'Guest Explorer', email: 'guest@zenplato.com' });
            setIsAuthenticated(true);
            setActiveTab('Explore');
            setActiveSubscreen(null);
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

        {/* Nutrition Calculations Screen */}
        {activeSubscreen === 'nutrition-calculations' && (
          <NutritionCalculationsScreen
            onBack={() => setActiveSubscreen(null)}
            onNavigateToMealPlan={() => {
              setActiveSubscreen(null);
              setActiveTab('Plans');
            }}
          />
        )}

        {/* ── 6-Step Goal Setting Sequential Journey ── */}

        {/* Step 1 of 6: Goal Setting Focus Screen */}
        {activeSubscreen === 'goal-setting-focus' && (
          <GoalSettingFocusScreen
            initialGoal={onboardingData.goal}
            onBack={() => {
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen(null);
              }
            }}
            onContinue={(goal) => {
              setOnboardingData((prev) => ({ ...prev, goal }));
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-symptoms');
              }
            }}
          />
        )}

        {/* Step 2 of 6: Symptoms & Priority Selection */}
        {activeSubscreen === 'goal-setting-symptoms' && (
          <GoalSettingSymptomsScreen
            selectedGoal={onboardingData.goal}
            initialSymptoms={onboardingData.symptoms}
            initialPriorities={onboardingData.priorities}
            onBack={() => {
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-focus');
              }
            }}
            onChangeGoal={() => setActiveSubscreen('goal-setting-focus')}
            onContinue={(symptomData) => {
              setOnboardingData((prev) => ({
                ...prev,
                symptoms: symptomData.selectedSymptoms,
                priorities: symptomData.topPriorities,
              }));
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-profile');
              }
            }}
          />
        )}

        {/* Step 3 of 6: Current Profile & Lifestyle */}
        {activeSubscreen === 'goal-setting-profile' && (
          <GoalSettingProfileScreen
            initialProfile={onboardingData.profile}
            onBack={() => {
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-symptoms');
              }
            }}
            onContinue={(profileData) => {
              setOnboardingData((prev) => ({ ...prev, profile: profileData }));
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-foodprefs');
              }
            }}
          />
        )}

        {/* Step 4 of 6: Dietary & Food Preferences */}
        {activeSubscreen === 'goal-setting-foodprefs' && (
          <GoalSettingFoodPrefsScreen
            initialPrefs={onboardingData.foodPrefs}
            onBack={() => {
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-profile');
              }
            }}
            onContinue={(prefsData) => {
              setOnboardingData((prev) => ({ ...prev, foodPrefs: prefsData }));
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-planstructure');
              }
            }}
          />
        )}

        {/* Step 5 of 6: Plan Structure & Flexibility */}
        {activeSubscreen === 'goal-setting-planstructure' && (
          <GoalSettingPlanStructureScreen
            initialPlan={onboardingData.planStructure}
            onBack={() => {
              if (returnToSummary) {
                setReturnToSummary(false);
                setActiveSubscreen('goal-plan-summary');
              } else {
                setActiveSubscreen('goal-setting-foodprefs');
              }
            }}
            onContinue={(planData) => {
              setOnboardingData((prev) => ({ ...prev, planStructure: planData }));
              setReturnToSummary(false);
              setActiveSubscreen('goal-plan-summary');
            }}
          />
        )}

        {/* Step 6 of 6: Goal Plan Summary (Modern Botanical Plan Overview) */}
        {activeSubscreen === 'goal-plan-summary' && (
          <GoalPlanSummaryScreen
            data={onboardingData}
            onBack={() => setActiveSubscreen('goal-setting-planstructure')}
            onChangeGoal={() => {
              setReturnToSummary(true);
              setActiveSubscreen('goal-setting-focus');
            }}
            onChangeSymptoms={() => {
              setReturnToSummary(true);
              setActiveSubscreen('goal-setting-symptoms');
            }}
            onChangeProfile={() => {
              setReturnToSummary(true);
              setActiveSubscreen('goal-setting-profile');
            }}
            onChangeFoodPrefs={() => {
              setReturnToSummary(true);
              setActiveSubscreen('goal-setting-foodprefs');
            }}
            onChangePlanStructure={() => {
              setReturnToSummary(true);
              setActiveSubscreen('goal-setting-planstructure');
            }}
            onGeneratePlan={() => {
              setActiveSubscreen(null);
              setActiveTab('Plans');
            }}
            onNavigateToCalculations={() => {
              setActiveSubscreen('nutrition-calculations');
            }}
          />
        )}

        {/* ── Meal Planning & Recipes ── */}

        {/* Meal Plan Detail Screen (Recipe Breakdown, Ingredients, Directions) */}
        {activeSubscreen === 'meal-plan-detail' && (
          <MealPlanDetailScreen
            mealId={selectedMealId}
            onBack={() => setActiveSubscreen(detailReturnScreen)}
            onAddToPlan={() => {
              setActiveSubscreen(null);
              setActiveTab('Plans');
            }}
          />
        )}

        {/* Edit My Plan Screen (Customize Meals & Portions) */}
        {activeSubscreen === 'edit-my-plan' && (
          <EditMyPlanScreen
            onBack={() => setActiveSubscreen(null)}
            onViewAsClient={() => setActiveSubscreen(null)}
            onSetTargets={() => setActiveSubscreen('nutrition-calculations')}
          />
        )}

        {/* ── Nutritionist Portal & Extended Editor ── */}

        {/* Plan Review & Approvals */}
        {activeSubscreen === 'plan-review-approval' && (
          <PlanReviewApprovalScreen
            onBack={() => setActiveSubscreen(null)}
            onPreviewForClient={() => {
              setSelectedMealId('moong-dal-chilla');
              setDetailReturnScreen('plan-review-approval');
              setActiveSubscreen('meal-plan-detail');
            }}
            onEditTargets={() => setActiveSubscreen('nutrition-calculations')}
            onOpenEditor={() => {
              setEditorReturnScreen('plan-review-approval');
              setActiveSubscreen('nutritionist-meal-plan-editor');
            }}
          />
        )}

        {/* Extended Nutritionist Meal Plan Editor */}
        {activeSubscreen === 'nutritionist-meal-plan-editor' && (
          <NutritionistMealPlanEditorScreen
            onBack={() => setActiveSubscreen(editorReturnScreen)}
            onPreviewForClient={() => {
              setSelectedMealId('moong-dal-chilla');
              setDetailReturnScreen('nutritionist-meal-plan-editor');
              setActiveSubscreen('meal-plan-detail');
            }}
          />
        )}

        {/* Care Team Screen */}
        {activeSubscreen === 'care-team' && (
          <CareTeamScreen onBack={() => setActiveSubscreen(null)} />
        )}

        {/* ── Root Tabs ── */}
        {!activeSubscreen && activeTab === 'Home' && (
          <HomeScreen
            onNavigateToExplore={() => setActiveTab('Explore')}
            onNavigateToMealPlan={() => setActiveTab('Plans')}
            onNavigateToCalculations={() => setActiveSubscreen('nutrition-calculations')}
            onNavigateToCareTeam={() => setActiveSubscreen('care-team')}
          />
        )}

        {!activeSubscreen && activeTab === 'Explore' && (
          <ExploreToolsScreen
            onSelectTool={handleSelectTool}
            onOpenNotifications={() => setActiveSubscreen('care-team')}
            onOpenProfile={() => setActiveTab('You')}
          />
        )}

        {!activeSubscreen && activeTab === 'Plans' && (
          <MealPlansScreen
            onBack={() => setActiveTab('Explore')}
            onViewRecipe={(id) => {
              setSelectedMealId(id);
              setDetailReturnScreen(null);
              setActiveSubscreen('meal-plan-detail');
            }}
            onCustomizePlan={() => setActiveSubscreen('edit-my-plan')}
            onViewBreakdown={() => setActiveSubscreen('nutrition-calculations')}
          />
        )}

        {!activeSubscreen && activeTab === 'You' && (
          <ProfileScreen
            onNavigateToCalculations={() => setActiveSubscreen('nutrition-calculations')}
            onNavigateToGoalSetting={() => setActiveSubscreen('goal-setting-focus')}
            onNavigateToCareTeam={() => setActiveSubscreen('care-team')}
            onNavigateToNutritionistPortal={() => setActiveSubscreen('plan-review-approval')}
            onNavigateToNutritionistEditor={() => {
              setEditorReturnScreen(null);
              setActiveSubscreen('nutritionist-meal-plan-editor');
            }}
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
            onPressAction={() => setActiveSubscreen('goal-setting-focus')}
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
