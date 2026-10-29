import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { CloseIcon, InfoIcon } from './Icons';

interface AboutBmiModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutBmiModal: React.FC<AboutBmiModalProps> = ({ visible, onClose }) => {
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
              <Text style={styles.title}>About BMI</Text>
              <Text style={styles.subtitle}>Body Mass Index</Text>
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
            {/* Description */}
            <Text style={styles.description}>
              BMI is a simple measure that relates your weight to your height. It is used as a general indicator to understand whether your weight is in a healthy range for your height.
            </Text>

            {/* Formula Box */}
            <View style={styles.formulaBox}>
              <View style={styles.formulaLabelContainer}>
                <Text style={styles.formulaLabel}>Formula</Text>
              </View>
              <View style={styles.formulaDivider} />
              <View style={styles.formulaValueContainer}>
                <Text style={styles.formulaText}>
                  BMI = weight (kg) ÷ [height (m)]²
                </Text>
              </View>
            </View>

            {/* BMI ranges for adults */}
            <Text style={styles.sectionHeading}>BMI ranges for adults</Text>

            {/* Color segments bar */}
            <View style={styles.gaugeBarContainer}>
              <View style={[styles.gaugeSegment, { backgroundColor: '#A4C3D2', flex: 1 }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#6E8B67', flex: 1.2 }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#E4CFBA', flex: 1 }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#EAA972', flex: 1 }]} />
              <View style={[styles.gaugeSegment, { backgroundColor: '#E87A84', flex: 1 }]} />
            </View>

            {/* Range labels */}
            <View style={styles.rangeLabelsRow}>
              <View style={styles.rangeCol}>
                <Text style={styles.rangeValue}>{'< 18.5'}</Text>
                <Text style={styles.rangeName}>Underweight</Text>
              </View>
              <View style={styles.rangeCol}>
                <Text style={[styles.rangeValue, { color: Colors.primary, fontWeight: '700' }]}>
                  18.5 – 24.9
                </Text>
                <Text style={[styles.rangeName, { color: Colors.primary, fontWeight: '600' }]}>
                  Normal
                </Text>
              </View>
              <View style={styles.rangeCol}>
                <Text style={styles.rangeValue}>25 – 29.9</Text>
                <Text style={styles.rangeName}>Overweight</Text>
              </View>
              <View style={styles.rangeCol}>
                <Text style={styles.rangeValue}>30 – 34.9</Text>
                <Text style={styles.rangeName}>Obesity I</Text>
              </View>
              <View style={styles.rangeCol}>
                <Text style={styles.rangeValue}>≥ 35</Text>
                <Text style={styles.rangeName}>Obesity II</Text>
              </View>
            </View>

            {/* Disclaimer Box */}
            <View style={styles.disclaimerBox}>
              <View style={{ marginRight: 10, marginTop: 2 }}>
                <InfoIcon size={16} color="#856404" />
              </View>
              <Text style={styles.disclaimerText}>
                BMI is a general reference and may not be accurate for everyone, such as athletes, pregnant individuals, or those with certain medical conditions. Your nutritionist will consider multiple factors beyond BMI.
              </Text>
            </View>

            {/* Got it CTA */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Got it</Text>
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
    paddingBottom: 32,
    maxHeight: '85%',
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
    marginBottom: 14,
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
    paddingBottom: 16,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4A4D46',
    marginBottom: 18,
  },
  formulaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4EFE6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  formulaLabelContainer: {
    paddingRight: 12,
  },
  formulaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  formulaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#DCD6CC',
    marginRight: 12,
  },
  formulaValueContainer: {
    flex: 1,
  },
  formulaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E3A2F',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 10,
  },
  gaugeBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
    gap: 3,
  },
  gaugeSegment: {
    borderRadius: 3,
  },
  rangeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rangeCol: {
    alignItems: 'center',
    flex: 1,
  },
  rangeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333530',
    marginBottom: 2,
  },
  rangeName: {
    fontSize: 9.5,
    color: '#737970',
    textAlign: 'center',
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#FBF8F0',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#6E6B62',
  },
  primaryButton: {
    backgroundColor: '#5C6E52',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

