import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { RootTab } from '../types';
import { PlusIcon } from './Icons';

interface BottomNavProps {
  activeTab: RootTab;
  onSelectTab: (tab: RootTab) => void;
  onPressAction?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onPressAction,
}) => {
  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('Home')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, activeTab === 'Home' && styles.activeTabIcon]}>⌂</Text>
        <Text style={[styles.tabLabel, activeTab === 'Home' && styles.activeTabLabel]}>Home</Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('Explore')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, activeTab === 'Explore' && styles.activeTabIcon]}>🧭</Text>
        <Text style={[styles.tabLabel, activeTab === 'Explore' && styles.activeTabLabel]}>Explore</Text>
      </TouchableOpacity>

      {/* Center Action (+) */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={onPressAction || (() => onSelectTab('Add'))}
          activeOpacity={0.85}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('Plans')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, activeTab === 'Plans' && styles.activeTabIcon]}>📋</Text>
        <Text style={[styles.tabLabel, activeTab === 'Plans' && styles.activeTabLabel]}>Plans</Text>
      </TouchableOpacity>

      {/* You */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('You')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabIcon, activeTab === 'You' && styles.activeTabIcon]}>👤</Text>
        <Text style={[styles.tabLabel, activeTab === 'You' && styles.activeTabLabel]}>You</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    color: '#8D9188',
    marginBottom: 2,
  },
  activeTabIcon: {
    color: Colors.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8D9188',
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

