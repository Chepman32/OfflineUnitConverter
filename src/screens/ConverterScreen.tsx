import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Animated, Alert } from 'react-native';
import { convert, multiConvert } from '../domain/conversion/engine';
import { getUnitsByCategory, getUnitById, findUnitByToken, categories } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import AnimatedPress from '../components/AnimatedPress';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../i18n';
import PrecisionControl from '../components/PrecisionControl';
import NumericKeypad from '../components/NumericKeypad';
import ValueDisplay from '../components/ValueDisplay';
import UnitPicker from '../components/UnitPicker';
import SwapButton from '../components/SwapButton';
import { useFormatOptions } from '../hooks/useFormatOptions';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHaptic from 'react-native-haptic-feedback';
import { useAppStore } from '../store';

export default function ConverterScreen() {
  const fromUnit = useAppStore(s => s.fromUnitId);
  const toUnit = useAppStore(s => s.toUnitId);
  const input = useAppStore(s => s.input);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setPair = useAppStore(s => s.setPair);
  const setInput = useAppStore(s => s.setInput);
  const swap = useAppStore(s => s.swap);
  const [pickerFor, setPickerFor] = React.useState<'from'|'to'|null>(null);
  const [showPrecision, setShowPrecision] = React.useState(false);
  const addHistory = useAppStore(s => s.addHistory);
  const favorites = useAppStore(s => s.favorites);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const isPro = useAppStore(s => s.pro);
  const categoryId = getUnitById(fromUnit)?.categoryId ?? 'length';
  const lengthUnits = getUnitsByCategory(categoryId as any);
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const theme = useTheme();

  const fmt = useFormatOptions();
  const hapticsEnabled = useAppStore(s => s.haptics);
  const result = useMemo(() => {
    try { return convert(input || '0', fromUnit, toUnit, fmt); } catch { return '-'; }
  }, [input, fromUnit, toUnit, fmt]);

  const all = useMemo(() => multiConvert(input || '0', fromUnit, categoryId, fmt), [input, fromUnit, fmt]);

  const shake = useRef(new Animated.Value(0)).current;
  const invalid = useMemo(() => {
    // allow "-" or "-0.5" style, only one dot
    const s = input;
    if (!s) return false;
    if (/^-?$/.test(s)) return false;
    if ((s.match(/\./g) || []).length > 1) return true;
    return isNaN(Number(s));
  }, [input]);

  const triggerShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const onKey = (k: string) => {
    const prev = useAppStore.getState().input;
    if (k === '⌫') return setInput(prev.slice(0, -1));
    if (k === '·') return setInput(prev.includes('.') ? prev : prev + '.');
    if (k === '±') return setInput(prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    if (/^\d$/.test(k)) return setInput(prev === '0' ? k : prev + k);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }] }>
      <View style={styles.row}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] }) }] }}>
          <TextInput
            value={input}
            onChangeText={(t) => setInput(t)}
            keyboardType="decimal-pad"
            style={[styles.input, { color: theme.onSurface }, invalid && styles.inputInvalid]}
            accessibilityHint={invalid ? 'Invalid number' : undefined}
            onEndEditing={() => invalid && triggerShake()}
          />
        </Animated.View>
        <Pressable
          accessibilityRole="button"
          style={styles.pasteBtn}
          onPress={async () => {
            try {
              const s = await Clipboard.getString();
              if (!s) return;
              const match = s.match(/([-+]?\d{1,3}(?:[\s,]\d{3})*(?:\.\d+)?|[-+]?\d*\.\d+|[-+]?\d+)/);
              if (match) {
                const numRaw = match[0].replace(/[,\s]/g, '');
                setInput(numRaw);
              }
              const tokens = s.split(/\s+|,|;|\(|\)|\[|\]|\{|\}|\|/g).map(t => t.trim()).filter(Boolean);
              for (const tk of tokens) {
                const u = findUnitByToken(tk);
                if (u) {
                  setFrom(u.id);
                  // try infer a likely 'to' unit from favorites
                  const fav = useAppStore.getState().favorites.find(f => f.fromUnitId === u.id);
                  if (fav) setTo(fav.toUnitId);
                  break;
                }
              }
            } catch {}
          }}
        >
          <Text style={styles.pasteText}>{t('common.paste','Paste')}</Text>
        </Pressable>
      </View>
      {invalid && (
        <Text style={styles.validation}>{t('errors.invalidNumber','Invalid number format')}</Text>
      )}
      <View style={styles.row}>
        <UnitChipList label="From" units={lengthUnits} value={fromUnit} onPress={() => setPickerFor('from')} />
        <SwapButton onSwap={() => { swap(); }} />
        <UnitChipList label="To" units={lengthUnits} value={toUnit} onPress={() => setPickerFor('to')} />
      </View>
      <ScrollRowCategories
        active={categoryId}
        onSelect={(id) => {
          const pair = getDefaultPairForCategory(id as any);
          setPair(pair[0], pair[1]);
          addRecentCategory(id);
        }}
      />
      <View style={[styles.resultBox, { backgroundColor: theme.surfaceElevated }]}>
        <Text style={[styles.resultLabel, { color: theme.onSurface }]}>{t('common.result','Result')}</Text>
        <ValueDisplay value={result} style={styles.resultValue} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('precision.title','Precision')} onPress={() => setShowPrecision(true)}>
          <Text style={styles.precisionChip}>{useAppStore.getState().decimalsGlobal} {t('settings.decimals','Decimals')}</Text>
        </Pressable>
        <AnimatedPress
          style={styles.copyBtn}
          accessibilityRole="button"
          accessibilityHint="Copies the result to clipboard"
          onPress={() => {
            const uFrom = getUnitById(fromUnit);
            const uTo = getUnitById(toUnit);
            const mode = useAppStore.getState().copyMode;
            let text = result;
            if (mode === 'value_unit') text = `${result} ${uTo?.symbol ?? toUnit}`;
            if (mode === 'expression') text = `${input || '0'} ${uFrom?.symbol ?? fromUnit} → ${result} ${uTo?.symbol ?? toUnit}`;
            Clipboard.setString(text);
            if (hapticsEnabled) ReactNativeHaptic.trigger('impactLight');
            // Save to history on copy
            try {
              addHistory({
                id: String(Date.now()),
                inputValue: input || '0',
                fromUnitId: fromUnit,
                toUnitId: toUnit,
                resultValue: result,
                createdAt: Date.now(),
              }, isPro);
            } catch {}
          }}
        >
          <Text style={styles.copyText}>{t('common.copy','Copy')}</Text>
        </AnimatedPress>
        <AnimatedPress
          style={[styles.copyBtn, { marginLeft: 8 }]}
          accessibilityRole="button"
          accessibilityHint="Toggle favorite for this pair"
          onPress={() => {
            const exists = favorites.some(f => f.fromUnitId === fromUnit && f.toUnitId === toUnit);
            if (exists) {
              const id = favorites.find(f => f.fromUnitId === fromUnit && f.toUnitId === toUnit)!.id;
              removeFavorite(id);
            } else {
              const st = useAppStore.getState();
              if (!st.pro && st.favorites.length >= 20) {
                Alert.alert(t('favorites.title','Favorites'), t('errors.favLimit','Favorite limit reached. Unlock Pro for more.'));
              } else {
                addFavorite({ id: String(Date.now()), fromUnitId: fromUnit, toUnitId: toUnit, lastUsedAt: Date.now() });
              }
            }
          }}
        >
          <Text style={styles.copyText}>★</Text>
        </AnimatedPress>
      </View>
      <NumericKeypad onKey={onKey} />

      <AnimatedPress
        style={[styles.copyBtn, { alignSelf:'stretch', justifyContent:'center', alignItems:'center' }]}
        onPress={() => {
          const nav = require('../navigation/safe');
          nav?.useOptionalNavigation?.()?.navigate?.('MultiConvert');
        }}
      >
        <Text style={styles.copyText}>{t('common.seeAllUnits','See all units')}</Text>
      </AnimatedPress>

      <PrecisionControl visible={showPrecision} onClose={() => setShowPrecision(false)} />

      <Text style={styles.mcTitle}>{t('tabs.multiConvert','All Units')}</Text>
      <View style={styles.mcList}>
        {all.map(row => (
          <View key={row.unitId} style={styles.mcRow}>
            <Text style={styles.mcUnit}>{row.unitId}</Text>
            <Text style={styles.mcVal}>{row.value}</Text>
          </View>
        ))}
      </View>

        <UnitPicker
          visible={pickerFor !== null}
          onClose={() => setPickerFor(null)}
          categoryId={categoryId}
          onSelect={(id) => {
            if (pickerFor === 'from') setFrom(id); else setTo(id);
            // track recents
            try { useAppStore.getState().addRecentUnit(id); } catch {}
          }}
        />
    </View>
  );
}

function UnitChipList({ label, units, value, onPress }: { label: string; units: any[]; value: string; onPress: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.selectLabel}>{label}</Text>
      <Pressable onPress={onPress} style={styles.selectBox}>
        <Text style={styles.selectText}>{value}</Text>
      </Pressable>
    </View>
  );
}

function ScrollRowCategories({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <View style={{ marginTop: 4 }}>
      <Text style={{ marginBottom: 6, color: '#555' }}>{t('home.categories','Categories')}</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap: 8 }}>
        {categories.map(cat => (
          <AnimatedPress key={cat.id} accessibilityRole="button" accessibilityLabel={cat.name} onPress={() => onSelect(cat.id)} style={[{ borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6 }, active===cat.id && { backgroundColor:'#111', borderColor:'#111' }]}>
            <Text style={[{ color:'#111' }, active===cat.id && { color:'#fff' }]}>{cat.name}</Text>
          </AnimatedPress>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  row: { flexDirection: 'row', alignItems:'center', gap: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 18 },
  inputInvalid: { borderColor: '#ff3b30' },
  validation: { color:'#ff3b30', marginTop: -6 },
  pasteBtn: { marginLeft: 8, borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6 },
  pasteText: { color:'#007aff', fontWeight:'600' },
  selectLabel: { marginBottom: 6, color: '#555' },
  selectBox: { borderWidth:1, borderColor:'#ddd', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 },
  selectText: { fontSize: 16 },
  swap: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  swapText: { fontSize: 18 },
  resultBox: { padding: 16, backgroundColor: '#f5f5f7', borderRadius: 12 },
  resultLabel: { color: '#555' },
  resultValue: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  precisionChip: { marginTop: 6, color:'#007aff', fontWeight:'600' },
  copyBtn: { marginTop: 8, alignSelf:'flex-start', borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6 },
  copyText: { color:'#111', fontWeight:'600' },
  mcTitle: { marginTop: 16, fontWeight:'600' },
  mcList: { borderWidth:1, borderColor:'#eee', borderRadius: 10 },
  mcRow: { flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth:1, borderColor:'#f4f4f4' },
  mcUnit: { color:'#333' },
  mcVal: { color:'#111', fontWeight:'600' },
});
