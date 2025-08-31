import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { t } from '../i18n';
import { useOptionalNavigation } from '../navigation/safe';
import { useTheme } from '../theme/ThemeProvider';
import { useAppStore } from '../store';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const nav = useOptionalNavigation();
  const theme = useTheme();
  const setSeen = useAppStore(s => s.setOnboardingSeen);
  const [index, setIndex] = React.useState(0);
  const scroller = React.useRef<ScrollView | null>(null);

  const pages = [
    {
      key: 'history',
      icon: 'time-outline' as const,
      title: t('onboarding.card1.title', 'History'),
      text: t('onboarding.card1.text', 'View your recent conversion history'),
    },
    {
      key: 'settings',
      icon: 'settings-outline' as const,
      title: t('onboarding.card2.title', 'Settings'),
      text: t('onboarding.card2.text', 'Customize the app to suit your preferences'),
    },
    {
      key: 'simple',
      icon: 'happy-outline' as const,
      title: t('onboarding.card3.title', 'Simple and Easy'),
      text: t('onboarding.card3.text', 'Enjoy a clean and easy-to-use interface'),
    },
  ];

  const next = () => {
    if (index < pages.length - 1) {
      const x = (index + 1) * width;
      scroller.current?.scrollTo({ x, animated: true });
      setIndex(i => Math.min(i + 1, pages.length - 1));
    } else {
      setSeen(true);
      nav?.navigate?.('Main');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}> 
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        contentContainerStyle={{ alignItems:'center' }}
      >
        {pages.map((p) => (
          <View key={p.key} style={[styles.page, { width }]}> 
            <View style={[styles.card, { backgroundColor: theme.surfaceElevated }]}> 
              <View style={styles.iconWrap}>
                <Ionicons name={p.icon} size={82} color={theme.onSurface} />
              </View>
              <Text style={[styles.title, { color: theme.onSurface }]}>{p.title}</Text>
              <Text style={[styles.text, { color: '#5b6672' }]}>{p.text}</Text>
              <Pressable accessibilityRole="button" style={styles.nextBtn} onPress={next}>
                <Text style={styles.nextText}>{t('common.next', 'Next')}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { paddingHorizontal: 18, alignItems: 'center', justifyContent:'center' },
  card: {
    width: width - 48,
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 22,
    alignItems:'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    // Android
    elevation: 4,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', marginTop: 6 },
  text: { marginTop: 8, textAlign:'center', fontSize: 15, lineHeight: 20 },
  nextBtn: { marginTop: 28, backgroundColor: '#EBEEF3', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 20 },
  nextText: { color: '#0f172a', fontWeight:'700' },
});
