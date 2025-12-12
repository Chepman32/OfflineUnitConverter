import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import { searchUnits } from '../domain/conversion/search';
import { categories, getUnitById, getUnitsByCategory } from '../data/units';
import { useAppStore } from '../store';
import { t } from '../i18n';
import UnitRow from './UnitRow';
import { useTheme } from '../theme/ThemeProvider';
import { triggerLightHaptic } from '../utils/haptics';

export default function UnitPicker({
  visible,
  onSelect,
  onClose,
  categoryId,
}: {
  visible: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  categoryId?: string;
}) {
  const theme = useTheme();
  const [q, setQ] = useState('');
  const recents = useAppStore(s => s.recentsUnits);
  const [activeCat, setActiveCat] = useState(categoryId ?? categories[0].id);
  const filterCat = categoryId ?? activeCat;
  const catUnits = useMemo(
    () => getUnitsByCategory(filterCat as any),
    [filterCat],
  );
  const results = useMemo(() => {
    if (!q.trim())
      return catUnits.map(u => ({
        id: u.id,
        label: `${u.name} (${u.symbol})`,
        score: 0,
      }));
    const raw = searchUnits(q);
    return raw
      .filter(item => getUnitById(item.id)?.categoryId === filterCat)
      .slice(0, 40);
  }, [q, filterCat, catUnits]);
  React.useEffect(() => {
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
      accessibilityLabel={t('unitPicker.title', 'Unit Picker')}
    >
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.onSurface }]}>
            {t('unitPicker.title', 'Select Unit')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close', 'Close')}
            onPress={onClose}
          >
            <Text style={styles.close}>{t('common.close', 'Close')}</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.tabs}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(cat => (
            <Pressable
              key={cat.id}
              onPress={() => {
                triggerLightHaptic();
                setActiveCat(cat.id);
              }}
              style={[styles.tab, filterCat === cat.id && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: filterCat === cat.id }}
            >
              <Text
                style={[
                  styles.tabText,
                  filterCat === cat.id && styles.tabTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <TextInput
          placeholder={t('unitPicker.searchPlaceholder', 'Search units')}
          value={q}
          onChangeText={setQ}
          style={styles.input}
          autoFocus
        />
        {recents.length > 0 && (
          <ScrollView
            horizontal
            contentContainerStyle={styles.chips}
            showsHorizontalScrollIndicator={false}
          >
            {recents.map(id => (
              <Pressable
                key={id}
                style={styles.chip}
                onPress={() => {
                  triggerLightHaptic();
                  onSelect(id);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel={getUnitById(id)?.name || id}
              >
                <Text style={styles.chipText}>
                  {getUnitById(id)?.symbol ?? id}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <UnitRow
              unitId={item.id}
              onPress={id => {
                onSelect(id);
                onClose();
              }}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {t('unitPicker.empty', 'Type to search')}
            </Text>
          }
        />
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
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
  tabs: { gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  tab: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  tabActive: { backgroundColor: '#111', borderColor: '#111' },
  tabText: { color: '#111' },
  tabTextActive: { color: '#fff' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  chips: { gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: { color: '#111' },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  rowText: { fontSize: 16 },
  empty: { textAlign: 'center', padding: 20, color: '#888' },
});
