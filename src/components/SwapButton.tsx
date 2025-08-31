import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { useReduceMotion } from '../hooks/useReduceMotion';
import ReactNativeHaptic from 'react-native-haptic-feedback';
import { useAppStore } from '../store';

export default function SwapButton({ onSwap }: { onSwap: () => void }) {
  const rot = useSharedValue(0);
  const reduce = useReduceMotion();
  const haptics = useAppStore(s => s.haptics);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rot.value}deg` }],
  }));

  const onPress = () => {
    if (haptics) ReactNativeHaptic.trigger('impactMedium');
    if (reduce) return onSwap();
    rot.value = withTiming(180, { duration: 220 }, (finished) => {
      if (finished) runOnJS(onSwap)();
      rot.value = 0;
    });
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} accessibilityRole="button" accessibilityLabel="Swap units">
      <Animated.View style={style}>
        <Text style={styles.icon}>⇄</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  icon: { fontSize: 18 },
});
