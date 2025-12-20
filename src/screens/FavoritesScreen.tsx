import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { useOptionalNavigation } from '../navigation/safe';
import { triggerLightHaptic } from '../utils/haptics';
import { getUnitById } from '../data/units';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const favorites = useAppStore(s => s.favorites);
  const reduceMotion = useAppStore(s => s.reduceMotion);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const moveUp = useAppStore(s => s.moveFavoriteUp);
  const moveDown = useAppStore(s => s.moveFavoriteDown);
  const remove = useAppStore(s => s.removeFavorite);
  const nav = useOptionalNavigation();

  // Helper to get translated unit name
  const getUnitName = (unitId: string) => {
    const unit = getUnitById(unitId);
    if (!unit) return unitId;
    // Try to get translated name, fall back to symbol
    const translatedName = t(`units.${unitId}`, '');
    return translatedName || unit.symbol || unitId;
  };

  const handleMoveUp = useCallback(
    (id: string) => {
      triggerLightHaptic();
      moveUp(id);
    },
    [moveUp],
  );

  const handleMoveDown = useCallback(
    (id: string) => {
      triggerLightHaptic();
      moveDown(id);
    },
    [moveDown],
  );

  const handleRemove = useCallback(
    (id: string) => {
      triggerLightHaptic();
      remove(id);
    },
    [remove],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, paddingTop: insets.top },
      ]}
    >
      <Text style={[styles.title, { color: theme.onSurface }]}>
        {t('favorites.title', 'Favorites')}
      </Text>
      <ScrollView style={styles.list}>
        {favorites.length === 0 ? (
          <Text style={styles.desc}>
            {t('favorites.empty', 'No favorites yet.')}
          </Text>
        ) : (
          favorites.map(item => {
            const fromName = getUnitName(item.fromUnitId);
            const toName = getUnitName(item.toUnitId);
            return (
              <Animated.View
                key={item.id}
                style={styles.row}
                layout={
                  reduceMotion
                    ? undefined
                    : Layout.springify().damping(15).stiffness(120)
                }
                entering={reduceMotion ? undefined : FadeIn.duration(200)}
                exiting={reduceMotion ? undefined : FadeOut.duration(200)}
              >
                <Text style={[styles.pair, { color: theme.onSurface }]}>
                  {fromName} → {toName}
                </Text>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.smallBtn}
                    onPress={() => handleMoveUp(item.id)}
                  >
                    <Text style={styles.actionText}>↑</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.smallBtn}
                    onPress={() => handleMoveDown(item.id)}
                  >
                    <Text style={styles.actionText}>↓</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.smallBtn}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Text style={styles.actionText}>✕</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.open}
                    onPress={() => {
                      triggerLightHaptic();
                      setFrom(item.fromUnitId);
                      setTo(item.toUnitId);
                      nav?.navigate?.('Converter');
                    }}
                  >
                    <Text style={styles.openText}>
                      {t('favorites.open', 'Open')}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '600' },
  list: { flex: 1, marginTop: 10 },
  desc: { marginTop: 6, color: '#666' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  pair: { fontSize: 20, fontWeight: '600' },
  open: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  openText: { fontSize: 18, fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionText: { fontSize: 18, fontWeight: '600' },
});
