import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { BodyProfile, Gender } from '../types';
import {
  CloseIcon,
  UserIcon,
  HeightIcon,
  WeightIcon,
  ActivityIcon,
  TargetIcon,
  ChevronDownIcon,
} from './Icons';

interface EditProfileModalProps {
  visible: boolean;
  profile: BodyProfile;
  onClose: () => void;
  onSave: (updated: BodyProfile) => void;
}

const ACTIVITY_OPTIONS = [
  { label: 'Sedentary', desc: 'Little to no exercise, desk job' },
  { label: 'Lightly active', desc: 'Light exercise 1–2 days a week' },
  { label: 'Moderately active', desc: 'Light exercise 3–5 days a week' },
  { label: 'Very active', desc: 'Hard exercise 6–7 days a week' },
];

const HEALTH_GOALS = [
  { label: 'Hormonal balance', desc: 'Supporting PCOS, thyroid and hormonal health' },
  { label: 'Weight management', desc: 'Sustainable fat loss and muscle tone' },
  { label: 'Improve energy levels', desc: 'Feel active and less fatigued throughout day' },
  { label: 'Better digestion', desc: 'Reduce bloating and gut inflammation' },
  { label: 'Build healthier habits', desc: 'Create sustainable daily routines' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
}) => {
  const [age, setAge] = useState(String(profile.age));
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [height, setHeight] = useState(String(profile.heightCm));
  const [weight, setWeight] = useState(String(profile.weightKg));
  const [activityIndex, setActivityIndex] = useState(
    Math.max(0, ACTIVITY_OPTIONS.findIndex((a) => a.label === profile.activityLevel))
  );
  const [goalIndex, setGoalIndex] = useState(
    Math.max(0, HEALTH_GOALS.findIndex((g) => g.label === profile.healthGoal))
  );
  const [bodyFat, setBodyFat] = useState(profile.bodyFatPercent || '');
  const [muscleMass, setMuscleMass] = useState(profile.muscleMassKg || '');

  const handleSave = () => {
    const parsedAge = parseInt(age, 10) || 26;
    const parsedHeight = parseFloat(height) || 165;
    const parsedWeight = parseFloat(weight) || 65;

    onSave({
      age: parsedAge,
      gender,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      activityLevel: ACTIVITY_OPTIONS[activityIndex].label,
      activityDescription: ACTIVITY_OPTIONS[activityIndex].desc,
      healthGoal: HEALTH_GOALS[goalIndex].label,
      healthGoalDescription: HEALTH_GOALS[goalIndex].desc,
      bodyFatPercent: bodyFat,
      muscleMassKg: muscleMass,
    });
    onClose();
  };

  const cycleActivity = () => {
    setActivityIndex((prev) => (prev + 1) % ACTIVITY_OPTIONS.length);
  };

  const cycleGoal = () => {
    setGoalIndex((prev) => (prev + 1) % HEALTH_GOALS.length);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Edit your body profile</Text>
              <Text style={styles.subtitle}>
                Update your details to get accurate calculations.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <CloseIcon size={16} color="#1C1D1A" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Age Field */}
            <View style={styles.fieldRow}>
              <View style={styles.iconSquare}>
                <UserIcon size={18} color="#4A4E46" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Age</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.textInput}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="26"
                    placeholderTextColor="#A0A59C"
                  />
                  <View style={styles.unitDropdown}>
                    <Text style={styles.unitText}>years</Text>
                    <ChevronDownIcon size={12} color="#737970" />
                  </View>
                </View>
              </View>
            </View>

            {/* Gender Field */}
            <View style={styles.fieldRow}>
              <View style={styles.iconSquare}>
                <UserIcon size={16} color="#4A4E46" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderPillsContainer}>
                  {(['Female', 'Male', 'Other'] as Gender[]).map((g) => {
                    const isSelected = gender === g;
                    return (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.genderPill,
                          isSelected && styles.genderPillActive,
                        ]}
                        onPress={() => setGender(g)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.genderPillText,
                            isSelected && styles.genderPillTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Height & Weight Row */}
            <View style={styles.dualFieldRow}>
              {/* Height */}
              <View style={styles.dualCol}>
                <View style={styles.fieldRowCompact}>
                  <View style={styles.iconSquare}>
                    <HeightIcon size={16} color="#4A4E46" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Height</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={styles.textInput}
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                        placeholder="165"
                        placeholderTextColor="#A0A59C"
                      />
                      <View style={styles.unitDropdown}>
                        <Text style={styles.unitText}>cm</Text>
                        <ChevronDownIcon size={11} color="#737970" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Weight */}
              <View style={styles.dualCol}>
                <View style={styles.fieldRowCompact}>
                  <View style={styles.iconSquare}>
                    <WeightIcon size={16} color="#4A4E46" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Weight</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={styles.textInput}
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        placeholder="65"
                        placeholderTextColor="#A0A59C"
                      />
                      <View style={styles.unitDropdown}>
                        <Text style={styles.unitText}>kg</Text>
                        <ChevronDownIcon size={11} color="#737970" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.fieldRow}>
              <View style={styles.iconSquare}>
                <ActivityIcon size={18} color="#4A4E46" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Activity level</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={cycleActivity}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownValue}>
                    {ACTIVITY_OPTIONS[activityIndex].label}
                  </Text>
                  <ChevronDownIcon size={14} color="#737970" />
                </TouchableOpacity>
                <Text style={styles.fieldHelpText}>
                  {ACTIVITY_OPTIONS[activityIndex].desc}
                </Text>
              </View>
            </View>

            {/* Health Goal */}
            <View style={styles.fieldRow}>
              <View style={styles.iconSquare}>
                <TargetIcon size={18} color="#4A4E46" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Health goal</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={cycleGoal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownValue}>
                    {HEALTH_GOALS[goalIndex].label}
                  </Text>
                  <ChevronDownIcon size={14} color="#737970" />
                </TouchableOpacity>
                <Text style={styles.fieldHelpText}>
                  {HEALTH_GOALS[goalIndex].desc}
                </Text>
              </View>
            </View>

            {/* Body composition (optional) */}
            <View style={styles.fieldRow}>
              <View style={styles.iconSquare}>
                <ActivityIcon size={16} color="#4A4E46" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Body composition (optional)</Text>
                <View style={styles.compositionRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.subInputLabel}>Body fat %</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={styles.textInput}
                        value={bodyFat}
                        onChangeText={setBodyFat}
                        keyboardType="numeric"
                        placeholder="e.g. 28"
                        placeholderTextColor="#A0A59C"
                      />
                      <Text style={styles.staticUnitText}>%</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subInputLabel}>Muscle mass (optional)</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={styles.textInput}
                        value={muscleMass}
                        onChangeText={setMuscleMass}
                        keyboardType="numeric"
                        placeholder="e.g. 40"
                        placeholderTextColor="#A0A59C"
                      />
                      <Text style={styles.staticUnitText}>kg</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Save details CTA */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Save details</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '92%',
  },
  dragHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1CDC7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#686B63',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F2EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fieldRowCompact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dualFieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dualCol: {
    flex: 1,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F4EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 18,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#262923',
    marginBottom: 6,
  },
  subInputLabel: {
    fontSize: 11,
    color: '#686B63',
    marginBottom: 4,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1D1A',
    paddingVertical: 0,
  },
  unitDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unitText: {
    fontSize: 12.5,
    color: '#686B63',
    fontWeight: '500',
  },
  staticUnitText: {
    fontSize: 12.5,
    color: '#8C9088',
    fontWeight: '500',
  },
  genderPillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderPill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: '#5C6E52',
    borderColor: '#5C6E52',
  },
  genderPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#343831',
  },
  genderPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8E4DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  dropdownValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1C1D1A',
  },
  fieldHelpText: {
    fontSize: 11,
    color: '#737970',
    marginTop: 4,
  },
  compositionRow: {
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

