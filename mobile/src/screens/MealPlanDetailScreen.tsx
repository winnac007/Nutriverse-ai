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
  ClockIcon,
  ChefHatIcon,
  LeafIcon,
  WheatIcon,
  DropIcon,
  FlameIcon,
  UserIcon,
  UtensilsCrossed,
  DumbbellIcon,
  HeartIcon,
  PlusIcon,
} from '../components/Icons';

interface MealPlanDetailScreenProps {
  mealId?: string;
  onBack: () => void;
  onAddToPlan?: () => void;
}

export const MealPlanDetailScreen: React.FC<MealPlanDetailScreenProps> = ({
  mealId = 'moong-dal-chilla',
  onBack,
  onAddToPlan,
}) => {
  const [servings, setServings] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAdjustServings = () => {
    setServings((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from favorites' : 'Saved to favorites',
      'You can easily access this recipe in your Recipe Library.'
    );
  };

  const handleAddPlan = () => {
    if (onAddToPlan) {
      onAddToPlan();
    } else {
      Alert.alert(
        'Added to Plan',
        'Moong Dal Chilla has been scheduled for your Breakfast on Monday.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>
        <Text style={styles.barTitle}>Meal Plan Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Meal Plan Details</Text>
          <Text style={styles.pageSubtitle}>
            Simple, wholesome and tailored to your goals.
          </Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextContent}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>BREAKFAST</Text>
            </View>

            <Text style={styles.heroTitle}>Moong Dal Chilla</Text>
            <Text style={styles.heroSubtitle}>With mint chutney and fresh fruits</Text>
            <Text style={styles.heroDesc}>
              A high-protein, fiber-rich breakfast that keeps you full and energised through the morning.
            </Text>

            {/* 3 Metric Badges */}
            <View style={styles.metricsBadgeRow}>
              <View style={styles.metricItem}>
                <ClockIcon size={12} color="#4A4E46" />
                <View>
                  <Text style={styles.metricItemVal}>15 mins</Text>
                  <Text style={styles.metricItemLbl}>Prep time</Text>
                </View>
              </View>

              <View style={styles.metricItem}>
                <FlameIcon size={12} color="#D97706" />
                <View>
                  <Text style={styles.metricItemVal}>{350 * servings} kcal</Text>
                  <Text style={styles.metricItemLbl}>Calories</Text>
                </View>
              </View>

              <View style={styles.metricItem}>
                <ChefHatIcon size={12} color="#4A4E46" />
                <View>
                  <Text style={styles.metricItemVal}>Easy</Text>
                  <Text style={styles.metricItemLbl}>To cook</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Dish Image */}
          <Image
            source={require('../../assets/images/hero-chilla.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* ── Nutrition per serving ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Nutrition per serving</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Detailed Nutrition',
                'Per serving: 350 kcal | Protein 18g | Carbs 45g | Fat 12g | Fiber 8g | Iron 3.2mg | Magnesium 85mg'
              )
            }
          >
            <Text style={styles.linkText}>View detailed nutrition ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nutritionGrid}>
          {/* Protein */}
          <View style={styles.nutritionCard}>
            <View style={[styles.nutritionIconCircle, { backgroundColor: '#EAF5EC' }]}>
              <LeafIcon size={14} color="#466647" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.nutrValue}>{18 * servings} g</Text>
              <Text style={styles.nutrLabel}>Protein</Text>
            </View>
          </View>

          {/* Carbs */}
          <View style={styles.nutritionCard}>
            <View style={[styles.nutritionIconCircle, { backgroundColor: '#FDF4EB' }]}>
              <WheatIcon size={14} color="#D9822B" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.nutrValue}>{45 * servings} g</Text>
              <Text style={styles.nutrLabel}>Carbs</Text>
            </View>
          </View>

          {/* Fat */}
          <View style={styles.nutritionCard}>
            <View style={[styles.nutritionIconCircle, { backgroundColor: '#F6EFEB' }]}>
              <DropIcon size={14} color="#8B5A2B" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.nutrValue}>{12 * servings} g</Text>
              <Text style={styles.nutrLabel}>Fat</Text>
            </View>
          </View>

          {/* Fiber */}
          <View style={styles.nutritionCard}>
            <View style={[styles.nutritionIconCircle, { backgroundColor: '#EBF4F6' }]}>
              <LeafIcon size={13} color="#3D5C3E" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.nutrValue}>{8 * servings} g</Text>
              <Text style={styles.nutrLabel}>Fiber</Text>
            </View>
          </View>
        </View>

        {/* ── Ingredients (1 serving) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            Ingredients ({servings} {servings > 1 ? 'servings' : 'serving'})
          </Text>
          <TouchableOpacity
            style={styles.adjustServingsBtn}
            onPress={handleAdjustServings}
            activeOpacity={0.8}
          >
            <UserIcon size={11} color="#4A4E46" style={{ marginRight: 4 }} />
            <Text style={styles.adjustServingsText}>Adjust servings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ingredientsGrid}>
          {/* 1. Moong dal */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-moong-dal.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Moong dal</Text>
            <Text style={styles.ingredientQty}>{servings * 0.5} cup (soaked)</Text>
          </View>

          {/* 2. Onion */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-onion.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Onion</Text>
            <Text style={styles.ingredientQty}>{servings * 2} tbsp (chopped)</Text>
          </View>

          {/* 3. Tomato */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-tomato.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Tomato</Text>
            <Text style={styles.ingredientQty}>{servings * 2} tbsp (chopped)</Text>
          </View>

          {/* 4. Coriander */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-coriander.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Coriander</Text>
            <Text style={styles.ingredientQty}>{servings * 2} tbsp (chopped)</Text>
          </View>

          {/* 5. Spices */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-spices.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Spices</Text>
            <Text style={styles.ingredientQty}>½ tsp each (turmeric, cumin)</Text>
          </View>

          {/* 6. Mint chutney */}
          <View style={styles.ingredientItem}>
            <Image
              source={require('../../assets/images/ing-chutney.png')}
              style={styles.ingredientThumb}
            />
            <Text style={styles.ingredientName}>Mint chutney</Text>
            <Text style={styles.ingredientQty}>{servings * 2} tbsp (for serving)</Text>
          </View>
        </View>

        {/* ── Step by step method ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Step by step method</Text>
          <TouchableOpacity
            style={styles.watchVideoBtn}
            onPress={() =>
              Alert.alert(
                'Watch Video',
                'Demonstrating chef technique for crisp golden Moong Dal Chilla.'
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.watchVideoText}>▷ Watch video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.methodCard}>
          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepContentText}>
                Blend soaked moong dal with spices into a smooth batter.
              </Text>
            </View>

            {/* Step 2 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepContentText}>
                Add chopped vegetables and mix well.
              </Text>
            </View>

            {/* Step 3 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepContentText}>
                Cook on a non-stick pan with little oil until golden on both sides.
              </Text>
            </View>

            {/* Step 4 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepContentText}>
                Serve hot with mint chutney and fresh fruits.
              </Text>
            </View>
          </View>

          {/* Leaf corner artwork */}
          <Image
            source={require('../../assets/images/botanical-branch-clean.png')}
            style={styles.methodCornerLeaf}
            resizeMode="contain"
          />
        </View>

        {/* ── More options for you ── */}
        <Text style={[styles.sectionHeading, { marginBottom: 10 }]}>More options for you</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsRow}
        >
          <View style={styles.optionMiniCard}>
            <UtensilsCrossed size={16} color="#3D5C3E" />
            <Text style={styles.optionMiniTitle}>Swap veggies</Text>
            <Text style={styles.optionMiniDesc}>Use seasonal vegetables</Text>
          </View>

          <View style={styles.optionMiniCard}>
            <WheatIcon size={16} color="#D9822B" />
            <Text style={styles.optionMiniTitle}>Gluten-free</Text>
            <Text style={styles.optionMiniDesc}>Naturally gluten-free</Text>
          </View>

          <View style={styles.optionMiniCard}>
            <DumbbellIcon size={16} color="#3D5C3E" />
            <Text style={styles.optionMiniTitle}>Higher protein</Text>
            <Text style={styles.optionMiniDesc}>Add paneer or tofu on side</Text>
          </View>

          <View style={styles.optionMiniCard}>
            <DropIcon size={16} color="#8B5A2B" />
            <Text style={styles.optionMiniTitle}>Low oil option</Text>
            <Text style={styles.optionMiniDesc}>Use minimal oil or spray</Text>
          </View>
        </ScrollView>

        {/* ── Bottom Action Buttons ── */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.saveFavoritesBtn}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <HeartIcon size={14} color={isFavorite ? '#C53030' : '#4A4E46'} style={{ marginRight: 6 }} />
            <Text style={styles.saveFavoritesText}>
              {isFavorite ? 'Favorited' : 'Save to favorites'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addPlanBtn}
            onPress={handleAddPlan}
            activeOpacity={0.85}
          >
            <PlusIcon size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.addPlanText}>Add to my plan</Text>
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
  barTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  titleSection: {
    marginTop: 4,
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
    marginTop: 2,
  },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E4DC',
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
  tagBadge: {
    backgroundColor: '#EAF0E6',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  tagBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#3D5C3E',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555850',
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 11,
    lineHeight: 15,
    color: '#686B63',
    marginTop: 6,
    marginBottom: 12,
  },
  metricsBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  metricItemVal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  metricItemLbl: {
    fontSize: 8,
    color: '#737970',
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 16.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  linkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#5C6E52',
  },
  nutritionGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  nutritionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  nutritionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  nutrLabel: {
    fontSize: 9.5,
    color: '#737970',
  },
  adjustServingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  adjustServingsText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#343831',
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  ingredientItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 8,
    alignItems: 'center',
  },
  ingredientThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1D1A',
    textAlign: 'center',
  },
  ingredientQty: {
    fontSize: 9,
    color: '#737970',
    textAlign: 'center',
    marginTop: 1,
  },
  watchVideoBtn: {
    backgroundColor: '#F3EFE7',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  watchVideoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262923',
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 12,
    paddingRight: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepContentText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#343831',
  },
  methodCornerLeaf: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 80,
    height: 80,
    opacity: 0.35,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  optionMiniCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 10,
    alignItems: 'center',
  },
  optionMiniTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1D1A',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  optionMiniDesc: {
    fontSize: 9.5,
    color: '#737970',
    textAlign: 'center',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveFavoritesBtn: {
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
  saveFavoritesText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  addPlanBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6E52',
    borderRadius: 14,
    paddingVertical: 14,
  },
  addPlanText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

