import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { triggerLightHaptic } from '../utils/haptics';

interface LiquidGlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function LiquidGlassButton({
  title,
  onPress,
  style,
}: LiquidGlassButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacity, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    triggerLightHaptic();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
    >
      <Animated.View
        style={[styles.container, style, { transform: [{ scale }], opacity }]}
      >
        {/* Main glass button */}
        <View style={styles.glassContainer}>
          {/* Combined gradient background with shine */}
          <Svg width="100%" height="100%" style={styles.svgBackground}>
            <Defs>
              {/* Main glass gradient */}
              <LinearGradient
                id="glassGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#b4d0ff" stopOpacity="1" />
                <Stop offset="30%" stopColor="#9bb8ff" stopOpacity="1" />
                <Stop offset="60%" stopColor="#8a9eff" stopOpacity="1" />
                <Stop offset="100%" stopColor="#9080e0" stopOpacity="1" />
              </LinearGradient>
              {/* Shine gradient - fades from white to transparent */}
              <LinearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <Stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            {/* Base gradient */}
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#glassGrad)"
              rx="26"
              ry="26"
            />
            {/* Shine overlay */}
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#shineGrad)"
              rx="26"
              ry="26"
            />
          </Svg>

          {/* Border */}
          <View style={styles.border} />

          {/* Text */}
          <Text style={styles.text}>{title}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glassContainer: {
    height: 56,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
});
