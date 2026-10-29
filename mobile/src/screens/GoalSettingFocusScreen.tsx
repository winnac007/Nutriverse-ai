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
import { ChevronLeftIcon, CheckIcon, SproutIcon } from '../components/Icons';

interface GoalSettingFocusScreenProps {
  initialGoal?: string;
  onBack: () => void;
  onContinue: (selectedGoal: string) => void;
}

interface GoalOption {
  id: string;
  title: string;
  subtitle: string;
  pills: string[];
  emoji: string;
}

const GOALS: GoalOption[] = [
  {
    id: 'Manage PCOS symptoms',
    title: 'Manage PCOS symptoms',
    subtitle: 'Balance hormones, regulate cycles and improve overall wellbeing.',
    pills: ['Hormonal balance', 'Better cycles', 'Clearer skin'],
    emoji: '⚖️🌿',
  },
  {
    id: 'Weight management',
    title: 'Weight management',
    subtitle: 'Lose, maintain or gain weight in a healthy way.',
    pills: ['Lose weight', 'Maintain weight', 'Healthy gain'],
    emoji: '⚖️🌱',
  },
  {
    id: 'Improve fitness & strength',
    title: 'Improve fitness & strength',
    subtitle: 'Build stamina, increase energy and feel stronger.',
    pills: ['More energy', 'Build strength', 'Better endurance'],
    emoji: '👟🌿',
  },
  {
    id: 'Better sleep',
    title: 'Better sleep',
    subtitle: 'Improve sleep quality and daily energy.',
    pills: ['Fall asleep faster', 'Stay asleep longer', 'Feel rested'],
    emoji: '🌙😴',
  },
  {
    id: 'Better digestion',
    title: 'Better digestion',
    subtitle: 'Reduce bloating, manage acidity and improve gut health.',
    pills: ['Less bloating', 'Regular digestion', 'Gut comfort'],
    emoji: '🍵🍃',
  },
  {
    id: 'Improve overall health',
    title: 'Improve overall health',
    subtitle: 'Build sustainable healthy habits for long-term wellbeing.',
    pills: ['More energy', 'Stronger immunity', 'Balanced lifestyle'],
    emoji: '❤️🌱',
  },
  {
    id: 'Other goal',
    title: 'Other goal',
    subtitle: 'Tell us your specific goal.',
    pills: [],
    emoji: '➕',
  },
];

export const GoalSettingFocusScreen: React.FC<GoalSettingFocusScreenProps> = ({
  initialGoal = 'Manage PCOS symptoms',
  onBack,
  onContinue,
}) => {
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);

  useEffect(() => {
    if (initialGoal) {
      setSelectedGoal(initialGoal);
    }
  }, [initialGoal]);

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
          <Text style={styles.stepText}>1 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Goal Setting</Text>
          <Text style={styles.subHeading}>What would you like to focus on?</Text>
          <Text style={styles.subDesc}>Choose your primary goal. You can always add more later.</Text>
        </View>

        {/* Personalized Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconCircle}>
            <Text style={{ fontSize: 18 }}>🌱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Your goal helps us create a personalized plan</Text>
            <Text style={styles.bannerDesc}>
              We'll tailor your nutrition, activity and lifestyle recommendations based on your goal and your health condition.
            </Text>
          </View>
          <Image
            source={require('../../assets/images/botanical-branch-clean.png')}
            style={styles.bannerLeaves}
            resizeMode="contain"
          />
        </View>

        {/* Goal Cards List */}
        <View style={styles.goalsList}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => setSelectedGoal(goal.id)}
                activeOpacity={0.88}
              >
                {/* Artwork Graphic */}
                <View style={styles.goalArtCircle}>
                  <Text style={{ fontSize: 24 }}>{goal.emoji}</Text>
                </View>

                {/* Content */}
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>

                  {/* Pills */}
                  {goal.pills.length > 0 && (
                    <View style={styles.pillsRow}>
                      {goal.pills.map((pill) => (
                        <View key={pill} style={styles.tagPill}>
                          <Text style={styles.tagPillText}>{pill}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Radio Indicator */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInnerDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => onContinue(selectedGoal)}
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
  titleSection: {
    marginTop: 6,
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#343831',
    marginTop: 4,
  },
  subDesc: {
    fontSize: 12.5,
    color: '#686B63',
    marginTop: 2,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: '#E6E0D4',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: '#555850',
    paddingRight: 20,
  },
  bannerLeaves: {
    position: 'absolute',
    right: -10,
    top: 0,
    bottom: 0,
    width: 70,
    opacity: 0.35,
  },
  goalsList: {
    gap: 12,
    marginBottom: 24,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ECE8DF',
    padding: 14,
  },
  goalCardSelected: {
    borderColor: '#5C6E52',
    backgroundColor: '#FAFBF9',
  },
  goalArtCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  goalSubtitle: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#686B63',
    marginTop: 2,
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#F5F2EB',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A4E46',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C5C1B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioCircleSelected: {
    borderColor: '#3D5C3E',
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3D5C3E',
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

