import React, { useRef } from 'react';
import { Pressable, Animated, ViewStyle } from 'react-native';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { triggerLightHaptic } from '../utils/haptics';

export default function AnimatedPress({
  children,
  style,
  onPress,
  scaleTo = 0.96,
  accessibilityRole,
  accessibilityHint,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  scaleTo?: number;
  accessibilityRole?: any;
  accessibilityHint?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduce = useReduceMotion();

  const handlePress = () => {
    triggerLightHaptic();
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() =>
        !reduce &&
        Animated.spring(scale, {
          toValue: scaleTo,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }).start()
      }
      onPressOut={() =>
        !reduce &&
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }).start()
      }
      style={style as any}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
