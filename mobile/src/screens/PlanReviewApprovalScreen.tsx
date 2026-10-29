import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ClockIcon,
  ChevronDownIcon,
} from '../components/Icons';

interface PlanReviewApprovalScreenProps {
  onBack: () => void;
  onPreviewForClient?: () => void;
  onEditTargets?: () => void;
  onOpenEditor?: () => void;
}

const DAYS = [
  'Mon 12 Oct',
  'Tue 13 Oct',
  'Wed 14 Oct',
  'Thu 15 Oct',
  'Fri 16 Oct',
  'Sat 17 Oct',
  'Sun 18 Oct',
];

const SUBTABS = ['Meal Plan', 'Nutrition Targets', 'Progress', 'Notes', 'Activity'];

export const PlanReviewApprovalScreen: React.FC<PlanReviewApprovalScreenProps> = ({
  onBack,
  onPreviewForClient,
  onEditTargets,
  onOpenEditor,
}) => {
  const [activeSubtab, setActiveSubtab] = useState('Meal Plan');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [clientNotes, setClientNotes] = useState('');

  const handleRegenerateAI = () => {
    Alert.alert(
      'AI Clinical Engine',
      'Regenerating meal options optimized for Riya’s PCOS insulin sensitivity and anti-inflammatory markers...',
      [{ text: 'Confirm', onPress: () => Alert.alert('Plan Regenerated! ✨') }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleSendApproval = () => {
    Alert.alert(
      'Sent to Client! 🚀',
      'The personalized 7-day blueprint has been dispatched to Riya Sharma for approval.'
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleDropdownBtn}
          onPress={() =>
            Alert.alert('Role Switcher', 'Switching roles between Nutritionist and Client.')
          }
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 13, marginRight: 4 }}>👤</Text>
          <Text style={styles.roleDropdownText}>Viewing as Nutritionist</Text>
          <ChevronDownIcon size={12} color="#4A4E46" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Plan Review & Approvals</Text>
          <Text style={styles.pageSubtitle}>
            Review, edit and personalize the meal plan for your client.
          </Text>
        </View>

        {/* ── Client Card ── */}
        <View style={styles.clientCard}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.clientAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.clientName}>Riya Sharma</Text>
            <Text style={styles.clientMetadata}>26 years • PCOS • Weight management</Text>
          </View>
          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => Alert.alert('Client Profile', 'Riya Sharma: BMI 23.9, Goal 55kg')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewProfileText}>View full profile →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Sub Navigation Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subtabsRow}
        >
          {SUBTABS.map((tab) => {
            const isSelected = activeSubtab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.subtabItem, isSelected && styles.subtabItemActive]}
                onPress={() => setActiveSubtab(tab)}
              >
                <Text
                  style={[styles.subtabText, isSelected && styles.subtabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Current Plan Week Bar ── */}
        <View style={styles.currentPlanBar}>
          <View style={styles.planBarLeft}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>📅</Text>
            <View>
              <Text style={styles.planBarTitle}>Current Plan</Text>
              <Text style={styles.planBarDates}>Week 1 (12 – 18 Oct)</Text>
            </View>
          </View>

          <View style={styles.planBarActions}>
            <TouchableOpacity
              style={styles.regenerateBtn}
              onPress={handleRegenerateAI}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 11, marginRight: 4 }}>✨</Text>
              <Text style={styles.regenerateText}>Regenerate with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editWeekBtn}
              onPress={onOpenEditor}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 11, marginRight: 4, color: '#FFFFFF' }}>✎</Text>
              <Text style={styles.editWeekText}>Edit plan</Text>
              <ChevronDownIcon size={10} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Days Row ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}
        >
          {DAYS.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayTab, isSelected && styles.dayTabActive]}
                onPress={() => setActiveDayIndex(idx)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Client Meals List ── */}
        <View style={styles.mealsContainer}>
          {/* Breakfast */}
          <View style={styles.mealReviewCard}>
            <View style={styles.mealReviewHeader}>
              <View style={styles.slotRow}>
                <Text style={{ fontSize: 13, marginRight: 4 }}>☀️</Text>
                <Text style={styles.slotTitle}>Breakfast</Text>
                <Text style={styles.slotTime}>8:00 AM</Text>
              </View>

              <View style={styles.reviewHeaderActions}>
                <TouchableOpacity
                  style={styles.swapPill}
                  onPress={() => Alert.alert('Swap', 'Swap Moong Dal Chilla')}
                >
                  <Text style={{ fontSize: 11, marginRight: 2 }}>⇄</Text>
                  <Text style={styles.swapPillText}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreDotsBtn}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mealReviewBody}>
              <Image
                source={require('../../assets/images/meal-breakfast.png')}
                style={styles.mealThumb}
              />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.mealTitle}>Moong Dal Chilla</Text>
                <Text style={styles.mealSubtitle} numberOfLines={1}>
                  With mint chutney and fresh fruits
                </Text>

                <View style={styles.chipsRow}>
                  <View style={styles.chipItem}>
                    <ClockIcon size={9} color="#737970" />
                    <Text style={styles.chipText}>15 mins</Text>
                  </View>
                  <View style={styles.chipItem}>
                    <Text style={{ fontSize: 8 }}>📊</Text>
                    <Text style={styles.chipText}>350 kcal</Text>
                  </View>
                  <View style={styles.chipBadge}>
                    <Text style={styles.chipBadgeText}>High protein</Text>
                  </View>
                </View>

                <View style={styles.macroStringRow}>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>18 g</Text> Protein</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>45 g</Text> Carbs</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>12 g</Text> Fat</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editMealBtn}
              onPress={() => Alert.alert('Edit Meal', 'Modifying portion and clinical substitutions.')}
            >
              <Text style={{ fontSize: 11, marginRight: 4 }}>✎</Text>
              <Text style={styles.editMealText}>Edit meal</Text>
            </TouchableOpacity>
          </View>

          {/* Mid-morning */}
          <View style={styles.mealReviewCard}>
            <View style={styles.mealReviewHeader}>
              <View style={styles.slotRow}>
                <Text style={{ fontSize: 13, marginRight: 4 }}>🍵</Text>
                <Text style={styles.slotTitle}>Mid-morning</Text>
                <Text style={styles.slotTime}>11:00 AM</Text>
              </View>

              <View style={styles.reviewHeaderActions}>
                <TouchableOpacity style={styles.swapPill}>
                  <Text style={{ fontSize: 11, marginRight: 2 }}>⇄</Text>
                  <Text style={styles.swapPillText}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreDotsBtn}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mealReviewBody}>
              <Image
                source={require('../../assets/images/meal-mid-morning.png')}
                style={styles.mealThumb}
              />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.mealTitle}>Greek Yogurt Bowl</Text>
                <Text style={styles.mealSubtitle} numberOfLines={1}>
                  With nuts, seeds and berries
                </Text>

                <View style={styles.chipsRow}>
                  <View style={styles.chipItem}>
                    <ClockIcon size={9} color="#737970" />
                    <Text style={styles.chipText}>5 mins</Text>
                  </View>
                  <View style={styles.chipItem}>
                    <Text style={{ fontSize: 8 }}>📊</Text>
                    <Text style={styles.chipText}>200 kcal</Text>
                  </View>
                  <View style={styles.chipBadge}>
                    <Text style={styles.chipBadgeText}>Gut friendly</Text>
                  </View>
                </View>

                <View style={styles.macroStringRow}>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>12 g</Text> Protein</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>18 g</Text> Carbs</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>8 g</Text> Fat</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editMealBtn}>
              <Text style={{ fontSize: 11, marginRight: 4 }}>✎</Text>
              <Text style={styles.editMealText}>Edit meal</Text>
            </TouchableOpacity>
          </View>

          {/* Lunch */}
          <View style={styles.mealReviewCard}>
            <View style={styles.mealReviewHeader}>
              <View style={styles.slotRow}>
                <Text style={{ fontSize: 13, marginRight: 4 }}>🥗</Text>
                <Text style={styles.slotTitle}>Lunch</Text>
                <Text style={styles.slotTime}>1:30 PM</Text>
              </View>

              <View style={styles.reviewHeaderActions}>
                <TouchableOpacity style={styles.swapPill}>
                  <Text style={{ fontSize: 11, marginRight: 2 }}>⇄</Text>
                  <Text style={styles.swapPillText}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreDotsBtn}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mealReviewBody}>
              <Image
                source={require('../../assets/images/meal-lunch.png')}
                style={styles.mealThumb}
              />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.mealTitle}>Quinoa Buddha Bowl</Text>
                <Text style={styles.mealSubtitle} numberOfLines={1}>
                  With roasted vegetables and tahini dressing
                </Text>

                <View style={styles.chipsRow}>
                  <View style={styles.chipItem}>
                    <ClockIcon size={9} color="#737970" />
                    <Text style={styles.chipText}>20 mins</Text>
                  </View>
                  <View style={styles.chipItem}>
                    <Text style={{ fontSize: 8 }}>📊</Text>
                    <Text style={styles.chipText}>420 kcal</Text>
                  </View>
                  <View style={styles.chipBadge}>
                    <Text style={styles.chipBadgeText}>Balanced</Text>
                  </View>
                </View>

                <View style={styles.macroStringRow}>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>18 g</Text> Protein</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>52 g</Text> Carbs</Text>
                  <Text style={styles.macroStr}><Text style={{ fontWeight: '700' }}>14 g</Text> Fat</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editMealBtn}>
              <Text style={{ fontSize: 11, marginRight: 4 }}>✎</Text>
              <Text style={styles.editMealText}>Edit meal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Daily Nutrition Donut Summary ── */}
        <View style={styles.nutritionSummaryBox}>
          <View style={styles.donutCircle}>
            <Text style={styles.donutCaloriesVal}>2,000</Text>
            <Text style={styles.donutCaloriesLbl}>kcal</Text>
          </View>

          <View style={styles.macroDonutLegend}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#567252' }]} />
              <Text style={styles.legendName}>Carbohydrates</Text>
              <Text style={styles.legendVal}>250 g</Text>
              <Text style={styles.legendPct}>50%</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#D9984E' }]} />
              <Text style={styles.legendName}>Protein</Text>
              <Text style={styles.legendVal}>100 g</Text>
              <Text style={styles.legendPct}>20%</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#8B6A45' }]} />
              <Text style={styles.legendName}>Fat</Text>
              <Text style={styles.legendVal}>67 g</Text>
              <Text style={styles.legendPct}>30%</Text>
            </View>
          </View>

          <View style={styles.adjustTargetsCol}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
            <Text style={styles.adjustTargetsTitle}>Adjust daily targets</Text>
            <Text style={styles.adjustTargetsDesc}>
              Modify calories and macros for this client.
            </Text>
            <TouchableOpacity
              style={styles.setTargetsBtn}
              onPress={onEditTargets}
              activeOpacity={0.8}
            >
              <Text style={styles.setTargetsText}>Edit targets →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Notes for Your Client ── */}
        <View style={styles.clientNotesBox}>
          <View style={styles.notesHeader}>
            <Text style={{ fontSize: 13, marginRight: 6 }}>📝</Text>
            <Text style={styles.notesTitle}>Notes for your client (optional)</Text>
          </View>
          <TextInput
            style={styles.clientNotesInput}
            value={clientNotes}
            onChangeText={setClientNotes}
            placeholder="Add personalized notes, substitutes, or special instructions..."
            placeholderTextColor="#9A9E95"
            multiline
          />
        </View>

        {/* ── Bottom Three Actions ── */}
        <View style={styles.reviewActionsGrid}>
          <View style={styles.dualTopActionRow}>
            <TouchableOpacity
              style={styles.previewBtn}
              onPress={onPreviewForClient}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 13, marginRight: 4 }}>👁️</Text>
              <Text style={styles.previewBtnText}>Preview for client</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => Alert.alert('Saved', 'Plan changes preserved.')}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 13, marginRight: 4 }}>🔖</Text>
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendApprovalBtn}
            onPress={handleSendApproval}
            activeOpacity={0.85}
          >
            <Text style={styles.sendApprovalText}>Send to client for approval  →</Text>
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: '#E6E1D7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  roleDropdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3C4039',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  titleSection: {
    marginTop: 4,
    marginBottom: 12,
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
    color: '#686B63',
    marginTop: 2,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginBottom: 14,
  },
  clientAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  clientName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  clientMetadata: {
    fontSize: 11,
    color: '#737970',
    marginTop: 2,
  },
  viewProfileBtn: {
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  viewProfileText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262923',
  },
  subtabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  subtabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  subtabItemActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  subtabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4A4E46',
  },
  subtabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  currentPlanBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  planBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planBarTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  planBarDates: {
    fontSize: 10.5,
    color: '#737970',
  },
  planBarActions: {
    flexDirection: 'row',
    gap: 6,
  },
  regenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  regenerateText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#343831',
  },
  editWeekBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C6E52',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
    gap: 2,
  },
  editWeekText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayTab: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  dayTabActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  dayTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A4E46',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mealsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  mealReviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
  },
  mealReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EB',
    marginBottom: 8,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginRight: 6,
  },
  slotTime: {
    fontSize: 11,
    color: '#737970',
  },
  reviewHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2EB',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  swapPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4A4E46',
  },
  moreDotsBtn: {
    paddingHorizontal: 4,
  },
  mealReviewBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  mealTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  mealSubtitle: {
    fontSize: 10.5,
    color: '#686B63',
    marginTop: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chipText: {
    fontSize: 10,
    color: '#737970',
  },
  chipBadge: {
    backgroundColor: '#EAF0E6',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  chipBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  macroStringRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroStr: {
    fontSize: 10,
    color: '#555850',
  },
  editMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  editMealText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262923',
  },
  nutritionSummaryBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F4',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE3D5',
    padding: 14,
    marginBottom: 18,
    gap: 12,
  },
  donutCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#567252',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  donutCaloriesVal: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  donutCaloriesLbl: {
    fontSize: 9,
    color: '#737970',
  },
  macroDonutLegend: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendName: {
    fontSize: 10.5,
    color: '#343831',
    flex: 1,
  },
  legendVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginRight: 6,
  },
  legendPct: {
    fontSize: 10,
    color: '#737970',
  },
  adjustTargetsCol: {
    width: 100,
    borderLeftWidth: 1,
    borderLeftColor: '#E8E4DC',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  adjustTargetsTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginTop: 2,
  },
  adjustTargetsDesc: {
    fontSize: 8.5,
    color: '#737970',
    lineHeight: 12,
    marginVertical: 4,
  },
  setTargetsBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCD6CA',
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  setTargetsText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#262923',
  },
  clientNotesBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginBottom: 20,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notesTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  clientNotesInput: {
    fontSize: 12,
    color: '#1C1D1A',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  reviewActionsGrid: {
    gap: 10,
  },
  dualTopActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCD6CA',
    borderRadius: 14,
    paddingVertical: 12,
  },
  previewBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCD6CA',
    borderRadius: 14,
    paddingVertical: 12,
  },
  saveBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  sendApprovalBtn: {
    backgroundColor: '#5C6E52',
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6E52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  sendApprovalText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});

