import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useTheme } from '../theme/ThemeProvider';

export default function AnimatedSplash() {
  const [visible, setVisible] = useState(true);
  const reduce = useReduceMotion();
  const theme = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(0, { duration: reduce ? 150 : 350 }, () => {
        runOnJS(setVisible)(false);
      });
    }, 650);
    return () => clearTimeout(t);
  }, [opacity, reduce]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!visible) return null;
  return (
    <Animated.View style={[styles.overlay, style, { backgroundColor: theme.surface }]}> 
      <View style={styles.center}>
        <Text style={styles.logo}>Metryvo</Text>
        <Text style={styles.badge}>offline</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { position:'absolute', inset:0, alignItems:'center', justifyContent:'center' },
  center: { alignItems:'center', gap: 8 },
  logo: { fontSize: 22, fontWeight:'800' },
  badge: { color:'#888' },
});
