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
  LeafIcon,
  BellIcon,
  ChevronRightIcon,
  UtensilsCrossed,
  ScaleIcon,
  TargetIcon,
  PlanIcon,
  ActivityIcon,
  FileTextIcon,
  StethoscopeIcon,
  WaterIcon,
  SparkleIcon,
} from '../components/Icons';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  iconComponent: React.ReactNode;
  iconBg: string;
  badge?: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'health-restore',
    title: 'Health & Restore',
    subtitle: 'Conditions, gut & care',
    iconComponent: <LeafIcon size={18} color="#29482F" />,
    iconBg: '#E9ECDF',
    badge: 'Clinical',
  },
  {
    id: 'log-meal',
    title: 'Log Your Meal',
    subtitle: 'Track daily plate intake',
    iconComponent: <UtensilsCrossed size={18} color="#29482F" />,
    iconBg: '#E9ECDF',
  },
  {
    id: 'nutrition-calc',
    title: 'Nutrition Calculations',
    subtitle: 'BMI, BMR, TDEE, IBW',
    iconComponent: <ScaleIcon size={18} color="#29482F" />,
    iconBg: '#E9ECDF',
  },
  {
    id: 'goal-setting',
    title: 'Goal Setting',
    subtitle: 'Clinical onboarding target',
    iconComponent: <TargetIcon size={18} color="#855B1E" />,
    iconBg: '#F3E8D3',
    badge: 'Step 1-6',
  },
  {
    id: 'meal-builder',
    title: 'Meal Plan Builder',
    subtitle: 'Personalized recipes & plates',
    iconComponent: <PlanIcon size={18} color="#524C42" />,
    iconBg: '#ECE7DD',
  },
  {
    id: 'progress-tracker',
    title: 'Progress Tracker',
    subtitle: 'Monitor clinical metrics',
    iconComponent: <ActivityIcon size={18} color="#29482F" />,
    iconBg: '#E9ECDF',
  },
  {
    id: 'recipe-library',
    title: 'Recipe Library',
    subtitle: 'Therapeutic meal library',
    iconComponent: <FileTextIcon size={18} color="#524C42" />,
    iconBg: '#ECE7DD',
  },
  {
    id: 'symptom-tracker',
    title: 'Symptom & Cycle',
    subtitle: 'Track cycle & biomarkers',
    iconComponent: <SparkleIcon size={18} color="#855B1E" />,
    iconBg: '#F3E8D3',
  },
  {
    id: 'nutritionist-editor',
    title: 'Nutritionist Editor',
    subtitle: 'Review & approve plans',
    iconComponent: <StethoscopeIcon size={18} color="#29482F" />,
    iconBg: '#E9ECDF',
    badge: 'Pro',
  },
  {
    id: 'water-lifestyle',
    title: 'Water & Lifestyle',
    subtitle: 'Circadian hydration & habits',
    iconComponent: <WaterIcon size={18} color="#2B70C9" />,
    iconBg: '#E3EDF8',
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
          <LeafIcon size={20} color="#3D5C3E" />
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <BellIcon size={19} color="#2E2A26" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onOpenProfile}
            activeOpacity={0.8}
            accessibilityLabel="Profile"
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
            Practical clinical tools to understand your body, set targets and take charge of your metabolic health.
          </Text>
        </View>

        {/* Featured Health & Restore Card (Clean Mobbin Style) */}
        <TouchableOpacity
          style={styles.featuredHealthCard}
          onPress={() => onSelectTool('health-restore')}
          activeOpacity={0.88}
        >
          <Image
            source={require('../../assets/images/healthcare-bowl.jpg')}
            style={styles.featuredHealthImg}
            resizeMode="cover"
          />
          <View style={styles.featuredHealthOverlay} />
          <View style={styles.featuredHealthContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>CLINICAL CARE</Text>
            </View>
            <Text style={styles.featuredTitle}>Health &amp; Restore</Text>
            <Text style={styles.featuredSub}>
              Conditions, gut health, hormonal balance &amp; nutrient guidance
            </Text>
            <View style={styles.featuredActionRow}>
              <Text style={styles.featuredActionText}>Explore Condition Care</Text>
              <ChevronRightIcon size={13} color="#3D5C3E" />
            </View>
          </View>
        </TouchableOpacity>

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
                {tool.iconComponent}
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
    paddingTop: 10,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#2E2A26',
    letterSpacing: -0.3,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
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
    paddingBottom: 36,
  },
  headingSection: {
    marginTop: 6,
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#2E2A26',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: '#706860',
    lineHeight: 18,
    marginTop: 4,
  },
  featuredHealthCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2DBD0',
    backgroundColor: '#FFFFFF',
    minHeight: 136,
  },
  featuredHealthImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    height: '100%',
  },
  featuredHealthOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  featuredHealthContent: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
    width: '75%',
  },
  featuredBadge: {
    backgroundColor: '#3D5C3E',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 3,
  },
  featuredSub: {
    fontSize: 11,
    color: '#5D5952',
    lineHeight: 15,
    marginBottom: 10,
  },
  featuredActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolCard: {
    width: '48.3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E2D6',
    minHeight: 132,
    position: 'relative',
  },
  toolBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E9ECDF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  toolBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#29482F',
  },
  toolIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 3,
  },
  toolSubtitle: {
    fontSize: 10.5,
    color: '#706860',
    lineHeight: 14,
  },
});
