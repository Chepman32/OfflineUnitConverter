import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { t } from '../i18n';
import { useOptionalNavigation } from '../navigation/safe';
import { useTheme } from '../theme/ThemeProvider';
import { useAppStore } from '../store';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const nav = useOptionalNavigation();
  const theme = useTheme();
  const setSeen = useAppStore(s => s.setOnboardingSeen);
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems:'center' }}
      >
        <View style={[styles.page, { width }]}>
          <Text style={[styles.title, { color: theme.onSurface }]}>{t('onboarding.title1','Offline-first')}</Text>
          <Text style={styles.text}>{t('onboarding.text1','Works 100% offline. No tracking.')}</Text>
        </View>
        <View style={[styles.page, { width }]}>
          <Text style={[styles.title, { color: theme.onSurface }]}>{t('onboarding.title2','Powerful conversions')}</Text>
          <Text style={styles.text}>{t('onboarding.text2','High precision math, multi-convert, favorites.')}</Text>
        </View>
        <View style={[styles.page, { width }]}>
          <Text style={[styles.title, { color: theme.onSurface }]}>{t('onboarding.title3','Unlock Pro')}</Text>
          <Text style={styles.text}>{t('onboarding.text3','Unlimited history and favorites, themes, more.')}</Text>
          <View style={{ flexDirection:'row', gap: 12, marginTop: 12 }}>
            <Pressable accessibilityRole="button" style={styles.btn} onPress={() => { setSeen(true); nav?.navigate?.('Main'); }}><Text style={styles.btnText}>{t('common.open','Open')}</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.btn} onPress={() => nav?.navigate?.('Pro')}><Text style={styles.btnText}>{t('tabs.pro','Pro')}</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.btnOutline} onPress={() => { setSeen(true); nav?.navigate?.('Main'); }}><Text style={styles.btnOutlineText}>Skip</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { padding: 24, alignItems: 'center', justifyContent:'center' },
  title: { fontSize: 22, fontWeight: '700' },
  text: { color:'#555', marginTop: 6, textAlign:'center' },
  btn: { backgroundColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
  btnText: { color:'#fff', fontWeight:'600' },
  btnOutline: { borderWidth:1, borderColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
  btnOutlineText: { color:'#111', fontWeight:'600' },
});
