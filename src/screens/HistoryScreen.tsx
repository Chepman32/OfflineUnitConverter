import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { getUnitById } from '../data/units';
import { formatRelativeTime } from '../utils/relativeTime';
import { useOptionalNavigation } from '../navigation/safe';
import { triggerLightHaptic } from '../utils/haptics';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const history = useAppStore(s => s.history);
  const clear = useAppStore(s => s.clearHistory);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setInput = useAppStore(s => s.setInput);
  const favorites = useAppStore(s => s.favorites);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const copyMode = useAppStore(s => s.copyMode);
  const nav = useOptionalNavigation();

  // Helper to get translated unit name
  const getUnitName = (unitId: string) => {
    const unit = getUnitById(unitId);
    if (!unit) return unitId;
    // Try to get translated name, fall back to symbol
    const translatedName = t(`units.${unitId}`, '');
    return translatedName || unit.symbol || unitId;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, paddingTop: insets.top },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={[styles.title, { color: theme.onSurface }]}>
          {t('history.title', 'History')}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(t('history.title'), t('confirm.areYouSure'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('history.clear'),
                style: 'destructive',
                onPress: () => clear(),
              },
            ])
          }
        >
          <Text style={{ color: theme.onSurface }}>
            {t('history.clear', 'Clear')}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={history}
        keyExtractor={i => i.id}
        renderItem={({ item }) => {
          const f = favorites.find(
            x =>
              x.fromUnitId === item.fromUnitId && x.toUnitId === item.toUnitId,
          );
          const starred = !!f;
          const fromUnit = getUnitById(item.fromUnitId);
          const toUnit = getUnitById(item.toUnitId);
          const fromSymbol = fromUnit?.symbol || item.fromUnitId;
          const toSymbol = toUnit?.symbol || item.toUnitId;
          const fromName = getUnitName(item.fromUnitId);
          const toName = getUnitName(item.toUnitId);

          let shareMessage = item.resultValue;
          if (copyMode === 'value_unit') {
            shareMessage = `${item.resultValue} ${toSymbol}`;
          } else if (copyMode === 'expression') {
            shareMessage = `${item.inputValue} ${fromSymbol} = ${item.resultValue} ${toSymbol}`;
          }
          return (
            <View style={[styles.row, { borderBottomColor: theme.border }]}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  triggerLightHaptic();
                  setFrom(item.fromUnitId);
                  setTo(item.toUnitId);
                  setInput(item.inputValue);
                  nav?.navigate?.('Converter');
                }}
              >
                <Text style={[styles.expr, { color: theme.onSurface }]}>
                  {item.inputValue} {fromName} → {item.resultValue} {toName}
                </Text>
                <Text
                  style={[styles.time, { color: theme.onSurfaceSecondary }]}
                >
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </Pressable>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('history.share', 'Share')}
                  style={styles.shareBtn}
                  onPress={async () => {
                    triggerLightHaptic();
                    try {
                      await Share.share({ message: shareMessage });
                    } catch {}
                  }}
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color={theme.onSurface}
                  />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={styles.starBtn}
                  onPress={() => {
                    triggerLightHaptic();
                    if (starred) removeFavorite(f!.id);
                    else
                      addFavorite({
                        id: String(Date.now()),
                        fromUnitId: item.fromUnitId,
                        toUnitId: item.toUnitId,
                        lastUsedAt: Date.now(),
                      });
                  }}
                >
                  <Text style={[styles.star, starred && styles.starActive]}>
                    ★
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.desc, { color: theme.onSurfaceSecondary }]}>
            {t('history.empty', 'No history yet.')}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '600' },
  desc: { marginTop: 6 },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  },
  expr: { fontSize: 16 },
  time: { marginTop: 2, fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shareBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  starBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  star: { fontSize: 18, color: '#BBBBBB' },
  starActive: { color: '#f7b500' },
});
