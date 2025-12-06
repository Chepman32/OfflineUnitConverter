import React from 'react';
import { useOptionalNavigation } from '../navigation/safe';
import { View, Text, Switch, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import AnimatedPress from '../components/AnimatedPress';
import * as RNShare from 'react-native';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { exportAll } from '../store/exportImportHelpers';
import { t } from '../i18n';

export default function SettingsScreen() {
  const reduceMotion = useAppStore(s => s.reduceMotion);
  const setReduceMotion = useAppStore(s => s.setReduceMotion);
  const haptics = useAppStore(s => s.haptics);
  const setHaptics = useAppStore(s => s.setHaptics);
  const decimals = useAppStore(s => s.decimalsGlobal);
  const setDecimals = useAppStore(s => s.setDecimals);
  const rounding = useAppStore(s => s.roundingMode);
  const setRounding = useAppStore(s => s.setRoundingMode);
  const useGrouping = useAppStore(s => s.formatting.useGrouping);
  const setUseGrouping = useAppStore(s => s.setUseGrouping);
  const locale = useAppStore(s => s.formatting.locale);
  const setLocale = useAppStore(s => s.setLocale);
  const themeMode = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const copyMode = useAppStore(s => s.copyMode);
  const setCopyMode = useAppStore(s => s.setCopyMode);
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const pro = useAppStore(s => s.pro);
  const setOnboardingSeen = useAppStore(s => s.setOnboardingSeen);
  const [json, setJson] = React.useState('');
  const [moreOpen, setMoreOpen] = React.useState(false);
  const nav = useOptionalNavigation();
  const tokens = useTheme();
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: tokens.surface }]}
      contentContainerStyle={{ minHeight: '120%' }}
      showsVerticalScrollIndicator={true}
    >
      <Text style={[styles.title, { color: tokens.onSurface }]}>{t('settings.title','Settings')}</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.theme','Theme')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['system','light','dark','oled'] as const).map(m => (
            <AnimatedPress key={m} onPress={() => { if (m==='oled' && !pro) { nav?.navigate?.('Pro'); return; } setTheme(m); }} style={[styles.chip, { borderColor: tokens.border }, themeMode===m && { backgroundColor: tokens.accent, borderColor: tokens.accent }]}>
              <Text style={[{ color: tokens.onSurface }, themeMode===m && { color: '#FFFFFF' }]}>{m}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.reduceMotion','Reduce Motion')}</Text>
        <Switch value={reduceMotion} onValueChange={setReduceMotion} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.grouping','Thousands Grouping')}</Text>
        <Switch value={!!useGrouping} onValueChange={setUseGrouping} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.copy','Copy Mode')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {([ 'value', 'value_unit', 'expression' ] as const).map(m => (
            <AnimatedPress key={m} onPress={() => setCopyMode(m)} style={[styles.chip, { borderColor: tokens.border }, copyMode===m && { backgroundColor: tokens.accent, borderColor: tokens.accent }]}>
              <Text style={[{ color: tokens.onSurface }, copyMode===m && { color: '#FFFFFF' }]}>{m}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.locale','Locale')}</Text>
        <TextInput
          accessibilityLabel={t('settings.locale','Locale')}
          value={locale ?? ''}
          onChangeText={(v) => setLocale(v || undefined)}
          placeholder="e.g. en-US"
          style={{ borderWidth:1, borderColor: tokens.inputBorder, backgroundColor: tokens.inputBackground, color: tokens.onSurface, borderRadius:8, paddingHorizontal:8, paddingVertical:6, minWidth: 100 }}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.haptics','Haptics')}</Text>
        <Switch value={haptics} onValueChange={setHaptics} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.language','Language')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['en'] as const).map(lng => (
            <AnimatedPress key={lng} onPress={() => setLanguage(lng)} style={[styles.chip, { borderColor: tokens.border }, language===lng && { backgroundColor: tokens.accent, borderColor: tokens.accent }]}>
              <Text style={[{ color: tokens.onSurface }, language===lng && { color: '#FFFFFF' }]}>{lng}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.decimals','Decimals')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          <Pressable style={[styles.btnSmall, { borderColor: tokens.border }]} onPress={() => setDecimals(Math.max(0, decimals - 1))}><Text style={{ color: tokens.onSurface }}>-</Text></Pressable>
          <Text style={{ minWidth: 24, textAlign:'center', color: tokens.onSurface }}>{decimals}</Text>
          <Pressable style={[styles.btnSmall, { borderColor: tokens.border }]} onPress={() => setDecimals(Math.min(12, decimals + 1))}><Text style={{ color: tokens.onSurface }}>+</Text></Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>{t('settings.rounding','Rounding')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['halfUp','floor','ceil','bankers'] as const).map(m => (
            <Pressable key={m} onPress={() => setRounding(m)} style={[styles.chip, { borderColor: tokens.border }, rounding===m && { backgroundColor: tokens.accent, borderColor: tokens.accent }]}>
              <Text style={[{ color: tokens.onSurface }, rounding===m && { color: '#FFFFFF' }]}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.subtitle, { color: tokens.onSurface }]}>{t('settings.export','Export')} / {t('settings.share','Share')}</Text>
        <View style={styles.buttons}>
          <Pressable accessibilityRole="button" style={[styles.btn, { backgroundColor: tokens.accent }]} onPress={() => setJson(exportAll())}><Text style={styles.btnText}>{t('settings.export','Export')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={[styles.btn, { backgroundColor: tokens.accent }]} onPress={async () => { try { await (RNShare as any).Share.share({ message: exportAll() }); } catch {} }}><Text style={styles.btnText}>{t('settings.share','Share')}</Text></Pressable>
        </View>
        <ScrollView style={[styles.textbox, { borderColor: tokens.border, backgroundColor: tokens.inputBackground }]}>
          <TextInput
            multiline
            placeholder="Exported JSON will appear here."
            placeholderTextColor={tokens.onSurfaceMuted}
            value={json}
            onChangeText={setJson}
            style={{ color: tokens.onSurface }}
          />
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMoreOpen(v => !v)}
          style={[styles.accordionHeader, { borderColor: tokens.border }]}
        >
          <Text style={[styles.subtitle, { color: tokens.onSurface, marginBottom: 0 }]}>{t('settings.more','More')}</Text>
          <Text style={{ color: tokens.onSurface }}>{moreOpen ? '−' : '+'}</Text>
        </Pressable>
        {moreOpen && (
          <View style={[styles.listBox, { borderColor: tokens.border, backgroundColor: tokens.surface }]}>
            {[
              { label: t('tabs.pro','Pro'), action: () => nav?.navigate?.('Pro') },
              { label: t('settings.about','About'), action: () => nav?.navigate?.('About') },
              { label: t('licenses.title','Licenses'), action: () => nav?.navigate?.('Licenses') },
              { label: t('customUnits.title','Custom Units'), action: () => nav?.navigate?.('CustomUnits') },
              { label: 'Reset Onboarding', action: () => { setOnboardingSeen(false); Alert.alert('Onboarding Reset', 'Onboarding will show again on next app launch'); }, danger: true },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <Pressable
                  accessibilityRole="button"
                  onPress={item.action}
                  style={[styles.listItem, idx === arr.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <Text style={[styles.listItemText, { color: item.danger ? '#c0392b' : tokens.onSurface }]}>{item.label}</Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 150 },
  title: { fontSize: 20, fontWeight: '600' },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 8 },
  label: { fontSize: 16 },
  section: { marginTop: 16 },
  subtitle: { fontWeight:'600', marginBottom: 8 },
  buttons: { flexDirection:'row', gap: 12, flexWrap: 'wrap' },
  btn: { backgroundColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
  btnText: { color:'#fff', fontWeight:'600' },
  textbox: { marginTop: 8, borderWidth:1, borderColor:'#eee', borderRadius:10, padding: 8, maxHeight: 160 },
  btnSmall: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6, alignItems:'center' },
  chip: { borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6 },
  chipActive: { backgroundColor:'#111', borderColor:'#111' },
  chipText: { color:'#111' },
  chipTextActive: { color:'#fff' },
  accordionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical: 10, paddingHorizontal: 4, borderWidth:1, borderRadius: 10 },
  listBox: { marginTop: 10, borderWidth:1, borderRadius: 16, overflow:'hidden' },
  listItem: { paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth:1, borderColor:'#eee' },
  listItemText: { fontSize: 17, fontWeight:'500' },
});
