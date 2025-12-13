import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { getUnitsByCategory, getUnitById } from '../data/units';
import { useAppStore } from '../store';
import { useOptionalNavigation } from '../navigation/safe';
import { categories } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import AnimatedPress from '../components/AnimatedPress';
import { useTheme } from '../theme/ThemeProvider';
import { triggerLightHaptic } from '../utils/haptics';

// Helper function to get the correct translation key for a unit
// Temperature units C and F need to use temp_C and temp_F keys to avoid conflict with Coulomb and Farad
const getUnitTranslationKey = (unitId: string): string => {
  const unit = getUnitById(unitId);
  if (unit?.categoryId === 'temperature' && (unitId === 'C' || unitId === 'F')) {
    return `temp_${unitId}`;
  }
  return unitId;
};

export default function MultiConvertScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const fromUnit = useAppStore(s => s.fromUnitId);
  const toUnit = useAppStore(s => s.toUnitId);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setPair = useAppStore(s => s.setPair);
  const categoryId = getUnitById(fromUnit)?.categoryId ?? 'length';
  const units = getUnitsByCategory(categoryId as any);
  const nav = useOptionalNavigation();
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const bottomPadding = tabBarHeight + insets.bottom + 20;

  const [filter, setFilter] = useState('');

  // Validate that fromUnit exists, otherwise reset to default
  React.useEffect(() => {
    const unit = getUnitById(fromUnit);
    if (!unit) {
      const defaultUnit = units[0]?.id || 'm';
      setFrom(defaultUnit);
    }
  }, [fromUnit, units, setFrom]);

  const filteredUnits = useMemo(() => {
    if (!filter.trim()) return units;
    const f = filter.toLowerCase();
    return units.filter(u => {
      const text = `${u.id} ${u.name} ${u.symbol}`.toLowerCase();
      return text.includes(f);
    });
  }, [units, filter]);

  const limitedUnits = filteredUnits;

  const fromUnitData = getUnitById(fromUnit);
  const toUnitData = getUnitById(toUnit);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.surface }}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={headerHeight}
      contentContainerStyle={{ flex: 1 }}
    >
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          backgroundColor: theme.surface,
          paddingBottom: bottomPadding,
        }}
        data={limitedUnits}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollIndicatorInsets={{ bottom: bottomPadding }}
        automaticallyAdjustKeyboardInsets={true}
        keyExtractor={u => u.id}
        renderItem={({ item }) => {
          const isFrom = item.id === fromUnit;
          const isTo = item.id === toUnit;
          return (
            <View
              style={[
                styles.unitRow,
                {
                  backgroundColor: theme.surfaceElevated || '#fff',
                  borderColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#eee',
                },
                isFrom && styles.unitRowFrom,
                isTo && styles.unitRowTo,
              ]}
            >
              <View style={styles.unitInfo}>
                <Text style={[styles.unitSymbol, { color: theme.onSurface }]}>
                  {item.symbol}
                </Text>
                <Text
                  style={[
                    styles.unitName,
                    { color: theme.onSurfaceSecondary || '#666' },
                  ]}
                >
                  {t(`units.${getUnitTranslationKey(item.id)}`, item.name)}
                </Text>
              </View>
              <View style={styles.unitActions}>
                <Pressable
                  style={[
                    styles.selectBtn,
                    {
                      backgroundColor: isFrom
                        ? '#007AFF'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#fff',
                      borderColor: isFrom
                        ? '#007AFF'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.2)'
                        : '#ddd',
                    },
                  ]}
                  onPress={() => {
                    triggerLightHaptic();
                    setFrom(item.id);
                  }}
                >
                  <Text
                    style={[
                      styles.selectBtnText,
                      {
                        color: isFrom ? '#fff' : theme.isDark ? '#fff' : '#333',
                      },
                    ]}
                  >
                    {t('common.from')}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.selectBtn,
                    {
                      backgroundColor: isTo
                        ? '#007AFF'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#fff',
                      borderColor: isTo
                        ? '#007AFF'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.2)'
                        : '#ddd',
                    },
                  ]}
                  onPress={() => {
                    triggerLightHaptic();
                    setTo(item.id);
                  }}
                >
                  <Text
                    style={[
                      styles.selectBtnText,
                      {
                        color: isTo ? '#fff' : theme.isDark ? '#fff' : '#333',
                      },
                    ]}
                  >
                    {t('common.to')}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, { color: theme.onSurface }]}>
              {t('screens.unitPicker')}
            </Text>

            {/* Current Selection Card */}
            <View
              style={[
                styles.selectionCard,
                { backgroundColor: theme.surfaceElevated || '#f8f8f8' },
              ]}
            >
              <View style={styles.selectionRow}>
                <View style={styles.selectionUnit}>
                  <Text style={styles.selectionLabel}>{t('common.from')}</Text>
                  <Text
                    style={[styles.selectionValue, { color: theme.onSurface }]}
                  >
                    {fromUnitData?.symbol || fromUnit}
                  </Text>
                  <Text style={styles.selectionName}>
                    {fromUnitData
                      ? t(
                          `units.${getUnitTranslationKey(fromUnitData.id)}`,
                          fromUnitData.name,
                        )
                      : ''}
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.selectionUnit}>
                  <Text style={styles.selectionLabel}>{t('common.to')}</Text>
                  <Text
                    style={[styles.selectionValue, { color: theme.onSurface }]}
                  >
                    {toUnitData?.symbol || toUnit}
                  </Text>
                  <Text style={styles.selectionName}>
                    {toUnitData
                      ? t(
                          `units.${getUnitTranslationKey(toUnitData.id)}`,
                          toUnitData.name,
                        )
                      : ''}
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.convertBtn}
                onPress={() => {
                  triggerLightHaptic();
                  nav?.navigate?.('Converter');
                }}
              >
                <Text style={styles.convertBtnText}>
                  {t('common.goToConverter')}
                </Text>
              </Pressable>
            </View>

            {/* Category Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map(cat => {
                const isActive = categoryId === cat.id;
                return (
                  <AnimatedPress
                    key={cat.id}
                    accessibilityRole="button"
                    accessibilityLabel={t(`categories.${cat.id}`, cat.name)}
                    onPress={() => {
                      const pair = getDefaultPairForCategory(cat.id as any);
                      setPair(pair[0], pair[1]);
                      addRecentCategory(cat.id);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive
                          ? theme.accent
                          : theme.isDark
                          ? 'rgba(255, 255, 255, 0.1)'
                          : '#fff',
                        borderColor: isActive
                          ? theme.accent
                          : theme.isDark
                          ? 'rgba(255, 255, 255, 0.2)'
                          : '#ddd',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isActive
                            ? '#fff'
                            : theme.isDark
                            ? '#fff'
                            : '#333',
                        },
                      ]}
                    >
                      {t(`categories.${cat.id}`, cat.name)}
                    </Text>
                  </AnimatedPress>
                );
              })}
            </ScrollView>

            {/* Filter */}
            <View style={styles.filterRow}>
              <TextInput
                style={[
                  styles.filterInput,
                  {
                    color: theme.onSurface,
                    backgroundColor: theme.surfaceElevated || '#f5f5f5',
                  },
                ]}
                value={filter}
                onChangeText={setFilter}
                placeholder={t('common.filterPlaceholder')}
                placeholderTextColor="#999"
              />
            </View>

            <Text
              style={[
                styles.sectionLabel,
                { color: theme.onSurfaceSecondary || '#888' },
              ]}
            >
              {t(
                `categories.${categoryId}`,
                categories.find(c => c.id === categoryId)?.name || 'Units',
              )}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('unitPicker.empty')}</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },

  // Selection Card
  selectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectionUnit: {
    flex: 1,
    alignItems: 'center',
  },
  selectionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectionValue: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectionName: {
    fontSize: 12,
    color: '#888',
  },
  arrow: {
    fontSize: 24,
    color: '#999',
    marginHorizontal: 12,
  },
  convertBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  convertBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Category Pills
  categoryScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Filter
  filterRow: {
    marginBottom: 16,
  },
  filterInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },

  // Section Label
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Unit Row
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  unitRowFrom: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  unitRowTo: {
    borderColor: '#34C759',
    borderWidth: 2,
  },
  unitInfo: {
    flex: 1,
  },
  unitSymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  unitName: {
    fontSize: 13,
  },
  unitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  selectBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
