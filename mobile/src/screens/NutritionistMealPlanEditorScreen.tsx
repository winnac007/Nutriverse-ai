import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ClockIcon,
  ChevronDownIcon,
  CheckIcon,
  CloseIcon,
  PencilIcon,
  CalendarIcon,
  MealIcon,
  EyeIcon,
  SparkleIcon,
  PlusIcon,
  PlanIcon,
} from '../components/Icons';

interface NutritionistMealPlanEditorScreenProps {
  onBack: () => void;
  onPreviewForClient?: () => void;
}

const DAYS = [
  'Mon 12 Oct',
  'Tue 13 Oct',
  'Wed 14 Oct',
  'Thu 15 Oct',
  'Fri 16 Oct',
  'Sat 17 Oct',
  'Sun 18 Oct',
];

const SUBTABS = ['Meal Plan', 'Nutrition Targets', 'Progress', 'Notes', 'Consultations'];

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  image: any;
}

export const NutritionistMealPlanEditorScreen: React.FC<NutritionistMealPlanEditorScreenProps> = ({
  onBack,
  onPreviewForClient,
}) => {
  const [activeSubtab, setActiveSubtab] = useState('Meal Plan');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeSectionView, setActiveSectionView] = useState<'meals' | 'settings_notes'>('meals');

  // Expanded meal editor state
  const [expandedMeal, setExpandedMeal] = useState<string | null>('Breakfast');

  // Breakfast editing state
  const [breakfastPrepTime, setBreakfastPrepTime] = useState('15 mins');
  const [breakfastCalories, setBreakfastCalories] = useState('350 kcal');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: '1',
      name: 'Moong dal (soaked)',
      amount: '½ cup',
      image: require('../../assets/images/ing-moong-dal.png'),
    },
    {
      id: '2',
      name: 'Onion (chopped)',
      amount: '2 tbsp',
      image: require('../../assets/images/ing-onion.png'),
    },
    {
      id: '3',
      name: 'Tomato (chopped)',
      amount: '2 tbsp',
      image: require('../../assets/images/ing-tomato.png'),
    },
    {
      id: '4',
      name: 'Coriander',
      amount: '2 tbsp',
      image: require('../../assets/images/ing-coriander.png'),
    },
    {
      id: '5',
      name: 'Spices',
      amount: '½ tsp',
      image: require('../../assets/images/ing-spices.png'),
    },
    {
      id: '6',
      name: 'Mint chutney',
      amount: '2 tbsp',
      image: require('../../assets/images/ing-chutney.png'),
    },
  ]);

  // Sidebar / Settings state
  const [planType, setPlanType] = useState('Weight management');
  const [cuisinePreference, setCuisinePreference] = useState('Indian (Vegetarian)');
  const [dietPattern, setDietPattern] = useState('Balanced');
  const [syncWithClient, setSyncWithClient] = useState(true);

  // Notes state
  const [clientNotes, setClientNotes] = useState(
    'Focus on balanced meals, stay hydrated and include seasonal vegetables. You can swap similar ingredients based on availability.'
  );
  const [internalNotes, setInternalNotes] = useState(
    'Client prefers simple recipes. Avoid overly spicy food. Monitor energy levels and update after 2 weeks.'
  );

  // AI suggestions applied state
  const [aiApplied, setAiApplied] = useState<{ [key: string]: boolean }>({});

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddIngredient = () => {
    Alert.prompt
      ? Alert.prompt('Add Ingredient', 'Enter name and portion (e.g. Grated paneer - 2 tbsp):', (text) => {
          if (text) {
            setIngredients((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                name: text,
                amount: '1 serving',
                image: require('../../assets/images/ing-coriander.png'),
              },
            ]);
          }
        })
      : Alert.alert('Add Ingredient', 'Adding Flaxseeds (1 tsp) to breakfast.');
  };

  const handleApplyAiSuggestion = (key: string, label: string) => {
    setAiApplied((prev) => ({ ...prev, [key]: true }));
    Alert.alert('AI Clinical Rule Applied', `${label} has been integrated into today's meal blueprint.`);
  };

  const handleUpdateMeal = () => {
    Alert.alert('Meal Updated', 'Breakfast recipe, portions, and macros saved successfully!');
  };

  const handleSaveChanges = () => {
    Alert.alert('Saved', 'All meal plan modifications have been saved as draft.');
  };

  const handleSendToClient = () => {
    Alert.alert(
      'Sent for Client Approval',
      'The personalized nutrition blueprint has been dispatched to Riya Sharma with your clinical recommendations.'
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Top Navigation Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewAsClientBtn}
          onPress={onPreviewForClient || onBack}
          activeOpacity={0.8}
        >
          <EyeIcon size={14} color="#3D5C3E" style={{ marginRight: 5 }} />
          <Text style={styles.viewAsClientText}>View as Client</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Title */}
        <View style={styles.headerTitleBox}>
          <Text style={styles.backToClientLink} onPress={onBack}>
            ‹ Back to client
          </Text>
          <Text style={styles.pageTitle}>Edit Meal Plan</Text>
          <Text style={styles.pageSubtitle}>
            Customize meals, portions and timings for Riya.
          </Text>
        </View>

        {/* ── Client Profile Card ── */}
        <View style={styles.clientCard}>
          <Image
            source={require('../../assets/images/coach-client-priya.png')}
            style={styles.clientAvatar}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.clientName}>Riya Sharma</Text>
            <Text style={styles.clientTags}>26 years • PCOS • Weight management</Text>
          </View>
          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => Alert.alert('Client Profile', 'Opening Riya Sharma’s medical & biometric history.')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewProfileBtnText}>View full profile →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Sub Navigation Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabsContainer}
        >
          {SUBTABS.map((tab) => {
            const isActive = tab === activeSubtab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.subTabPill, isActive && styles.subTabPillActive]}
                onPress={() => setActiveSubtab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.subTabText,
                    isActive && styles.subTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Day Selector Row ── */}
        <View style={styles.daySelectorRow}>
          <TouchableOpacity
            style={styles.dayNavArrow}
            onPress={() => setActiveDayIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeDayIndex === 0}
          >
            <Text style={[styles.dayNavArrowText, activeDayIndex === 0 && { color: '#C8CCC4' }]}>‹</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {DAYS.map((day, idx) => {
              const isSelected = idx === activeDayIndex;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayPill, isSelected && styles.dayPillActive]}
                  onPress={() => setActiveDayIndex(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayPillText, isSelected && styles.dayPillTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.dayNavArrow}
            onPress={() => setActiveDayIndex((prev) => Math.min(DAYS.length - 1, prev + 1))}
            disabled={activeDayIndex === DAYS.length - 1}
          >
            <Text style={[styles.dayNavArrowText, activeDayIndex === DAYS.length - 1 && { color: '#C8CCC4' }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section Segment Switcher (Meals vs Plan Settings & Notes) */}
        <View style={styles.sectionSwitchRow}>
          <TouchableOpacity
            style={[
              styles.sectionSwitchBtn,
              activeSectionView === 'meals' && styles.sectionSwitchBtnActive,
            ]}
            onPress={() => setActiveSectionView('meals')}
          >
            <Text
              style={[
                styles.sectionSwitchText,
                activeSectionView === 'meals' && styles.sectionSwitchTextActive,
              ]}
            >
              Daily Meals ({DAYS[activeDayIndex]})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sectionSwitchBtn,
              activeSectionView === 'settings_notes' && styles.sectionSwitchBtnActive,
            ]}
            onPress={() => setActiveSectionView('settings_notes')}
          >
            <Text
              style={[
                styles.sectionSwitchText,
                activeSectionView === 'settings_notes' && styles.sectionSwitchTextActive,
              ]}
            >
              Targets & Notes
            </Text>
          </TouchableOpacity>
        </View>

        {activeSectionView === 'meals' ? (
          <>
            {/* ── 1. Breakfast (Expanded Editor State) ── */}
            <View style={styles.expandedMealCard}>
              {/* Header row */}
              <View style={styles.mealCardTopHeader}>
                <View style={styles.mealTimeGroup}>
                  <ClockIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
                  <Text style={styles.mealNameLabel}>Breakfast</Text>
                  <Text style={styles.mealTimeLabel}>8:00 AM</Text>
                </View>

                <View style={styles.mealActionIconsRow}>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Replace Breakfast', 'Opening recipe library for healthy breakfast swaps.')}
                  >
                    <Text style={styles.actionIconText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Copy Breakfast', 'Copied recipe to clipboard to paste into other days.')}
                  >
                    <Text style={styles.actionIconText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Remove Breakfast', 'Clear this meal slot?')}
                  >
                    <Text style={[styles.actionIconText, { color: '#DC2626' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dish info & image */}
              <View style={styles.dishHeaderRow}>
                <Image
                  source={require('../../assets/images/meal-chilla.png')}
                  style={styles.expandedDishImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.dishTitle}>Moong Dal Chilla</Text>
                  <Text style={styles.dishSubtitle}>With mint chutney and fresh fruits</Text>
                </View>
              </View>

              {/* Ingredients Table */}
              <View style={styles.ingredientsEditorBox}>
                <View style={styles.ingEditorHeader}>
                  <Text style={styles.ingEditorTitle}>Ingredients (1 serving)</Text>
                </View>

                {ingredients.map((ing) => (
                  <View key={ing.id} style={styles.ingTableRow}>
                    <Image source={ing.image} style={styles.ingRowThumb} />
                    <Text style={styles.ingRowName}>{ing.name}</Text>
                    <Text style={styles.ingRowAmount}>{ing.amount}</Text>
                    <TouchableOpacity
                      style={styles.ingRemoveBtn}
                      onPress={() => handleRemoveIngredient(ing.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.ingRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addIngBtn}
                  onPress={handleAddIngredient}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addIngText}>+ Add ingredient</Text>
                </TouchableOpacity>
              </View>

              {/* Prep time & Calories pickers */}
              <View style={styles.prepTimeCalRow}>
                <View style={styles.dropdownPickerBox}>
                  <Text style={styles.dropdownPickerLabel}>⏱️ Prep time</Text>
                  <TouchableOpacity
                    style={styles.pickerSelector}
                    onPress={() =>
                      Alert.alert('Prep time', 'Choose prep time', [
                        { text: '10 mins', onPress: () => setBreakfastPrepTime('10 mins') },
                        { text: '15 mins', onPress: () => setBreakfastPrepTime('15 mins') },
                        { text: '20 mins', onPress: () => setBreakfastPrepTime('20 mins') },
                      ])
                    }
                  >
                    <Text style={styles.pickerSelectorText}>{breakfastPrepTime}</Text>
                    <ChevronDownIcon size={12} color="#737970" />
                  </TouchableOpacity>
                </View>

                <View style={styles.dropdownPickerBox}>
                  <Text style={styles.dropdownPickerLabel}>Calories</Text>
                  <TouchableOpacity
                    style={styles.pickerSelector}
                    onPress={() =>
                      Alert.alert('Calories', 'Choose target calorie', [
                        { text: '300 kcal', onPress: () => setBreakfastCalories('300 kcal') },
                        { text: '350 kcal', onPress: () => setBreakfastCalories('350 kcal') },
                        { text: '400 kcal', onPress: () => setBreakfastCalories('400 kcal') },
                      ])
                    }
                  >
                    <Text style={styles.pickerSelectorText}>{breakfastCalories}</Text>
                    <ChevronDownIcon size={12} color="#737970" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Macros Breakdown */}
              <View style={styles.macrosBox}>
                <Text style={styles.macrosBoxLabel}>Macros (per serving)</Text>
                <View style={styles.macrosRow}>
                  <View style={styles.macroPill}>
                    <View style={[styles.macroDot, { backgroundColor: '#8B5CF6' }]} />
                    <Text style={styles.macroName}>Protein</Text>
                    <Text style={styles.macroVal}>18 g</Text>
                  </View>
                  <View style={styles.macroPill}>
                    <View style={[styles.macroDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.macroName}>Carbs</Text>
                    <Text style={styles.macroVal}>45 g</Text>
                  </View>
                  <View style={styles.macroPill}>
                    <View style={[styles.macroDot, { backgroundColor: '#EC4899' }]} />
                    <Text style={styles.macroName}>Fat</Text>
                    <Text style={styles.macroVal}>12 g</Text>
                  </View>
                </View>
              </View>

              {/* Update Meal Button */}
              <TouchableOpacity
                style={styles.updateMealBtn}
                onPress={handleUpdateMeal}
                activeOpacity={0.85}
              >
                <Text style={styles.updateMealBtnText}>Update meal</Text>
              </TouchableOpacity>
            </View>

            {/* ── 2. Mid-morning Meal Card ── */}
            <View style={styles.standardMealCard}>
              <View style={styles.mealCardTopHeader}>
                <View style={styles.mealTimeGroup}>
                  <ClockIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
                  <Text style={styles.mealNameLabel}>Mid-morning</Text>
                  <Text style={styles.mealTimeLabel}>11:00 AM</Text>
                </View>
                <View style={styles.mealActionIconsRow}>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={[styles.actionIconText, { color: '#DC2626' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dishHeaderRow}>
                <Image
                  source={require('../../assets/images/meal-yogurt.png')}
                  style={styles.standardDishImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.dishTitle}>Greek Yogurt Bowl</Text>
                  <Text style={styles.dishSubtitle}>With nuts, seeds and berries</Text>

                  <View style={styles.quickStatsRow}>
                    <Text style={styles.quickStatText}>⏱️ 5 mins</Text>
                    <Text style={styles.quickStatText}>200 kcal</Text>
                    <Text style={styles.quickStatText}>P: 12g • C: 18g • F: 8g</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editMealBtnOutlined}
                onPress={() => setExpandedMeal('Mid-morning')}
              >
                <Text style={styles.editMealBtnText}>Edit meal</Text>
              </TouchableOpacity>
            </View>

            {/* ── 3. Lunch Meal Card ── */}
            <View style={styles.standardMealCard}>
              <View style={styles.mealCardTopHeader}>
                <View style={styles.mealTimeGroup}>
                  <ClockIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
                  <Text style={styles.mealNameLabel}>Lunch</Text>
                  <Text style={styles.mealTimeLabel}>1:30 PM</Text>
                </View>
                <View style={styles.mealActionIconsRow}>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={[styles.actionIconText, { color: '#DC2626' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dishHeaderRow}>
                <Image
                  source={require('../../assets/images/meal-quinoa.png')}
                  style={styles.standardDishImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.dishTitle}>Quinoa Buddha Bowl</Text>
                  <Text style={styles.dishSubtitle}>With roasted vegetables and tahini dressing</Text>

                  <View style={styles.quickStatsRow}>
                    <Text style={styles.quickStatText}>⏱️ 20 mins</Text>
                    <Text style={styles.quickStatText}>420 kcal</Text>
                    <Text style={styles.quickStatText}>P: 18g • C: 52g • F: 14g</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editMealBtnOutlined}
                onPress={() => setExpandedMeal('Lunch')}
              >
                <Text style={styles.editMealBtnText}>Edit meal</Text>
              </TouchableOpacity>
            </View>

            {/* ── 4. Evening Snack Meal Card ── */}
            <View style={styles.standardMealCard}>
              <View style={styles.mealCardTopHeader}>
                <View style={styles.mealTimeGroup}>
                  <ClockIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
                  <Text style={styles.mealNameLabel}>Evening Snack</Text>
                  <Text style={styles.mealTimeLabel}>4:30 PM</Text>
                </View>
                <View style={styles.mealActionIconsRow}>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={[styles.actionIconText, { color: '#DC2626' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dishHeaderRow}>
                <Image
                  source={require('../../assets/images/meal-buttermilk.png')}
                  style={styles.standardDishImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.dishTitle}>Masala Buttermilk</Text>
                  <Text style={styles.dishSubtitle}>With roasted makhana</Text>

                  <View style={styles.quickStatsRow}>
                    <Text style={styles.quickStatText}>⏱️ 5 mins</Text>
                    <Text style={styles.quickStatText}>120 kcal</Text>
                    <Text style={styles.quickStatText}>P: 6g • C: 14g • F: 4g</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editMealBtnOutlined}
                onPress={() => setExpandedMeal('Evening Snack')}
              >
                <Text style={styles.editMealBtnText}>Edit meal</Text>
              </TouchableOpacity>
            </View>

            {/* ── 5. Dinner Meal Card ── */}
            <View style={styles.standardMealCard}>
              <View style={styles.mealCardTopHeader}>
                <View style={styles.mealTimeGroup}>
                  <ClockIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
                  <Text style={styles.mealNameLabel}>Dinner</Text>
                  <Text style={styles.mealTimeLabel}>7:30 PM</Text>
                </View>
                <View style={styles.mealActionIconsRow}>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={styles.actionIconText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn}>
                    <Text style={[styles.actionIconText, { color: '#DC2626' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dishHeaderRow}>
                <Image
                  source={require('../../assets/images/meal-paneer.png')}
                  style={styles.standardDishImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.dishTitle}>Paneer & Vegetable Stir Fry</Text>
                  <Text style={styles.dishSubtitle}>With millets or brown rice</Text>

                  <View style={styles.quickStatsRow}>
                    <Text style={styles.quickStatText}>⏱️ 20 mins</Text>
                    <Text style={styles.quickStatText}>400 kcal</Text>
                    <Text style={styles.quickStatText}>P: 22g • C: 48g • F: 16g</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editMealBtnOutlined}
                onPress={() => setExpandedMeal('Dinner')}
              >
                <Text style={styles.editMealBtnText}>Edit meal</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Actions under Meal list */}
            <View style={styles.mealListExtraActions}>
              <TouchableOpacity
                style={styles.extraActionCard}
                onPress={() => Alert.alert('Add Meal', 'Adding custom meal or hydration slot.')}
              >
                <PlusIcon size={16} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.extraActionTitle}>Add new meal</Text>
                  <Text style={styles.extraActionSub}>Add a meal, snack or drink</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.extraActionCard}
                onPress={() => Alert.alert('Recipe Library', 'Exploring condition-specific therapeutic recipes.')}
              >
                <PlanIcon size={16} color="#3D5C3E" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.extraActionTitle}>Browse recipes</Text>
                  <Text style={styles.extraActionSub}>Explore condition-specific recipes</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        {/* ── Section: Plan Settings, Daily Targets, AI & Notes ── */}
        {(activeSectionView === 'settings_notes' || activeSectionView === 'meals') && (
          <View style={styles.settingsAndNotesContainer}>
            {/* Plan Settings Card */}
            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarSectionTitle}>Plan settings</Text>

              <View style={styles.settingField}>
                <Text style={styles.settingLabel}>Plan type</Text>
                <TouchableOpacity
                  style={styles.settingDropdown}
                  onPress={() =>
                    Alert.alert('Plan Type', 'Select plan type', [
                      { text: 'Weight management', onPress: () => setPlanType('Weight management') },
                      { text: 'PCOS hormonal balance', onPress: () => setPlanType('PCOS hormonal balance') },
                      { text: 'Diabetes management', onPress: () => setPlanType('Diabetes management') },
                    ])
                  }
                >
                  <Text style={styles.settingDropdownValue}>{planType}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingField}>
                <Text style={styles.settingLabel}>Cuisine preference</Text>
                <TouchableOpacity
                  style={styles.settingDropdown}
                  onPress={() =>
                    Alert.alert('Cuisine', 'Select cuisine', [
                      { text: 'Indian (Vegetarian)', onPress: () => setCuisinePreference('Indian (Vegetarian)') },
                      { text: 'Mediterranean', onPress: () => setCuisinePreference('Mediterranean') },
                      { text: 'Continental', onPress: () => setCuisinePreference('Continental') },
                    ])
                  }
                >
                  <Text style={styles.settingDropdownValue}>{cuisinePreference}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingField}>
                <Text style={styles.settingLabel}>Diet pattern</Text>
                <TouchableOpacity
                  style={styles.settingDropdown}
                  onPress={() =>
                    Alert.alert('Diet pattern', 'Select pattern', [
                      { text: 'Balanced', onPress: () => setDietPattern('Balanced') },
                      { text: 'Low GI / High Fiber', onPress: () => setDietPattern('Low GI / High Fiber') },
                      { text: 'Keto / Low Carb', onPress: () => setDietPattern('Keto / Low Carb') },
                    ])
                  }
                >
                  <Text style={styles.settingDropdownValue}>{dietPattern}</Text>
                  <ChevronDownIcon size={12} color="#737970" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Daily Nutrition Targets Card */}
            <View style={styles.sidebarCard}>
              <View style={styles.targetsHeaderRow}>
                <Text style={styles.sidebarSectionTitle}>Daily nutrition targets</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Edit Targets', 'Adjust calorie and macro distribution for Riya.')}
                >
                  <PencilIcon size={12} color="#3D5C3E" />
                </TouchableOpacity>
              </View>

              <View style={styles.targetsList}>
                <View style={styles.targetRow}>
                  <View style={[styles.targetDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.targetName}>Calories</Text>
                  <Text style={styles.targetValue}>2,000 kcal</Text>
                </View>

                <View style={styles.targetRow}>
                  <View style={[styles.targetDot, { backgroundColor: '#F97316' }]} />
                  <Text style={styles.targetName}>Protein</Text>
                  <Text style={styles.targetValue}>100 g <Text style={styles.targetPct}>(20%)</Text></Text>
                </View>

                <View style={styles.targetRow}>
                  <View style={[styles.targetDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.targetName}>Carbs</Text>
                  <Text style={styles.targetValue}>250 g <Text style={styles.targetPct}>(50%)</Text></Text>
                </View>

                <View style={styles.targetRow}>
                  <View style={[styles.targetDot, { backgroundColor: '#8B5A2B' }]} />
                  <Text style={styles.targetName}>Fat</Text>
                  <Text style={styles.targetValue}>67 g <Text style={styles.targetPct}>(30%)</Text></Text>
                </View>
              </View>
            </View>

            {/* Sync with Client App Toggle */}
            <View style={styles.sidebarCard}>
              <View style={styles.syncRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.syncTitle}>Sync with client app</Text>
                  <Text style={styles.syncSub}>Changes will be visible to the client after approval.</Text>
                </View>
                <Switch
                  value={syncWithClient}
                  onValueChange={setSyncWithClient}
                  trackColor={{ false: '#D9DCD6', true: '#5C6E52' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* AI Suggestions Card */}
            <View style={styles.sidebarCard}>
              <View style={styles.aiHeaderRow}>
                <SparkleIcon size={14} color="#3D5C3E" style={{ marginRight: 6 }} />
                <Text style={styles.sidebarSectionTitle}>AI suggestions</Text>
              </View>

              <View style={styles.aiSuggestionItem}>
                <Text style={styles.aiSuggestionText}>
                  Add more iron-rich foods for PCOS support
                </Text>
                <TouchableOpacity
                  style={[styles.aiAddBtn, aiApplied['iron'] && styles.aiAddBtnDone]}
                  onPress={() => handleApplyAiSuggestion('iron', 'Iron-rich foods')}
                >
                  <Text style={[styles.aiAddBtnText, aiApplied['iron'] && styles.aiAddBtnTextDone]}>
                    {aiApplied['iron'] ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.aiSuggestionItem}>
                <Text style={styles.aiSuggestionText}>
                  Increase fibre at dinner to improve satiety
                </Text>
                <TouchableOpacity
                  style={[styles.aiAddBtn, aiApplied['fibre'] && styles.aiAddBtnDone]}
                  onPress={() => handleApplyAiSuggestion('fibre', 'Fiber boost')}
                >
                  <Text style={[styles.aiAddBtnText, aiApplied['fibre'] && styles.aiAddBtnTextDone]}>
                    {aiApplied['fibre'] ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.aiSuggestionItem}>
                <Text style={styles.aiSuggestionText}>
                  Suggest seasonal alternatives
                </Text>
                <TouchableOpacity
                  style={[styles.aiAddBtn, aiApplied['seasonal'] && styles.aiAddBtnDone]}
                  onPress={() => handleApplyAiSuggestion('seasonal', 'Seasonal swap')}
                >
                  <Text style={[styles.aiAddBtnText, aiApplied['seasonal'] && styles.aiAddBtnTextDone]}>
                    {aiApplied['seasonal'] ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes for Client */}
            <View style={styles.sidebarCard}>
              <View style={styles.notesHeaderRow}>
                <Text style={styles.sidebarSectionTitle}>Notes for client</Text>
                <Text style={styles.notesOptionalTag}>(optional)</Text>
              </View>
              <TextInput
                style={styles.notesTextArea}
                multiline
                numberOfLines={3}
                value={clientNotes}
                onChangeText={setClientNotes}
                placeholder="Write recommendations or tips for Riya..."
              />
              <Text style={styles.charCountText}>{clientNotes.length}/500</Text>
            </View>

            {/* Internal Notes */}
            <View style={styles.sidebarCard}>
              <View style={styles.notesHeaderRow}>
                <Text style={styles.sidebarSectionTitle}>Internal notes</Text>
                <Text style={styles.notesOptionalTag}>(for consultants only)</Text>
              </View>
              <TextInput
                style={styles.notesTextArea}
                multiline
                numberOfLines={3}
                value={internalNotes}
                onChangeText={setInternalNotes}
                placeholder="Private clinical reminders, next labs to review..."
              />
              <Text style={styles.charCountText}>{internalNotes.length}/500</Text>
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Sticky Bar ── */}
      <View style={styles.bottomBarContainer}>
        {/* Nutritionist Pill */}
        <View style={styles.nutritionistPill}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.nutritionistAvatar}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.nutriName}>Dr. Meera</Text>
            <Text style={styles.nutriRole}>Nutritionist</Text>
          </View>
          <TouchableOpacity
            style={styles.nutriMenuDots}
            onPress={() => Alert.alert('Consultant Actions', 'Switch profile, export PDF, or consult colleague.')}
          >
            <Text style={{ fontSize: 16, color: '#737970' }}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.bottomActionButtons}>
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={onPreviewForClient || onBack}
            activeOpacity={0.8}
          >
            <EyeIcon size={13} color="#3D5C3E" style={{ marginRight: 4 }} />
            <Text style={styles.previewBtnText}>Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveDraftBtn}
            onPress={handleSaveChanges}
            activeOpacity={0.8}
          >
            <CheckIcon size={13} color="#3D5C3E" style={{ marginRight: 4 }} />
            <Text style={styles.saveDraftBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendApprovalBtn}
            onPress={handleSendToClient}
            activeOpacity={0.85}
          >
            <Text style={styles.sendApprovalBtnText}>Send to client →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7EE',
  },
  topBar: {
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7EE',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E4DD',
  },
  viewAsClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8DEC8',
  },
  viewAsClientText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
  },
  headerTitleBox: {
    marginBottom: 14,
  },
  backToClientLink: {
    fontSize: 12,
    color: '#5C6E52',
    fontWeight: '600',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#5A5F56',
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5DD',
    marginBottom: 14,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
  },
  clientTags: {
    fontSize: 11,
    color: '#737970',
    marginTop: 2,
  },
  viewProfileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3EFE6',
  },
  viewProfileBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  subTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingVertical: 2,
  },
  subTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  subTabPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5F56',
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  daySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayNavArrow: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNavArrowText: {
    fontSize: 22,
    color: '#1C1D1A',
    fontWeight: '600',
  },
  daysScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  dayPillActive: {
    backgroundColor: '#3D5C3E',
    borderColor: '#3D5C3E',
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5F56',
  },
  dayPillTextActive: {
    color: '#FFFFFF',
  },
  sectionSwitchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  sectionSwitchBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  sectionSwitchBtnActive: {
    backgroundColor: '#EAF0E6',
    borderColor: '#3D5C3E',
  },
  sectionSwitchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737970',
  },
  sectionSwitchTextActive: {
    color: '#2A422B',
  },
  expandedMealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#3D5C3E',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  mealCardTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE6',
  },
  mealTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealNameLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
    marginRight: 6,
  },
  mealTimeLabel: {
    fontSize: 12,
    color: '#737970',
  },
  mealActionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  actionIconText: {
    fontSize: 11,
    color: '#5C6E52',
    fontWeight: '600',
  },
  dishHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  expandedDishImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
  },
  standardDishImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
  },
  dishSubtitle: {
    fontSize: 12,
    color: '#737970',
    marginTop: 2,
  },
  ingredientsEditorBox: {
    backgroundColor: '#FAF7EE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  ingEditorHeader: {
    marginBottom: 8,
  },
  ingEditorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  ingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE2',
  },
  ingRowThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  ingRowName: {
    flex: 1,
    fontSize: 12,
    color: '#1C1D1A',
  },
  ingRowAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C6E52',
    marginRight: 10,
  },
  ingRemoveBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingRemoveText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  addIngBtn: {
    paddingTop: 10,
    alignItems: 'center',
  },
  addIngText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  prepTimeCalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  dropdownPickerBox: {
    flex: 1,
  },
  dropdownPickerLabel: {
    fontSize: 11,
    color: '#737970',
    marginBottom: 4,
    fontWeight: '600',
  },
  pickerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7EE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  pickerSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  macrosBox: {
    backgroundColor: '#FAF7EE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  macrosBoxLabel: {
    fontSize: 11,
    color: '#737970',
    marginBottom: 6,
    fontWeight: '600',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroName: {
    fontSize: 11,
    color: '#5A5F56',
  },
  macroVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  updateMealBtn: {
    backgroundColor: '#5C6E52',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateMealBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  standardMealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E5DD',
    marginBottom: 12,
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  quickStatText: {
    fontSize: 10,
    color: '#737970',
    backgroundColor: '#FAF7EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  editMealBtnOutlined: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5C6E52',
  },
  editMealBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C6E52',
  },
  mealListExtraActions: {
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  extraActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5DD',
    borderStyle: 'dashed',
  },
  extraActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  extraActionSub: {
    fontSize: 11,
    color: '#737970',
  },
  settingsAndNotesContainer: {
    gap: 12,
    marginTop: 6,
  },
  sidebarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  sidebarSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  settingField: {
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 11,
    color: '#737970',
    marginBottom: 4,
  },
  settingDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7EE',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  settingDropdownValue: {
    fontSize: 13,
    color: '#1C1D1A',
    fontWeight: '600',
  },
  targetsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetsList: {
    gap: 8,
    marginTop: 4,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  targetName: {
    flex: 1,
    fontSize: 12,
    color: '#5A5F56',
  },
  targetValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  targetPct: {
    fontSize: 11,
    fontWeight: '400',
    color: '#737970',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  syncSub: {
    fontSize: 11,
    color: '#737970',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE6',
  },
  aiSuggestionText: {
    flex: 1,
    fontSize: 12,
    color: '#1C1D1A',
    paddingRight: 10,
    lineHeight: 16,
  },
  aiAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#EAF0E6',
    borderWidth: 1,
    borderColor: '#C6D6C0',
  },
  aiAddBtnDone: {
    backgroundColor: '#3D5C3E',
    borderColor: '#3D5C3E',
  },
  aiAddBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  aiAddBtnTextDone: {
    color: '#FFFFFF',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  notesOptionalTag: {
    fontSize: 11,
    color: '#737970',
  },
  notesTextArea: {
    backgroundColor: '#FAF7EE',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: '#1C1D1A',
    borderWidth: 1,
    borderColor: '#E8E5DD',
    textAlignVertical: 'top',
    minHeight: 64,
  },
  charCountText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5DD',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  nutritionistPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutritionistAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  nutriName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  nutriRole: {
    fontSize: 10,
    color: '#737970',
  },
  nutriMenuDots: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
  },
  bottomActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  previewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#E8E5DD',
  },
  saveDraftBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  sendApprovalBtn: {
    flex: 1,
    backgroundColor: '#3D5C3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  sendApprovalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

