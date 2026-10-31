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
import {
  LeafIcon,
  BellIcon,
  ChevronRightIcon,
  UtensilsCrossed,
  FlameIcon,
  DumbbellIcon,
  SproutIcon,
  CalendarIcon,
  StethoscopeIcon,
  ScaleIcon,
  ActivityIcon,
} from '../components/Icons';

export interface HomeScreenProps {
  onNavigateToExplore: () => void;
  onNavigateToMealPlan: () => void;
  onNavigateToCalculations: () => void;
  onNavigateToCareTeam: () => void;
  onNavigateToHealthRestore: () => void;
  onNavigateToEditPlan: () => void;
  onNavigateToProfile: () => void;
  onNavigateToMealDetail?: (mealId?: string) => void;
  userName?: string;
  conditionName?: string;
}

interface ExploreItem {
  id: string;
  title: string;
  description: string;
  image: any;
  action: () => void;
}

interface FocusItem {
  id: string;
  title: string;
  iconComponent: React.ReactNode;
  toneBg: string;
  action: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToExplore,
  onNavigateToMealPlan,
  onNavigateToCalculations,
  onNavigateToCareTeam,
  onNavigateToHealthRestore,
  onNavigateToEditPlan,
  onNavigateToProfile,
  onNavigateToMealDetail,
  userName = 'Riya Sharma',
  conditionName = 'PCOS',
}) => {
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const firstName = userName?.trim().split(/\s+/)[0] || 'there';
  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'NV';

  const exploreItems: ExploreItem[] = [
    {
      id: 'health-restore',
      title: 'Health & Restore',
      description: 'Conditions, gut health & care',
      image: require('../../assets/images/healthcare-bowl.jpg'),
      action: onNavigateToHealthRestore,
    },
    {
      id: 'fitness',
      title: 'Strength & Fuel',
      description: 'Fitness, energy & targets',
      image: require('../../assets/images/fitness-plate.jpg'),
      action: onNavigateToCalculations,
    },
    {
      id: 'meals',
      title: 'Meals & Recipes',
      description: 'Personalized meal inspiration',
      image: require('../../assets/images/discover-bowl.jpg'),
      action: () => {
        if (onNavigateToMealDetail) onNavigateToMealDetail('moong-dal-chilla');
        else onNavigateToMealPlan();
      },
    },
    {
      id: 'consult',
      title: 'Consult Experts',
      description: 'Nutritionists, coaches & doctors',
      image: require('../../assets/images/nutritionist-ananya.webp'),
      action: onNavigateToCareTeam,
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Trusted wellness essentials',
      image: require('../../assets/images/market-hero-plate.png'),
      action: onNavigateToCareTeam,
    },
    {
      id: 'track',
      title: 'Track & Journal',
      description: 'Biomarkers, habits & progress',
      image: require('../../assets/images/card4-ref.png'),
      action: onNavigateToCalculations,
    },
  ];

  const focusItems: FocusItem[] = [
    {
      id: 'log',
      title: 'Log your meals',
      iconComponent: <UtensilsCrossed size={17} color="#29482F" />,
      toneBg: '#E9ECDF',
      action: onNavigateToEditPlan,
    },
    {
      id: 'plan',
      title: 'Plan today’s plate',
      iconComponent: <CalendarIcon size={17} color="#855B1E" />,
      toneBg: '#F3E8D3',
      action: onNavigateToMealPlan,
    },
    {
      id: 'move',
      title: 'Move with intention',
      iconComponent: <DumbbellIcon size={17} color="#2E4832" />,
      toneBg: '#D5DFD1',
      action: onNavigateToCalculations,
    },
    {
      id: 'coach',
      title: 'Talk to a coach',
      iconComponent: <StethoscopeIcon size={17} color="#524C42" />,
      toneBg: '#ECE7DD',
      action: onNavigateToCareTeam,
    },
  ];

  return (
    <View style={styles.container}>
      {/* ── Top Header Bar (Mobbin Clean Aesthetic) ── */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <LeafIcon size={20} color="#3D5C3E" />
          <Text style={styles.brandTitle}>NutriVerse</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={onNavigateToCareTeam}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <BellIcon size={19} color="#4A4036" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={onNavigateToProfile}
            activeOpacity={0.8}
            accessibilityLabel="Profile"
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Greeting Section (Crisp, High-End Photography) ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.greetingEyebrow}>{greeting}</Text>
            <Text style={styles.greetingName}>{firstName}</Text>
            <Text style={styles.heroTagline}>
              Small, consistent choices create lasting metabolic health.
            </Text>
          </View>

          <View style={styles.heroImageWrapper}>
            <Image
              source={require('../../assets/images/hero-bowl.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* ── Continue Your Journey Card (Links to Health & Restore) ── */}
        <TouchableOpacity
          style={styles.journeyCard}
          onPress={onNavigateToHealthRestore}
          activeOpacity={0.88}
        >
          <View style={styles.journeyCopy}>
            <View style={styles.journeyBadgeRow}>
              <Text style={styles.eyebrow}>YOUR CARE JOURNEY</Text>
              <View style={styles.activeDot} />
            </View>

            <Text style={styles.journeyTitle}>Manage {conditionName}</Text>

            <View style={styles.journeyProgressMeta}>
              <Text style={styles.journeySignalText}>4 of 5 clinical signals ready</Text>
              <Text style={styles.journeySignalPercent}>80%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressTrackFill, { width: '80%' }]} />
            </View>
          </View>

          <View style={styles.journeyAction}>
            <ChevronRightIcon size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* ── Section: Explore ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Explore</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToExplore}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>View all</Text>
            <ChevronRightIcon size={13} color="#5C6B5C" />
          </TouchableOpacity>
        </View>

        <View style={styles.exploreGrid}>
          {exploreItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.exploreCard}
              onPress={item.action}
              activeOpacity={0.85}
            >
              <View style={styles.exploreMediaContainer}>
                <Image
                  source={item.image}
                  style={styles.exploreImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.exploreCopy}>
                <Text style={styles.exploreTitle}>{item.title}</Text>
                <View style={styles.exploreFooter}>
                  <Text style={styles.exploreDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.exploreArrowCircle}>
                    <ChevronRightIcon size={11} color="#334E34" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Section: Your Progress ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Your progress</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToCalculations}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>View calculations</Text>
            <ChevronRightIcon size={13} color="#5C6B5C" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.progressCard}
          onPress={onNavigateToCalculations}
          activeOpacity={0.88}
        >
          {/* Dial Graphic */}
          <View style={styles.progressRingWrapper}>
            <View style={styles.progressRingOuter}>
              <View style={styles.progressRingInner}>
                <Text style={styles.progressRingBigText}>67%</Text>
                <Text style={styles.progressRingSubText}>Rhythm</Text>
              </View>
            </View>
          </View>

          {/* Progress Metrics List (Pure Clean Vector Icons, No Emojis) */}
          <View style={styles.progressList}>
            <View style={styles.progressItem}>
              <View style={styles.metricIconWrap}>
                <UtensilsCrossed size={14} color="#3D5C3E" />
              </View>
              <Text style={styles.progressItemLabel}>Meals logged</Text>
              <Text style={styles.progressItemVal}>2</Text>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.metricIconWrap}>
                <FlameIcon size={14} color="#B45309" />
              </View>
              <Text style={styles.progressItemLabel}>Energy intake</Text>
              <Text style={styles.progressItemVal}>1,490 kcal</Text>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.metricIconWrap}>
                <DumbbellIcon size={14} color="#3D5C3E" />
              </View>
              <Text style={styles.progressItemLabel}>Protein logged</Text>
              <Text style={styles.progressItemVal}>76 g</Text>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.metricIconWrap}>
                <SproutIcon size={14} color="#3D5C3E" />
              </View>
              <Text style={styles.progressItemLabel}>Current streak</Text>
              <Text style={styles.progressItemVal}>5 days</Text>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.metricIconWrap}>
                <CalendarIcon size={14} color="#706860" />
              </View>
              <Text style={styles.progressItemLabel}>Weekly variety</Text>
              <Text style={styles.progressItemVal}>8 recipes</Text>
            </View>
          </View>

          <View style={styles.progressCardArrow}>
            <ChevronRightIcon size={15} color="#334E34" />
          </View>
        </TouchableOpacity>

        {/* ── Section: Today's Focus (4 Cards) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Today’s focus</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToMealPlan}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Open plan</Text>
            <ChevronRightIcon size={13} color="#5C6B5C" />
          </TouchableOpacity>
        </View>

        <View style={styles.focusGrid}>
          {focusItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.focusCard}
              onPress={item.action}
              activeOpacity={0.85}
            >
              <View style={[styles.focusIconBadge, { backgroundColor: item.toneBg }]}>
                {item.iconComponent}
              </View>
              <Text style={styles.focusTitle}>{item.title}</Text>
              <View style={styles.focusArrow}>
                <ChevronRightIcon size={13} color="#3D5C3E" />
              </View>
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
  header: {
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
    fontSize: 21,
    fontWeight: '700',
    color: '#2D4530',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E9ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8DEC9',
  },
  avatarText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334E34',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F1E6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E1D2',
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroCopy: {
    flex: 1,
    paddingRight: 12,
  },
  greetingEyebrow: {
    fontSize: 12,
    color: '#706860',
    fontWeight: '500',
    marginBottom: 2,
  },
  greetingName: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2A26',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  heroTagline: {
    fontSize: 11.5,
    color: '#706860',
    marginTop: 6,
    lineHeight: 16,
  },
  heroImageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2DBD0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  journeyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#1F2E1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  journeyCopy: {
    flex: 1,
    paddingRight: 12,
  },
  journeyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#3D5C3E',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  journeyTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 24,
  },
  journeyProgressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  journeySignalText: {
    fontSize: 10.5,
    color: '#706860',
  },
  journeySignalPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334E34',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#ECE6DA',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#3D5C3E',
    borderRadius: 2.5,
  },
  journeyAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3D5C3E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D5C3E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: '#2E2A26',
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionActionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#5C6B5C',
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  exploreCard: {
    width: '48.3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E2D6',
    overflow: 'hidden',
    shadowColor: '#1F2E1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  exploreMediaContainer: {
    height: 98,
    backgroundColor: '#E9ECDF',
  },
  exploreImage: {
    width: '100%',
    height: '100%',
  },
  exploreCopy: {
    padding: 10,
  },
  exploreTitle: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 3,
  },
  exploreFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 2,
  },
  exploreDesc: {
    flex: 1,
    fontSize: 10,
    color: '#706860',
    lineHeight: 13.5,
  },
  exploreArrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#E8E2D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    padding: 14,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#1F2E1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  progressRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressRingOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#3D5C3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingBigText: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 19,
  },
  progressRingSubText: {
    fontSize: 8.5,
    color: '#706860',
    marginTop: 1,
  },
  progressList: {
    flex: 1,
    gap: 5,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressItemLabel: {
    flex: 1,
    fontSize: 10.5,
    color: '#4A4036',
  },
  progressItemVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2E2A26',
  },
  progressCardArrow: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  focusCard: {
    width: '48.3%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E2D6',
    padding: 10,
    gap: 8,
  },
  focusIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 14.5,
  },
  focusArrow: {
    marginLeft: 2,
  },
});
