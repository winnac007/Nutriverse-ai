import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  BookmarkIcon,
  ShieldIcon,
  ScaleIcon,
  TargetIcon,
  PlanIcon,
  ActivityIcon,
  StethoscopeIcon,
  FileTextIcon,
  SparkleIcon,
  CloseIcon,
  LeafIcon,
  HeartIcon,
  UtensilsCrossed,
  ClockIcon,
} from '../components/Icons';

export interface HealthCondition {
  id: string;
  label: string;
  blurb: string;
  badgeCode: string;
  category?: string;
  keyNutrients: string;
}

const CONDITIONS: HealthCondition[] = [
  {
    id: 'pcos',
    label: 'PCOS',
    blurb: 'Insulin-friendly, anti-inflammatory guidance for hormonal balance.',
    badgeCode: 'PCOS',
    category: 'hormonal',
    keyNutrients: 'Inositol, Zinc, Omega-3, Magnesium',
  },
  {
    id: 'hormonal-balance',
    label: 'Hormonal Balance',
    blurb: 'Browse thyroid, PCOS and other endocrine & cycle needs.',
    badgeCode: 'HOR',
    category: 'hormonal',
    keyNutrients: 'Healthy Fats, Vitamin D3, B-Complex',
  },
  {
    id: 'diabetes',
    label: 'Diabetes Support',
    blurb: 'Low-GI, high-fibre balance to stabilize glucose and HbA1c.',
    badgeCode: 'GLU',
    category: 'metabolic',
    keyNutrients: 'Complex Carbs, Chromium, Soluble Fibre',
  },
  {
    id: 'gut-health',
    label: 'Gut Health',
    blurb: 'Gentle meals, prebiotic fibres and habits that ease digestion.',
    badgeCode: 'GUT',
    category: 'digestive',
    keyNutrients: 'Probiotics, L-Glutamine, Polyphenols',
  },
  {
    id: 'high-cholesterol',
    label: 'Cholesterol Care',
    blurb: 'Soluble fibre and unsaturated plant fats for healthy lipid profile.',
    badgeCode: 'LIP',
    category: 'cardiovascular',
    keyNutrients: 'Plant Sterols, Beta-Glucan, MUFA',
  },
  {
    id: 'thyroid',
    label: 'Thyroid Support',
    blurb: 'Selenium and iodine balance supporting steady metabolic rate.',
    badgeCode: 'THY',
    category: 'hormonal',
    keyNutrients: 'Selenium, Zinc, Tyrosine, Iron',
  },
];

interface HealthRestoreScreenProps {
  onBack: () => void;
  onNavigateToCalculations: () => void;
  onNavigateToGoalSetting: (initialCondition?: string) => void;
  onNavigateToSymptoms: () => void;
  onNavigateToLifestyle: () => void;
  onNavigateToMealPlans: () => void;
  onNavigateToMealDetail: (mealId?: string) => void;
  onNavigateToEditPlan: () => void;
  onNavigateToCareTeam: () => void;
  onNavigateToProgress: () => void;
  initialConditionId?: string;
}

export const HealthRestoreScreen: React.FC<HealthRestoreScreenProps> = ({
  onBack,
  onNavigateToCalculations,
  onNavigateToGoalSetting,
  onNavigateToSymptoms,
  onNavigateToLifestyle,
  onNavigateToMealPlans,
  onNavigateToMealDetail,
  onNavigateToEditPlan,
  onNavigateToCareTeam,
  onNavigateToProgress,
  initialConditionId = 'pcos',
}) => {
  const [selectedConditionId, setSelectedConditionId] = useState<string>(initialConditionId);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [hasSampleReport, setHasSampleReport] = useState<boolean>(false);

  const activeCondition =
    CONDITIONS.find((c) => c.id === selectedConditionId) || CONDITIONS[0];

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      !isSaved ? 'Saved' : 'Removed',
      !isSaved
        ? 'Health & Restore has been pinned to your saved bookmarks.'
        : 'Health & Restore removed from bookmarks.'
    );
  };

  const getConditionIcon = (condId: string, isActive: boolean) => {
    const col = isActive ? '#29482F' : '#706860';
    switch (condId) {
      case 'pcos':
        return <LeafIcon size={18} color={col} />;
      case 'hormonal-balance':
        return <SparkleIcon size={18} color={col} />;
      case 'diabetes':
        return <ActivityIcon size={18} color={col} />;
      case 'gut-health':
        return <LeafIcon size={18} color={col} />;
      case 'high-cholesterol':
        return <HeartIcon size={18} color={col} />;
      case 'thyroid':
        return <TargetIcon size={18} color={col} />;
      default:
        return <LeafIcon size={18} color={col} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <ChevronLeftIcon size={18} color="#2E2A26" />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Health &amp; Restore</Text>

        <TouchableOpacity
          style={[styles.iconButton, isSaved && styles.iconButtonSaved]}
          onPress={handleToggleSave}
          activeOpacity={0.7}
          accessibilityLabel={isSaved ? 'Saved' : 'Save'}
        >
          <BookmarkIcon size={16} color={isSaved ? '#29482F' : '#2E2A26'} filled={isSaved} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Main Header ── */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Health &amp; Restore</Text>
          <Text style={styles.mainSubtitle}>
            Understand your body, manage symptoms and build sustainable clinical habits.
          </Text>
        </View>

        {/* ── Condition Shortcuts Horizontal Rail ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.conditionRail}
        >
          {CONDITIONS.map((cond) => {
            const isActive = cond.id === activeCondition.id;
            return (
              <TouchableOpacity
                key={cond.id}
                style={[
                  styles.conditionShortcut,
                  isActive && styles.conditionShortcutActive,
                ]}
                onPress={() => setSelectedConditionId(cond.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.conditionIconBadge, isActive && styles.conditionIconBadgeActive]}>
                  {getConditionIcon(cond.id, isActive)}
                </View>
                <Text
                  style={[
                    styles.conditionShortcutLabel,
                    isActive && styles.conditionShortcutLabelActive,
                  ]}
                  numberOfLines={2}
                >
                  {cond.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Your Support Journey Card ── */}
        <View style={styles.journeyCard}>
          <Image
            source={require('../../assets/images/healthcare-bowl.jpg')}
            style={styles.journeyMedia}
            resizeMode="cover"
          />
          <View style={styles.journeyGradient} />

          <View style={styles.journeyContent}>
            <View style={styles.journeyPill}>
              <Text style={styles.journeyEyebrow}>CLINICAL SUPPORT</Text>
            </View>

            <Text style={styles.journeyTitle}>
              {activeCondition.label} Care,{'\n'}made simple
            </Text>

            <View style={styles.checkList}>
              <View style={styles.checkRow}>
                <View style={styles.checkBadge}>
                  <CheckIcon size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.checkText}>Personalized nutrition targets</Text>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.checkBadge}>
                  <CheckIcon size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.checkText}>Symptom-aware daily guidance</Text>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.checkBadge}>
                  <CheckIcon size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.checkText}>Direct expert care support</Text>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.checkBadge}>
                  <CheckIcon size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.checkText}>Sustainable lifestyle rhythm</Text>
              </View>
            </View>

            {/* Condition Nutrients */}
            <View style={styles.clinicalFocusPill}>
              <Text style={styles.clinicalFocusText}>
                Key Nutrients: {activeCondition.keyNutrients}
              </Text>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.journeyButton}
              onPress={() => onNavigateToGoalSetting(activeCondition.label)}
              activeOpacity={0.85}
            >
              <Text style={styles.journeyButtonText}>
                Continue your {activeCondition.label} journey
              </Text>
              <ChevronRightIcon size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section: Learn & Understand ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Learn &amp; Understand</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToSymptoms}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>View all</Text>
            <ChevronRightIcon size={13} color="#5D5952" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.learnScroll}
        >
          {/* Learn Card 1: Understanding condition */}
          <TouchableOpacity
            style={styles.learnCard}
            onPress={onNavigateToSymptoms}
            activeOpacity={0.88}
          >
            <View style={styles.learnMediaContainer}>
              <Image
                source={require('../../assets/images/card1-ref.png')}
                style={styles.learnImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.learnBody}>
              <Text style={styles.learnCardTitle}>
                Understanding {activeCondition.label}
              </Text>
              <View style={styles.learnCardFooter}>
                <Text style={styles.learnCardDesc}>
                  Causes, symptoms &amp; clinical management
                </Text>
                <View style={styles.learnArrowCircle}>
                  <ChevronRightIcon size={12} color="#3D5C3E" />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Learn Card 2: Nutrition for balance */}
          <TouchableOpacity
            style={styles.learnCard}
            onPress={() => onNavigateToMealDetail('moong-dal-chilla')}
            activeOpacity={0.88}
          >
            <View style={styles.learnMediaContainer}>
              <Image
                source={require('../../assets/images/discover-bowl.jpg')}
                style={styles.learnImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.learnBody}>
              <Text style={styles.learnCardTitle}>Nutrition for balance</Text>
              <View style={styles.learnCardFooter}>
                <Text style={styles.learnCardDesc}>
                  Food choices that stabilize insulin &amp; energy
                </Text>
                <View style={styles.learnArrowCircle}>
                  <ChevronRightIcon size={12} color="#3D5C3E" />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Learn Card 3: Movement & lifestyle */}
          <TouchableOpacity
            style={styles.learnCard}
            onPress={onNavigateToLifestyle}
            activeOpacity={0.88}
          >
            <View style={styles.learnMediaContainer}>
              <Image
                source={require('../../assets/images/fitness-plate.jpg')}
                style={styles.learnImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.learnBody}>
              <Text style={styles.learnCardTitle}>Movement &amp; lifestyle</Text>
              <View style={styles.learnCardFooter}>
                <Text style={styles.learnCardDesc}>
                  Simple habits for steady circadian rhythm
                </Text>
                <View style={styles.learnArrowCircle}>
                  <ChevronRightIcon size={12} color="#3D5C3E" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Section: Track Your Health ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Track Your Health</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToProgress}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>See all</Text>
            <ChevronRightIcon size={13} color="#5D5952" />
          </TouchableOpacity>
        </View>

        <View style={styles.trackGrid}>
          {/* Track 1: Log Meals */}
          <TouchableOpacity
            style={styles.trackCard}
            onPress={onNavigateToEditPlan}
            activeOpacity={0.8}
          >
            <View style={[styles.trackIconCircle, { backgroundColor: '#E9ECDF' }]}>
              <UtensilsCrossed size={16} color="#29482F" />
            </View>
            <Text style={styles.trackTitle}>Log meals</Text>
            <Text style={styles.trackSubtitle}>Track daily plate intake</Text>
          </TouchableOpacity>

          {/* Track 2: Review Symptoms */}
          <TouchableOpacity
            style={styles.trackCard}
            onPress={onNavigateToSymptoms}
            activeOpacity={0.8}
          >
            <View style={[styles.trackIconCircle, { backgroundColor: '#E9ECDF' }]}>
              <LeafIcon size={16} color="#29482F" />
            </View>
            <Text style={styles.trackTitle}>Review symptoms</Text>
            <Text style={styles.trackSubtitle}>Update clinical patterns</Text>
          </TouchableOpacity>

          {/* Track 3: View Lifestyle */}
          <TouchableOpacity
            style={styles.trackCard}
            onPress={onNavigateToLifestyle}
            activeOpacity={0.8}
          >
            <View style={[styles.trackIconCircle, { backgroundColor: '#F3E8D3' }]}>
              <ActivityIcon size={16} color="#855B1E" />
            </View>
            <Text style={styles.trackTitle}>View lifestyle</Text>
            <Text style={styles.trackSubtitle}>Sleep, water &amp; routine</Text>
          </TouchableOpacity>

          {/* Track 4: Prepare Reports */}
          <TouchableOpacity
            style={styles.trackCard}
            onPress={() => setShowReportModal(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.trackIconCircle, { backgroundColor: '#ECE7DD' }]}>
              <FileTextIcon size={16} color="#524C42" />
            </View>
            <Text style={styles.trackTitle}>Prepare reports</Text>
            <Text style={styles.trackSubtitle}>Extract biomarkers</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section: Work With an Expert ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Work With an Expert</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToCareTeam}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>See all</Text>
            <ChevronRightIcon size={13} color="#5D5952" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.expertCard}
          onPress={onNavigateToCareTeam}
          activeOpacity={0.88}
        >
          <View style={styles.expertAvatarsRow}>
            <Image
              source={require('../../assets/images/coach-av-neha.png')}
              style={styles.expertAvatar}
            />
            <Image
              source={require('../../assets/images/coach-av-kavya.png')}
              style={[styles.expertAvatar, { marginLeft: -10 }]}
            />
            <Image
              source={require('../../assets/images/coach-av-ritika.png')}
              style={[styles.expertAvatar, { marginLeft: -10 }]}
            />
            <View style={[styles.expertAvatarPlus, { marginLeft: -10 }]}>
              <Text style={styles.expertAvatarPlusText}>+</Text>
            </View>
          </View>

          <View style={styles.expertCopy}>
            <Text style={styles.expertTitle}>
              Consult nutritionists &amp; clinicians
            </Text>
            <Text style={styles.expertSubtitle}>
              Personalized guidance with Dr. Ananya &amp; care team
            </Text>
          </View>

          <View style={styles.expertArrow}>
            <ChevronRightIcon size={16} color="#3D5C3E" />
          </View>
        </TouchableOpacity>

        {/* ── Section: Explore Tools ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Explore Tools</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={onNavigateToCalculations}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Calculations</Text>
            <ChevronRightIcon size={13} color="#5D5952" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolsGrid}>
          {/* Tool 1: Nutrition Calculations */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={onNavigateToCalculations}
            activeOpacity={0.85}
          >
            <View style={[styles.toolIconSquare, { backgroundColor: '#E9ECDF' }]}>
              <ScaleIcon size={18} color="#29482F" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Nutrition calculations</Text>
              <Text style={styles.toolSubtitle}>BMR, TDEE &amp; targets</Text>
            </View>
          </TouchableOpacity>

          {/* Tool 2: Goal setting */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => onNavigateToGoalSetting()}
            activeOpacity={0.85}
          >
            <View style={[styles.toolIconSquare, { backgroundColor: '#F3E8D3' }]}>
              <TargetIcon size={18} color="#855B1E" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Goal setting</Text>
              <Text style={styles.toolSubtitle}>Review your targets</Text>
            </View>
          </TouchableOpacity>

          {/* Tool 3: Meal plans */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={onNavigateToMealPlans}
            activeOpacity={0.85}
          >
            <View style={[styles.toolIconSquare, { backgroundColor: '#ECE7DD' }]}>
              <PlanIcon size={18} color="#524C42" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Meal plans</Text>
              <Text style={styles.toolSubtitle}>Personalized &amp; flexible</Text>
            </View>
          </TouchableOpacity>

          {/* Tool 4: Progress tracking */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={onNavigateToProgress}
            activeOpacity={0.85}
          >
            <View style={[styles.toolIconSquare, { backgroundColor: '#E9ECDF' }]}>
              <ActivityIcon size={18} color="#29482F" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Progress tracking</Text>
              <Text style={styles.toolSubtitle}>Clinical logged rhythm</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Clinical Guidance Note ── */}
        <View style={styles.guidanceNote}>
          <View style={styles.guidanceShieldWrap}>
            <ShieldIcon size={16} color="#3D5C3E" />
          </View>
          <Text style={styles.guidanceNoteText}>
            Nutrition guidance supports your care; it does not replace advice from a qualified
            clinician.
          </Text>
          <TouchableOpacity
            style={styles.guidanceStethoscopeBtn}
            onPress={onNavigateToCareTeam}
            activeOpacity={0.7}
            accessibilityLabel="Find a qualified health expert"
          >
            <StethoscopeIcon size={15} color="#29482F" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Lab Report & Biomarker Modal ── */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalIconBox}>
                  <FileTextIcon size={18} color="#3D5C3E" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Health Documents</Text>
                  <Text style={styles.modalSub}>
                    Lab reports, lipid panels &amp; biomarker extraction
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowReportModal(false)}
              >
                <CloseIcon size={14} color="#686B63" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.uploadBox}>
                <View style={styles.uploadIconBadge}>
                  <FileTextIcon size={22} color="#3D5C3E" />
                </View>
                <Text style={styles.uploadPrompt}>Select lab report or try clinical sample</Text>
                <Text style={styles.uploadFormats}>
                  Supports PDF, JPG, PNG (CBC, Lipid Panel, HbA1c, Thyroid)
                </Text>

                <TouchableOpacity
                  style={styles.sampleReportBtn}
                  onPress={() => setHasSampleReport(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sampleReportBtnText}>
                    {hasSampleReport ? 'Sample Loaded' : 'Load Sample Lab Report'}
                  </Text>
                </TouchableOpacity>
              </View>

              {hasSampleReport && (
                <View style={styles.biomarkerSection}>
                  <Text style={styles.biomarkerSectionTitle}>
                    Extracted Biomarkers &amp; Clinical Insights
                  </Text>

                  <View style={styles.biomarkerGrid}>
                    <View style={styles.biomarkerCard}>
                      <Text style={styles.biomarkerName}>HbA1c</Text>
                      <Text style={styles.biomarkerVal}>6.2%</Text>
                      <Text style={[styles.biomarkerBadge, { color: '#B45309' }]}>
                        Borderline
                      </Text>
                    </View>

                    <View style={styles.biomarkerCard}>
                      <Text style={styles.biomarkerName}>Fasting Glucose</Text>
                      <Text style={styles.biomarkerVal}>112 mg/dL</Text>
                      <Text style={[styles.biomarkerBadge, { color: '#B45309' }]}>
                        Mildly Elevated
                      </Text>
                    </View>

                    <View style={styles.biomarkerCard}>
                      <Text style={styles.biomarkerName}>Total Cholesterol</Text>
                      <Text style={styles.biomarkerVal}>218 mg/dL</Text>
                      <Text style={[styles.biomarkerBadge, { color: '#B91C1C' }]}>
                        Elevated
                      </Text>
                    </View>

                    <View style={styles.biomarkerCard}>
                      <Text style={styles.biomarkerName}>TSH (Thyroid)</Text>
                      <Text style={styles.biomarkerVal}>4.2 µIU/mL</Text>
                      <Text style={[styles.biomarkerBadge, { color: '#29482F' }]}>
                        Normal
                      </Text>
                    </View>
                  </View>

                  <View style={styles.biomarkerSuggestedBanner}>
                    <Text style={styles.biomarkerSuggestedText}>
                      Suggested focus: <Text style={{ fontWeight: '700' }}>PCOS &amp; Metabolic Care</Text>
                    </Text>
                  </View>
                </View>
              )}

              <Text style={styles.modalPrivacyNote}>
                Your file is stored locally on device. No sensitive health data is transmitted without consent.
              </Text>
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowReportModal(false);
                  onNavigateToCareTeam();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>Consult Doctor with Report</Text>
                <ChevronRightIcon size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 10,
    paddingBottom: 8,
  },
  topBarTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#2E2A26',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E1D2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSaved: {
    backgroundColor: '#E9ECDF',
    borderColor: '#CAD4BD',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  header: {
    marginTop: 6,
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#2E2A26',
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  mainSubtitle: {
    fontSize: 12.5,
    color: '#716D65',
    lineHeight: 18,
    marginTop: 4,
  },
  conditionRail: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  conditionShortcut: {
    width: 88,
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  conditionShortcutActive: {
    borderColor: '#3D5C3E',
    backgroundColor: '#E9ECDF',
    borderWidth: 1.5,
  },
  conditionIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  conditionIconBadgeActive: {
    backgroundColor: '#D8E2CE',
  },
  conditionShortcutLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#5D5952',
    textAlign: 'center',
    lineHeight: 13.5,
  },
  conditionShortcutLabelActive: {
    color: '#29482F',
    fontWeight: '700',
  },
  journeyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2DBD0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 22,
    shadowColor: '#1F2E1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  journeyMedia: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    height: '100%',
  },
  journeyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  journeyContent: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
    width: '100%',
  },
  journeyPill: {
    backgroundColor: '#E9ECDF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  journeyEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: '#29482F',
    letterSpacing: 1,
  },
  journeyTitle: {
    fontFamily: 'serif',
    fontSize: 23,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 28,
    marginBottom: 10,
  },
  checkList: {
    gap: 5,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  checkBadge: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#3D5C3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 11.5,
    color: '#4F514B',
    fontWeight: '500',
  },
  clinicalFocusPill: {
    backgroundColor: '#F7F4EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E1D2',
  },
  clinicalFocusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3D5C3E',
  },
  journeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#3D5C3E',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 16,
    shadowColor: '#29482F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  journeyButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 18,
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
    color: '#5D5952',
  },
  learnScroll: {
    gap: 10,
    paddingBottom: 18,
  },
  learnCard: {
    width: 200,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  learnMediaContainer: {
    height: 104,
    backgroundColor: '#E9ECDF',
  },
  learnImage: {
    width: '100%',
    height: '100%',
  },
  learnBody: {
    padding: 10,
  },
  learnCardTitle: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 4,
  },
  learnCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  learnCardDesc: {
    flex: 1,
    fontSize: 10,
    color: '#77726A',
    lineHeight: 13.5,
  },
  learnArrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#E5DDD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  trackCard: {
    width: '48.3%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  trackIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  trackTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2E2A26',
  },
  trackSubtitle: {
    fontSize: 10,
    color: '#77726A',
    marginTop: 2,
    lineHeight: 13,
  },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  expertAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  expertAvatarPlus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E9ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertAvatarPlusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#29482F',
  },
  expertCopy: {
    flex: 1,
  },
  expertTitle: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 17,
  },
  expertSubtitle: {
    fontSize: 10,
    color: '#706860',
    marginTop: 2,
  },
  expertArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  toolCard: {
    width: '48.3%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  toolIconSquare: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTextCol: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2E2A26',
    lineHeight: 15,
  },
  toolSubtitle: {
    fontSize: 9.5,
    color: '#77726A',
    marginTop: 1,
  },
  guidanceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E2D6',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  guidanceShieldWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  guidanceNoteText: {
    flex: 1,
    fontSize: 10.5,
    color: '#69655E',
    lineHeight: 15,
  },
  guidanceStethoscopeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#E8E2D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FAF7EE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#2E2A26',
  },
  modalSub: {
    fontSize: 10.5,
    color: '#716D65',
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8E4DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CAD4BD',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadPrompt: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2E2A26',
    textAlign: 'center',
  },
  uploadFormats: {
    fontSize: 10.5,
    color: '#77726A',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  sampleReportBtn: {
    backgroundColor: '#EAF0E6',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#3D5C3E',
  },
  sampleReportBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#29482F',
  },
  biomarkerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5DDD0',
    padding: 12,
    marginBottom: 12,
  },
  biomarkerSectionTitle: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 8,
  },
  biomarkerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  biomarkerCard: {
    width: '48%',
    backgroundColor: '#FAF7EE',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8E1D2',
  },
  biomarkerName: {
    fontSize: 10,
    color: '#716D65',
  },
  biomarkerVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E2A26',
    marginTop: 1,
  },
  biomarkerBadge: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  biomarkerSuggestedBanner: {
    backgroundColor: '#EAF0E6',
    borderRadius: 8,
    padding: 6,
  },
  biomarkerSuggestedText: {
    fontSize: 10.5,
    color: '#29482F',
  },
  modalPrivacyNote: {
    fontSize: 10,
    color: '#77726A',
    lineHeight: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  modalFooterActions: {
    marginTop: 4,
  },
  modalPrimaryBtn: {
    backgroundColor: '#3D5C3E',
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
