import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TargetIcon,
  UserIcon,
  LeafIcon,
  SproutIcon,
} from '../components/Icons';
import { checkBackendHealth, getApiHost } from '../services/api';

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateToCalculations: () => void;
  onNavigateToGoalSetting: () => void;
  onNavigateToCareTeam: () => void;
  onNavigateToNutritionistPortal?: () => void;
  onNavigateToNutritionistEditor?: () => void;
  onSignOut?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateToCalculations,
  onNavigateToGoalSetting,
  onNavigateToCareTeam,
  onNavigateToNutritionistPortal,
  onNavigateToNutritionistEditor,
  onSignOut,
}) => {
  return (
    <View style={styles.container}>
      {/* ── Top Header ── */}
      <View style={styles.topBar}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeftIcon size={24} color="#1C1D1A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
        <Text style={styles.barTitle}>Your Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={require('../../assets/images/nutritionist-ananya.webp')}
            style={styles.avatarImg}
          />
          <Text style={styles.userName}>Alok D.</Text>
          <Text style={styles.userSubtitle}>Zenplato Member • Hormonal Wellness Track</Text>

          <View style={styles.statsPillRow}>
            <View style={styles.statMiniCol}>
              <Text style={styles.statMiniNum}>65 kg</Text>
              <Text style={styles.statMiniLabel}>Weight</Text>
            </View>
            <View style={styles.statMiniSep} />
            <View style={styles.statMiniCol}>
              <Text style={styles.statMiniNum}>55 kg</Text>
              <Text style={styles.statMiniLabel}>Goal Target</Text>
            </View>
            <View style={styles.statMiniSep} />
            <View style={styles.statMiniCol}>
              <Text style={styles.statMiniNum}>23.9</Text>
              <Text style={styles.statMiniLabel}>Current BMI</Text>
            </View>
          </View>
        </View>

        {/* Section: Wellness Plan */}
        <Text style={styles.groupHeading}>WELLNESS & TARGETS</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={onNavigateToCalculations}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📊</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Nutrition Calculations</Text>
              <Text style={styles.settingDesc}>BMI, BMR, TDEE, Ideal Body Weight</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={onNavigateToGoalSetting}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>My Goals & Timeline</Text>
              <Text style={styles.settingDesc}>Manage PCOS symptoms, 6 months target</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={onNavigateToCareTeam}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>👩‍⚕️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>My Care Team</Text>
              <Text style={styles.settingDesc}>Dr. Ananya Sharma (Clinical Nutritionist)</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={onNavigateToNutritionistPortal}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📋</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Nutritionist Portal</Text>
              <Text style={styles.settingDesc}>Plan Review & Approvals for client plans</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={onNavigateToNutritionistEditor}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🍳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Edit Meal Plan (Nutritionist)</Text>
              <Text style={styles.settingDesc}>Customize meals, portions & timings for Riya</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>
        </View>

        {/* Section: Preferences */}
        <Text style={styles.groupHeading}>PREFERENCES</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>🥗</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Dietary Preferences</Text>
              <Text style={styles.settingDesc}>Vegetarian (Indian cuisine, Paneer, Dal)</Text>
            </View>
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>🌸</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Health Focus</Text>
              <Text style={styles.settingDesc}>Hormonal balance, PCOS symptom relief</Text>
            </View>
          </View>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={async () => {
              const res = await checkBackendHealth();
              if (res.connected) {
                Alert.alert(
                  'Backend Connected! 🟢',
                  `Connected to Nutriverse API v${res.version || '2.1'}\nHost: ${res.host}\nData mode: Live backend with database.`
                );
              } else {
                Alert.alert(
                  'Offline / Standalone Mode 🟠',
                  `Could not connect to ${res.host}.\n\nThe mobile app is operating in local mock mode with full UI and biometric calculation functionality.\n\nTo connect to live backend:\ncd backend && uvicorn app.main:app --reload`
                );
              }
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Backend API Status</Text>
              <Text style={styles.settingDesc}>Check FastAPI connection ({getApiHost()})</Text>
            </View>
            <ChevronRightIcon size={16} color="#8D9188" />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        {onSignOut && (
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to sign out of your Zenplato account?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: onSignOut,
                },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutBtnText}>Log Out of Zenplato</Text>
          </TouchableOpacity>
        )}
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
  barTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#5C6E52',
  },
  userName: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  userSubtitle: {
    fontSize: 12,
    color: '#686B63',
    marginTop: 2,
  },
  statsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
  },
  statMiniCol: {
    flex: 1,
    alignItems: 'center',
  },
  statMiniNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  statMiniLabel: {
    fontSize: 10,
    color: '#737970',
    marginTop: 2,
  },
  statMiniSep: {
    width: 1,
    height: 24,
    backgroundColor: '#E8E4DC',
  },
  groupHeading: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#737970',
    marginBottom: 8,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  settingDesc: {
    fontSize: 11,
    color: '#686B63',
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F3EFE7',
  },
  signOutBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D4D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  signOutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});

