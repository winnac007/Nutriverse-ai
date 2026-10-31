import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  CheckIcon,
  SproutIcon,
  LeafIcon,
  TargetIcon,
  SparkleIcon,
  UtensilsCrossed,
  PlanIcon,
  ActivityIcon,
  PencilIcon,
  ScaleIcon,
} from '../components/Icons';

export interface PlanSummaryData {
  goal: string;
  symptoms: string[];
  priorities: string[];
  profile: {
    age: string;
    height: string;
    weight: string;
    targetWeight?: string;
    activityLevel: string;
    selectedConditions: string[];
    sleepDuration: string;
    waterIntake: string;
    workRoutine: string;
    stressLevel: string;
    cycleType?: string;
    cycleLength?: string;
    periodDuration?: string;
    medications?: string;
  };
  foodPrefs: {
    cuisines: string[];
    dietType: string;
    likedFoods: string[];
    avoidFoods: string[];
    eatingOutEnabled: boolean;
    eatingOutOption: string;
    mealPattern: string;
  };
  planStructure: {
    planFormat: 'day_based' | 'meal_option_based';
    duration: '7' | '15' | 'custom';
    selectedMeals: string[];
    includeAlternatives: boolean;
    eatingOutFlexibility: boolean;
    seasonalSuitability: boolean;
  };
}

interface GoalPlanSummaryScreenProps {
  data: PlanSummaryData;
  onBack: () => void;
  onChangeGoal: () => void;
  onChangeSymptoms: () => void;
  onChangeProfile: () => void;
  onChangeFoodPrefs: () => void;
  onChangePlanStructure: () => void;
  onGeneratePlan: () => void;
  onNavigateToCalculations: () => void;
}

export const GoalPlanSummaryScreen: React.FC<GoalPlanSummaryScreenProps> = ({
  data,
  onBack,
  onChangeGoal,
  onChangeSymptoms,
  onChangeProfile,
  onChangeFoodPrefs,
  onChangePlanStructure,
  onGeneratePlan,
  onNavigateToCalculations,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onGeneratePlan();
    }, 900);
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <SproutIcon size={18} color="#3D5C3E" style={{ marginRight: 6 }} />
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.stepText}>6 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Header with Character Art */}
        <View style={styles.titleWithGraphicRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.kicker}>Goal Setting</Text>
            <Text style={styles.mainTitle}>Your Plan Summary</Text>
            <Text style={styles.subDesc}>
              Review your personalized details before we generate your bespoke clinical nutrition plan.
            </Text>
          </View>
          <View style={styles.characterArtBox}>
            <View style={styles.clinicalHeaderBadge}>
              <PlanIcon size={26} color="#3D5C3E" />
            </View>
          </View>
        </View>

        {/* ── Card 1: Primary Goal ── */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <TargetIcon size={18} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>Primary Goal</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={onChangeGoal}
              activeOpacity={0.75}
            >
              <PencilIcon size={11} color="#3D5C3E" />
              <Text style={[styles.changeBtnText, { marginLeft: 3 }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalPillRow}>
            <Text style={styles.goalHighlightText}>{data.goal}</Text>
          </View>
        </View>

        {/* ── Card 2: Focus Symptoms & Priorities ── */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <SparkleIcon size={18} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>Focus & Priorities</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={onChangeSymptoms}
              activeOpacity={0.75}
            >
              <PencilIcon size={11} color="#3D5C3E" />
              <Text style={[styles.changeBtnText, { marginLeft: 3 }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionMiniLabel}>Selected Symptoms & Experiences:</Text>
          <View style={styles.chipsWrap}>
            {data.symptoms.map((s) => (
              <View key={s} style={styles.symptomChip}>
                <Text style={styles.symptomChipText}>
                  {s.replace(/-/g, ' ')}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionMiniLabel, { marginTop: 12 }]}>Top Priorities:</Text>
          <View style={styles.prioritiesWrap}>
            {data.priorities.map((p, idx) => (
              <View key={p} style={styles.priorityRowItem}>
                <View style={styles.priorityIdxCircle}>
                  <Text style={styles.priorityIdxText}>{idx + 1}</Text>
                </View>
                <Text style={styles.priorityItemTitle}>
                  {p.replace(/-/g, ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Card 3: Body Vitals & Lifestyle ── */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <ScaleIcon size={18} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>Body Profile & Lifestyle</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={onChangeProfile}
              activeOpacity={0.75}
            >
              <PencilIcon size={11} color="#3D5C3E" />
              <Text style={[styles.changeBtnText, { marginLeft: 3 }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vitalsGrid}>
            <View style={styles.vitalTile}>
              <Text style={styles.vitalLabel}>Age</Text>
              <Text style={styles.vitalValue}>{data.profile.age} yrs</Text>
            </View>
            <View style={styles.vitalTile}>
              <Text style={styles.vitalLabel}>Height</Text>
              <Text style={styles.vitalValue}>{data.profile.height} cm</Text>
            </View>
            <View style={styles.vitalTile}>
              <Text style={styles.vitalLabel}>Current Wt</Text>
              <Text style={styles.vitalValue}>{data.profile.weight} kg</Text>
            </View>
            <View style={styles.vitalTile}>
              <Text style={styles.vitalLabel}>Target Wt</Text>
              <Text style={styles.vitalValue}>{data.profile.targetWeight || '—'} kg</Text>
            </View>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Activity Level:</Text>
              <Text style={styles.detailVal}>{data.profile.activityLevel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Conditions:</Text>
              <Text style={styles.detailVal}>
                {data.profile.selectedConditions && data.profile.selectedConditions.length > 0
                  ? data.profile.selectedConditions.join(', ')
                  : 'None'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Sleep Duration:</Text>
              <Text style={styles.detailVal}>{data.profile.sleepDuration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Water Intake:</Text>
              <Text style={styles.detailVal}>{data.profile.waterIntake}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Work Routine:</Text>
              <Text style={styles.detailVal}>{data.profile.workRoutine}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Stress Level:</Text>
              <Text style={styles.detailVal}>{data.profile.stressLevel}</Text>
            </View>
          </View>
        </View>

        {/* ── Card 4: Food Preferences & Diet ── */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <UtensilsCrossed size={18} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>Food & Diet Preferences</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={onChangeFoodPrefs}
              activeOpacity={0.75}
            >
              <PencilIcon size={11} color="#3D5C3E" />
              <Text style={[styles.changeBtnText, { marginLeft: 3 }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Diet Type:</Text>
            <Text style={[styles.detailVal, { fontWeight: '700', color: '#3D5C3E' }]}>
              {data.foodPrefs.dietType}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Cuisine:</Text>
            <Text style={styles.detailVal}>
              {data.foodPrefs.cuisines.join(', ')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Meal Pattern:</Text>
            <Text style={styles.detailVal}>{data.foodPrefs.mealPattern}</Text>
          </View>

          <Text style={[styles.sectionMiniLabel, { marginTop: 10 }]}>Foods You Love:</Text>
          <View style={styles.chipsWrap}>
            {data.foodPrefs.likedFoods.map((food) => (
              <View key={food} style={styles.likedChip}>
                <Text style={styles.likedChipText}>{food}</Text>
              </View>
            ))}
          </View>

          {data.foodPrefs.avoidFoods && data.foodPrefs.avoidFoods.length > 0 && (
            <>
              <Text style={[styles.sectionMiniLabel, { marginTop: 10, color: '#882A1E' }]}>
                Foods to Avoid:
              </Text>
              <View style={styles.chipsWrap}>
                {data.foodPrefs.avoidFoods.map((food) => (
                  <View key={food} style={styles.avoidChip}>
                    <Text style={styles.avoidChipText}>{food}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── Card 5: Plan Structure & Flexibility ── */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <PlanIcon size={18} color="#3D5C3E" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>Plan Structure</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={onChangePlanStructure}
              activeOpacity={0.75}
            >
              <PencilIcon size={11} color="#3D5C3E" />
              <Text style={[styles.changeBtnText, { marginLeft: 3 }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Format:</Text>
            <Text style={styles.detailVal}>
              {data.planStructure.planFormat === 'day_based'
                ? 'Day-by-day structured plan'
                : 'Meal options catalog'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Duration:</Text>
            <Text style={styles.detailVal}>{data.planStructure.duration} Days</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Included Meals:</Text>
            <Text style={styles.detailVal}>
              {data.planStructure.selectedMeals.join(', ')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Clinical Alternatives:</Text>
            <Text style={styles.detailVal}>
              {data.planStructure.includeAlternatives ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>

        {/* Clinical Note Callout */}
        <View style={styles.calloutCard}>
          <SproutIcon size={20} color="#3D5C3E" style={{ marginRight: 10 }} />
          <Text style={styles.calloutText}>
            Our clinical AI has cross-referenced your biometric targets, cuisine favorites, and health focus to formulate an optimal metabolic blueprint.
          </Text>
        </View>

        {/* Secondary Calculations CTA */}
        <TouchableOpacity
          style={styles.calcButton}
          onPress={onNavigateToCalculations}
          activeOpacity={0.8}
        >
          <ActivityIcon size={16} color="#3D5C3E" style={{ marginRight: 6 }} />
          <Text style={styles.calcButtonText}>View Body Calculations (BMI, BMR, TDEE)</Text>
        </TouchableOpacity>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isGenerating && styles.primaryButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating ? (
            <View style={styles.generatingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.primaryButtonText}>Formulating Plan...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Generate My Personalized Plan  →</Text>
          )}
        </TouchableOpacity>
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
  brandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  progressRow: {
    alignItems: 'flex-end',
  },
  stepText: {
    fontSize: 11,
    color: '#737970',
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSegments: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E5DFD4',
  },
  progressDotActive: {
    backgroundColor: '#5C6E52',
    width: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleWithGraphicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  kicker: {
    fontSize: 12,
    color: '#686B63',
    fontWeight: '500',
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.4,
    marginVertical: 4,
  },
  subDesc: {
    fontSize: 12,
    color: '#686B63',
    lineHeight: 17,
  },
  characterArtBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3E8D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicalHeaderBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECE7DC',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EDE4',
    paddingBottom: 10,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontFamily: 'serif',
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  changeBtn: {
    backgroundColor: '#F3EFE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E0D4',
  },
  changeBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  goalPillRow: {
    backgroundColor: '#FAF8F4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFECE4',
  },
  goalHighlightText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sectionMiniLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#737970',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomChip: {
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFECE4',
  },
  symptomChipText: {
    fontSize: 12,
    color: '#4A4E46',
    textTransform: 'capitalize',
  },
  prioritiesWrap: {
    gap: 6,
  },
  priorityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFECE4',
  },
  priorityIdxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  priorityIdxText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priorityItemTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1C1D1A',
    textTransform: 'capitalize',
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  vitalTile: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFECE4',
  },
  vitalLabel: {
    fontSize: 10.5,
    color: '#737970',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  detailsList: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailKey: {
    fontSize: 12.5,
    color: '#737970',
  },
  detailVal: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  likedChip: {
    backgroundColor: '#EAF0E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CDE0C7',
  },
  likedChipText: {
    fontSize: 12,
    color: '#2A462C',
    fontWeight: '600',
  },
  avoidChip: {
    backgroundColor: '#FDEEE9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F6D2C8',
  },
  avoidChipText: {
    fontSize: 12,
    color: '#882A1E',
    fontWeight: '600',
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E0D4',
    padding: 14,
    marginBottom: 16,
  },
  calloutText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#555850',
  },
  calcButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#5C6E52',
    borderRadius: 26,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  calcButtonText: {
    color: '#5C6E52',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6E52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  generatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

