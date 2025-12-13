import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { categories } from '../data/units';
import CategoryCard from '../components/CategoryCard';
import { useOptionalNavigation } from '../navigation/safe';
import { useAppStore } from '../store';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import { useTheme } from '../theme/ThemeProvider';
import { triggerLightHaptic } from '../utils/haptics';

export default function HomeScreen() {
  const { t } = useTranslation();
  const nav = useOptionalNavigation();
  const setPair = useAppStore(s => s.setPair);
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const recents = useAppStore(s => s.recentsCategories);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, paddingTop: insets.top + 10 },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.onSurface }]}>
          {t('home.categories')}
        </Text>
        <Pressable
          style={[styles.multiConvertBtn, { backgroundColor: theme.accent }]}
          onPress={() => {
            triggerLightHaptic();
            nav?.navigate?.('MultiConvert');
          }}
        >
          <Text style={styles.multiConvertText}>{t('tabs.multiConvert')}</Text>
        </Pressable>
      </View>
      {recents.length > 0 && (
        <View style={styles.recentsContainer}>
          <Text style={[styles.subtitle, { color: theme.onSurface }]}>
            {t('home.recents')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentsScrollContent}
          >
            {recents.map(id => {
              const cat = categories.find(c => c.id === id)!;
              return (
                <Pressable
                  key={id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.isDark
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.05)',
                      borderColor: theme.isDark
                        ? 'rgba(255, 255, 255, 0.3)'
                        : '#ddd',
                    },
                  ]}
                  onPress={() => {
                    triggerLightHaptic();
                    const pair = getDefaultPairForCategory(id as any);
                    setPair(pair[0], pair[1]);
                    nav?.navigate?.('Converter');
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: theme.isDark ? '#FFFFFF' : theme.onSurface },
                    ]}
                  >
                    {t(`categories.${cat.id}`, cat.name)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
      <FlatList
        contentContainerStyle={[styles.grid, { paddingBottom: 100 }]}
        data={categories}
        numColumns={2}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            title={t(`categories.${item.id}`, item.name)}
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
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  multiConvertBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  multiConvertText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  subtitle: { fontWeight: '600', marginBottom: 6 },
  recentsContainer: {
    marginBottom: 12,
    flexShrink: 0,
  },
  recentsScrollContent: {
    gap: 8,
    paddingRight: 20,
    minHeight: 32,
  },
  grid: { justifyContent: 'space-between' },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { fontWeight: '500', fontSize: 14 },
});
