import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { t } from '../i18n';
import { useOptionalNavigation } from '../navigation/safe';

export default function HistoryScreen() {
  dayjs.extend(relativeTime as any);
  const theme = useTheme();
  const history = useAppStore(s => s.history);
  const clear = useAppStore(s => s.clearHistory);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setInput = useAppStore(s => s.setInput);
  const favorites = useAppStore(s => s.favorites);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const nav = useOptionalNavigation();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={[styles.title, { color: theme.onSurface }]}>{t('history.title','History')}</Text>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert(t('history.title','History'), t('confirm.areYouSure','Are you sure?'),[
          { text:'Cancel', style:'cancel' },
          { text:t('history.clear','Clear'), style:'destructive', onPress: () => clear() },
        ])}><Text>{t('history.clear','Clear')}</Text></Pressable>
      </View>
      <FlatList
        data={history}
        keyExtractor={i => i.id}
        renderItem={({ item }) => {
          const f = favorites.find(x => x.fromUnitId === item.fromUnitId && x.toUnitId === item.toUnitId);
          const starred = !!f;
          return (
            <View style={styles.row}>
              <Pressable style={{ flex: 1 }} onPress={() => { setFrom(item.fromUnitId); setTo(item.toUnitId); setInput(item.inputValue); nav?.navigate?.('Converter'); }}>
                <Text style={styles.expr}>{item.inputValue} {item.fromUnitId} → {item.resultValue} {item.toUnitId}</Text>
                <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.starBtn} onPress={() => {
                if (starred) removeFavorite(f!.id);
                else addFavorite({ id: String(Date.now()), fromUnitId: item.fromUnitId, toUnitId: item.toUnitId, lastUsedAt: Date.now() });
              }}>
                <Text style={[styles.star, starred && styles.starActive]}>★</Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.desc}>{t('history.empty','No history yet.')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '600' },
  desc: { marginTop: 6, color: '#666' },
  row: { paddingVertical: 10, borderBottomWidth:1, borderColor:'#f0f0f0' },
  expr: { fontSize: 16 },
  time: { color:'#888', marginTop: 2, fontSize: 12 },
  starBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  star: { fontSize: 18, color:'#bbb' },
  starActive: { color:'#f7b500' },
});
