import React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const defaultColor = '#2E2A26';

// ── Minimalist Clean Vector Icons (Zero Emojis, Pure Geometric Design) ──

export const HomeIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  const w = size;
  const h = size;
  return (
    <View style={[styles.center, { width: w, height: h }, style]}>
      {/* Roof peak */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.45,
          borderRightWidth: w * 0.45,
          borderBottomWidth: h * 0.38,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      {/* House Body */}
      <View
        style={{
          width: w * 0.65,
          height: h * 0.45,
          borderWidth: 1.6,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          marginTop: -0.5,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {/* Doorway */}
        <View
          style={{
            width: w * 0.22,
            height: h * 0.24,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const CompassIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      <View
        style={{
          width: size * 0.38,
          height: size * 0.38,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const PlanIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.85,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: 3,
          padding: 2.5,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ height: 1.5, backgroundColor: color, width: '70%', borderRadius: 1 }} />
        <View style={{ height: 1.5, backgroundColor: color, width: '90%', borderRadius: 1 }} />
        <View style={{ height: 1.5, backgroundColor: color, width: '60%', borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const UserIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.38,
          height: size * 0.38,
          borderRadius: size * 0.19,
          borderWidth: 1.6,
          borderColor: color,
          marginBottom: 1.5,
        }}
      />
      <View
        style={{
          width: size * 0.72,
          height: size * 0.36,
          borderTopLeftRadius: size * 0.36,
          borderTopRightRadius: size * 0.36,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const BellIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.62,
          height: size * 0.6,
          borderTopLeftRadius: size * 0.31,
          borderTopRightRadius: size * 0.31,
          borderWidth: 1.6,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.78,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          marginTop: -0.5,
        }}
      />
      <View
        style={{
          width: size * 0.18,
          height: size * 0.14,
          borderBottomLeftRadius: size * 0.09,
          borderBottomRightRadius: size * 0.09,
          backgroundColor: color,
          marginTop: 0.8,
        }}
      />
    </View>
  );
};

export const LeafIcon: React.FC<IconProps> = ({ size = 20, color = '#3D5C3E', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.75,
          height: size * 0.75,
          borderTopLeftRadius: size * 0.75,
          borderBottomRightRadius: size * 0.75,
          borderTopRightRadius: size * 0.1,
          borderBottomLeftRadius: size * 0.1,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: '-45deg' }],
        }}
      >
        <View
          style={{
            width: size * 0.45,
            height: 1.4,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    </View>
  );
};

export const SproutIcon: React.FC<IconProps> = (props) => <LeafIcon {...props} />;

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  const s = size * 0.4;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: s,
          height: s,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginLeft: -s * 0.25,
        }}
      />
    </View>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  const s = size * 0.4;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: s,
          height: s,
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginRight: -s * 0.25,
        }}
      />
    </View>
  );
};

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  const s = size * 0.4;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: s,
          height: s,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: -s * 0.25,
        }}
      />
    </View>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', style }) => {
  const w = size * 0.35;
  const h = size * 0.65;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: w,
          height: h,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: -2,
        }}
      />
    </View>
  );
};

export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  const len = size * 0.65;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          position: 'absolute',
          width: len,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: len,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => {
  const len = size * 0.6;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          position: 'absolute',
          width: len,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 2,
          height: len,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const CalendarIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Binder rings */}
      <View style={{ flexDirection: 'row', gap: size * 0.35, marginBottom: -1 }}>
        <View style={{ width: 2, height: 3.5, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: 2, height: 3.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
      {/* Calendar body */}
      <View
        style={{
          width: size * 0.76,
          height: size * 0.72,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: 3.5,
          overflow: 'hidden',
        }}
      >
        <View style={{ height: size * 0.2, backgroundColor: color }} />
        <View style={{ padding: 2, flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      </View>
    </View>
  );
};

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = defaultColor, style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          width: 1.5,
          height: size * 0.3,
          backgroundColor: color,
          top: size * 0.2,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.24,
          height: 1.5,
          backgroundColor: color,
          right: size * 0.22,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const UtensilsCrossed: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Minimalist plate rim */}
      <View
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderRadius: (size * 0.78) / 2,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.44,
            height: size * 0.44,
            borderRadius: (size * 0.44) / 2,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const MealIcon: React.FC<IconProps> = (props) => <UtensilsCrossed {...props} />;

export const FlameIcon: React.FC<IconProps> = ({ size = 20, color = '#B45309', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.6,
          height: size * 0.78,
          borderTopLeftRadius: 0,
          borderTopRightRadius: size * 0.5,
          borderBottomLeftRadius: size * 0.5,
          borderBottomRightRadius: size * 0.5,
          borderWidth: 1.6,
          borderColor: color,
          transform: [{ rotate: '-45deg' }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.24,
            height: size * 0.32,
            borderTopLeftRadius: 0,
            borderTopRightRadius: size * 0.2,
            borderBottomLeftRadius: size * 0.2,
            borderBottomRightRadius: size * 0.2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const DumbbellIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: '-45deg' }],
        }}
      >
        <View style={{ width: 3, height: size * 0.58, backgroundColor: color, borderRadius: 1.5 }} />
        <View style={{ width: size * 0.45, height: 2, backgroundColor: color }} />
        <View style={{ width: 3, height: size * 0.58, backgroundColor: color, borderRadius: 1.5 }} />
      </View>
    </View>
  );
};

export const HeartIcon: React.FC<IconProps> = ({ size = 20, color = '#E11D48', style }) => {
  const lobeSize = size * 0.42;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          position: 'absolute',
          width: lobeSize,
          height: lobeSize * 1.5,
          borderTopLeftRadius: lobeSize / 2,
          borderTopRightRadius: lobeSize / 2,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
          left: size * 0.2,
          top: size * 0.16,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: lobeSize,
          height: lobeSize * 1.5,
          borderTopLeftRadius: lobeSize / 2,
          borderTopRightRadius: lobeSize / 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          right: size * 0.2,
          top: size * 0.16,
        }}
      />
    </View>
  );
};

export const ShieldIcon: React.FC<IconProps> = ({ size = 20, color = '#3D5C3E', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.78,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottomLeftRadius: size * 0.36,
          borderBottomRightRadius: size * 0.36,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 1.5, height: size * 0.4, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const ScaleIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Top beam */}
      <View style={{ width: size * 0.8, height: 1.8, backgroundColor: color, borderRadius: 1 }} />
      {/* Center post */}
      <View style={{ width: 1.8, height: size * 0.6, backgroundColor: color, marginTop: -1 }} />
      {/* Base */}
      <View style={{ width: size * 0.5, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

export const StethoscopeIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.65,
          height: size * 0.55,
          borderBottomLeftRadius: size * 0.32,
          borderBottomRightRadius: size * 0.32,
          borderWidth: 1.6,
          borderTopWidth: 0,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: (size * 0.28) / 2,
          backgroundColor: color,
          marginTop: 2,
        }}
      />
    </View>
  );
};

export const BookmarkIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  color = defaultColor,
  filled = false,
  style,
}) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.75,
          borderWidth: 1.6,
          borderColor: color,
          borderBottomWidth: 0,
          backgroundColor: filled ? color : 'transparent',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      />
      {/* Ribbon notch */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: (size * 0.55) / 2,
          borderRightWidth: (size * 0.55) / 2,
          borderTopWidth: size * 0.2,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: filled ? color : 'transparent',
          marginTop: -0.5,
        }}
      />
    </View>
  );
};

export const FileTextIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.65,
          height: size * 0.8,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: 2.5,
          paddingHorizontal: 2.5,
          paddingVertical: 3,
          justifyContent: 'space-around',
        }}
      >
        <View style={{ width: '60%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '85%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '70%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const SparkleIcon: React.FC<IconProps> = ({ size = 20, color = '#B45309', style }) => {
  const d = size * 0.45;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: d,
          height: d,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const ActivityIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 4, height: 1.6, backgroundColor: color }} />
        <View style={{ width: 1.6, height: 7, backgroundColor: color, marginTop: -3 }} />
        <View style={{ width: 1.6, height: 14, backgroundColor: color, marginTop: 2 }} />
        <View style={{ width: 1.6, height: 6, backgroundColor: color, marginTop: -1 }} />
        <View style={{ width: 5, height: 1.6, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const TargetIcon: React.FC<IconProps> = ({ size = 20, color = defaultColor, style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: (size * 0.42) / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = defaultColor, style }) => {
  const r = size * 0.6;
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: r,
          height: r,
          borderRadius: r / 2,
          borderWidth: 1.6,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: 1.8,
          height: size * 0.35,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
          position: 'absolute',
          right: 2,
          bottom: 2,
        }}
      />
    </View>
  );
};

export const WaterIcon: React.FC<IconProps> = ({ size = 20, color = '#2B70C9', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.58,
          height: size * 0.58,
          borderTopLeftRadius: 0,
          borderTopRightRadius: size * 0.58,
          borderBottomLeftRadius: size * 0.58,
          borderBottomRightRadius: size * 0.58,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

export const InfoIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: color,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.65, fontWeight: '700', color, marginTop: -1 }}>i</Text>
    </View>
  );
};

export const ShareIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 2,
        }}
      />
    </View>
  );
};

export const BmiIcon: React.FC<IconProps> = (props) => <ActivityIcon {...props} />;
export const HeightIcon: React.FC<IconProps> = ({ size = 18, color = defaultColor, style }) => (
  <View style={[styles.center, { width: size, height: size }, style]}>
    <Text style={{ fontSize: size * 0.8, fontWeight: '700', color }}>↕</Text>
  </View>
);
export const WeightIcon: React.FC<IconProps> = (props) => <ScaleIcon {...props} />;
export const RunnerIcon: React.FC<IconProps> = (props) => <DumbbellIcon {...props} />;
export const BowlIcon: React.FC<IconProps> = (props) => <UtensilsCrossed {...props} />;
export const PencilIcon: React.FC<IconProps> = ({ size = 14, color = defaultColor, style }) => (
  <View style={[styles.center, { width: size, height: size }, style]}>
    <View style={{ width: 2, height: size * 0.75, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
  </View>
);
export const WheatIcon: React.FC<IconProps> = (props) => <LeafIcon {...props} />;
export const DropIcon: React.FC<IconProps> = (props) => <WaterIcon {...props} />;
export const ChefHatIcon: React.FC<IconProps> = (props) => <UtensilsCrossed {...props} />;
export const MoonIcon: React.FC<IconProps> = (props) => <ClockIcon {...props} />;
export const BriefcaseIcon: React.FC<IconProps> = (props) => <PlanIcon {...props} />;
export const BrainIcon: React.FC<IconProps> = (props) => <ActivityIcon {...props} />;

export const RefreshIcon: React.FC<IconProps> = ({ size = 18, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.75,
          height: size * 0.75,
          borderRadius: (size * 0.75) / 2,
          borderWidth: 1.6,
          borderColor: color,
          borderTopColor: 'transparent',
        }}
      />
    </View>
  );
};

export const EyeIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size * 0.7 }, style]}>
      <View
        style={{
          width: size * 0.85,
          height: size * 0.55,
          borderRadius: size * 0.3,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.25,
            height: size * 0.25,
            borderRadius: (size * 0.25) / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const TrashIcon: React.FC<IconProps> = ({ size = 14, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View style={{ width: size * 0.8, height: 1.6, backgroundColor: color, marginBottom: 1 }} />
      <View
        style={{
          width: size * 0.65,
          height: size * 0.7,
          borderWidth: 1.5,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      />
    </View>
  );
};

export const LockIcon: React.FC<IconProps> = ({ size = 14, color = defaultColor, style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size * 0.45,
          height: size * 0.4,
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: color,
          borderTopLeftRadius: size * 0.22,
          borderTopRightRadius: size * 0.22,
        }}
      />
      <View
        style={{
          width: size * 0.7,
          height: size * 0.5,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
