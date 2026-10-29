import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CheckIcon,
  ClockIcon,
} from '../components/Icons';

interface GoalSettingFoodPrefsScreenProps {
  initialPrefs?: {
    cuisines?: string[];
    dietType?: string;
    likedFoods?: string[];
    avoidFoods?: string[];
    eatingOutEnabled?: boolean;
    eatingOutOption?: string;
    mealPattern?: string;
  };
  onBack: () => void;
  onContinue: (prefsData: any) => void;
}

export const GoalSettingFoodPrefsScreen: React.FC<GoalSettingFoodPrefsScreenProps> = ({
  initialPrefs,
  onBack,
  onContinue,
}) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    initialPrefs?.cuisines || ['Indian']
  );
  const [dietType, setDietType] = useState(initialPrefs?.dietType || 'Vegetarian');
  const [likedFoods, setLikedFoods] = useState<string[]>(
    initialPrefs?.likedFoods || [
      'Paneer',
      'Oats',
      'Quinoa',
      'Sprouts',
      'Fruits',
      'Makhana',
      'Dal',
      'Curd',
      'Seasonal vegetables',
    ]
  );
  const [avoidFoods, setAvoidFoods] = useState<string[]>(
    initialPrefs?.avoidFoods || [
      'Refined flour',
      'Deep fried food',
      'Excess sugar',
      'Processed food',
      'Red meat',
    ]
  );
  const [eatingOutEnabled, setEatingOutEnabled] = useState(
    initialPrefs?.eatingOutEnabled !== undefined ? initialPrefs.eatingOutEnabled : true
  );
  const [eatingOutOption, setEatingOutOption] = useState(
    initialPrefs?.eatingOutOption || 'Homemade meals'
  );
  const [mealPattern, setMealPattern] = useState(
    initialPrefs?.mealPattern || '3 meals + 2 snacks'
  );

  // Custom Food Modal State
  const [customModal, setCustomModal] = useState<{
    visible: boolean;
    type: 'liked' | 'avoid';
    title: string;
    input: string;
  }>({
    visible: false,
    type: 'liked',
    title: '',
    input: '',
  });

  const [mealPatternModalVisible, setMealPatternModalVisible] = useState(false);

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const removeLikedFood = (food: string) => {
    setLikedFoods((prev) => prev.filter((f) => f !== food));
  };

  const removeAvoidFood = (food: string) => {
    setAvoidFoods((prev) => prev.filter((f) => f !== food));
  };

  const handleOpenAddLiked = () => {
    setCustomModal({
      visible: true,
      type: 'liked',
      title: 'Add Food You Love',
      input: '',
    });
  };

  const handleOpenAddAvoid = () => {
    setCustomModal({
      visible: true,
      type: 'avoid',
      title: 'Add Food to Avoid',
      input: '',
    });
  };

  const handleSaveCustomFood = () => {
    const trimmed = customModal.input.trim();
    if (!trimmed) {
      Alert.alert('Empty Input', 'Please enter a food name.');
      return;
    }

    if (customModal.type === 'liked') {
      if (!likedFoods.includes(trimmed)) {
        setLikedFoods((prev) => [...prev, trimmed]);
      }
    } else {
      if (!avoidFoods.includes(trimmed)) {
        setAvoidFoods((prev) => [...prev, trimmed]);
      }
    }

    setCustomModal((prev) => ({ ...prev, visible: false, input: '' }));
  };

  const handleContinue = () => {
    onContinue({
      cuisines: selectedCuisines,
      dietType,
      likedFoods,
      avoidFoods,
      eatingOutEnabled,
      eatingOutOption,
      mealPattern,
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
          <Text style={styles.stepText}>4 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
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
            <Text style={styles.mainTitle}>Food Preferences</Text>
            <Text style={styles.subDesc}>
              Tell us what you like, don't like and your eating habits so we can create a plan that truly works for you.
            </Text>
          </View>
          <View style={styles.characterArtBox}>
            <Text style={{ fontSize: 46 }}>🥗🥑</Text>
          </View>
        </View>

        {/* ── Section 1: Cuisine preference ── */}
        <Text style={styles.sectionHeading}>
          Cuisine preference <Text style={styles.optLbl}>(select one or more)</Text>
        </Text>
        <View style={styles.cuisineCardsGrid}>
          {[
            { id: 'Indian', name: 'Indian', emoji: '🍛' },
            { id: 'Continental', name: 'Continental', emoji: '🥗' },
            { id: 'Mixed', name: 'Mixed', emoji: '🍲' },
            { id: 'Others', name: '+ Others', emoji: '➕' },
          ].map((c) => {
            const isSelected = selectedCuisines.includes(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.cuisineTile, isSelected && styles.cuisineTileActive]}
                onPress={() => toggleCuisine(c.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cuisineIconCircle}>
                  <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
                </View>
                <Text style={styles.cuisineTileName}>{c.name}</Text>
                {isSelected && (
                  <View style={styles.cuisineCheckCorner}>
                    <CheckIcon size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 2: Diet type ── */}
        <Text style={[styles.sectionHeading, { marginTop: 16 }]}>
          Diet type <Text style={styles.optLbl}>(select one)</Text>
        </Text>
        <View style={styles.dietPillsRow}>
          {['Vegetarian', 'Eggetarian', 'Non-veg', 'Vegan'].map((d) => {
            const isSelected = dietType === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dietPill, isSelected && styles.dietPillActive]}
                onPress={() => setDietType(d)}
              >
                {isSelected && <Text style={styles.checkMarkWhite}>✓ </Text>}
                <Text
                  style={[styles.dietPillText, isSelected && styles.dietPillTextActive]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 3: Foods you love ── */}
        <View style={styles.headerWithAddRow}>
          <Text style={styles.sectionHeading}>
            Foods you love <Text style={styles.optLbl}>(add as many as you like)</Text>
          </Text>
          <TouchableOpacity style={styles.addCustomBtn} onPress={handleOpenAddLiked} activeOpacity={0.75}>
            <Text style={styles.addCustomText}>+ Add custom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {likedFoods.map((food) => (
            <View key={food} style={styles.likedTagPill}>
              <Text style={styles.likedTagText}>{food}</Text>
              <TouchableOpacity onPress={() => removeLikedFood(food)} style={styles.closeTagBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.closeTagText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Section 4: Foods to avoid ── */}
        <View style={[styles.headerWithAddRow, { marginTop: 16 }]}>
          <Text style={[styles.sectionHeading, { color: '#882A1E' }]}>
            Foods to avoid <Text style={styles.optLbl}>(select any)</Text>
          </Text>
          <TouchableOpacity style={styles.addCustomBtn} onPress={handleOpenAddAvoid} activeOpacity={0.75}>
            <Text style={styles.addCustomText}>+ Add custom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {avoidFoods.map((food) => (
            <View key={food} style={styles.avoidTagPill}>
              <Text style={styles.avoidTagText}>{food}</Text>
              <TouchableOpacity onPress={() => removeAvoidFood(food)} style={styles.closeTagBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.closeTagText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Section 5: Eating out options ── */}
        <View style={styles.eatingOutCard}>
          <View style={styles.eatingOutHeaderRow}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🍽️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.eatingOutTitle}>Eating out options</Text>
              <Text style={styles.eatingOutSub}>Helps us include realistic choices for your lifestyle.</Text>
            </View>
            <Switch
              value={eatingOutEnabled}
              onValueChange={setEatingOutEnabled}
              trackColor={{ false: '#D4CFC6', true: '#5C6E52' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {eatingOutEnabled && (
            <View style={styles.eatingOutTilesRow}>
              {[
                { id: 'Homemade meals', emoji: '🍲', label: 'Homemade meals' },
                { id: 'Occasional eating out', emoji: '🥗', label: 'Occasional eating out' },
                { id: 'Frequent eating out', emoji: '🍔', label: 'Frequent eating out' },
              ].map((opt) => {
                const isSelected = eatingOutOption === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.eatingOutTile, isSelected && styles.eatingOutTileActive]}
                    onPress={() => setEatingOutOption(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>{opt.emoji}</Text>
                    <Text style={styles.eatingOutTileLabel}>{opt.label}</Text>
                    {isSelected && (
                      <View style={styles.cuisineCheckCorner}>
                        <CheckIcon size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Section 6: Meal pattern ── */}
        <View style={styles.mealPatternRow}>
          <View style={styles.mealPatternIconCircle}>
            <ClockIcon size={16} color="#4A4E46" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealPatternTitle}>Meal pattern</Text>
            <Text style={styles.mealPatternSub}>Choose how many meals you prefer in a day.</Text>
          </View>
          <TouchableOpacity
            style={styles.mealPatternDropdown}
            onPress={() => setMealPatternModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.mealPatternDropdownText}>{mealPattern}</Text>
            <ChevronDownIcon size={12} color="#737970" />
          </TouchableOpacity>
        </View>

        {/* Callout */}
        <View style={styles.calloutCard}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>🌱</Text>
          <Text style={styles.calloutText}>
            We'll include multiple meal options and healthier alternatives based on your preferences and goal.
          </Text>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue  →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Custom Food Input Modal ── */}
      <Modal
        visible={customModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomModal((prev) => ({ ...prev, visible: false }))}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdropCenter}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setCustomModal((prev) => ({ ...prev, visible: false }))}
          />
          <View style={styles.customFoodDialog}>
            <Text style={styles.customFoodDialogTitle}>{customModal.title}</Text>
            <Text style={styles.customFoodDialogSub}>
              {customModal.type === 'liked'
                ? 'Enter a food, ingredient or dish you enjoy:'
                : 'Enter a food or ingredient you want to exclude:'}
            </Text>

            <TextInput
              style={styles.customFoodInput}
              value={customModal.input}
              onChangeText={(text) => setCustomModal((prev) => ({ ...prev, input: text }))}
              placeholder="e.g. Avocado, Paneer, Almonds..."
              placeholderTextColor="#9A9E95"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveCustomFood}
            />

            <View style={styles.customFoodButtonsRow}>
              <TouchableOpacity
                style={styles.customFoodCancelBtn}
                onPress={() => setCustomModal((prev) => ({ ...prev, visible: false, input: '' }))}
                activeOpacity={0.7}
              >
                <Text style={styles.customFoodCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customFoodAddBtn}
                onPress={handleSaveCustomFood}
                activeOpacity={0.8}
              >
                <Text style={styles.customFoodAddText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Meal Pattern Bottom Sheet Modal ── */}
      <Modal
        visible={mealPatternModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMealPatternModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMealPatternModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>Choose Meal Pattern</Text>

            {[
              '3 meals + 2 snacks',
              '3 meals + 1 snack',
              '3 main meals',
              '2 meals + 1 snack',
              'Intermittent fasting (16:8)',
            ].map((pattern) => {
              const isSelected = mealPattern === pattern;
              return (
                <TouchableOpacity
                  key={pattern}
                  style={[styles.modalOptionRow, isSelected && styles.modalOptionRowActive]}
                  onPress={() => {
                    setMealPattern(pattern);
                    setMealPatternModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}>
                    {pattern}
                  </Text>
                  <View style={[styles.modalRadio, isSelected && styles.modalRadioActive]}>
                    {isSelected && <View style={styles.modalRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setMealPatternModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
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
    fontSize: 11.5,
    color: '#686B63',
    lineHeight: 16,
  },
  characterArtBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 8,
  },
  optLbl: {
    fontSize: 11,
    color: '#737970',
    fontWeight: '400',
  },
  cuisineCardsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  cuisineTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  cuisineTileActive: {
    borderColor: '#5C6E52',
    backgroundColor: '#FBFDFB',
  },
  cuisineIconCircle: {
    marginBottom: 4,
  },
  cuisineTileName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  cuisineCheckCorner: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dietPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingVertical: 8,
  },
  dietPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  dietPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#444740',
  },
  dietPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkMarkWhite: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
  },
  headerWithAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addCustomBtn: {
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addCustomText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#343831',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  likedTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0E6',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 6,
  },
  likedTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#264428',
  },
  avoidTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEEEB',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 6,
  },
  avoidTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8A2C21',
  },
  closeTagBtn: {
    padding: 2,
  },
  closeTagText: {
    fontSize: 10,
    color: '#737970',
    fontWeight: '700',
  },
  eatingOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginVertical: 12,
  },
  eatingOutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eatingOutTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  eatingOutSub: {
    fontSize: 10.5,
    color: '#737970',
  },
  eatingOutTilesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  eatingOutTile: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  eatingOutTileActive: {
    borderColor: '#5C6E52',
    backgroundColor: '#FFFFFF',
  },
  eatingOutTileLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1C1D1A',
    textAlign: 'center',
  },
  mealPatternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  mealPatternIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mealPatternTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  mealPatternSub: {
    fontSize: 10,
    color: '#737970',
  },
  mealPatternDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF8F4',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mealPatternDropdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E0D4',
    padding: 12,
    marginBottom: 24,
  },
  calloutText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: '#555850',
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
  modalBackdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  customFoodDialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  customFoodDialogTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 6,
  },
  customFoodDialogSub: {
    fontSize: 12.5,
    color: '#686B63',
    lineHeight: 17,
    marginBottom: 16,
  },
  customFoodInput: {
    backgroundColor: '#FAF8F4',
    borderWidth: 1.5,
    borderColor: '#5C6E52',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1C1D1A',
    marginBottom: 20,
  },
  customFoodButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  customFoodCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3EFE7',
    alignItems: 'center',
  },
  customFoodCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#686B63',
  },
  customFoodAddBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#5C6E52',
    alignItems: 'center',
  },
  customFoodAddText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCD8CE',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1D1A',
    fontFamily: 'serif',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFECE4',
  },
  modalOptionRowActive: {
    backgroundColor: '#EAF0E6',
    borderColor: '#3D5C3E',
  },
  modalOptionText: {
    fontSize: 13.5,
    color: '#4A4E46',
    flex: 1,
  },
  modalOptionTextActive: {
    color: '#1C1D1A',
    fontWeight: '700',
  },
  modalRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C8CCC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRadioActive: {
    borderColor: '#3D5C3E',
  },
  modalRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3D5C3E',
  },
  modalCloseBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3EFE7',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C6E52',
  },
});

