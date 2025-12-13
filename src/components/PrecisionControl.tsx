import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';

export default function PrecisionControl({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const decimals = useAppStore(s => s.decimalsGlobal);
  const setDecimals = useAppStore(s => s.setDecimals);
  const rounding = useAppStore(s => s.roundingMode);
  const setRounding = useAppStore(s => s.setRoundingMode);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);
  if (!visible) return null;

  return (
    <View
      style={styles.overlay}
      accessibilityViewIsModal
      accessibilityLabel={t('precision.title')}
    >
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.onSurface }]}>
            {t('precision.title')}
          </Text>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.close}>{t('common.close')}</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('settings.decimals')}</Text>
          <View style={styles.row}>
            <Pressable
              accessibilityLabel={t('precision.decrease')}
              accessibilityRole="button"
              style={styles.step}
              onPress={() => setDecimals(Math.max(0, decimals - 1))}
            >
              <Text>-</Text>
            </Pressable>
            <Text style={styles.value}>{decimals}</Text>
            <Pressable
              accessibilityLabel={t('precision.increase')}
              accessibilityRole="button"
              style={styles.step}
              onPress={() => setDecimals(Math.min(12, decimals + 1))}
            >
              <Text>+</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('settings.rounding')}</Text>
          <View style={styles.chipGrid}>
            {(['halfUp', 'floor', 'ceil', 'bankers'] as const).map(m => (
              <Pressable
                key={m}
                accessibilityRole="button"
                onPress={() => setRounding(m)}
                style={[styles.chip, rounding === m && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    rounding === m && styles.chipTextActive,
                  ]}
                >
                  {m}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    justifyContent: 'center',
  },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600' },
  close: { color: '#007aff', fontWeight: '600' },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { marginBottom: 6, color: '#555' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  step: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  value: { minWidth: 32, textAlign: 'center', fontSize: 18 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '48%',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextActive: { color: '#fff' },
});
