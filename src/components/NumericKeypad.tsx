import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { triggerLightHaptic } from '../utils/haptics';
import { useTheme } from '../theme/ThemeProvider';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '±', '0', '⌫', '·'];

export default function NumericKeypad({
  onKey,
}: {
  onKey: (k: string) => void;
}) {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  // Calculate key size based on screen width, with max constraint for tablets
  const maxKeypadWidth = Math.min(width - 40, 500); // Max 500px wide
  const gap = 12;
  const keysPerRow = 3;
  const totalGaps = (keysPerRow - 1) * gap;
  const keySize = Math.floor((maxKeypadWidth - totalGaps) / keysPerRow);

  return (
    <View style={[styles.container, { maxWidth: maxKeypadWidth }]}>
      <View style={[styles.grid, { gap }]}>
        {KEYS.map(k => (
          <View
            key={k}
            style={{
              width: keySize,
              height: keySize * 0.85,
            }}
          >
            <Pressable
              onPress={() => {
                triggerLightHaptic();
                onKey(k);
              }}
              style={({ pressed }) => [
                styles.key,
                {
                  backgroundColor: theme.surfaceElevated || '#fff',
                  borderColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.2)'
                    : '#ddd',
                },
                pressed && styles.keyPressed,
              ]}
            >
              <Text style={[styles.keyText, { color: theme.onSurface }]}>
                {k}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: { opacity: 0.7 },
  keyText: { fontSize: 32, fontWeight: '600' },
});
