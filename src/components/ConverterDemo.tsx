import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { convert } from '../domain/conversion/engine';
import { getUnitsByCategory } from '../data/units';

const lengthUnits = getUnitsByCategory('length');

export default function ConverterDemo() {
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [input, setInput] = useState('1');

  const result = useMemo(() => {
    try {
      return convert(input || '0', fromUnit, toUnit, { decimals: 6 });
    } catch (e) {
      return '-';
    }
  }, [input, fromUnit, toUnit]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Metryvo (Demo)</Text>

      <View style={styles.row}>
        <TextInput
          accessibilityLabel="Input value"
          keyboardType="decimal-pad"
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Enter value"
        />
      </View>

      <View style={styles.row}>
        <UnitSelect value={fromUnit} onChange={setFromUnit} />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setFromUnit(toUnit);
            setToUnit(fromUnit);
          }}
          style={({ pressed }) => [styles.swap, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.swapText}>⇄</Text>
        </Pressable>
        <UnitSelect value={toUnit} onChange={setToUnit} />
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Result</Text>
        <Text selectable style={styles.resultValue}>{result}</Text>
      </View>

      <Text style={styles.hint}>Precise, offline conversion using decimal math.</Text>
    </View>
  );
}

function UnitSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.select}>
      <Text style={styles.selectLabel}>Unit</Text>
      <View style={styles.chips}>
        {lengthUnits.slice(0, 6).map(u => (
          <Pressable
            key={u.id}
            onPress={() => onChange(u.id)}
            style={[styles.chip, value === u.id && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: value === u.id }}
          >
            <Text style={[styles.chipText, value === u.id && styles.chipTextActive]}>{u.symbol}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 18 },
  swap: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  swapText: { fontSize: 18 },
  resultBox: { padding: 16, backgroundColor: '#f5f5f7', borderRadius: 12 },
  resultLabel: { color: '#555' },
  resultValue: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  hint: { color: '#666' },
  select: { flex: 1 },
  selectLabel: { marginBottom: 6, color: '#555' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextActive: { color: '#fff' },
});
