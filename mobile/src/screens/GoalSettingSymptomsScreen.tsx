import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors } from '../theme/colors';
import { ChevronLeftIcon, CheckIcon, PencilIcon } from '../components/Icons';

interface GoalSettingSymptomsScreenProps {
  selectedGoal?: string;
  initialSymptoms?: string[];
  initialPriorities?: string[];
  onBack: () => void;
  onContinue: (data: { selectedSymptoms: string[]; topPriorities: string[] }) => void;
  onChangeGoal: () => void;
}

const GOAL_DETAILS: Record<string, { desc: string; emoji: string }> = {
  'Manage PCOS symptoms': {
    desc: 'Balance hormones, regulate cycles and improve overall wellbeing.',
    emoji: '⚖️🌿',
  },
  'Weight management': {
    desc: 'Lose, maintain or gain weight in a healthy, sustainable way.',
    emoji: '⚖️🌱',
  },
  'Improve fitness & strength': {
    desc: 'Build stamina, increase energy and feel stronger every day.',
    emoji: '👟🌿',
  },
  'Better sleep': {
    desc: 'Improve sleep quality, fall asleep faster and wake up rested.',
    emoji: '🌙😴',
  },
  'Better digestion': {
    desc: 'Reduce bloating, manage acidity and improve gut health.',
    emoji: '🍵🍃',
  },
  'Improve overall health': {
    desc: 'Build sustainable healthy habits for long-term vitality.',
    emoji: '❤️🌱',
  },
  'Other goal': {
    desc: 'Personalized nutrition plan tailored to your specific goals.',
    emoji: '➕🌱',
  },
};

interface SymptomItem {
  id: string;
  name: string;
  icon: string;
}

interface PriorityItem {
  id: string;
  num: number;
  icon: string;
  title: string;
  desc: string;
}

const GOAL_SYMPTOMS_MAP: Record<string, SymptomItem[]> = {
  'Manage PCOS symptoms': [
    { id: 'irregular-periods', name: 'Irregular\nperiods', icon: '📅' },
    { id: 'acne', name: 'Acne', icon: '💆‍♀️' },
    { id: 'hair-fall', name: 'Hair fall', icon: '💇‍♀️' },
    { id: 'weight-gain', name: 'Weight\ngain', icon: '⚖️' },
    { id: 'bloating', name: 'Bloating', icon: '👍' },
    { id: 'mood-swings', name: 'Mood swings', icon: '🧠' },
    { id: 'excess-hair', name: 'Excess hair\ngrowth', icon: '🧔‍♀️' },
    { id: 'low-energy', name: 'Low energy', icon: '🪫' },
    { id: 'sleep-issues', name: 'Sleep issues', icon: '🌙' },
    { id: 'sugar-cravings', name: 'Sugar cravings', icon: '🧁' },
    { id: 'digestive-issues', name: 'Digestive\nissues', icon: '🍵' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
  'Weight management': [
    { id: 'weight-gain', name: 'Stubborn\nweight', icon: '⚖️' },
    { id: 'sugar-cravings', name: 'Sugar\ncravings', icon: '🧁' },
    { id: 'low-energy', name: 'Low energy', icon: '🪫' },
    { id: 'bloating', name: 'Bloating', icon: '👍' },
    { id: 'emotional-eating', name: 'Emotional\neating', icon: '🍟' },
    { id: 'slow-metabolism', name: 'Slow\nmetabolism', icon: '🐢' },
    { id: 'water-retention', name: 'Water\nretention', icon: '💧' },
    { id: 'muscle-loss', name: 'Low muscle\ntone', icon: '💪' },
    { id: 'sleep-issues', name: 'Sleep issues', icon: '🌙' },
    { id: 'late-night-snacking', name: 'Late night\nsnacks', icon: '🍿' },
    { id: 'digestive-issues', name: 'Digestive\nissues', icon: '🍵' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
  'Improve fitness & strength': [
    { id: 'low-stamina', name: 'Low stamina', icon: '🏃' },
    { id: 'muscle-fatigue', name: 'Muscle\nfatigue', icon: '💪' },
    { id: 'slow-recovery', name: 'Slow\nrecovery', icon: '🩹' },
    { id: 'low-energy', name: 'Energy slumps', icon: '🪫' },
    { id: 'inadequate-protein', name: 'Low protein\nintake', icon: '🥚' },
    { id: 'joint-stiffness', name: 'Joint\nstiffness', icon: '🦴' },
    { id: 'sleep-issues', name: 'Poor sleep', icon: '🌙' },
    { id: 'dehydration', name: 'Dehydration', icon: '💧' },
    { id: 'cramping', name: 'Muscle\ncramps', icon: '⚡' },
    { id: 'bloating', name: 'Bloating', icon: '👍' },
    { id: 'inconsistent-routine', name: 'Inconsistent\nroutine', icon: '⏱️' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
  'Better sleep': [
    { id: 'falling-asleep', name: 'Trouble\nfalling asleep', icon: '🌙' },
    { id: 'waking-frequently', name: 'Waking up\nfrequently', icon: '⏰' },
    { id: 'morning-fatigue', name: 'Morning\nfatigue', icon: '🥱' },
    { id: 'night-cravings', name: 'Late night\ncravings', icon: '🧁' },
    { id: 'high-stress', name: 'Restless mind', icon: '🧠' },
    { id: 'caffeine-reliance', name: 'Caffeine\nreliance', icon: '☕' },
    { id: 'digestive-discomfort', name: 'Night acidity', icon: '🍵' },
    { id: 'irregular-hours', name: 'Irregular\nhours', icon: '📱' },
    { id: 'low-energy', name: 'Daytime\nslumps', icon: '🪫' },
    { id: 'headaches', name: 'Tension\nheadaches', icon: '🤕' },
    { id: 'mood-swings', name: 'Irritability', icon: '😤' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
  'Better digestion': [
    { id: 'bloating', name: 'Bloating\nafter meals', icon: '👍' },
    { id: 'acidity', name: 'Acidity &\nheartburn', icon: '🔥' },
    { id: 'gas-indigestion', name: 'Gas &\nindigestion', icon: '💨' },
    { id: 'irregular-bowel', name: 'Irregular\nbowels', icon: '🚽' },
    { id: 'food-sensitivities', name: 'Food\nsensitivities', icon: '🌾' },
    { id: 'low-energy', name: 'Post-meal\nfatigue', icon: '🪫' },
    { id: 'nausea', name: 'Stomach\nheaviness', icon: '🤢' },
    { id: 'sugar-cravings', name: 'Sugar\ncravings', icon: '🧁' },
    { id: 'poor-appetite', name: 'Unpredictable\nappetite', icon: '🍽️' },
    { id: 'skin-breakouts', name: 'Skin\nbreakouts', icon: '💆‍♀️' },
    { id: 'stress-gut', name: 'Stress gut', icon: '🧠' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
  'Improve overall health': [
    { id: 'low-energy', name: 'Daily fatigue', icon: '🪫' },
    { id: 'frequent-illness', name: 'Low immunity', icon: '🤒' },
    { id: 'inconsistent-diet', name: 'Irregular\neating', icon: '🍱' },
    { id: 'bloating', name: 'Bloating', icon: '👍' },
    { id: 'high-stress', name: 'Stress &\nburnout', icon: '🧠' },
    { id: 'poor-sleep', name: 'Unrefreshing\nsleep', icon: '🌙' },
    { id: 'sugar-cravings', name: 'Sugar\ncravings', icon: '🧁' },
    { id: 'sedentary-habits', name: 'Sitting long\nhours', icon: '💻' },
    { id: 'dehydration', name: 'Low water\nintake', icon: '💧' },
    { id: 'mood-swings', name: 'Mood dips', icon: '☁️' },
    { id: 'weight-fluctuation', name: 'Weight\nchanges', icon: '⚖️' },
    { id: 'others', name: 'Others', icon: '⋯' },
  ],
};

const GOAL_PRIORITIES_MAP: Record<string, PriorityItem[]> = {
  'Manage PCOS symptoms': [
    { id: 'regulate-menstrual-cycle', num: 1, icon: '📅', title: 'Regulate menstrual cycle', desc: 'More regular, less painful periods' },
    { id: 'reduce-acne', num: 2, icon: '💆‍♀️', title: 'Reduce acne', desc: 'Clearer, healthier skin' },
    { id: 'manage-weight', num: 3, icon: '⚖️', title: 'Manage weight', desc: 'Sustainable and healthy weight balance' },
    { id: 'improve-energy', num: 4, icon: '⚡', title: 'Improve energy levels', desc: 'Feel active and less fatigued' },
    { id: 'reduce-bloating', num: 5, icon: '👍', title: 'Reduce bloating', desc: 'Less discomfort and better digestion' },
  ],
  'Weight management': [
    { id: 'sustainable-weight-loss', num: 1, icon: '⚖️', title: 'Sustainable fat loss', desc: 'Steady caloric deficit with filling whole meals' },
    { id: 'curb-cravings', num: 2, icon: '🧁', title: 'Control sugar cravings', desc: 'Protein-rich snacks and balanced glycemic load' },
    { id: 'boost-metabolism', num: 3, icon: '⚡', title: 'Boost metabolic rate', desc: 'Fuel active metabolism with nutrient density' },
    { id: 'build-consistency', num: 4, icon: '🌱', title: 'Build lasting daily habits', desc: 'Enjoyable foods without restrictive diets' },
    { id: 'reduce-bloating', num: 5, icon: '🍵', title: 'Reduce fluid retention', desc: 'Less bloating and lighter gut feel' },
  ],
  'Improve fitness & strength': [
    { id: 'build-strength', num: 1, icon: '💪', title: 'Build lean muscle & strength', desc: 'Optimal protein distribution across all meals' },
    { id: 'boost-stamina', num: 2, icon: '🏃', title: 'Improve endurance & stamina', desc: 'Sustained complex carbs for long workouts' },
    { id: 'faster-recovery', num: 3, icon: '⚡', title: 'Faster muscle recovery', desc: 'Anti-inflammatory nutrients and hydration' },
    { id: 'workout-fuel', num: 4, icon: '🥗', title: 'Smart pre & post workout fuel', desc: 'Timed nutrition for peak training performance' },
    { id: 'joint-health', num: 5, icon: '🦴', title: 'Support joints & flexibility', desc: 'Micronutrients for joint integrity' },
  ],
  'Better sleep': [
    { id: 'fall-asleep-faster', num: 1, icon: '🌙', title: 'Fall asleep faster', desc: 'Magnesium and tryptophan rich dinner choices' },
    { id: 'deep-sleep', num: 2, icon: '😴', title: 'Deeper, uninterrupted sleep', desc: 'Stable nighttime blood sugar without crashes' },
    { id: 'wake-energized', num: 3, icon: '⚡', title: 'Wake up energized', desc: 'Start morning refreshed without heavy fog' },
    { id: 'cut-night-cravings', num: 4, icon: '🍵', title: 'Stop late night snacking', desc: 'Satiating dinners that calm gut digestion' },
    { id: 'reduce-stress', num: 5, icon: '🪷', title: 'Calm nervous system', desc: 'Nutritional support to lower evening cortisol' },
  ],
  'Better digestion': [
    { id: 'reduce-bloating', num: 1, icon: '🍵', title: 'Eliminate daily bloating', desc: 'Gentle, easy-to-digest fiber combinations' },
    { id: 'gut-microbiome', num: 2, icon: '🌱', title: 'Strengthen gut microbiome', desc: 'Prebiotics and probiotic cultured foods' },
    { id: 'smooth-regularity', num: 3, icon: '🚽', title: 'Improve bowel regularity', desc: 'Hydration and optimal soluble fiber balance' },
    { id: 'ease-acidity', num: 4, icon: '🥛', title: 'Soothe acidity & reflux', desc: 'Alkalizing and soothing ingredient swaps' },
    { id: 'identify-triggers', num: 5, icon: '🔍', title: 'Identify food sensitivities', desc: 'Pinpoint and swap uncomfortable foods' },
  ],
  'Improve overall health': [
    { id: 'all-day-vitality', num: 1, icon: '⚡', title: 'All-day vibrant energy', desc: 'Even energy without mid-afternoon crashes' },
    { id: 'strengthen-immunity', num: 2, icon: '🛡️', title: 'Strengthen immune defenses', desc: 'Antioxidants and micronutrient-dense meals' },
    { id: 'healthy-heart', num: 3, icon: '❤️', title: 'Cardiovascular & lipid health', desc: 'Healthy fats, omega-3s and high fiber' },
    { id: 'gut-wellbeing', num: 4, icon: '🍵', title: 'Smooth digestion & gut feel', desc: 'Wholesome gut-nourishing daily recipes' },
    { id: 'healthy-habits', num: 5, icon: '🌱', title: 'Sustainable lifestyle balance', desc: 'Effortless routines that easily stick for life' },
  ],
};

export const GoalSettingSymptomsScreen: React.FC<GoalSettingSymptomsScreenProps> = ({
  selectedGoal = 'Manage PCOS symptoms',
  initialSymptoms,
  initialPriorities,
  onBack,
  onContinue,
  onChangeGoal,
}) => {
  const currentSymptomsList = GOAL_SYMPTOMS_MAP[selectedGoal] || GOAL_SYMPTOMS_MAP['Manage PCOS symptoms'];
  const currentPrioritiesList = GOAL_PRIORITIES_MAP[selectedGoal] || GOAL_PRIORITIES_MAP['Manage PCOS symptoms'];

  const defaultSymptoms = initialSymptoms && initialSymptoms.length > 0
    ? initialSymptoms
    : currentSymptomsList.slice(0, 4).map((s) => s.id);

  const defaultPriorities = initialPriorities && initialPriorities.length > 0
    ? initialPriorities
    : currentPrioritiesList.slice(0, 3).map((p) => p.id);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(defaultSymptoms);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(defaultPriorities);

  // When selectedGoal changes from parent, re-initialize if no explicit custom selections
  useEffect(() => {
    if (!initialSymptoms) {
      setSelectedSymptoms(currentSymptomsList.slice(0, 4).map((s) => s.id));
    }
    if (!initialPriorities) {
      setSelectedPriorities(currentPrioritiesList.slice(0, 3).map((p) => p.id));
    }
  }, [selectedGoal]);

  const goalInfo = GOAL_DETAILS[selectedGoal] || {
    desc: 'Personalized nutrition and lifestyle recommendations for your body.',
    emoji: '🌱',
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      } else {
        if (prev.length >= 3) {
          return [prev[1], prev[2], id];
        }
        return [...prev, id];
      }
    });
  };

  const handleContinue = () => {
    onContinue({
      selectedSymptoms,
      topPriorities: selectedPriorities,
    });
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar Header ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <Text style={{ fontSize: 16, marginRight: 4 }}>🌱</Text>
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.stepText}>2 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
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
            <Text style={styles.mainTitle}>Let's understand your focus better</Text>
            <Text style={styles.subDesc}>
              Tell us more about what you currently experience and what you would like to improve.
            </Text>
          </View>
          <View style={styles.characterArtBox}>
            <Text style={{ fontSize: 52 }}>🧘‍♀️</Text>
          </View>
        </View>

        {/* Selected Goal Banner Card */}
        <View style={styles.selectedGoalCard}>
          <View style={styles.selectedGoalIconCircle}>
            <Text style={{ fontSize: 22 }}>{goalInfo.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectedGoalKicker}>Selected Goal</Text>
            <Text style={styles.selectedGoalTitle}>{selectedGoal}</Text>
            <Text style={styles.selectedGoalDesc}>
              {goalInfo.desc}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeGoalBtn}
            onPress={onChangeGoal}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 11, marginRight: 3 }}>✎</Text>
            <Text style={styles.changeGoalText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section: Which symptoms do you currently experience? ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Which symptoms do you currently experience?</Text>
          <Text style={styles.sectionSub}>Select all that apply.</Text>
        </View>

        {/* 4-Column Symptoms Grid */}
        <View style={styles.symptomsGrid}>
          {currentSymptomsList.map((item) => {
            const isChecked = selectedSymptoms.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.symptomTile, isChecked && styles.symptomTileChecked]}
                onPress={() => toggleSymptom(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.tileCheckAnchor}>
                  {isChecked ? (
                    <View style={styles.tileCheckCircle}>
                      <CheckIcon size={10} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.tileEmptyCircle} />
                  )}
                </View>
                <Text style={styles.symptomIconEmoji}>{item.icon}</Text>
                <Text
                  style={[styles.symptomTileLabel, isChecked && styles.symptomTileLabelChecked]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section: What would you like to improve the most? ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What would you like to improve the most?</Text>
          <Text style={styles.sectionSub}>Choose up to 3 priorities.</Text>
        </View>

        <View style={styles.prioritiesList}>
          {currentPrioritiesList.map((p) => {
            const isChecked = selectedPriorities.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.priorityRow, isChecked && styles.priorityRowChecked]}
                onPress={() => togglePriority(p.id)}
                activeOpacity={0.85}
              >
                <View style={styles.priorityNumCircle}>
                  <Text style={styles.priorityNumText}>{p.num}</Text>
                </View>

                <View style={styles.priorityIconWrapper}>
                  <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.priorityTitle}>{p.title}</Text>
                  <Text style={styles.priorityDesc}>{p.desc}</Text>
                </View>

                <View style={[styles.priorityCheckbox, isChecked && styles.priorityCheckboxChecked]}>
                  {isChecked && <CheckIcon size={12} color="#FFFFFF" />}
                </View>

                <Text style={styles.dragHandleDots}>::</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => onContinue({ selectedSymptoms, topPriorities: selectedPriorities })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue  →</Text>
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
    paddingBottom: 36,
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
    lineHeight: 16,
  },
  characterArtBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDEEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginBottom: 20,
  },
  selectedGoalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F7F4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedGoalKicker: {
    fontSize: 9.5,
    color: '#737970',
    fontWeight: '600',
  },
  selectedGoalTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  selectedGoalDesc: {
    fontSize: 10.5,
    color: '#686B63',
    marginTop: 1,
  },
  changeGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeGoalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262923',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sectionSub: {
    fontSize: 11.5,
    color: '#737970',
    marginTop: 2,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  symptomTile: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
    minHeight: 88,
    justifyContent: 'center',
  },
  symptomTileChecked: {
    backgroundColor: '#F5FAF3',
    borderColor: '#5C6E52',
  },
  tileCheckAnchor: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  tileCheckCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmptyCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#D4CFC6',
  },
  symptomIconEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  symptomTileLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: '#444740',
    textAlign: 'center',
    lineHeight: 12,
  },
  symptomTileLabelChecked: {
    color: '#264428',
    fontWeight: '700',
  },
  prioritiesList: {
    gap: 10,
    marginBottom: 24,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
  },
  priorityRowChecked: {
    borderColor: '#5C6E52',
    backgroundColor: '#FAFBF9',
  },
  priorityNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  priorityNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#737970',
  },
  priorityIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FAF8F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  priorityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  priorityDesc: {
    fontSize: 10.5,
    color: '#737970',
    marginTop: 1,
  },
  priorityCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#C5C1B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  priorityCheckboxChecked: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  dragHandleDots: {
    fontSize: 14,
    color: '#B5B0A6',
    fontWeight: '900',
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6E52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

