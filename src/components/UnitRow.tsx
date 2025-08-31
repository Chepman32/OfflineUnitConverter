import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getUnitById, getCategoryById } from '../data/units';
import { useTheme } from '../theme/ThemeProvider';

export default function UnitRow({ unitId, onPress }: { unitId: string; onPress: (id: string) => void }) {
  const theme = useTheme();
  const u = getUnitById(unitId);
  if (!u) return null;
  const cat = getCategoryById(u.categoryId);
  return (
    <Pressable style={styles.row} onPress={() => onPress(unitId)} accessibilityRole="button" accessibilityLabel={`${u.name} ${u.symbol}`}> 
      <View style={styles.left}><Text style={[styles.symbol, { color: theme.onSurface }]}>{u.symbol}</Text></View>
      <View style={styles.right}>
        <Text style={[styles.name, { color: theme.onSurface }]}>{u.name}</Text>
        <Text style={styles.meta}>{cat?.name ?? u.categoryId}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth:1, borderColor:'#f5f5f5' },
  left: { width: 64, alignItems:'flex-start' },
  right: { flex:1 },
  symbol: { fontWeight:'700', color:'#111' },
  name: { color:'#111' },
  meta: { color:'#888', marginTop: 2, fontSize: 12 },
});
