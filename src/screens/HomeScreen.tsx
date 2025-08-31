import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable } from 'react-native';
import { categories } from '../data/units';
import CategoryCard from '../components/CategoryCard';
import { useOptionalNavigation } from '../navigation/safe';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import { useTheme } from '../theme/ThemeProvider';
import IconTest from '../components/IconTest';

export default function HomeScreen() {
  const nav = useOptionalNavigation();
  const setPair = useAppStore(s => s.setPair);
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const recents = useAppStore(s => s.recentsCategories);
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <IconTest />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.onSurface }]}>{t('home.categories','Categories')}</Text>
        <Pressable 
          style={styles.multiConvertBtn} 
          onPress={() => nav?.navigate?.('MultiConvert')}
        >
          <Text style={styles.multiConvertText}>{t('tabs.multiConvert','All Units')}</Text>
        </Pressable>
      </View>
      {recents.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[styles.subtitle, { color: theme.onSurface }]}>{t('home.recents','Recents')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {recents.map(id => {
              const cat = categories.find(c => c.id === id)!;
              return (
                <Pressable key={id} style={styles.chip} onPress={() => {
                  const pair = getDefaultPairForCategory(id as any);
                  setPair(pair[0], pair[1]); nav?.navigate?.('Converter');
                }}>
                  <Text style={styles.chipText}>{cat.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.grid}
        data={categories}
        numColumns={2}
        keyExtractor={c => c.id}
        renderItem={({ item }) => (
          <CategoryCard
            title={item.name}
            onPress={() => {
              const pair = getDefaultPairForCategory(item.id as any);
              setPair(pair[0], pair[1]);
              nav?.navigate?.('Converter');
              addRecentCategory(item.id);
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  multiConvertBtn: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  multiConvertText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  subtitle: { fontWeight: '600', marginBottom: 6 },
  grid: { justifyContent: 'space-between' },
  chip: { borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6 },
  chipText: { color:'#111' },
});
