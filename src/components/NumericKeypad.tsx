import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useReduceMotion } from '../hooks/useReduceMotion';
import ReactNativeHaptic from 'react-native-haptic-feedback';
import { useAppStore } from '../store';

const KEYS = ['7','8','9','4','5','6','1','2','3','±','0','⌫','·'];

function Key({ k, onKey }: { k: string; onKey: (k: string) => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduce = useReduceMotion();
  const haptics = useAppStore(s => s.haptics);
  return (
    <Pressable
      onPress={() => { if (haptics) ReactNativeHaptic.trigger('impactLight'); onKey(k); }}
      onPressIn={() => !reduce && Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 20, bounciness: 10 }).start()}
      onPressOut={() => !reduce && Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start()}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={styles.keyText}>{k}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function NumericKeypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <View style={styles.grid}>
      {KEYS.map(k => (
        <Key key={k} k={k} onKey={onKey} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection:'row', flexWrap:'wrap', gap: 8, justifyContent:'center' },
  key: { width: 72, height: 56, borderRadius: 12, borderWidth:1, borderColor:'#ddd', alignItems:'center', justifyContent:'center', backgroundColor:'#fff' },
  keyPressed: { opacity: 0.7 },
  keyText: { fontSize: 20, fontWeight:'600' },
});
