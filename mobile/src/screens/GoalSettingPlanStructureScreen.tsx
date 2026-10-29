import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  CheckIcon,
  CalendarIcon,
  MealIcon,
  ChefHatIcon,
  SproutIcon,
} from '../components/Icons';

interface GoalSettingPlanStructureScreenProps {
  initialPlan?: {
    planFormat?: 'day_based' | 'meal_option_based';
    duration?: '7' | '15' | 'custom';
    selectedMeals?: string[];
    includeAlternatives?: boolean;
    eatingOutFlexibility?: boolean;
    seasonalSuitability?: boolean;
  };
  onBack: () => void;
  onContinue: (planData: any) => void;
}

export const GoalSettingPlanStructureScreen: React.FC<GoalSettingPlanStructureScreenProps> = ({
  initialPlan,
  onBack,
  onContinue,
}) => {
  // Plan format: 'day_based' | 'meal_option_based'
  const [planFormat, setPlanFormat] = useState<'day_based' | 'meal_option_based'>(
    initialPlan?.planFormat || 'day_based'
  );

  // Plan duration: '7' | '15' | 'custom'
  const [duration, setDuration] = useState<'7' | '15' | 'custom'>(
    initialPlan?.duration || '7'
  );

  // Meals to include
  const [selectedMeals, setSelectedMeals] = useState<string[]>(
    initialPlan?.selectedMeals || ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
  );

  // Clinical flexibility toggles
  const [includeAlternatives, setIncludeAlternatives] = useState(
    initialPlan?.includeAlternatives !== undefined ? initialPlan.includeAlternatives : true
  );
  const [eatingOutFlexibility, setEatingOutFlexibility] = useState(
    initialPlan?.eatingOutFlexibility !== undefined ? initialPlan.eatingOutFlexibility : true
  );
  const [seasonalSuitability, setSeasonalSuitability] = useState(
    initialPlan?.seasonalSuitability !== undefined ? initialPlan.seasonalSuitability : true
  );

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) => {
      if (prev.includes(meal)) {
        if (prev.length <= 1) {
          Alert.alert('Selection Required', 'Please select at least one meal to include.');
          return prev;
        }
        return prev.filter((m) => m !== meal);
      } else {
        return [...prev, meal];
      }
    });
  };

  const handleContinue = () => {
    onContinue({
      planFormat,
      duration,
      selectedMeals,
      includeAlternatives,
      eatingOutFlexibility,
      seasonalSuitability,
    });
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <Text style={{ fontSize: 16, marginRight: 4 }}>🌱</Text>
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.stepText}>5 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Header with Graphic */}
        <View style={styles.titleWithGraphicRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.kicker}>Goal Setting</Text>
            <Text style={styles.mainTitle}>Build Your Plan</Text>
            <Text style={styles.subDesc}>
              Choose how you would like your meal plan to be structured. You can always change this later.
            </Text>
          </View>
          <View style={styles.characterArtBox}>
            <Text style={{ fontSize: 44 }}>👩‍🍳🥗</Text>
          </View>
        </View>

        {/* ── Section 1: Plan format ── */}
        <Text style={styles.sectionHeading}>Plan format</Text>
        <Text style={styles.sectionSubHeading}>Select how your meal plan is organized</Text>

        <View style={styles.formatCardsContainer}>
          {/* Day-based plan */}
          <TouchableOpacity
            style={[
              styles.formatCard,
              planFormat === 'day_based' && styles.formatCardSelected,
            ]}
            onPress={() => setPlanFormat('day_based')}
            activeOpacity={0.85}
          >
            <View style={styles.formatHeader}>
              <View style={styles.formatIconBadge}>
                <CalendarIcon size={18} color="#3D5C3E" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.formatTitle}>Day-based plan</Text>
                <Text style={styles.formatTag}>Structured & consistent</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  planFormat === 'day_based' && styles.radioOuterSelected,
                ]}
              >
                {planFormat === 'day_based' && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.formatDescription}>
              Specific curated meals for Monday through Sunday. Ideal for building a steady routine and precise grocery shopping.
            </Text>
          </TouchableOpacity>

          {/* Meal-option-based plan */}
          <TouchableOpacity
            style={[
              styles.formatCard,
              planFormat === 'meal_option_based' && styles.formatCardSelected,
            ]}
            onPress={() => setPlanFormat('meal_option_based')}
            activeOpacity={0.85}
          >
            <View style={styles.formatHeader}>
              <View style={styles.formatIconBadge}>
                <MealIcon size={18} color="#3D5C3E" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.formatTitle}>Meal-option-based plan</Text>
                <Text style={styles.formatTag}>Flexible & modular</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  planFormat === 'meal_option_based' && styles.radioOuterSelected,
                ]}
              >
                {planFormat === 'meal_option_based' && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.formatDescription}>
              A flexible pool of nutritionally equivalent recipes for each meal. Pick what you crave every morning, afternoon and evening.
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Section 2: Plan duration ── */}
        <Text style={styles.sectionHeading}>Plan duration</Text>
        <Text style={styles.sectionSubHeading}>Choose the cycle length for your personalized roadmap</Text>

        <View style={styles.durationCardsContainer}>
          {[
            {
              id: '7' as const,
              title: '7 days (1 week)',
              badge: 'Recommended for start',
              subtitle: 'Test recipes, monitor digestive response and adapt comfortably.',
            },
            {
              id: '15' as const,
              title: '15 days (2 weeks)',
              badge: 'Habit forming',
              subtitle: 'Deepen routine, observe initial metabolic and energy shifts.',
            },
            {
              id: 'custom' as const,
              title: 'Custom duration (4–12 weeks)',
              badge: 'Long-term goal',
              subtitle: 'Comprehensive endocrine and weight transformation with check-ins.',
            },
          ].map((item) => {
            const isSelected = duration === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                onPress={() => setDuration(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.durationCardRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={styles.durationTitle}>{item.title}</Text>
                      {item.badge && (
                        <View style={styles.durationBadge}>
                          <Text style={styles.durationBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.durationSub}>{item.subtitle}</Text>
                  </View>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 3: Meals to include ── */}
        <Text style={styles.sectionHeading}>Meals to include</Text>
        <Text style={styles.sectionSubHeading}>Select which daily meals you want Zenplato to design</Text>

        <View style={styles.mealsList}>
          {[
            {
              id: 'Breakfast',
              emoji: '🥞',
              time: '8:00 AM - 9:30 AM',
              title: 'Breakfast',
              desc: 'High-protein, steady energy start to prevent glucose spikes',
            },
            {
              id: 'Lunch',
              emoji: '🥗',
              time: '1:00 PM - 2:00 PM',
              title: 'Lunch',
              desc: 'Balanced plate with fiber, complex carbs and healthy fats',
            },
            {
              id: 'Dinner',
              emoji: '🍲',
              time: '7:30 PM - 8:30 PM',
              title: 'Dinner',
              desc: 'Light, anti-inflammatory nourishing recipes for sound sleep',
            },
            {
              id: 'Snacks',
              emoji: '🥜',
              time: '11:00 AM & 4:30 PM',
              title: 'Snacks',
              desc: 'Smart bites: seeds, roasted makhana, herbal infusions',
            },
            {
              id: 'Pre / Post workout',
              emoji: '⚡',
              time: 'Workout fuel',
              title: 'Pre / Post workout',
              desc: 'Electrolytes, rapid amino acids and recovery support',
            },
          ].map((meal) => {
            const isChecked = selectedMeals.includes(meal.id);
            return (
              <TouchableOpacity
                key={meal.id}
                style={[styles.mealCard, isChecked && styles.mealCardChecked]}
                onPress={() => toggleMeal(meal.id)}
                activeOpacity={0.8}
              >
                <View style={styles.mealEmojiBox}>
                  <Text style={{ fontSize: 24 }}>{meal.emoji}</Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.mealHeaderRow}>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    <Text style={styles.mealTimeBadge}>{meal.time}</Text>
                  </View>
                  <Text style={styles.mealDesc}>{meal.desc}</Text>
                </View>

                <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                  {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 4: Flexibility & Clinical Toggles ── */}
        <Text style={styles.sectionHeading}>Plan Flexibility</Text>
        <Text style={styles.sectionSubHeading}>Fine-tune recommendations for real life convenience</Text>

        <View style={styles.togglesCard}>
          {/* Toggle 1 */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleIconCol}>
              <Text style={{ fontSize: 20 }}>🔄</Text>
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.toggleTitle}>Include alternatives</Text>
              <Text style={styles.toggleSub}>Show 2–3 alternative options per meal</Text>
            </View>
            <Switch
              value={includeAlternatives}
              onValueChange={setIncludeAlternatives}
              trackColor={{ false: '#D9DCD6', true: '#5C6E52' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleDivider} />

          {/* Toggle 2 */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleIconCol}>
              <Text style={{ fontSize: 20 }}>🍽️</Text>
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.toggleTitle}>Eating out flexibility</Text>
              <Text style={styles.toggleSub}>Add healthy restaurant and eating-out suggestions</Text>
            </View>
            <Switch
              value={eatingOutFlexibility}
              onValueChange={setEatingOutFlexibility}
              trackColor={{ false: '#D9DCD6', true: '#5C6E52' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleDivider} />

          {/* Toggle 3 */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleIconCol}>
              <Text style={{ fontSize: 20 }}>🌿</Text>
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.toggleTitle}>Seasonal & local suitability</Text>
              <Text style={styles.toggleSub}>Prioritise in-season, locally fresh produce</Text>
            </View>
            <Switch
              value={seasonalSuitability}
              onValueChange={setSeasonalSuitability}
              trackColor={{ false: '#D9DCD6', true: '#5C6E52' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Assurance Card ── */}
        <View style={styles.assuranceBox}>
          <View style={styles.assuranceIconCol}>
            <SproutIcon size={22} color="#3D5C3E" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.assuranceTitle}>Expert Reviewed Plan</Text>
            <Text style={styles.assuranceText}>
              Your custom plan structure will be synthesized by Zenplato Clinical AI and verified by your nutritionist Dr. Meera before it goes live.
            </Text>
          </View>
        </View>

        {/* ── Bottom Continue Button ── */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingTop: 52,
    paddingBottom: 14,
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
  brandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
  },
  progressRow: {
    alignItems: 'flex-end',
  },
  stepText: {
    fontSize: 11,
    color: '#737970',
    marginBottom: 4,
    fontWeight: '600',
  },
  progressSegments: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2DEC6',
  },
  progressDotActive: {
    backgroundColor: '#3D5C3E',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  titleWithGraphicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  kicker: {
    fontSize: 13,
    color: '#5C6E52',
    fontWeight: '600',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 27,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#1C1D1A',
    lineHeight: 33,
    marginBottom: 6,
  },
  subDesc: {
    fontSize: 13,
    color: '#5A5F56',
    lineHeight: 18,
  },
  characterArtBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8E2D2',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
    marginTop: 14,
    marginBottom: 2,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: '#737970',
    marginBottom: 12,
  },
  formatCardsContainer: {
    gap: 12,
    marginBottom: 10,
  },
  formatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E8E5DD',
  },
  formatCardSelected: {
    borderColor: '#3D5C3E',
    backgroundColor: '#F8FAF6',
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formatIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  formatTag: {
    fontSize: 11,
    color: '#5C6E52',
    marginTop: 1,
  },
  formatDescription: {
    fontSize: 12,
    color: '#5A5F56',
    lineHeight: 17,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C8CCC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3D5C3E',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3D5C3E',
  },
  durationCardsContainer: {
    gap: 10,
    marginBottom: 10,
  },
  durationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E5DD',
  },
  durationCardSelected: {
    borderColor: '#3D5C3E',
    backgroundColor: '#F8FAF6',
  },
  durationCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  durationBadge: {
    backgroundColor: '#EAF0E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationBadgeText: {
    fontSize: 10,
    color: '#3D5C3E',
    fontWeight: '600',
  },
  durationSub: {
    fontSize: 11,
    color: '#737970',
    lineHeight: 15,
  },
  mealsList: {
    gap: 10,
    marginBottom: 10,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E5DD',
  },
  mealCardChecked: {
    borderColor: '#3D5C3E',
    backgroundColor: '#F9FBF8',
  },
  mealEmojiBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingRight: 8,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  mealTimeBadge: {
    fontSize: 10,
    color: '#737970',
    backgroundColor: '#F0EFE9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mealDesc: {
    fontSize: 11,
    color: '#656A61',
    lineHeight: 15,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C8CCC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#3D5C3E',
    borderColor: '#3D5C3E',
  },
  togglesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5DD',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleIconCol: {
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 11,
    color: '#737970',
    lineHeight: 15,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: '#F0EFE9',
    marginVertical: 10,
  },
  assuranceBox: {
    backgroundColor: '#EAF0E6',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4DEC8',
  },
  assuranceIconCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assuranceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A422B',
    marginBottom: 2,
  },
  assuranceText: {
    fontSize: 11,
    color: '#435844',
    lineHeight: 16,
  },
  continueButton: {
    backgroundColor: '#5C6E52',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

