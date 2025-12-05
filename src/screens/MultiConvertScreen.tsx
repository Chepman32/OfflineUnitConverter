import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { getUnitsByCategory, getUnitById } from '../data/units';
import { multiConvert } from '../domain/conversion/engine';
import { useFormatOptions } from '../hooks/useFormatOptions';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { useOptionalNavigation } from '../navigation/safe';
import UnitPicker from '../components/UnitPicker';
import { categories } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import AnimatedPress from '../components/AnimatedPress';
import { useTheme } from '../theme/ThemeProvider';

export default function MultiConvertScreen() {
  const theme = useTheme();
  const fromUnit = useAppStore(s => s.fromUnitId);
  const toUnit = useAppStore(s => s.toUnitId);
  const input = useAppStore(s => s.input);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setPair = useAppStore(s => s.setPair);
  const setInput = useAppStore(s => s.setInput);
  const categoryId = getUnitById(fromUnit)?.categoryId ?? 'length';
  const fmt = useFormatOptions();
  const units = getUnitsByCategory(categoryId as any);
  const nav = useOptionalNavigation();
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerToVisible, setPickerToVisible] = useState(false);
  const pro = useAppStore(s => s.pro);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomPadding = tabBarHeight + insets.bottom + 20;

  const [filter, setFilter] = useState('');
  const rowsAll = useMemo(() => {
    try {
      return multiConvert(input || '0', fromUnit, categoryId, fmt);
    } catch (e) {
      console.warn('multiConvert failed', e);
      return [];
    }
  }, [input, fromUnit, categoryId, fmt]);
  const rows = useMemo(() => {
    if (!filter.trim()) return rowsAll;
    const f = filter.toLowerCase();
    return rowsAll.filter(r => {
      const u = getUnitById(r.unitId);
      const text = `${r.unitId} ${u?.name ?? ''} ${u?.symbol ?? ''}`.toLowerCase();
      return text.includes(f);
    });
  }, [rowsAll, filter]);
  const limitedRows = useMemo(() => {
    const pro = useAppStore.getState().pro;
    return pro ? rows : rows.slice(0, 15);
  }, [rows]);

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, backgroundColor: theme.surface, paddingBottom: bottomPadding }}
      data={limitedRows}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollIndicatorInsets={{ bottom: bottomPadding }}
      keyExtractor={r => r.unitId}
      renderItem={({ item }) => (
        <View style={styles.mcRow}>
          <Text allowFontScaling style={styles.mcUnit}>{item.unitId}</Text>
          <Text allowFontScaling style={styles.mcVal}>{item.value}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.actBtn} onPress={() => { setFrom(item.unitId); nav?.navigate?.('Converter'); }}><Text>{t('common.from','From')}</Text></Pressable>
            <Pressable style={styles.actBtn} onPress={() => { setTo(item.unitId); nav?.navigate?.('Converter'); }}><Text>{t('common.to','To')}</Text></Pressable>
          </View>
        </View>
      )}
      ListHeaderComponent={(
        <View>
          <Text style={styles.title}>{t('tabs.multiConvert','All Units')}</Text>
          {!pro && (
            <View style={{ padding: 10, borderWidth:1, borderColor:'#ffd60a', backgroundColor:'#fff8e1', borderRadius:8, marginBottom: 8 }}>
              <Text style={{ color:'#7a5b00' }}>{t('pro.multiConvertNote','Multi-convert is fully unlocked with Pro.')}</Text>
              <Pressable accessibilityRole="button" style={[styles.btn, { marginTop: 6 }]} onPress={() => nav?.navigate?.('Pro')}><Text>{t('tabs.pro','Pro')}</Text></Pressable>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.from','From')}</Text>
            <Pressable style={styles.btn} onPress={() => setPickerVisible(true)}><Text>{fromUnit}</Text></Pressable>
            <Text style={styles.label}>{t('common.to','To')}</Text>
            <Pressable style={styles.btn} onPress={() => setPickerToVisible(true)}><Text>{toUnit}</Text></Pressable>
            <Text style={styles.label}>{t('common.value','Value')}</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" value={input} onChangeText={setInput} />
          </View>
          <View style={[styles.row, { flexWrap:'wrap' }]}>
            {categories.map(cat => (
              <AnimatedPress key={cat.id} accessibilityRole="button" accessibilityLabel={cat.name} onPress={() => {
                const pair = getDefaultPairForCategory(cat.id as any);
                setPair(pair[0], pair[1]); addRecentCategory(cat.id);
              }} style={[styles.chip, (getUnitById(fromUnit)?.categoryId===cat.id) && styles.chipActive]}>
                <Text style={[styles.chipText, (getUnitById(fromUnit)?.categoryId===cat.id) && styles.chipTextActive]}>{cat.name}</Text>
              </AnimatedPress>
            ))}
          </View>
          <View style={[styles.row, { marginBottom: 8 }]}>
            <Text style={styles.label}>{t('common.filter','Filter')}</Text>
            <TextInput style={styles.input} value={filter} onChangeText={setFilter} placeholder={t('common.filterPlaceholder','e.g., ft or foot')} />
          </View>
        </View>
      )}
      ListFooterComponent={(
        <>
          <UnitPicker visible={pickerVisible} onClose={() => setPickerVisible(false)} categoryId={categoryId} onSelect={(id) => { setFrom(id); setPickerVisible(false); }} />
          <UnitPicker visible={pickerToVisible} onClose={() => setPickerToVisible(false)} categoryId={categoryId} onSelect={(id) => { setTo(id); setPickerToVisible(false); }} />
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection:'row', alignItems:'center', gap: 8, marginBottom: 12 },
  label: { color:'#555' },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:8, paddingVertical:6, minWidth: 80 },
  btn: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6 },
  mcRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 10, borderBottomWidth:1, borderColor:'#f0f0f0' },
  mcUnit: { color:'#333' },
  mcVal: { color:'#111', fontWeight:'600', flex: 1, textAlign:'right', marginRight: 12 },
  actions: { flexDirection:'row', gap: 8 },
  actBtn: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6 },
  chip: { borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6, marginRight:8, marginTop: 8 },
  chipActive: { backgroundColor:'#111', borderColor:'#111' },
  chipText: { color:'#111' },
  chipTextActive: { color:'#fff' },
});
