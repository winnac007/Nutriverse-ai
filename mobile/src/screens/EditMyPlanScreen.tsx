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
  PencilIcon,
} from '../components/Icons';

interface EditMyPlanScreenProps {
  onBack: () => void;
  onSetTargets?: () => void;
  onViewAsClient?: () => void;
}

interface EditableMeal {
  id: string;
  slot: string;
  time: string;
  title: string;
  subtitle: string;
  prepTime: string;
  calories: string;
  badge: string;
  protein: string;
  carbs: string;
  fat: string;
  image: any;
}

const INITIAL_MEALS: EditableMeal[] = [
  {
    id: 'breakfast',
    slot: 'Breakfast',
    time: '8:00 AM',
    title: 'Moong Dal Chilla',
    subtitle: 'With mint chutney and fresh fruits',
    prepTime: '15 mins',
    calories: '350 kcal',
    badge: 'High protein',
    protein: '18 g',
    carbs: '45 g',
    fat: '12 g',
    image: require('../../assets/images/meal-breakfast.png'),
  },
  {
    id: 'mid-morning',
    slot: 'Mid-morning',
    time: '11:00 AM',
    title: 'Greek Yogurt Bowl',
    subtitle: 'With nuts, seeds and berries',
    prepTime: '5 mins',
    calories: '200 kcal',
    badge: 'Gut friendly',
    protein: '12 g',
    carbs: '18 g',
    fat: '8 g',
    image: require('../../assets/images/meal-mid-morning.png'),
  },
  {
    id: 'lunch',
    slot: 'Lunch',
    time: '1:30 PM',
    title: 'Quinoa Buddha Bowl',
    subtitle: 'With roasted vegetables and tahini dressing',
    prepTime: '20 mins',
    calories: '420 kcal',
    badge: 'Balanced',
    protein: '18 g',
    carbs: '52 g',
    fat: '14 g',
    image: require('../../assets/images/meal-lunch.png'),
  },
  {
    id: 'evening-snack',
    slot: 'Evening Snack',
    time: '4:30 PM',
    title: 'Masala Buttermilk',
    subtitle: 'With roasted makhana',
    prepTime: '5 mins',
    calories: '120 kcal',
    badge: 'Refreshing',
    protein: '6 g',
    carbs: '14 g',
    fat: '4 g',
    image: require('../../assets/images/meal-evening-snack.png'),
  },
  {
    id: 'dinner',
    slot: 'Dinner',
    time: '7:30 PM',
    title: 'Paneer & Vegetable Stir Fry',
    subtitle: 'With millets or brown rice',
    prepTime: '20 mins',
    calories: '400 kcal',
    badge: 'High fibre',
    protein: '22 g',
    carbs: '48 g',
    fat: '16 g',
    image: require('../../assets/images/meal-dinner.png'),
  },
];

const DAYS = [
  'Mon 12 Oct',
  'Tue 13 Oct',
  'Wed 14 Oct',
  'Thu 15 Oct',
  'Fri 16 Oct',
  'Sat 17 Oct',
  'Sun 18 Oct',
];

export const EditMyPlanScreen: React.FC<EditMyPlanScreenProps> = ({
  onBack,
  onSetTargets,
  onViewAsClient,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [meals, setMeals] = useState<EditableMeal[]>(INITIAL_MEALS);
  const [clientNotes, setClientNotes] = useState('');

  const handleSwap = (slot: string) => {
    Alert.alert(
      `Swap ${slot}`,
      `Would you like to swap ${slot} with a recipe from your favorites or recipe library?`,
      [
        { text: 'Browse Library', onPress: () => Alert.alert('Library Opened') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemove = (mealId: string) => {
    Alert.alert('Remove Meal', 'Are you sure you want to remove this meal slot?', [
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setMeals((prev) => prev.filter((m) => m.id !== mealId)),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSaveChanges = () => {
    Alert.alert('Changes Saved! 💾', 'Your custom meal plan schedule has been saved locally.');
  };

  const handleSubmitForReview = () => {
    Alert.alert(
      'Submitted for Clinical Review! 🌿',
      'Dr. Ananya Sharma has received your customization notes and will approve or adjust portions within 24 hours.'
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
          style={styles.viewAsClientBtn}
          onPress={onViewAsClient || onBack}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 13, marginRight: 4 }}>👁️</Text>
          <Text style={styles.viewAsClientText}>View as client</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Edit My Plan</Text>
          <Text style={styles.pageSubtitle}>
            Customize meals, portions and timings based on your needs.
          </Text>
        </View>

        {/* ── Care Team Shared Access Banner ── */}
        <View style={styles.careTeamBanner}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.nutritionistAvatar}
          />
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.careBannerTitle}>Plan managed by your nutritionist</Text>
            <Text style={styles.careBannerSub}>
              Edits can be made by you, your nutritionist or consultant.
            </Text>
          </View>

          {/* Shared Access Avatars */}
          <View style={styles.sharedAccessCol}>
            <View style={styles.sharedAccessBadge}>
              <Text style={{ fontSize: 10, marginRight: 3 }}>👥</Text>
              <Text style={styles.sharedAccessText}>Shared access</Text>
            </View>
            <View style={styles.avatarMiniStack}>
              <View style={styles.miniAvatarItem}>
                <Text style={{ fontSize: 9 }}>👤</Text>
                <Text style={styles.miniAvatarLabel}>You</Text>
              </View>
              <View style={styles.miniAvatarItem}>
                <Image
                  source={require('../../assets/images/nutritionist-ananya.webp')}
                  style={styles.miniImg}
                />
                <Text style={styles.miniAvatarLabel}>Nutritionist</Text>
              </View>
              <View style={styles.miniAvatarItem}>
                <Image
                  source={require('../../assets/images/coach-av-arjun.png')}
                  style={styles.miniImg}
                />
                <Text style={styles.miniAvatarLabel}>Consultant</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Day Selector Tabs ── */}
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

        {/* ── Editable Meal Cards ── */}
        <View style={styles.mealsContainer}>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealEditCard}>
              {/* Header with Slot, Time and Actions */}
              <View style={styles.mealEditHeader}>
                <View style={styles.slotTimeRow}>
                  <Text style={{ fontSize: 13, marginRight: 4 }}>☀️</Text>
                  <Text style={styles.slotName}>{meal.slot}</Text>
                  <Text style={styles.slotTime}>{meal.time}</Text>
                </View>

                {/* Edit, Swap, Remove actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Edit', `Edit timing or portion for ${meal.title}`)}
                  >
                    <Text style={styles.actionIconText}>✎ Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => handleSwap(meal.slot)}
                  >
                    <Text style={styles.actionIconText}>⇄ Swap</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => handleRemove(meal.id)}
                  >
                    <Text style={[styles.actionIconText, { color: '#B91C1C' }]}>🗑 Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Meal Content Row */}
              <View style={styles.mealBodyRow}>
                <Image source={meal.image} style={styles.mealBodyImage} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={styles.mealBodyTitle}>{meal.title}</Text>
                  <Text style={styles.mealBodySub} numberOfLines={1}>
                    {meal.subtitle}
                  </Text>

                  {/* Badges */}
                  <View style={styles.tagsRow}>
                    <View style={styles.timeTag}>
                      <ClockIcon size={10} color="#737970" />
                      <Text style={styles.tagText}>{meal.prepTime}</Text>
                    </View>
                    <View style={styles.timeTag}>
                      <Text style={{ fontSize: 9 }}>📊</Text>
                      <Text style={styles.tagText}>{meal.calories}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{meal.badge}</Text>
                    </View>
                  </View>

                  {/* Macro Row */}
                  <View style={styles.macroSummaryRow}>
                    <Text style={styles.macroStatText}>
                      <Text style={{ fontWeight: '700' }}>{meal.protein}</Text> Protein
                    </Text>
                    <Text style={styles.macroStatText}>
                      <Text style={{ fontWeight: '700' }}>{meal.carbs}</Text> Carbs
                    </Text>
                    <Text style={styles.macroStatText}>
                      <Text style={{ fontWeight: '700' }}>{meal.fat}</Text> Fat
                    </Text>
                  </View>
                </View>
              </View>

              {/* Edit Details Action Button */}
              <TouchableOpacity
                style={styles.editDetailsBtn}
                onPress={() =>
                  Alert.alert('Edit Details', `Configure ingredients and portions for ${meal.title}`)
                }
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 11, marginRight: 4 }}>✎</Text>
                <Text style={styles.editDetailsText}>Edit details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Daily Nutrition Summary Donut & Target Adjustment ── */}
        <View style={styles.nutritionSummaryBox}>
          {/* Donut Simulation */}
          <View style={styles.donutContainer}>
            <View style={styles.donutCircle}>
              <Text style={styles.donutCaloriesVal}>2,000</Text>
              <Text style={styles.donutCaloriesLbl}>kcal</Text>
            </View>
          </View>

          {/* Macro Breakdown Rows */}
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

          {/* Right: Adjust Daily Targets Card */}
          <View style={styles.adjustTargetsCol}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
            <Text style={styles.adjustTargetsTitle}>Adjust daily targets</Text>
            <Text style={styles.adjustTargetsDesc}>
              Modify calories and macros to personalize this plan.
            </Text>
            <TouchableOpacity
              style={styles.setTargetsBtn}
              onPress={onSetTargets}
              activeOpacity={0.8}
            >
              <Text style={styles.setTargetsText}>Set targets →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Add or Modify Meals Actions ── */}
        <Text style={styles.subGroupHeading}>Add or modify meals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mealActionsRow}
        >
          <TouchableOpacity
            style={styles.addMealPillBtn}
            onPress={() => Alert.alert('Add Meal', 'Choose a slot and recipe to add to today.')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 13, marginRight: 4 }}>+</Text>
            <Text style={styles.addMealPillText}>Add meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineActionBtn}
            onPress={() => Alert.alert('Swap Meal', 'Select which meal to swap.')}
          >
            <Text style={{ fontSize: 12, marginRight: 4 }}>⇄</Text>
            <Text style={styles.outlineActionText}>Swap meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineActionBtn}
            onPress={() =>
              Alert.alert('Copy from Another Day', 'Duplicate Tuesday schedule to Friday.')
            }
          >
            <Text style={{ fontSize: 12, marginRight: 4 }}>📋</Text>
            <Text style={styles.outlineActionText}>Copy from another day</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineActionBtn}
            onPress={() => Alert.alert('Browse Recipes', 'Open recipe database.')}
          >
            <Text style={{ fontSize: 12, marginRight: 4 }}>📖</Text>
            <Text style={styles.outlineActionText}>Browse recipes</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Notes for Your Nutritionist / Consultant ── */}
        <View style={styles.notesBox}>
          <View style={styles.notesHeader}>
            <Text style={{ fontSize: 14, marginRight: 6 }}>📝</Text>
            <Text style={styles.notesTitle}>Notes for your nutritionist / consultant</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={clientNotes}
            onChangeText={setClientNotes}
            placeholder="E.g. I prefer less spicy food, can we add more Indian options?"
            placeholderTextColor="#9A9E95"
            multiline
          />
        </View>

        {/* ── Bottom Dual Action Buttons ── */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.saveChangesBtn}
            onPress={handleSaveChanges}
            activeOpacity={0.8}
          >
            <Text style={styles.saveChangesText}>Save changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitReviewBtn}
            onPress={handleSubmitForReview}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 13, marginRight: 6, color: '#FFFFFF' }}>✈️</Text>
            <Text style={styles.submitReviewText}>Submit for review</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bottomApprovalCaption}>
          Your nutritionist/consultant will review and approve the changes.
        </Text>
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
  viewAsClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: '#E6E1D7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAsClientText: {
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
  careTeamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
  },
  nutritionistAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  careBannerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  careBannerSub: {
    fontSize: 10.5,
    color: '#737970',
    marginTop: 2,
  },
  sharedAccessCol: {
    alignItems: 'flex-end',
  },
  sharedAccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2EB',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  sharedAccessText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#555850',
  },
  avatarMiniStack: {
    flexDirection: 'row',
    gap: 4,
  },
  miniAvatarItem: {
    alignItems: 'center',
  },
  miniImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  miniAvatarLabel: {
    fontSize: 8,
    color: '#737970',
    marginTop: 1,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
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
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4A4E46',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mealsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  mealEditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
  },
  mealEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EB',
    marginBottom: 10,
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginRight: 6,
  },
  slotTime: {
    fontSize: 11,
    color: '#737970',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  actionIconText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A4E46',
  },
  mealBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealBodyImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  mealBodyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  mealBodySub: {
    fontSize: 10.5,
    color: '#686B63',
    marginTop: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#737970',
  },
  categoryBadge: {
    backgroundColor: '#EAF0E6',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3D5C3E',
  },
  macroSummaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  macroStatText: {
    fontSize: 10.5,
    color: '#555850',
  },
  editDetailsBtn: {
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
  editDetailsText: {
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
    marginBottom: 20,
    gap: 12,
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  subGroupHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 8,
  },
  mealActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  addMealPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C6E52',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addMealPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  outlineActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#343831',
  },
  notesBox: {
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
  notesInput: {
    fontSize: 12,
    color: '#1C1D1A',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveChangesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCD6CA',
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveChangesText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  submitReviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6E52',
    borderRadius: 14,
    paddingVertical: 14,
  },
  submitReviewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomApprovalCaption: {
    fontSize: 10.5,
    color: '#737970',
    textAlign: 'center',
    marginTop: 8,
  },
});

