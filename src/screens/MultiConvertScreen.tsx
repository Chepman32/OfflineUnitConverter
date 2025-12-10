import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { getUnitsByCategory, getUnitById } from '../data/units';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { useOptionalNavigation } from '../navigation/safe';
import { categories } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import AnimatedPress from '../components/AnimatedPress';
import { useTheme } from '../theme/ThemeProvider';

export default function MultiConvertScreen() {
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
      console.warn('Invalid fromUnit:', fromUnit, '- resetting to default');
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
        contentContainerStyle={{ padding: 20, backgroundColor: theme.surface, paddingBottom: bottomPadding }}
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
          <View style={[styles.unitRow, isFrom && styles.unitRowFrom, isTo && styles.unitRowTo]}>
            <View style={styles.unitInfo}>
              <Text style={[styles.unitSymbol, { color: theme.onSurface }]}>{item.symbol}</Text>
              <Text style={[styles.unitName, { color: theme.onSurfaceSecondary || '#666' }]}>{item.name}</Text>
            </View>
            <View style={styles.unitActions}>
              <Pressable
                style={[styles.selectBtn, isFrom && styles.selectBtnActive]}
                onPress={() => setFrom(item.id)}
              >
                <Text style={[styles.selectBtnText, isFrom && styles.selectBtnTextActive]}>From</Text>
              </Pressable>
              <Pressable
                style={[styles.selectBtn, isTo && styles.selectBtnActive]}
                onPress={() => setTo(item.id)}
              >
                <Text style={[styles.selectBtnText, isTo && styles.selectBtnTextActive]}>To</Text>
              </Pressable>
            </View>
          </View>
        );
      }}
      ListHeaderComponent={(
        <View>
          <Text style={[styles.title, { color: theme.onSurface }]}>{t('screens.unitPicker', 'Select Units')}</Text>

          {/* Current Selection Card */}
          <View style={[styles.selectionCard, { backgroundColor: theme.surfaceElevated || '#f8f8f8' }]}>
            <View style={styles.selectionRow}>
              <View style={styles.selectionUnit}>
                <Text style={styles.selectionLabel}>From</Text>
                <Text style={[styles.selectionValue, { color: theme.onSurface }]}>{fromUnitData?.symbol || fromUnit}</Text>
                <Text style={styles.selectionName}>{fromUnitData?.name || ''}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.selectionUnit}>
                <Text style={styles.selectionLabel}>To</Text>
                <Text style={[styles.selectionValue, { color: theme.onSurface }]}>{toUnitData?.symbol || toUnit}</Text>
                <Text style={styles.selectionName}>{toUnitData?.name || ''}</Text>
              </View>
            </View>
            <Pressable
              style={styles.convertBtn}
              onPress={() => nav?.navigate?.('Converter')}
            >
              <Text style={styles.convertBtnText}>Go to Converter</Text>
            </Pressable>
          </View>

          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map(cat => (
              <AnimatedPress
                key={cat.id}
                accessibilityRole="button"
                accessibilityLabel={cat.name}
                onPress={() => {
                  const pair = getDefaultPairForCategory(cat.id as any);
                  setPair(pair[0], pair[1]);
                  addRecentCategory(cat.id);
                }}
                style={[styles.chip, categoryId === cat.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextActive]}>{cat.name}</Text>
              </AnimatedPress>
            ))}
          </ScrollView>

          {/* Filter */}
          <View style={styles.filterRow}>
            <TextInput
              style={[styles.filterInput, { color: theme.onSurface, backgroundColor: theme.surfaceElevated || '#f5f5f5' }]}
              value={filter}
              onChangeText={setFilter}
              placeholder={t('common.filterPlaceholder', 'Search units...')}
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionLabel}>{categories.find(c => c.id === categoryId)?.name || 'Units'}</Text>
        </View>
      )}
      ListEmptyComponent={(
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No units found</Text>
        </View>
      )}
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
    color: '#888',
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
    color: '#666',
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
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
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
    color: '#888',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
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
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  selectBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectBtnTextActive: {
    color: '#fff',
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
