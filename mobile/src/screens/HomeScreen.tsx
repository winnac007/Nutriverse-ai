import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  SproutIcon,
  BellIcon,
  FlameIcon,
  ClockIcon,
  ChevronRightIcon,
  LeafIcon,
} from '../components/Icons';

interface HomeScreenProps {
  onNavigateToExplore: () => void;
  onNavigateToMealPlan: () => void;
  onNavigateToCalculations: () => void;
  onNavigateToCareTeam: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToExplore,
  onNavigateToMealPlan,
  onNavigateToCalculations,
  onNavigateToCareTeam,
}) => {
  return (
    <View style={styles.container}>
      {/* ── Top App Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={{ fontSize: 22, marginRight: 6 }}>🌱</Text>
          <View>
            <Text style={styles.greetingText}>Good afternoon,</Text>
            <Text style={styles.brandTitle}>Zenplato Living</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.avatarPill} onPress={onNavigateToCareTeam}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.avatarImg}
          />
          <Text style={styles.avatarLabel}>Dr. Ananya</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Streak & Daily Overview Card */}
        <View style={styles.streakBanner}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakCount}>🔥 5 Day Streak</Text>
            <Text style={styles.streakSubtitle}>
              Mindful nutrition habits in rhythm
            </Text>
          </View>
          <TouchableOpacity
            style={styles.streakPill}
            onPress={onNavigateToCalculations}
            activeOpacity={0.8}
          >
            <Text style={styles.streakPillText}>View Targets</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie & Macro Ring Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Today's Nutrition Flow</Text>
            <Text style={styles.cardDate}>12 Oct 2026</Text>
          </View>

          <View style={styles.caloriesRow}>
            <View>
              <Text style={styles.calBigNum}>1,490</Text>
              <Text style={styles.calLabel}>of 2,000 kcal consumed</Text>
            </View>

            <View style={styles.calRemainingBox}>
              <Text style={styles.calRemainingNum}>510</Text>
              <Text style={styles.calRemainingLabel}>kcal left</Text>
            </View>
          </View>

          {/* Macro Progress Bars */}
          <View style={styles.macrosList}>
            {/* Protein */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroProgressLabelRow}>
                <Text style={styles.macroName}>Protein</Text>
                <Text style={styles.macroValueText}>76g / 100g</Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '76%', backgroundColor: '#466647' }]} />
              </View>
            </View>

            {/* Carbs */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroProgressLabelRow}>
                <Text style={styles.macroName}>Carbohydrates</Text>
                <Text style={styles.macroValueText}>185g / 250g</Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '74%', backgroundColor: '#D9822B' }]} />
              </View>
            </View>

            {/* Fat */}
            <View style={styles.macroProgressItem}>
              <View style={styles.macroProgressLabelRow}>
                <Text style={styles.macroName}>Healthy Fats</Text>
                <Text style={styles.macroValueText}>48g / 67g</Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '71%', backgroundColor: '#8B5A2B' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Up Next Meal Card */}
        <View style={styles.nextMealHeader}>
          <Text style={styles.sectionHeading}>Up Next on Your Plate</Text>
          <TouchableOpacity onPress={onNavigateToMealPlan}>
            <Text style={styles.seeAllText}>See all meals ›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.nextMealCard}
          onPress={onNavigateToMealPlan}
          activeOpacity={0.88}
        >
          <Image
            source={require('../../assets/images/meal-dinner.png')}
            style={styles.nextMealImage}
            resizeMode="cover"
          />
          <View style={styles.nextMealDetails}>
            <View style={styles.dinnerBadge}>
              <Text style={styles.dinnerBadgeText}>DINNER • 7:30 PM</Text>
            </View>
            <Text style={styles.nextMealTitle}>Paneer & Vegetable Stir Fry</Text>
            <Text style={styles.nextMealSub}>With steamed millets & cold-pressed sesame</Text>
            <View style={styles.mealMetricsMini}>
              <Text style={styles.mealMetricBold}>400 kcal</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.mealMetricLight}>22g Protein</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.mealMetricLight}>20 mins</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Daily Botanical Focus Card */}
        <View style={styles.botanicalFocusCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.focusPill}>
              <Text style={styles.focusPillText}>CLINICAL BOTANICAL TIP</Text>
            </View>
            <Text style={styles.focusTitle}>Seed Cycling for Hormonal Health</Text>
            <Text style={styles.focusDesc}>
              Flax & pumpkin seeds in phase 1 (follicular) provide zinc & lignans that support gentle estrogen balance.
            </Text>
          </View>
          <Image
            source={require('../../assets/images/banner-bowl.png')}
            style={styles.focusGraphic}
            resizeMode="contain"
          />
        </View>

        {/* Quick Hub Navigation Cards */}
        <View style={styles.quickHubGrid}>
          <TouchableOpacity
            style={styles.quickHubCard}
            onPress={onNavigateToCalculations}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>📊</Text>
            <Text style={styles.quickHubTitle}>Calculations</Text>
            <Text style={styles.quickHubSub}>BMI, BMR, TDEE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickHubCard}
            onPress={onNavigateToExplore}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🧭</Text>
            <Text style={styles.quickHubTitle}>Explore Tools</Text>
            <Text style={styles.quickHubSub}>8 wellness tools</Text>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 11,
    color: '#737970',
    fontWeight: '500',
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  avatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
  },
  avatarImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF8EA',
    borderWidth: 1,
    borderColor: '#F3E5C7',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  streakLeft: {
    flex: 1,
  },
  streakCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B45309',
  },
  streakSubtitle: {
    fontSize: 11.5,
    color: '#92400E',
    marginTop: 2,
  },
  streakPill: {
    backgroundColor: '#B45309',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  streakPillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  cardDate: {
    fontSize: 11,
    color: '#737970',
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calBigNum: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  calLabel: {
    fontSize: 12,
    color: '#737970',
    marginTop: 2,
  },
  calRemainingBox: {
    alignItems: 'flex-end',
  },
  calRemainingNum: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C6E52',
  },
  calRemainingLabel: {
    fontSize: 10.5,
    color: '#737970',
  },
  macrosList: {
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE7',
  },
  macroProgressItem: {},
  macroProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#262923',
  },
  macroValueText: {
    fontSize: 11,
    color: '#686B63',
  },
  macroBarBg: {
    height: 6,
    backgroundColor: '#EFECE4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  nextMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  seeAllText: {
    fontSize: 12.5,
    color: '#5C6E52',
    fontWeight: '600',
  },
  nextMealCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    overflow: 'hidden',
    marginBottom: 20,
  },
  nextMealImage: {
    width: 100,
    height: 100,
  },
  nextMealDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  dinnerBadge: {
    backgroundColor: '#EAF0E6',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
  },
  dinnerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  nextMealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  nextMealSub: {
    fontSize: 11,
    color: '#737970',
    marginTop: 2,
  },
  mealMetricsMini: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  mealMetricBold: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#262923',
  },
  dotSeparator: {
    fontSize: 10,
    color: '#C5C1B8',
    marginHorizontal: 4,
  },
  mealMetricLight: {
    fontSize: 11,
    color: '#686B63',
  },
  botanicalFocusCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF0E6',
    borderWidth: 1,
    borderColor: '#D4E1CE',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  focusPill: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  focusPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  focusTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 4,
  },
  focusDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#4A5844',
  },
  focusGraphic: {
    width: 70,
    height: 70,
    opacity: 0.35,
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  quickHubGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickHubCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 14,
    alignItems: 'center',
  },
  quickHubTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  quickHubSub: {
    fontSize: 11,
    color: '#737970',
    marginTop: 2,
  },
});

