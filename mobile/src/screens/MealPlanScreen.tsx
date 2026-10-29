import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  SproutIcon,
  InfoIcon,
  CloseIcon,
  CheckIcon,
} from '../components/Icons';

interface MealPlanScreenProps {
  onBack?: () => void;
  onNavigateToCalculations?: () => void;
}

interface MealItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  image: any;
  ingredients: string[];
  instructions: string[];
}

const CATEGORIES = [
  { id: 'my-plan', label: 'My Plan' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'heart-health', label: 'Heart Health' },
  { id: 'weight-loss', label: 'Weight Loss' },
];

const MEALS_DATA: MealItem[] = [
  {
    id: 'moong-dal-chilla',
    tag: 'BREAKFAST',
    title: 'Moong Dal Chilla',
    subtitle: 'With mint chutney and fresh fruits',
    time: '15 mins',
    calories: '350 kcal',
    protein: '18 g',
    carbs: '45 g',
    fat: '12 g',
    image: require('../../assets/images/meal-breakfast.png'),
    ingredients: [
      '1 cup soaked yellow moong dal',
      '1 green chili & 1/2 inch ginger',
      '1/4 cup finely chopped coriander',
      'Pinch of hing (asafoetida) & turmeric',
      '1 tsp cold-pressed sesame oil',
      'Fresh mint coriander chutney for serving',
    ],
    instructions: [
      'Blend soaked moong dal with ginger and green chili to a smooth batter.',
      'Heat a seasoned cast-iron tawa and pour a ladle of batter spreading thinly in a circular motion.',
      'Drizzle a few drops of sesame oil around edges and cook until golden crisp.',
      'Flip gently and cook for another minute. Serve warm with mint chutney.',
    ],
  },
  {
    id: 'greek-yogurt-bowl',
    tag: 'MID-MORNING',
    title: 'Greek Yogurt Bowl',
    subtitle: 'With nuts, seeds and berries',
    time: '5 mins',
    calories: '200 kcal',
    protein: '12 g',
    carbs: '18 g',
    fat: '8 g',
    image: require('../../assets/images/meal-mid-morning.png'),
    ingredients: [
      '150g unflavored Greek yogurt',
      '1 tbsp chia seeds & pumpkin seeds',
      'Handful of blueberries or pomegranates',
      '1 tsp raw organic honey',
    ],
    instructions: [
      'Whisk yogurt until creamy and spoon into a shallow bowl.',
      'Top with berries, roasted seeds and a gentle drizzle of raw honey.',
    ],
  },
  {
    id: 'quinoa-buddha-bowl',
    tag: 'LUNCH',
    title: 'Quinoa Buddha Bowl',
    subtitle: 'With roasted vegetables and tahini dressing',
    time: '20 mins',
    calories: '420 kcal',
    protein: '18 g',
    carbs: '52 g',
    fat: '14 g',
    image: require('../../assets/images/meal-lunch.png'),
    ingredients: [
      '1/2 cup cooked organic tri-color quinoa',
      '1/2 cup roasted zucchini, bell peppers & broccoli',
      '1/3 cup boiled chickpeas',
      '1 tbsp lemon tahini dressing',
    ],
    instructions: [
      'Layer warm fluffy quinoa on base of bowl.',
      'Arrange roasted vegetables and chickpeas in colorful sections.',
      'Drizzle with freshly whisked lemon garlic tahini dressing.',
    ],
  },
  {
    id: 'masala-buttermilk',
    tag: 'EVENING SNACK',
    title: 'Masala Buttermilk',
    subtitle: 'With roasted makhana',
    time: '5 mins',
    calories: '120 kcal',
    protein: '6 g',
    carbs: '14 g',
    fat: '4 g',
    image: require('../../assets/images/meal-evening-snack.png'),
    ingredients: [
      '1 glass freshly churned chaas / buttermilk',
      'Roasted cumin powder, black salt & mint',
      '1 cup air-roasted turmeric foxnuts (makhana)',
    ],
    instructions: [
      'Froth buttermilk with spices and fresh chopped mint leaves.',
      'Enjoy chilled alongside a bowl of warm, lightly spiced makhana.',
    ],
  },
  {
    id: 'paneer-veg-stir-fry',
    tag: 'DINNER',
    title: 'Paneer & Vegetable Stir Fry',
    subtitle: 'With millets or brown rice',
    time: '20 mins',
    calories: '400 kcal',
    protein: '22 g',
    carbs: '48 g',
    fat: '16 g',
    image: require('../../assets/images/meal-dinner.png'),
    ingredients: [
      '100g low-fat fresh cottage cheese (paneer) cubes',
      'Assorted bell peppers, French beans and carrots',
      '1 tsp cold-pressed mustard or olive oil',
      '1/2 cup cooked foxtail millet or brown basmati',
    ],
    instructions: [
      'Pan sear paneer cubes lightly until golden edges appear.',
      'Toss colorful vegetables on high flame with crushed pepper and sea salt.',
      'Fold in paneer cubes and serve over steamed warm millets.',
    ],
  },
];

const DATES = [
  'Mon, 12 Oct',
  'Tue, 13 Oct',
  'Wed, 14 Oct',
  'Thu, 15 Oct',
  'Fri, 16 Oct',
];

export const MealPlanScreen: React.FC<MealPlanScreenProps> = ({
  onBack,
  onNavigateToCalculations,
}) => {
  const [activeCategory, setActiveCategory] = useState('my-plan');
  const [dateIndex, setDateIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);

  const prevDate = () => {
    setDateIndex((prev) => (prev > 0 ? prev - 1 : DATES.length - 1));
  };

  const nextDate = () => {
    setDateIndex((prev) => (prev < DATES.length - 1 ? prev + 1 : 0));
  };

  const handleActivatePlan = () => {
    Alert.alert(
      'Plan Activated! 🌿',
      'This personalized meal plan has been synced with your grocery shopping list and daily health tracker.'
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Top Header ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.calcPill}
          onPress={onNavigateToCalculations}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 13, marginRight: 4 }}>📊</Text>
          <Text style={styles.calcPillText}>Targets & Macros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Meal Plan Builder</Text>
          <Text style={styles.pageSubtitle}>
            Chef-crafted, personalized recipes aligned with your health targets.
          </Text>
        </View>

        {/* Date Selector Header */}
        <View style={styles.dateSelectorCard}>
          <TouchableOpacity style={styles.dateArrow} onPress={prevDate}>
            <ChevronLeftIcon size={20} color="#1C1D1A" />
          </TouchableOpacity>
          <View style={styles.dateCenter}>
            <Text style={styles.dateText}>{DATES[dateIndex]}</Text>
            <Text style={styles.dateSubtext}>Week 1 • Hormonal Reset</Text>
          </View>
          <TouchableOpacity style={styles.dateArrow} onPress={nextDate}>
            <ChevronRightIcon size={20} color="#1C1D1A" />
          </TouchableOpacity>
        </View>

        {/* Category Horizontal Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Daily Target Summary Card */}
        <View style={styles.targetSummaryBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.targetBannerLabel}>Daily Macro Target</Text>
            <Text style={styles.targetBannerCalories}>
              1,490 / 2,000 <Text style={{ fontSize: 13, fontWeight: '400' }}>kcal planned</Text>
            </Text>
          </View>
          <View style={styles.targetProgressCircle}>
            <Text style={styles.targetPercentText}>75%</Text>
          </View>
        </View>

        {/* Meals List */}
        <View style={styles.mealsContainer}>
          {MEALS_DATA.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              style={styles.mealCard}
              onPress={() => setSelectedMeal(meal)}
              activeOpacity={0.88}
            >
              <Image source={meal.image} style={styles.mealImage} resizeMode="cover" />
              <View style={styles.mealContent}>
                <View style={styles.mealTagRow}>
                  <Text style={styles.mealTagText}>{meal.tag}</Text>
                  <View style={styles.timeBadge}>
                    <ClockIcon size={10} color="#737970" />
                    <Text style={styles.timeText}>{meal.time}</Text>
                  </View>
                </View>

                <Text style={styles.mealTitle}>{meal.title}</Text>
                <Text style={styles.mealSubtitle} numberOfLines={1}>
                  {meal.subtitle}
                </Text>

                {/* Macro metrics row */}
                <View style={styles.mealMacroRow}>
                  <Text style={styles.mealCalories}>{meal.calories}</Text>
                  <Text style={styles.macroSeparator}>•</Text>
                  <Text style={styles.mealMacroDetail}>P: {meal.protein}</Text>
                  <Text style={styles.macroSeparator}>•</Text>
                  <Text style={styles.mealMacroDetail}>C: {meal.carbs}</Text>
                  <Text style={styles.macroSeparator}>•</Text>
                  <Text style={styles.mealMacroDetail}>F: {meal.fat}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom CTA Button */}
        <TouchableOpacity
          style={styles.activateButton}
          onPress={handleActivatePlan}
          activeOpacity={0.85}
        >
          <Text style={styles.activateButtonText}>Activate Today's Plan  🌿</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Meal Detail Modal ── */}
      <Modal
        visible={!!selectedMeal}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedMeal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.dragHandle} />

            {selectedMeal && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTag}>{selectedMeal.tag}</Text>
                    <Text style={styles.modalTitle}>{selectedMeal.title}</Text>
                    <Text style={styles.modalSubtitle}>{selectedMeal.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedMeal(null)}
                  >
                    <CloseIcon size={16} color="#1C1D1A" />
                  </TouchableOpacity>
                </View>

                <Image
                  source={selectedMeal.image}
                  style={styles.modalBannerImage}
                  resizeMode="cover"
                />

                {/* Macro badges row */}
                <View style={styles.modalMacroPillRow}>
                  <View style={styles.macroStatBox}>
                    <Text style={styles.macroStatVal}>{selectedMeal.calories}</Text>
                    <Text style={styles.macroStatLabel}>Calories</Text>
                  </View>
                  <View style={styles.macroStatBox}>
                    <Text style={styles.macroStatVal}>{selectedMeal.protein}</Text>
                    <Text style={styles.macroStatLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroStatBox}>
                    <Text style={styles.macroStatVal}>{selectedMeal.carbs}</Text>
                    <Text style={styles.macroStatLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroStatBox}>
                    <Text style={styles.macroStatVal}>{selectedMeal.fat}</Text>
                    <Text style={styles.macroStatLabel}>Healthy Fat</Text>
                  </View>
                </View>

                {/* Ingredients */}
                <Text style={styles.modalSectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsBox}>
                  {selectedMeal.ingredients.map((ing, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <Text style={{ color: Colors.primary, marginRight: 8, fontSize: 14 }}>•</Text>
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                {/* Instructions */}
                <Text style={styles.modalSectionTitle}>Preparation Directions</Text>
                <View style={styles.instructionsBox}>
                  {selectedMeal.instructions.map((step, i) => (
                    <View key={i} style={styles.instructionStep}>
                      <View style={styles.stepNumCircle}>
                        <Text style={styles.stepNumText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setSelectedMeal(null)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.doneButtonText}>Done Reading</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  calcPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0E6',
    borderWidth: 1,
    borderColor: '#D4E1CE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  calcPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  titleSection: {
    marginBottom: 14,
  },
  pageTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#686B63',
    marginTop: 4,
    lineHeight: 18,
  },
  dateSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCenter: {
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  dateSubtext: {
    fontSize: 11,
    color: '#686B63',
    marginTop: 2,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  categoryPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4E46',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  targetSummaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0E6',
    borderWidth: 1,
    borderColor: '#D4E1CE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  targetBannerLabel: {
    fontSize: 11,
    color: '#52604D',
    marginBottom: 2,
  },
  targetBannerCalories: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  targetProgressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  mealsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    overflow: 'hidden',
  },
  mealImage: {
    width: 100,
    height: 100,
  },
  mealContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  mealTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  mealTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#5C6E52',
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 10,
    color: '#737970',
  },
  mealTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  mealSubtitle: {
    fontSize: 11.5,
    color: '#686B63',
    marginBottom: 6,
  },
  mealMacroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#262923',
  },
  macroSeparator: {
    color: '#C5C1B8',
    marginHorizontal: 4,
    fontSize: 10,
  },
  mealMacroDetail: {
    fontSize: 11,
    color: '#686B63',
  },
  activateButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  dragHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1CDC7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5C6E52',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#686B63',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalMacroPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  macroStatBox: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  macroStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  macroStatLabel: {
    fontSize: 10,
    color: '#737970',
    marginTop: 2,
  },
  modalSectionTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 10,
  },
  ingredientsBox: {
    backgroundColor: '#FBF9F5',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#343831',
  },
  instructionsBox: {
    gap: 12,
    marginBottom: 24,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#343831',
  },
  doneButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

