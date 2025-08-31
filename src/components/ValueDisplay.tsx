import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TextStyle } from 'react-native';
import { useReduceMotion } from '../hooks/useReduceMotion';

export default function ValueDisplay({ value, style }: { value: string; style?: TextStyle }) {
  const [display, setDisplay] = useState(value);
  const anim = useRef(new Animated.Value(0)).current;
  const reduce = useReduceMotion();

  useEffect(() => {
    if (reduce) { setDisplay(value); return; }
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 140, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      .start(() => setDisplay(value));
  }, [value, reduce]);

  const rotateX = reduce ? '0deg' : anim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] });
  const opacity = reduce ? 1 : anim;

  return (
    <Animated.Text allowFontScaling style={[style, { transform: [{ rotateX }], opacity }]} accessibilityRole="text">
      {display}
    </Animated.Text>
  );
}
