import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useTheme } from '../theme/ThemeProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

 
const iconSource = require('../assets/icon_no_border.png');

// Icon size for display
const ICON_SIZE = 120;
const HALF_SIZE = ICON_SIZE / 2;

// 4 parts of the icon, each showing a quadrant
// Top-left: horizontal line, Top-right: right chevron
// Bottom-left: left chevron, Bottom-right: horizontal line
const ICON_PARTS = [
  {
    id: 'topLeft',
    // Clip to show top-left quadrant (horizontal line)
    clipStyle: { top: 0, left: 0, right: HALF_SIZE, bottom: HALF_SIZE },
    startX: -SCREEN_WIDTH / 2,
    startY: -SCREEN_HEIGHT / 3,
    finalX: 0,
    finalY: 0,
    delay: 0,
  },
  {
    id: 'topRight',
    // Clip to show top-right quadrant (right chevron)
    clipStyle: { top: 0, left: HALF_SIZE, right: 0, bottom: HALF_SIZE },
    startX: SCREEN_WIDTH / 2,
    startY: -SCREEN_HEIGHT / 3,
    finalX: 0,
    finalY: 0,
    delay: 100,
  },
  {
    id: 'bottomLeft',
    // Clip to show bottom-left quadrant (left chevron)
    clipStyle: { top: HALF_SIZE, left: 0, right: HALF_SIZE, bottom: 0 },
    startX: -SCREEN_WIDTH / 2,
    startY: SCREEN_HEIGHT / 3,
    finalX: 0,
    finalY: 0,
    delay: 200,
  },
  {
    id: 'bottomRight',
    // Clip to show bottom-right quadrant (horizontal line)
    clipStyle: { top: HALF_SIZE, left: HALF_SIZE, right: 0, bottom: 0 },
    startX: SCREEN_WIDTH / 2,
    startY: SCREEN_HEIGHT / 3,
    finalX: 0,
    finalY: 0,
    delay: 300,
  },
];

interface IconPartProps {
  part: (typeof ICON_PARTS)[0];
  progress: Animated.SharedValue<number>;
}

function IconPart({ part, progress }: IconPartProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // Staggered animation based on delay
    const adjustedProgress = Math.max(
      0,
      Math.min(
        1,
        (progress.value * 1000 - part.delay) / (700 - part.delay * 0.5),
      ),
    );

    const x = interpolate(adjustedProgress, [0, 1], [part.startX, part.finalX]);
    const y = interpolate(adjustedProgress, [0, 1], [part.startY, part.finalY]);
    const opacity = interpolate(adjustedProgress, [0, 0.2, 1], [0, 1, 1]);
    const scale = interpolate(adjustedProgress, [0, 0.5, 1], [0.5, 0.9, 1]);
    const rotation = interpolate(adjustedProgress, [0, 1], [180, 0]);

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale },
        { rotate: `${rotation}deg` },
      ],
      opacity,
    };
  });

  // Calculate position offset for this quadrant
  const getOffset = () => {
    switch (part.id) {
      case 'topLeft':
        return { marginLeft: 0, marginTop: 0 };
      case 'topRight':
        return { marginLeft: -HALF_SIZE, marginTop: 0 };
      case 'bottomLeft':
        return { marginLeft: 0, marginTop: -HALF_SIZE };
      case 'bottomRight':
        return { marginLeft: -HALF_SIZE, marginTop: -HALF_SIZE };
      default:
        return { marginLeft: 0, marginTop: 0 };
    }
  };

  const offset = getOffset();

  return (
    <Animated.View
      style={[
        styles.partContainer,
        animatedStyle,
        {
          width: HALF_SIZE,
          height: HALF_SIZE,
          left: part.clipStyle.left,
          top: part.clipStyle.top,
        },
      ]}
    >
      <View style={styles.clipContainer}>
        <Image
          source={iconSource}
          style={[
            styles.iconImage,
            {
              width: ICON_SIZE,
              height: ICON_SIZE,
              marginLeft: offset.marginLeft,
              marginTop: offset.marginTop,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

export default function AnimatedSplash() {
  const [visible, setVisible] = useState(true);
  const reduce = useReduceMotion();
  const theme = useTheme();

  const assembleProgress = useSharedValue(0);
  const zoomScale = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 150 }, () => {
          runOnJS(setVisible)(false);
        });
      }, 300);
      return () => clearTimeout(t);
    }

    // Phase 1: Parts fly in and assemble (1 second)
    assembleProgress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });

    // Phase 2: Zoom in rapidly (0.5 seconds) after assembly
    const zoomTimeout = setTimeout(() => {
      zoomScale.value = withTiming(25, {
        duration: 500,
        easing: Easing.in(Easing.cubic),
      });
      overlayOpacity.value = withDelay(
        350,
        withTiming(0, { duration: 150 }, () => {
          runOnJS(setVisible)(false);
        }),
      );
    }, 1000);

    return () => clearTimeout(zoomTimeout);
  }, [assembleProgress, zoomScale, overlayOpacity, reduce]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoomScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, overlayStyle, { backgroundColor: theme.surface }]}
    >
      <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
        {ICON_PARTS.map(part => (
          <IconPart key={part.id} part={part} progress={assembleProgress} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'relative',
  },
  partContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  clipContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  iconImage: {
    position: 'absolute',
  },
});
