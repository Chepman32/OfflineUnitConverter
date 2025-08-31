import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { categories, getUnitById } from '../data/units';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';

export default function CustomUnitsScreen() {
  const theme = useTheme();
  const customUnits = useAppStore(s => s.customUnits);
  const add = useAppStore(s => s.addCustomUnit);
  const remove = useAppStore(s => s.removeCustomUnit);
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const list = customUnits[activeCat] || [];
  const pro = useAppStore(s => s.pro);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [baseRef, setBaseRef] = useState(categories.find(c => c.id===activeCat)!.baseUnitId);
  const [factor, setFactor] = useState('1');
  const [offset, setOffset] = useState('0');
  const [note, setNote] = useState('');

  const valid = useMemo(() => {
    const f = Number(factor);
    if (!name.trim() || !symbol.trim()) return false;
    if (!isFinite(f) || f === 0) return false;
    const off = Number(offset);
    return isFinite(off);
  }, [name, symbol, factor, offset]);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>{t('customUnits.title','Custom Units')}</Text>
      <View style={styles.rowWrap}>
        {categories.map(cat => (
          <Pressable key={cat.id} style={[styles.chip, activeCat===cat.id && styles.chipActive]} onPress={() => { setActiveCat(cat.id); setBaseRef(cat.baseUnitId); }}>
            <Text style={[styles.chipText, activeCat===cat.id && styles.chipTextActive]}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={list}
        keyExtractor={u => u.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>{item.name} ({item.symbol})</Text>
            <Text style={styles.itemMeta}>factor {item.factor} offset {item.offset || 0}</Text>
            <Pressable style={styles.btnSmall} onPress={() => remove(item.categoryId, item.id)}><Text>{t('common.delete','Delete')}</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{t('customUnits.empty','No custom units yet.')}</Text>}
      />
      <Text style={[styles.subtitle, { color: theme.onSurface }]}>{t('customUnits.add','Add / Edit')}</Text>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.name','Name')}</Text><TextInput style={styles.input} value={name} onChangeText={setName} /></View>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.symbol','Symbol')}</Text><TextInput style={styles.input} value={symbol} onChangeText={setSymbol} /></View>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.base','Base Unit')}</Text><TextInput style={styles.input} value={baseRef} onChangeText={setBaseRef} /></View>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.factor','Factor')}</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={factor} onChangeText={setFactor} /></View>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.offset','Offset')}</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={offset} onChangeText={setOffset} /></View>
      <View style={styles.formRow}><Text style={styles.label}>{t('customUnits.notes','Notes')}</Text><TextInput style={[styles.input, { minHeight: 40 }]} multiline value={note} onChangeText={setNote} /></View>
      <Pressable
        style={[styles.btn, !valid && { opacity: 0.5 }]}
        disabled={!valid}
        onPress={() => {
          if (!valid) return;
          if (!pro && list.length >= 10) { Alert.alert(t('customUnits.title','Custom Units'), t('errors.customLimit','Limit reached. Unlock Pro for more.')); return; }
          const id = `custom_${Date.now()}`;
          const now = Date.now();
          add({ id, categoryId: activeCat as any, name: name.trim(), symbol: symbol.trim(), factor: Number(factor), offset: Number(offset)||0, notes: note, createdAt: now, updatedAt: now, userNote: note } as any);
          Alert.alert(t('customUnits.title','Custom Units'), t('customUnits.saved','Saved'));
          setName(''); setSymbol(''); setFactor('1'); setOffset('0'); setNote('');
        }}
      >
        <Text style={styles.btnText}>{t('customUnits.save','Save')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontWeight: '600', marginTop: 8 },
  rowWrap: { flexDirection:'row', flexWrap:'wrap', gap: 8 },
  chip: { borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6 },
  chipActive: { backgroundColor:'#111', borderColor:'#111' },
  chipText: { color:'#111' },
  chipTextActive: { color:'#fff' },
  itemRow: { paddingVertical: 8, borderBottomWidth:1, borderColor:'#f0f0f0' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemMeta: { color:'#555', marginTop: 2 },
  empty: { color:'#777', marginVertical: 8 },
  formRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap: 8 },
  label: { minWidth: 100, color:'#555' },
  input: { flex: 1, borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:8, paddingVertical:6 },
  btn: { alignSelf:'flex-start', backgroundColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8, marginTop: 8 },
  btnText: { color:'#fff', fontWeight:'600' },
  btnSmall: { alignSelf:'flex-start', borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6, marginTop: 6 },
});
