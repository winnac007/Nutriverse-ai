import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { CloseIcon, InfoIcon, LeafIcon, FlameIcon } from './Icons';

interface AboutBmrModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutBmrModal: React.FC<AboutBmrModalProps> = ({ visible, onClose }) => {
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
              <Text style={styles.title}>About BMR</Text>
              <Text style={styles.subtitle}>Basal Metabolic Rate</Text>
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
              BMR is the estimated number of calories your body needs to perform essential functions at rest, such as breathing, circulation, and maintaining body temperature. It represents the minimum energy your body needs to stay alive.
            </Text>

            {/* Formula box */}
            <View style={styles.formulaBox}>
              <View style={styles.formulaLabelCol}>
                <Text style={styles.formulaLabel}>Formula</Text>
                <Text style={styles.formulaSublabel}>(Used in ZenPlato)</Text>
              </View>
              <View style={styles.formulaDivider} />
              <View style={styles.formulaValueCol}>
                <Text style={styles.equationTitle}>Mifflin–St Jeor Equation</Text>
                <Text style={styles.equationSub}>(commonly used and widely accepted)</Text>
              </View>
            </View>

            {/* Side-by-side cards for Women and Men */}
            <View style={styles.genderEquationsRow}>
              {/* Women */}
              <View style={styles.genderCard}>
                <View style={styles.genderHeader}>
                  <Text style={styles.genderSymbol}>♀</Text>
                  <Text style={styles.genderTitle}>For women</Text>
                </View>
                <Text style={styles.genderFormula}>
                  BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) - 161
                </Text>
              </View>

              {/* Men */}
              <View style={styles.genderCard}>
                <View style={styles.genderHeader}>
                  <Text style={styles.genderSymbolBlue}>♂</Text>
                  <Text style={styles.genderTitle}>For men</Text>
                </View>
                <Text style={styles.genderFormula}>
                  BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5
                </Text>
              </View>
            </View>

            {/* What your BMR means */}
            <Text style={styles.sectionHeading}>What your BMR means</Text>

            <View style={styles.meaningCardsRow}>
              {/* Card 1 */}
              <View style={styles.meaningCard}>
                <View style={styles.meaningIconWrapper}>
                  <LeafIcon size={16} color="#3D5C3E" />
                </View>
                <Text style={styles.meaningText}>
                  It reflects your body's basic energy needs.
                </Text>
              </View>

              {/* Card 2 */}
              <View style={styles.meaningCard}>
                <View style={styles.meaningIconWrapper}>
                  <FlameIcon size={16} color="#D97706" />
                </View>
                <Text style={styles.meaningText}>
                  Does not include calories burned through activity.
                </Text>
              </View>

              {/* Card 3 */}
              <View style={styles.meaningCard}>
                <View style={styles.meaningIconWrapper}>
                  <Text style={{ fontSize: 14 }}>🥞</Text>
                </View>
                <Text style={styles.meaningText}>
                  Used to estimate your total daily energy needs (TDEE).
                </Text>
              </View>
            </View>

            {/* Disclaimer Box */}
            <View style={styles.disclaimerBox}>
              <View style={{ marginRight: 10, marginTop: 2 }}>
                <InfoIcon size={16} color="#856404" />
              </View>
              <Text style={styles.disclaimerText}>
                BMR is an estimate and can vary based on individual factors such as body composition, hormonal status, medical conditions, and measurement accuracy. Your nutritionist will consider multiple factors beyond BMR while setting your personalized targets.
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
    maxHeight: '90%',
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
    marginBottom: 12,
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
    fontSize: 12.5,
    lineHeight: 19,
    color: '#4A4D46',
    marginBottom: 16,
  },
  formulaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4EFE6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  formulaLabelCol: {
    paddingRight: 10,
  },
  formulaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  formulaSublabel: {
    fontSize: 9.5,
    color: '#737970',
  },
  formulaDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DCD6CC',
    marginRight: 12,
  },
  formulaValueCol: {
    flex: 1,
  },
  equationTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  equationSub: {
    fontSize: 10,
    color: '#737970',
  },
  genderEquationsRow: {
    gap: 10,
    marginBottom: 20,
  },
  genderCard: {
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 12,
    padding: 12,
  },
  genderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  genderSymbol: {
    fontSize: 15,
    color: '#D97706',
    marginRight: 6,
    fontWeight: '700',
  },
  genderSymbolBlue: {
    fontSize: 15,
    color: '#2563EB',
    marginRight: 6,
    fontWeight: '700',
  },
  genderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  genderFormula: {
    fontSize: 11,
    lineHeight: 16,
    color: '#555850',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1D1A',
    marginBottom: 12,
  },
  meaningCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  meaningCard: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  meaningIconWrapper: {
    marginBottom: 6,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningText: {
    fontSize: 9.5,
    lineHeight: 14,
    color: '#555850',
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
