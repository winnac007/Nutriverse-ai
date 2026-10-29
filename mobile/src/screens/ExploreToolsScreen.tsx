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
  TargetIcon,
  BmiIcon,
  ChefHatIcon,
  MealIcon,
  WaterIcon,
  CalendarIcon,
} from '../components/Icons';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  badge?: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'log-meal',
    title: 'Log Your Meal',
    subtitle: 'Track what you eat',
    icon: '🍽️',
    iconBg: '#FCEFE9',
  },
  {
    id: 'nutrition-calc',
    title: 'Nutrition Calculations',
    subtitle: 'BMI, BMR, TDEE, IBW',
    icon: '📊',
    iconBg: '#EAF5EC',
  },
  {
    id: 'goal-setting',
    title: 'Goal Setting',
    subtitle: 'Set your goals',
    icon: '🎯',
    iconBg: '#FAF5E8',
    badge: 'Step 1-6',
  },
  {
    id: 'meal-builder',
    title: 'Meal Plan Builder',
    subtitle: 'Personalized plans',
    icon: '🥗',
    iconBg: '#F3EFE7',
  },
  {
    id: 'progress-tracker',
    title: 'Progress Tracker',
    subtitle: 'Monitor your journey',
    icon: '📈',
    iconBg: '#E9F5F8',
  },
  {
    id: 'recipe-library',
    title: 'Recipe Library',
    subtitle: 'Explore healthy recipes',
    icon: '📖',
    iconBg: '#F6EFEB',
  },
  {
    id: 'symptom-tracker',
    title: 'Symptom & Cycle Tracker',
    subtitle: 'Track your cycle, symptoms',
    icon: '🌸',
    iconBg: '#FBECEE',
  },
  {
    id: 'nutritionist-editor',
    title: 'Nutritionist Plan Editor',
    subtitle: 'Client meals & portions',
    icon: '🧑‍⚕️',
    iconBg: '#EAF0E6',
    badge: 'Pro',
  },
  {
    id: 'water-lifestyle',
    title: 'Water & Lifestyle',
    subtitle: 'Build healthy habits',
    icon: '💧',
    iconBg: '#EDF5FD',
  },
];

interface ExploreToolsScreenProps {
  onSelectTool: (toolId: string) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const ExploreToolsScreen: React.FC<ExploreToolsScreenProps> = ({
  onSelectTool,
  onOpenNotifications,
  onOpenProfile,
}) => {
  return (
    <View style={styles.container}>
      {/* ── Top Bar Header ── */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={{ fontSize: 22, marginRight: 6 }}>🌱</Text>
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
          >
            <BellIcon size={20} color="#1C1D1A" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onOpenProfile}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/nutritionist-ananya.webp')}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Description */}
        <View style={styles.headingSection}>
          <Text style={styles.pageTitle}>Explore Tools</Text>
          <Text style={styles.pageSubtitle}>
            Practical tools to understand your body, set goals and take charge of your health.
          </Text>
        </View>

        {/* 2-Column Tools Grid */}
        <View style={styles.toolsGrid}>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => onSelectTool(tool.id)}
              activeOpacity={0.85}
            >
              {tool.badge && (
                <View style={styles.toolBadge}>
                  <Text style={styles.toolBadgeText}>{tool.badge}</Text>
                </View>
              )}
              <View style={[styles.toolIconSquare, { backgroundColor: tool.iconBg }]}>
                <Text style={styles.toolIconEmoji}>{tool.icon}</Text>
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
            </TouchableOpacity>
          ))}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.3,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#3D5C3E',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  headingSection: {
    marginTop: 6,
    marginBottom: 20,
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
    lineHeight: 18,
    color: '#686B63',
    marginTop: 4,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE8DF',
    minHeight: 140,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  toolBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EAF0E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  toolBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  toolIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolIconEmoji: {
    fontSize: 22,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 4,
  },
  toolSubtitle: {
    fontSize: 11,
    color: '#737970',
    lineHeight: 15,
  },
});

