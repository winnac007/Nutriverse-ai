import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  UserIcon,
  HeightIcon,
  WeightIcon,
  ActivityIcon,
  TargetIcon,
  SproutIcon,
  LeafIcon,
  ClockIcon,
  WaterIcon,
  CompassIcon,
  CalendarIcon,
  CheckIcon,
  ShieldIcon,
} from '../components/Icons';

interface GoalSettingProfileScreenProps {
  initialProfile?: {
    age?: string;
    height?: string;
    weight?: string;
    targetWeight?: string;
    activityLevel?: string;
    selectedConditions?: string[];
    sleepDuration?: string;
    waterIntake?: string;
    workRoutine?: string;
    stressLevel?: string;
    cycleType?: string;
    cycleLength?: string;
    periodDuration?: string;
    medications?: string;
  };
  onBack: () => void;
  onContinue: (profileData: any) => void;
}

export const GoalSettingProfileScreen: React.FC<GoalSettingProfileScreenProps> = ({
  initialProfile,
  onBack,
  onContinue,
}) => {
  const [age, setAge] = useState(initialProfile?.age || '26');
  const [height, setHeight] = useState(initialProfile?.height || '162');
  const [weight, setWeight] = useState(initialProfile?.weight || '68');
  const [targetWeight, setTargetWeight] = useState(initialProfile?.targetWeight || '55');
  const [activityLevel, setActivityLevel] = useState(initialProfile?.activityLevel || 'Lightly active');

  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    initialProfile?.selectedConditions || ['PCOS']
  );
  const [sleepDuration, setSleepDuration] = useState(initialProfile?.sleepDuration || '6–7 hours');
  const [waterIntake, setWaterIntake] = useState(initialProfile?.waterIntake || '1.5–2 litres');
  const [workRoutine, setWorkRoutine] = useState(initialProfile?.workRoutine || 'Student');
  const [stressLevel, setStressLevel] = useState(initialProfile?.stressLevel || 'Moderate');

  const [cycleType, setCycleType] = useState(initialProfile?.cycleType || 'Irregular');
  const [cycleLength, setCycleLength] = useState(initialProfile?.cycleLength || '35');
  const [periodDuration, setPeriodDuration] = useState(initialProfile?.periodDuration || '5');
  const [medications, setMedications] = useState(initialProfile?.medications || '');

  // Dropdown Picker Modal State
  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    title: string;
    field: 'activity' | 'sleep' | 'water' | 'work' | 'stress';
    options: string[];
    selected: string;
  }>({
    visible: false,
    title: '',
    field: 'activity',
    options: [],
    selected: '',
  });

  const openPicker = (
    field: 'activity' | 'sleep' | 'water' | 'work' | 'stress',
    title: string,
    options: string[],
    currentVal: string
  ) => {
    setPickerModal({
      visible: true,
      title,
      field,
      options,
      selected: currentVal,
    });
  };

  const selectOption = (opt: string) => {
    const cleanOpt = opt.includes(' (') ? opt.split(' (')[0] : opt;
    if (pickerModal.field === 'activity') setActivityLevel(cleanOpt);
    else if (pickerModal.field === 'sleep') setSleepDuration(cleanOpt);
    else if (pickerModal.field === 'water') setWaterIntake(cleanOpt);
    else if (pickerModal.field === 'work') setWorkRoutine(cleanOpt);
    else if (pickerModal.field === 'stress') setStressLevel(cleanOpt);

    setPickerModal((prev) => ({ ...prev, visible: false }));
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleContinue = () => {
    onContinue({
      age,
      height,
      weight,
      targetWeight,
      activityLevel,
      selectedConditions,
      sleepDuration,
      waterIntake,
      workRoutine,
      stressLevel,
      cycleType,
      cycleLength,
      periodDuration,
      medications,
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
          <SproutIcon size={18} color="#3D5C3E" style={{ marginRight: 6 }} />
          <Text style={styles.brandTitle}>Zenplato</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.stepText}>3 of 6</Text>
          <View style={styles.progressSegments}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
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
        {/* Title & Graphic */}
        <View style={styles.titleWithGraphicRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.kicker}>Goal Setting</Text>
            <Text style={styles.mainTitle}>Your Current Profile</Text>
            <Text style={styles.subDesc}>Help us understand where you are now.</Text>
          </View>
          <View style={styles.characterArtBox}>
            <View style={styles.clinicalHeaderBadge}>
              <UserIcon size={26} color="#3D5C3E" />
            </View>
          </View>
        </View>

        {/* ── Section 1: Basic Details ── */}
        <Text style={styles.sectionHeading}>Basic Details</Text>
        <View style={styles.basicDetailsGrid}>
          {/* Age */}
          <View style={styles.fieldCol}>
            <View style={styles.inputBoxWithIcon}>
              <CalendarIcon size={16} color="#4A4E46" style={{ marginRight: 6 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallInputLabel}>Age</Text>
                <TextInput
                  style={styles.textInputMain}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.unitText}>years</Text>
            </View>
          </View>

          {/* Height */}
          <View style={styles.fieldCol}>
            <View style={styles.inputBoxWithIcon}>
              <HeightIcon size={16} color="#4A4E46" style={{ marginRight: 6 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallInputLabel}>Height</Text>
                <TextInput
                  style={styles.textInputMain}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.unitText}>cm</Text>
            </View>
          </View>

          {/* Current weight */}
          <View style={styles.fieldCol}>
            <View style={styles.inputBoxWithIcon}>
              <WeightIcon size={16} color="#4A4E46" style={{ marginRight: 6 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallInputLabel}>Current weight</Text>
                <TextInput
                  style={styles.textInputMain}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          {/* Target weight (optional) */}
          <View style={styles.fieldCol}>
            <View style={styles.inputBoxWithIcon}>
              <TargetIcon size={16} color="#4A4E46" style={{ marginRight: 6 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallInputLabel}>Target weight <Text style={styles.optLbl}>(optional)</Text></Text>
                <TextInput
                  style={styles.textInputMain}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          {/* Activity level full width */}
          <View style={styles.fullWidthField}>
            <TouchableOpacity
              style={styles.inputBoxWithIcon}
              onPress={() =>
                openPicker(
                  'activity',
                  'Select Activity Level',
                  [
                    'Sedentary (Little or no exercise)',
                    'Lightly active (Exercise 1–3 days/wk)',
                    'Moderately active (Exercise 3–5 days/wk)',
                    'Very active (Exercise 6–7 days/wk)',
                    'Extra active (Hard physical exercise)',
                  ],
                  activityLevel
                )
              }
              activeOpacity={0.8}
            >
              <ActivityIcon size={16} color="#4A4E46" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallInputLabel}>Activity level</Text>
                <Text style={styles.dropdownSelectedText}>{activityLevel}</Text>
              </View>
              <ChevronDownIcon size={12} color="#737970" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section 2: Health Conditions ── */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>
          Health Conditions <Text style={styles.optLbl}>(select all that apply)</Text>
        </Text>
        <View style={styles.conditionsPillsRow}>
          {['PCOS', 'Thyroid', 'Diabetes', 'PCOD', 'None', 'Others'].map((cond) => {
            const isSelected = selectedConditions.includes(cond);
            return (
              <TouchableOpacity
                key={cond}
                style={[styles.condPill, isSelected && styles.condPillActive]}
                onPress={() => toggleCondition(cond)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={{ marginRight: 4 }}>
                    <CheckIcon size={10} color="#FFFFFF" />
                  </View>
                )}
                <Text
                  style={[styles.condPillText, isSelected && styles.condPillTextActive]}
                >
                  {cond}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section 3: Lifestyle Snapshot ── */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Lifestyle Snapshot</Text>
        <View style={styles.lifestyleGrid}>
          {/* Sleep */}
          <View style={styles.lifestyleCol}>
            <TouchableOpacity
              style={styles.lifestyleTile}
              onPress={() =>
                openPicker(
                  'sleep',
                  'Sleep Duration',
                  ['< 5 hours', '5–6 hours', '6–7 hours', '7–8 hours', '8+ hours'],
                  sleepDuration
                )
              }
              activeOpacity={0.8}
            >
              <ClockIcon size={16} color="#4A4E46" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.lifestyleLabel}>Sleep duration</Text>
                <Text style={styles.lifestyleValue}>{sleepDuration}</Text>
              </View>
              <ChevronDownIcon size={10} color="#737970" />
            </TouchableOpacity>
          </View>

          {/* Water */}
          <View style={styles.lifestyleCol}>
            <TouchableOpacity
              style={styles.lifestyleTile}
              onPress={() =>
                openPicker(
                  'water',
                  'Daily Water Intake',
                  ['< 1 litre', '1–1.5 litres', '1.5–2 litres', '2–3 litres', '3+ litres'],
                  waterIntake
                )
              }
              activeOpacity={0.8}
            >
              <WaterIcon size={16} color="#4A4E46" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.lifestyleLabel}>Water intake</Text>
                <Text style={styles.lifestyleValue}>{waterIntake}</Text>
              </View>
              <ChevronDownIcon size={10} color="#737970" />
            </TouchableOpacity>
          </View>

          {/* Work routine */}
          <View style={styles.lifestyleCol}>
            <TouchableOpacity
              style={styles.lifestyleTile}
              onPress={() =>
                openPicker(
                  'work',
                  'Work Routine',
                  [
                    'Desk job / Sedentary',
                    'Student',
                    'Standing / On feet',
                    'Physical / Active work',
                    'Rotating night shifts',
                  ],
                  workRoutine
                )
              }
              activeOpacity={0.8}
            >
              <CompassIcon size={16} color="#4A4E46" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.lifestyleLabel}>Work routine</Text>
                <Text style={styles.lifestyleValue}>{workRoutine}</Text>
              </View>
              <ChevronDownIcon size={10} color="#737970" />
            </TouchableOpacity>
          </View>

          {/* Stress level */}
          <View style={styles.lifestyleCol}>
            <TouchableOpacity
              style={styles.lifestyleTile}
              onPress={() =>
                openPicker(
                  'stress',
                  'Stress Level',
                  ['Low', 'Mild', 'Moderate', 'High', 'Very high'],
                  stressLevel
                )
              }
              activeOpacity={0.8}
            >
              <LeafIcon size={16} color="#4A4E46" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.lifestyleLabel}>Stress level</Text>
                <Text style={styles.lifestyleValue}>{stressLevel}</Text>
              </View>
              <ChevronDownIcon size={10} color="#737970" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section 4: Menstrual Cycle (for PCOS support) ── */}
        <View style={styles.cycleCard}>
          <View style={styles.cycleHeaderRow}>
            <CalendarIcon size={16} color="#4A4E46" style={{ marginRight: 6 }} />
            <Text style={styles.cycleTitle}>
              Menstrual Cycle <Text style={styles.optLbl}>(for PCOS support)</Text>
            </Text>
          </View>

          {/* Cycle type pills */}
          <View style={styles.cycleTypeRow}>
            {['Regular', 'Irregular', 'No periods', 'Unknown'].map((t) => {
              const isSelected = cycleType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.cycleTypePill, isSelected && styles.cycleTypePillActive]}
                  onPress={() => setCycleType(t)}
                >
                  <Text
                    style={[styles.cycleTypeText, isSelected && styles.cycleTypeTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Cycle length and Period duration */}
          <View style={styles.cycleInputsRow}>
            <View style={styles.cycleInputBox}>
              <Text style={styles.cycleFieldLbl}>Average cycle length</Text>
              <View style={styles.inlineNumUnit}>
                <TextInput
                  style={styles.cycleNumInput}
                  value={cycleLength}
                  onChangeText={setCycleLength}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>days</Text>
              </View>
            </View>

            <View style={styles.cycleInputBox}>
              <Text style={styles.cycleFieldLbl}>Period duration</Text>
              <View style={styles.inlineNumUnit}>
                <TextInput
                  style={styles.cycleNumInput}
                  value={periodDuration}
                  onChangeText={setPeriodDuration}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Section 5: Current Medications or Supplements ── */}
        <View style={styles.medsCard}>
          <View style={styles.medsHeader}>
            <ShieldIcon size={14} color="#4A4E46" style={{ marginRight: 6 }} />
            <Text style={styles.medsTitle}>
              Current Medications or Supplements <Text style={styles.optLbl}>(optional)</Text>
            </Text>
          </View>
          <TextInput
            style={styles.medsInput}
            value={medications}
            onChangeText={setMedications}
            placeholder="e.g. birth control pills, metformin, vitamin D..."
            placeholderTextColor="#9A9E95"
          />
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

      {/* ── Dropdown Picker Modal ── */}
      <Modal
        visible={pickerModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerModal((prev) => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickerModal((prev) => ({ ...prev, visible: false }))}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>{pickerModal.title}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 340 }}>
              {pickerModal.options.map((opt) => {
                const isSelected =
                  opt === pickerModal.selected ||
                  opt.startsWith(pickerModal.selected) ||
                  pickerModal.selected.startsWith(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.modalOptionRow, isSelected && styles.modalOptionRowActive]}
                    onPress={() => selectOption(opt)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}
                    >
                      {opt}
                    </Text>
                    <View style={[styles.modalRadio, isSelected && styles.modalRadioActive]}>
                      {isSelected && <View style={styles.modalRadioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setPickerModal((prev) => ({ ...prev, visible: false }))}
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
    fontSize: 12,
    color: '#686B63',
  },
  characterArtBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3E8D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicalHeaderBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DC',
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 8,
  },
  optLbl: {
    fontSize: 11,
    color: '#737970',
    fontWeight: '400',
  },
  basicDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  fieldCol: {
    width: '48%',
  },
  fullWidthField: {
    width: '100%',
  },
  inputBoxWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 52,
  },
  smallInputLabel: {
    fontSize: 10,
    color: '#737970',
    marginBottom: 1,
  },
  textInputMain: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
    padding: 0,
  },
  unitText: {
    fontSize: 11.5,
    color: '#686B63',
    fontWeight: '500',
  },
  dropdownSelectedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  conditionsPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  condPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  condPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  condPillText: {
    fontSize: 12,
    color: '#444740',
    fontWeight: '500',
  },
  condPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkMarkWhite: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  lifestyleCol: {
    width: '48%',
  },
  lifestyleTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  lifestyleLabel: {
    fontSize: 9.5,
    color: '#737970',
  },
  lifestyleValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
    marginTop: 2,
  },
  cycleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginBottom: 16,
  },
  cycleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  cycleTypeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  cycleTypePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 10,
    paddingVertical: 6,
  },
  cycleTypePillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  cycleTypeText: {
    fontSize: 10,
    color: '#4A4E46',
    fontWeight: '600',
  },
  cycleTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cycleInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cycleInputBox: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    padding: 8,
  },
  cycleFieldLbl: {
    fontSize: 9.5,
    color: '#737970',
    marginBottom: 2,
  },
  inlineNumUnit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cycleNumInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D1A',
    padding: 0,
    marginRight: 4,
  },
  medsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 12,
    marginBottom: 24,
  },
  medsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medsTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  medsInput: {
    fontSize: 12,
    color: '#1C1D1A',
    borderWidth: 1,
    borderColor: '#EFECE4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FAF8F4',
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
    marginBottom: 6,
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
    paddingRight: 10,
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
    marginTop: 12,
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

