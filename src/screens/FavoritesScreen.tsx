import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { useOptionalNavigation } from '../navigation/safe';
import { t } from '../i18n';

export default function FavoritesScreen() {
  const theme = useTheme();
  const favorites = useAppStore(s => s.favorites);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const moveUp = useAppStore(s => s.moveFavoriteUp);
  const moveDown = useAppStore(s => s.moveFavoriteDown);
  const remove = useAppStore(s => s.removeFavorite);
  const nav = useOptionalNavigation();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>{t('favorites.title','Favorites')}</Text>
      <FlatList
        data={favorites}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.pair}>{item.fromUnitId} → {item.toUnitId}</Text>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" style={styles.smallBtn} onPress={() => moveUp(item.id)}><Text style={styles.actionText}>↑</Text></Pressable>
              <Pressable accessibilityRole="button" style={styles.smallBtn} onPress={() => moveDown(item.id)}><Text style={styles.actionText}>↓</Text></Pressable>
              <Pressable accessibilityRole="button" style={styles.smallBtn} onPress={() => remove(item.id)}><Text style={styles.actionText}>✕</Text></Pressable>
              <Pressable accessibilityRole="button" style={styles.open} onPress={() => { setFrom(item.fromUnitId); setTo(item.toUnitId); nav?.navigate?.('Converter'); }}><Text style={styles.openText}>{t('favorites.open','Open')}</Text></Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.desc}>{t('favorites.empty','No favorites yet.')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '600' },
  desc: { marginTop: 6, color: '#666' },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical: 10, borderBottomWidth:1, borderColor:'#f0f0f0' },
  pair: { fontSize: 20, fontWeight: '600' },
  open: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:12, paddingVertical:8 },
  openText: { fontSize: 18, fontWeight: '600' },
  actions: { flexDirection:'row', alignItems:'center', gap: 6 },
  smallBtn: { borderWidth:1, borderColor:'#ddd', borderRadius:6, paddingHorizontal:10, paddingVertical:6 },
  actionText: { fontSize: 18, fontWeight: '600' },
});
