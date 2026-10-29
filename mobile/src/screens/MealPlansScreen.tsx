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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  LeafIcon,
  ChefHatIcon,
  TargetIcon,
} from '../components/Icons';

interface MealPlansScreenProps {
  onBack?: () => void;
  onViewRecipe: (mealId: string) => void;
  onCustomizePlan: () => void;
  onViewBreakdown: () => void;
}

const CATEGORIES = [
  { id: 'my-plan', label: 'My Plan' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'heart-health', label: 'Heart Health' },
  { id: 'weight-loss', label: 'Weight Loss' },
];

export const MealPlansScreen: React.FC<MealPlansScreenProps> = ({
  onBack,
  onViewRecipe,
  onCustomizePlan,
  onViewBreakdown,
}) => {
  const [activeCategory, setActiveCategory] = useState('my-plan');
  const [dateIndex, setDateIndex] = useState(0);

  const dates = [
    'Mon, 12 Oct 2026',
    'Tue, 13 Oct 2026',
    'Wed, 14 Oct 2026',
    'Thu, 15 Oct 2026',
    'Fri, 16 Oct 2026',
  ];

  const handlePrevDate = () => {
    setDateIndex((prev) => (prev > 0 ? prev - 1 : dates.length - 1));
  };

  const handleNextDate = () => {
    setDateIndex((prev) => (prev < dates.length - 1 ? prev + 1 : 0));
  };

  const handleUsePlan = () => {
    Alert.alert(
      'Plan Activated! 🌿',
      'Today’s meal schedule is connected with your health targets, notifications, and grocery list.'
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.howItWorksButton}
          onPress={() =>
            Alert.alert(
              'How It Works',
              'Zenplato plans balance macro ratios, glycemic loads, and clinical botanical ingredients customized to your metabolic profile.'
            )
          }
          activeOpacity={0.7}
        >
          <InfoIcon size={14} color="#555850" />
          <Text style={styles.howItWorksText}>How it works</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Meal Plans</Text>
          <Text style={styles.mainSubtitle}>
            Personalised and flexible plans for your goals.
          </Text>
        </View>

        {/* Category Filter Pills */}
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

        {/* Hero Banner Card */}
        <View style={styles.heroBannerCard}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroKicker}>YOUR PERSONALIZED PLAN</Text>
            <Text style={styles.heroTitle}>Balanced for your unique needs</Text>
            <Text style={styles.heroDesc}>
              Meals crafted around your goals, nutrition targets and food preferences.
            </Text>

            {/* 3 Pills */}
            <View style={styles.heroBadgesRow}>
              <View style={styles.heroBadge}>
                <LeafIcon size={12} color="#466647" />
                <Text style={styles.heroBadgeText}>Wholesome ingredients</Text>
              </View>
              <View style={styles.heroBadge}>
                <ChefHatIcon size={12} color="#466647" />
                <Text style={styles.heroBadgeText}>Easy to cook</Text>
              </View>
              <View style={styles.heroBadge}>
                <Text style={{ fontSize: 11 }}>❤️</Text>
                <Text style={styles.heroBadgeText}>Culturally familiar</Text>
              </View>
            </View>
          </View>

          {/* Mediterranean Bowl Artwork */}
          <Image
            source={require('../../assets/images/banner-bowl.png')}
            style={styles.heroBowlImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Today's Plan Section ── */}
        <View style={styles.planHeaderRow}>
          <Text style={styles.sectionTitle}>Today's plan</Text>

          <View style={styles.datePickerGroup}>
            <View style={styles.dateNavigator}>
              <TouchableOpacity style={styles.dateArrowBtn} onPress={handlePrevDate}>
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.currentDateText}>{dates[dateIndex]}</Text>
              <TouchableOpacity style={styles.dateArrowBtn} onPress={handleNextDate}>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.calendarIconBtn}>
              <Text style={{ fontSize: 16 }}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5 Meal Items */}
        <View style={styles.mealsList}>
          {/* 1. Breakfast */}
          <View style={styles.mealRowCard}>
            <Image
              source={require('../../assets/images/meal-breakfast.png')}
              style={styles.mealThumbnail}
            />
            <View style={styles.mealInfoCol}>
              <Text style={styles.mealSlotLabel}>BREAKFAST</Text>
              <Text style={styles.mealName}>Moong Dal Chilla</Text>
              <Text style={styles.mealSubDesc} numberOfLines={1}>
                With mint chutney and fresh fruits
              </Text>
              <View style={styles.timeCalRow}>
                <View style={styles.inlineIconText}>
                  <ClockIcon size={11} color="#737970" />
                  <Text style={styles.timeCalText}>15 mins</Text>
                </View>
                <View style={[styles.inlineIconText, { marginLeft: 8 }]}>
                  <Text style={{ fontSize: 10 }}>📊</Text>
                  <Text style={styles.timeCalText}>350 kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.mealRightCol}>
              <View style={styles.macroMiniGrid}>
                <Text style={styles.macroVal}>18 g</Text>
                <Text style={styles.macroVal}>45 g</Text>
                <Text style={styles.macroVal}>12 g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>

              <TouchableOpacity
                style={styles.viewRecipeBtn}
                onPress={() => onViewRecipe('moong-dal-chilla')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <Text style={styles.viewRecipeChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Mid-Morning */}
          <View style={styles.mealRowCard}>
            <Image
              source={require('../../assets/images/meal-mid-morning.png')}
              style={styles.mealThumbnail}
            />
            <View style={styles.mealInfoCol}>
              <Text style={styles.mealSlotLabel}>MID-MORNING</Text>
              <Text style={styles.mealName}>Greek Yogurt Bowl</Text>
              <Text style={styles.mealSubDesc} numberOfLines={1}>
                With nuts, seeds and berries
              </Text>
              <View style={styles.timeCalRow}>
                <View style={styles.inlineIconText}>
                  <ClockIcon size={11} color="#737970" />
                  <Text style={styles.timeCalText}>5 mins</Text>
                </View>
                <View style={[styles.inlineIconText, { marginLeft: 8 }]}>
                  <Text style={{ fontSize: 10 }}>📊</Text>
                  <Text style={styles.timeCalText}>200 kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.mealRightCol}>
              <View style={styles.macroMiniGrid}>
                <Text style={styles.macroVal}>12 g</Text>
                <Text style={styles.macroVal}>18 g</Text>
                <Text style={styles.macroVal}>8 g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>

              <TouchableOpacity
                style={styles.viewRecipeBtn}
                onPress={() => onViewRecipe('greek-yogurt-bowl')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <Text style={styles.viewRecipeChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Lunch */}
          <View style={styles.mealRowCard}>
            <Image
              source={require('../../assets/images/meal-lunch.png')}
              style={styles.mealThumbnail}
            />
            <View style={styles.mealInfoCol}>
              <Text style={styles.mealSlotLabel}>LUNCH</Text>
              <Text style={styles.mealName}>Quinoa Buddha Bowl</Text>
              <Text style={styles.mealSubDesc} numberOfLines={1}>
                With roasted vegetables and tahini dressing
              </Text>
              <View style={styles.timeCalRow}>
                <View style={styles.inlineIconText}>
                  <ClockIcon size={11} color="#737970" />
                  <Text style={styles.timeCalText}>20 mins</Text>
                </View>
                <View style={[styles.inlineIconText, { marginLeft: 8 }]}>
                  <Text style={{ fontSize: 10 }}>📊</Text>
                  <Text style={styles.timeCalText}>420 kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.mealRightCol}>
              <View style={styles.macroMiniGrid}>
                <Text style={styles.macroVal}>18 g</Text>
                <Text style={styles.macroVal}>52 g</Text>
                <Text style={styles.macroVal}>14 g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>

              <TouchableOpacity
                style={styles.viewRecipeBtn}
                onPress={() => onViewRecipe('quinoa-buddha-bowl')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <Text style={styles.viewRecipeChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Evening Snack */}
          <View style={styles.mealRowCard}>
            <Image
              source={require('../../assets/images/meal-evening-snack.png')}
              style={styles.mealThumbnail}
            />
            <View style={styles.mealInfoCol}>
              <Text style={styles.mealSlotLabel}>EVENING SNACK</Text>
              <Text style={styles.mealName}>Masala Buttermilk</Text>
              <Text style={styles.mealSubDesc} numberOfLines={1}>
                With roasted makhana
              </Text>
              <View style={styles.timeCalRow}>
                <View style={styles.inlineIconText}>
                  <ClockIcon size={11} color="#737970" />
                  <Text style={styles.timeCalText}>5 mins</Text>
                </View>
                <View style={[styles.inlineIconText, { marginLeft: 8 }]}>
                  <Text style={{ fontSize: 10 }}>📊</Text>
                  <Text style={styles.timeCalText}>120 kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.mealRightCol}>
              <View style={styles.macroMiniGrid}>
                <Text style={styles.macroVal}>6 g</Text>
                <Text style={styles.macroVal}>14 g</Text>
                <Text style={styles.macroVal}>4 g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>

              <TouchableOpacity
                style={styles.viewRecipeBtn}
                onPress={() => onViewRecipe('masala-buttermilk')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <Text style={styles.viewRecipeChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Dinner */}
          <View style={styles.mealRowCard}>
            <Image
              source={require('../../assets/images/meal-dinner.png')}
              style={styles.mealThumbnail}
            />
            <View style={styles.mealInfoCol}>
              <Text style={styles.mealSlotLabel}>DINNER</Text>
              <Text style={styles.mealName}>Paneer & Vegetable Stir Fry</Text>
              <Text style={styles.mealSubDesc} numberOfLines={1}>
                With millets or brown rice
              </Text>
              <View style={styles.timeCalRow}>
                <View style={styles.inlineIconText}>
                  <ClockIcon size={11} color="#737970" />
                  <Text style={styles.timeCalText}>20 mins</Text>
                </View>
                <View style={[styles.inlineIconText, { marginLeft: 8 }]}>
                  <Text style={{ fontSize: 10 }}>📊</Text>
                  <Text style={styles.timeCalText}>400 kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.mealRightCol}>
              <View style={styles.macroMiniGrid}>
                <Text style={styles.macroVal}>22 g</Text>
                <Text style={styles.macroVal}>48 g</Text>
                <Text style={styles.macroVal}>16 g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>

              <TouchableOpacity
                style={styles.viewRecipeBtn}
                onPress={() => onViewRecipe('paneer-veg-stir-fry')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <Text style={styles.viewRecipeChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Daily Nutrition Summary Card ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIconCircle}>
              <Text style={{ fontSize: 14 }}>🎯</Text>
            </View>
            <Text style={styles.summaryHeading}>Daily nutrition summary</Text>
          </View>

          {/* Macro segmented bar */}
          <View style={styles.summaryBar}>
            <View style={[styles.summarySegment, { backgroundColor: '#567252', flex: 20 }]} />
            <View style={[styles.summarySegment, { backgroundColor: '#D9984E', flex: 50 }]} />
            <View style={[styles.summarySegment, { backgroundColor: '#8B6A45', flex: 30 }]} />
          </View>

          {/* Macro values row */}
          <View style={styles.summaryValuesRow}>
            <View>
              <Text style={styles.sumVal}>76 g</Text>
              <Text style={styles.sumLbl}>Protein</Text>
            </View>
            <View>
              <Text style={styles.sumVal}>177 g</Text>
              <Text style={styles.sumLbl}>Carbs</Text>
            </View>
            <View>
              <Text style={styles.sumVal}>52 g</Text>
              <Text style={styles.sumLbl}>Fat</Text>
            </View>
            <View>
              <Text style={styles.sumValBold}>2,000</Text>
              <Text style={styles.sumLbl}>kcal</Text>
            </View>

            <TouchableOpacity
              style={styles.fullBreakdownBtn}
              onPress={onViewBreakdown}
              activeOpacity={0.8}
            >
              <Text style={styles.fullBreakdownText}>View full breakdown →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bottom Dual Action Buttons ── */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.customizeBtn}
            onPress={onCustomizePlan}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, marginRight: 6 }}>⚙️</Text>
            <Text style={styles.customizeBtnText}>Customize my plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.usePlanBtn}
            onPress={handleUsePlan}
            activeOpacity={0.85}
          >
            <Text style={styles.usePlanBtnText}>Use this plan</Text>
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
  howItWorksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: '#E6E1D7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  howItWorksText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3C4039',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  titleSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    fontSize: 13,
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
    borderRadius: 18,
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
  heroBannerCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF5ED',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE3D5',
    padding: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 10,
    zIndex: 2,
  },
  heroKicker: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#737970',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1D1A',
    lineHeight: 25,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#555850',
    marginBottom: 12,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#262923',
  },
  heroBowlImage: {
    width: 130,
    height: 130,
    position: 'absolute',
    right: -15,
    top: 10,
    zIndex: 1,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  datePickerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dateArrowBtn: {
    paddingHorizontal: 6,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555850',
  },
  currentDateText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginHorizontal: 4,
  },
  calendarIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealsList: {
    gap: 12,
    marginBottom: 20,
  },
  mealRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 10,
  },
  mealThumbnail: {
    width: 82,
    height: 82,
    borderRadius: 14,
    marginRight: 10,
  },
  mealInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  mealSlotLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#5C6E52',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  mealSubDesc: {
    fontSize: 10.5,
    color: '#686B63',
    marginBottom: 4,
  },
  timeCalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeCalText: {
    fontSize: 10,
    color: '#737970',
  },
  mealRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 4,
  },
  macroMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 88,
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  macroVal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1C1D1A',
    width: 28,
    textAlign: 'center',
  },
  macroLbl: {
    fontSize: 8,
    color: '#737970',
    width: 28,
    textAlign: 'center',
  },
  viewRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    gap: 2,
  },
  viewRecipeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#262923',
  },
  viewRecipeChevron: {
    fontSize: 12,
    fontWeight: '700',
    color: '#262923',
  },
  summaryCard: {
    backgroundColor: '#F7F4EC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE3D5',
    padding: 14,
    marginBottom: 20,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  summaryIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  summaryBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
    marginBottom: 10,
  },
  summarySegment: {
    borderRadius: 2,
  },
  summaryValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sumVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sumValBold: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sumLbl: {
    fontSize: 9.5,
    color: '#737970',
  },
  fullBreakdownBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCD6CA',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  fullBreakdownText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#262923',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  customizeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCD6CA',
    borderRadius: 14,
    paddingVertical: 14,
  },
  customizeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  usePlanBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6E52',
    borderRadius: 14,
    paddingVertical: 14,
  },
  usePlanBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

