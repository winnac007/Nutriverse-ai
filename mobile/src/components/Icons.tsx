import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

// ── SVG-like vector icons implemented cleanly with React Native primitives & Unicode ──
export const SproutIcon: React.FC<IconProps> = ({ size = 20, color = '#3D5C3E' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🌿</Text>
  </View>
);

export const UserIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.8, color }}>👤</Text>
  </View>
);

export const HeightIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color, fontWeight: '700' }}>↕</Text>
  </View>
);

export const WeightIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.8, color }}>🛍️</Text>
  </View>
);

export const ActivityIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🏃</Text>
  </View>
);

export const TargetIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🎯</Text>
  </View>
);

export const BmiIcon: React.FC<IconProps> = ({ size = 20, color = '#3D8A4E' }) => (
  <View style={[styles.badgeCircle, { width: size + 10, height: size + 10, backgroundColor: '#EAF5EC' }]}>
    <Text style={{ fontSize: size * 0.75, color }}>📊</Text>
  </View>
);

export const FlameIcon: React.FC<IconProps> = ({ size = 20, color = '#D97706' }) => (
  <View style={[styles.badgeCircle, { width: size + 10, height: size + 10, backgroundColor: '#FEF3C7' }]}>
    <Text style={{ fontSize: size * 0.75, color }}>🔥</Text>
  </View>
);

export const RunnerIcon: React.FC<IconProps> = ({ size = 20, color = '#3B82F6' }) => (
  <View style={[styles.badgeCircle, { width: size + 10, height: size + 10, backgroundColor: '#EFF6FF' }]}>
    <Text style={{ fontSize: size * 0.75, color }}>🏃‍♂️</Text>
  </View>
);

export const BowlIcon: React.FC<IconProps> = ({ size = 20, color = '#B45309' }) => (
  <View style={[styles.badgeCircle, { width: size + 10, height: size + 10, backgroundColor: '#FDF4EB' }]}>
    <Text style={{ fontSize: size * 0.75, color }}>🥣</Text>
  </View>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 14, color = '#737970' }) => (
  <View style={[styles.infoCircle, { width: size, height: size, borderColor: color }]}>
    <Text style={{ fontSize: size * 0.7, color, fontWeight: '700' }}>i</Text>
  </View>
);

export const PencilIcon: React.FC<IconProps> = ({ size = 14, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>✎</Text>
  </View>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 14, color = '#737970' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>⏱️</Text>
  </View>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 16, color = '#737970' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>📅</Text>
  </View>
);

export const BellIcon: React.FC<IconProps> = ({ size = 20, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🔔</Text>
  </View>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 14, color = '#FFFFFF' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color, fontWeight: '900' }}>✓</Text>
  </View>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 20, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size, color, fontWeight: '600' }}>‹</Text>
  </View>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size, color, fontWeight: '600' }}>›</Text>
  </View>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 14, color = '#737970' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.8, color, fontWeight: '700' }}>∨</Text>
  </View>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, color = '#1C1D1A' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color, fontWeight: '600' }}>✕</Text>
  </View>
);

export const LeafIcon: React.FC<IconProps> = ({ size = 18, color = '#466647' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🌱</Text>
  </View>
);

export const WheatIcon: React.FC<IconProps> = ({ size = 18, color = '#D9822B' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🌾</Text>
  </View>
);

export const DropIcon: React.FC<IconProps> = ({ size = 18, color = '#8B5A2B' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>💧</Text>
  </View>
);

export const ChefHatIcon: React.FC<IconProps> = ({ size = 18, color = '#3D5C3E' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>👨‍🍳</Text>
  </View>
);

export const MealIcon: React.FC<IconProps> = ({ size = 20, color = '#3D5C3E' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🥗</Text>
  </View>
);

export const WaterIcon: React.FC<IconProps> = ({ size = 20, color = '#3B82F6' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>💧</Text>
  </View>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🌙</Text>
  </View>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>💼</Text>
  </View>
);

export const BrainIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🧠</Text>
  </View>
);

export const DumbbellIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🏋️</Text>
  </View>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = '#686B63' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>🔍</Text>
  </View>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size, color, fontWeight: '700' }}>+</Text>
  </View>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 16, color = '#3D5C3E' }) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.85, color }}>↗</Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCircle: {
    borderRadius: 999,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

