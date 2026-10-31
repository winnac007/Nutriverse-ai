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
import { BodyProfile } from '../types';
import { calculateNutrition } from '../utils/calculations';
import {
  ChevronLeftIcon,
  InfoIcon,
  PencilIcon,
  UserIcon,
  HeightIcon,
  WeightIcon,
  ScaleIcon,
  ActivityIcon,
  TargetIcon,
  BmiIcon,
  FlameIcon,
  RunnerIcon,
  BowlIcon,
  LeafIcon,
  WheatIcon,
  DropIcon,
  ClockIcon,
  CheckIcon,
} from '../components/Icons';
import { EditProfileModal } from '../components/EditProfileModal';
import { AboutBmiModal } from '../components/AboutBmiModal';
import { AboutBmrModal } from '../components/AboutBmrModal';

interface NutritionCalculationsScreenProps {
  onBack?: () => void;
  onNavigateToMealPlan?: () => void;
}

export const NutritionCalculationsScreen: React.FC<NutritionCalculationsScreenProps> = ({
  onBack,
  onNavigateToMealPlan,
}) => {
  const [profile, setProfile] = useState<BodyProfile>({
    age: 26,
    gender: 'Female',
    heightCm: 165,
    weightKg: 65,
    activityLevel: 'Moderately active',
    activityDescription: 'Light exercise 3–5 days a week',
    healthGoal: 'Hormonal balance',
    healthGoalDescription: 'Supporting PCOS, thyroid and hormonal health',
    bodyFatPercent: '28',
    muscleMassKg: '40',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [aboutBmiVisible, setAboutBmiVisible] = useState(false);
  const [aboutBmrVisible, setAboutBmrVisible] = useState(false);
  const [reviewRequested, setReviewRequested] = useState(false);

  // Live calculated nutrition metrics
  const nutrition = calculateNutrition(profile);

  // BMI Gauge indicator position (15 to 40 scale)
  const bmiPercent = Math.min(100, Math.max(0, ((nutrition.bmi - 15) / (38 - 15)) * 100));

  const handleRequestReview = () => {
    setReviewRequested(true);
    Alert.alert(
      'Review Requested',
      'Dr. Ananya and your care team will review your targets and adapt them to your hormonal health markers within 24 hours.'
    );
  };

  const handleUseInMealPlan = () => {
    if (onNavigateToMealPlan) {
      onNavigateToMealPlan();
    } else {
      Alert.alert(
        'Targets Applied',
        `Your personalized target of ${nutrition.dailyCalories} kcal (${nutrition.proteinGrams}g Protein, ${nutrition.carbsGrams}g Carbs, ${nutrition.fatGrams}g Fat) has been linked to your daily meal plan.`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Top Header Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.howItWorksButton}
          onPress={() => setAboutBmrVisible(true)}
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
        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Nutrition Calculations</Text>
          <Text style={styles.mainSubtitle}>Understand what your body needs.</Text>
        </View>

        {/* ── Section 1: Your Body Profile Card ── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Your body profile</Text>
              <Text style={styles.cardSubtitle}>Used to calculate your nutritional needs.</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.8}
            >
              <PencilIcon size={12} color="#1C1D1A" />
              <Text style={styles.editButtonText}>Edit details</Text>
            </TouchableOpacity>
          </View>

          {/* Plant / Bowl visual graphic in top right */}
          <View style={styles.botanicalGraphic}>
            <Image
              source={require('../../assets/images/banner-bowl.png')}
              style={styles.bowlImage}
              resizeMode="contain"
            />
          </View>

          {/* 5 Profile Metrics in Horizontal Scroll / Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileStatsRow}
          >
            {/* Age */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrapper}>
                <UserIcon size={16} color="#4A4E46" />
              </View>
              <Text style={styles.statLabel}>Age</Text>
              <Text style={styles.statValue}>{profile.age} years</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Height */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrapper}>
                <HeightIcon size={16} color="#4A4E46" />
              </View>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{profile.heightCm} cm</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Weight */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrapper}>
                <WeightIcon size={16} color="#4A4E46" />
              </View>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{profile.weightKg} kg</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Activity Level */}
            <View style={styles.statColWide}>
              <View style={styles.statIconWrapper}>
                <ActivityIcon size={16} color="#4A4E46" />
              </View>
              <Text style={styles.statLabel}>Activity level</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {profile.activityLevel}
              </Text>
            </View>

            <View style={styles.statDivider} />

            {/* Health Goal */}
            <View style={styles.statColWide}>
              <View style={styles.statIconWrapper}>
                <TargetIcon size={16} color="#4A4E46" />
              </View>
              <Text style={styles.statLabel}>Health goal</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {profile.healthGoal}
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* ── Section 2: Your Nutrition Snapshot ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your nutrition snapshot</Text>
          <Text style={styles.sectionSubtitle}>Key calculations based on your profile.</Text>
        </View>

        {/* 2x2 Grid */}
        <View style={styles.gridContainer}>
          {/* Card 1: BMI */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => setAboutBmiVisible(true)}
            activeOpacity={0.9}
          >
            <View style={styles.metricHeader}>
              <BmiIcon size={18} />
              <View style={styles.metricTitleRow}>
                <Text style={styles.metricCode}>BMI</Text>
                <InfoIcon size={13} color="#8A8E85" />
              </View>
            </View>
            <Text style={styles.metricBigNumber}>{nutrition.bmi}</Text>
            <Text style={styles.metricName}>Body Mass Index</Text>
            <Text style={styles.metricDesc}>Weight relative to height</Text>

            {/* Gauge Slider */}
            <View style={styles.bmiGaugeContainer}>
              <View style={styles.bmiGaugeTrack}>
                <View style={[styles.bmiSegment, { backgroundColor: '#7FA287', flex: 1.5 }]} />
                <View style={[styles.bmiSegment, { backgroundColor: '#D9C8AC', flex: 1 }]} />
              </View>
              {/* Indicator Dot */}
              <View style={[styles.bmiDot, { left: `${Math.min(92, Math.max(8, bmiPercent))}%` }]} />
            </View>
            <Text style={styles.bmiRangeText}>{nutrition.bmiStatus} range</Text>
          </TouchableOpacity>

          {/* Card 2: BMR */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => setAboutBmrVisible(true)}
            activeOpacity={0.9}
          >
            <View style={styles.metricHeader}>
              <FlameIcon size={18} />
              <View style={styles.metricTitleRow}>
                <Text style={styles.metricCode}>BMR</Text>
                <InfoIcon size={13} color="#8A8E85" />
              </View>
            </View>
            <Text style={styles.metricBigNumber}>
              {nutrition.bmr.toLocaleString()} <Text style={styles.metricUnit}>kcal/day</Text>
            </Text>
            <Text style={styles.metricName}>Resting energy needs</Text>
            <Text style={styles.metricDesc}>Energy your body needs at rest</Text>

            {/* Subtle botanical corner decoration */}
            <View style={styles.subtleCornerArt}>
              <LeafIcon size={28} color="#3D5C3E" style={{ opacity: 0.15 }} />
            </View>
          </TouchableOpacity>

          {/* Card 3: TDEE */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => setAboutBmrVisible(true)}
            activeOpacity={0.9}
          >
            <View style={styles.metricHeader}>
              <RunnerIcon size={18} />
              <View style={styles.metricTitleRow}>
                <Text style={styles.metricCode}>TDEE</Text>
                <InfoIcon size={13} color="#8A8E85" />
              </View>
            </View>
            <Text style={styles.metricBigNumber}>
              {nutrition.tdee.toLocaleString()} <Text style={styles.metricUnit}>kcal/day</Text>
            </Text>
            <Text style={styles.metricName}>Estimated daily energy needs</Text>
            <Text style={styles.metricDesc}>Based on your activity level</Text>

            <View style={styles.subtleCornerArt}>
              <FlameIcon size={28} color="#D97706" style={{ opacity: 0.14 }} />
            </View>
          </TouchableOpacity>

          {/* Card 4: IBW */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => setAboutBmiVisible(true)}
            activeOpacity={0.9}
          >
            <View style={styles.metricHeader}>
              <BowlIcon size={18} />
              <View style={styles.metricTitleRow}>
                <Text style={styles.metricCode}>IBW</Text>
                <InfoIcon size={13} color="#8A8E85" />
              </View>
            </View>
            <Text style={styles.metricBigNumber}>
              {nutrition.ibwMin} – {nutrition.ibwMax} <Text style={styles.metricUnit}>kg</Text>
            </Text>
            <Text style={styles.metricName}>Ideal Body Weight (reference)</Text>
            <Text style={styles.metricDesc}>Healthy weight range for your height</Text>

            <View style={styles.subtleCornerArt}>
              <ScaleIcon size={26} color="#3D5C3E" style={{ opacity: 0.15 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Section 3: Your Daily Nutrition Guide Card ── */}
        <View style={styles.sageCard}>
          <View style={styles.sageHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sageTitle}>Your daily nutrition guide</Text>
              <Text style={styles.sageSubtitle}>Personalized targets for your goals.</Text>
            </View>
            <View style={styles.awaitingBadge}>
              <ClockIcon size={12} color="#855B09" />
              <Text style={styles.awaitingBadgeText}>
                {reviewRequested ? 'Review in progress' : 'Awaiting consultant review'}
              </Text>
            </View>
          </View>

          {/* Daily Energy & Macro distribution */}
          <View style={styles.macroTopRow}>
            <View>
              <Text style={styles.macroLabel}>Daily energy</Text>
              <Text style={styles.macroBigCalories}>
                {nutrition.dailyCalories.toLocaleString()} <Text style={styles.macroCalUnit}>kcal</Text>
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 24 }}>
              <Text style={styles.macroLabel}>Macronutrient distribution</Text>
              {/* Segmented Macro Bar */}
              <View style={styles.macroMultiBar}>
                <View style={[styles.macroBarSegment, { backgroundColor: '#567252', flex: 20 }]} />
                <View style={[styles.macroBarSegment, { backgroundColor: '#D9984E', flex: 50 }]} />
                <View style={[styles.macroBarSegment, { backgroundColor: '#8B6A45', flex: 30 }]} />
              </View>
            </View>
          </View>

          {/* 3 Macro Columns: Protein, Carbs, Fat */}
          <View style={styles.macrosDetailsRow}>
            {/* Protein */}
            <View style={styles.macroDetailCol}>
              <LeafIcon size={16} color="#466647" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.macroDetailName}>Protein</Text>
                <Text style={styles.macroDetailGrams}>{nutrition.proteinGrams} g</Text>
              </View>
            </View>

            <View style={styles.macroDivider} />

            {/* Carbohydrates */}
            <View style={styles.macroDetailCol}>
              <WheatIcon size={16} color="#D9822B" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.macroDetailName}>Carbohydrates</Text>
                <Text style={styles.macroDetailGrams}>{nutrition.carbsGrams} g</Text>
              </View>
            </View>

            <View style={styles.macroDivider} />

            {/* Fat */}
            <View style={styles.macroDetailCol}>
              <DropIcon size={16} color="#8B5A2B" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.macroDetailName}>Fat</Text>
                <Text style={styles.macroDetailGrams}>{nutrition.fatGrams} g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Section 4: Guided by your nutrition expert ── */}
        <View style={styles.expertCard}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.expertAvatar}
          />
          <View style={styles.expertContent}>
            <View style={styles.expertTopRow}>
              <Text style={styles.expertTitle}>Guided by your nutrition expert</Text>
              <View style={styles.reviewPendingBadge}>
                <ClockIcon size={10} color="#855B09" />
                <Text style={styles.reviewPendingText}>
                  {reviewRequested ? 'Requested' : 'Review pending'}
                </Text>
              </View>
            </View>
            <Text style={styles.expertDesc}>
              Your nutritionist can review these estimates and personalize your targets based on your health condition and goals.
            </Text>
            <TouchableOpacity
              style={[styles.expertActionButton, reviewRequested && styles.expertActionActive]}
              onPress={handleRequestReview}
              activeOpacity={0.8}
            >
              {reviewRequested && (
                <View style={{ marginRight: 6 }}>
                  <CheckIcon size={12} color="#FFFFFF" />
                </View>
              )}
              <Text style={[styles.expertActionText, reviewRequested && styles.expertActionTextActive]}>
                {reviewRequested ? 'Request Submitted' : 'Request consultant review'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section 5: Bottom CTA Button ── */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryPillButton}
            onPress={handleUseInMealPlan}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryPillText}>Use in my meal plan  →</Text>
          </TouchableOpacity>
          <Text style={styles.bottomCaption}>
            Your targets help shape your personalized food recommendations.
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editModalVisible}
        profile={profile}
        onClose={() => setEditModalVisible(false)}
        onSave={(updated) => setProfile(updated)}
      />

      <AboutBmiModal
        visible={aboutBmiVisible}
        onClose={() => setAboutBmiVisible(false)}
      />

      <AboutBmrModal
        visible={aboutBmrVisible}
        onClose={() => setAboutBmrVisible(false)}
      />
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
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3C4039',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#686B63',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFECE4',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    zIndex: 2,
  },
  cardTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#686B63',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F1E9',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  botanicalGraphic: {
    position: 'absolute',
    top: 4,
    right: -10,
    width: 80,
    height: 80,
    opacity: 0.35,
    zIndex: 1,
  },
  bowlImage: {
    width: '100%',
    height: '100%',
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statCol: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statColWide: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10.5,
    color: '#737970',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#EFECE4',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#686B63',
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFECE4',
    position: 'relative',
    overflow: 'hidden',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  metricBigNumber: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    color: '#686B63',
    fontWeight: '400',
  },
  metricName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#343731',
  },
  metricDesc: {
    fontSize: 9.5,
    color: '#737970',
    marginTop: 2,
    lineHeight: 13,
  },
  bmiGaugeContainer: {
    height: 8,
    marginTop: 10,
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  bmiGaugeTrack: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bmiSegment: {
    height: '100%',
  },
  bmiDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3D5C3E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    top: -1,
  },
  bmiRangeText: {
    fontSize: 9.5,
    color: '#555850',
    fontWeight: '500',
    marginTop: 4,
  },
  subtleCornerArt: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  sageCard: {
    backgroundColor: '#EAF0E6',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D7E2D2',
    marginBottom: 20,
  },
  sageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sageTitle: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sageSubtitle: {
    fontSize: 12,
    color: '#52604D',
    marginTop: 2,
  },
  awaitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF2DD',
    borderWidth: 1,
    borderColor: '#EADBB8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  awaitingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C550A',
  },
  macroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroLabel: {
    fontSize: 11,
    color: '#52604D',
    marginBottom: 2,
  },
  macroBigCalories: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  macroCalUnit: {
    fontSize: 13,
    fontFamily: 'sans-serif',
    color: '#52604D',
    fontWeight: '500',
  },
  macroMultiBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
    gap: 2,
  },
  macroBarSegment: {
    borderRadius: 2,
  },
  macrosDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  macroDetailCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroDetailName: {
    fontSize: 10,
    color: '#52604D',
  },
  macroDetailGrams: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  macroDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D1DFC9',
    marginHorizontal: 4,
  },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFECE4',
    marginBottom: 24,
  },
  expertAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  expertContent: {
    flex: 1,
  },
  expertTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    flex: 1,
  },
  reviewPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FAF2DD',
    borderWidth: 1,
    borderColor: '#EADBB8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewPendingText: {
    fontSize: 9.5,
    color: '#7C550A',
    fontWeight: '600',
  },
  expertDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: '#686B63',
    marginBottom: 10,
  },
  expertActionButton: {
    borderWidth: 1,
    borderColor: '#3D5C3E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-end',
  },
  expertActionActive: {
    backgroundColor: '#EAF0E6',
    borderColor: '#5C6E52',
  },
  expertActionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  expertActionTextActive: {
    color: '#264428',
  },
  bottomSection: {
    alignItems: 'center',
  },
  primaryPillButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6E52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryPillText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomCaption: {
    fontSize: 11,
    color: '#737970',
    marginTop: 8,
    textAlign: 'center',
  },
});

