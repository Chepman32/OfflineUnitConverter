import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useOptionalNavigation } from '../navigation/safe';
import { View, Text, Switch, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import AnimatedPress from '../components/AnimatedPress';
import * as RNShare from 'react-native';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { exportAll, importAll } from '../store/exportImportHelpers';
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
  const [json, setJson] = React.useState('');
  const nav = useOptionalNavigation();
  const tokens = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: tokens.surface }]}>
      <Text style={[styles.title, { color: tokens.onSurface }]}>{t('settings.title','Settings')}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.theme','Theme')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['system','light','dark','oled'] as const).map(m => (
            <AnimatedPress key={m} onPress={() => { if (m==='oled' && !pro) { nav?.navigate?.('Pro'); return; } setTheme(m); }} style={[styles.chip, themeMode===m && styles.chipActive]}>
              <Text style={[styles.chipText, themeMode===m && styles.chipTextActive]}>{m}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.reduceMotion','Reduce Motion')}</Text>
        <Switch value={reduceMotion} onValueChange={setReduceMotion} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.grouping','Thousands Grouping')}</Text>
        <Switch value={!!useGrouping} onValueChange={setUseGrouping} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.copy','Copy Mode')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {([ 'value', 'value_unit', 'expression' ] as const).map(m => (
            <AnimatedPress key={m} onPress={() => setCopyMode(m)} style={[styles.chip, copyMode===m && styles.chipActive]}>
              <Text style={[styles.chipText, copyMode===m && styles.chipTextActive]}>{m}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.locale','Locale')}</Text>
        <TextInput
          accessibilityLabel={t('settings.locale','Locale')}
          value={locale ?? ''}
          onChangeText={(v) => setLocale(v || undefined)}
          placeholder="e.g. en-US"
          style={{ borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:8, paddingVertical:6, minWidth: 100 }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.haptics','Haptics')}</Text>
        <Switch value={haptics} onValueChange={setHaptics} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.language','Language')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['en'] as const).map(lng => (
            <AnimatedPress key={lng} onPress={() => setLanguage(lng)} style={[styles.chip, language===lng && styles.chipActive]}>
              <Text style={[styles.chipText, language===lng && styles.chipTextActive]}>{lng}</Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.decimals','Decimals')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          <Pressable style={styles.btnSmall} onPress={() => setDecimals(Math.max(0, decimals - 1))}><Text>-</Text></Pressable>
          <Text style={{ minWidth: 24, textAlign:'center' }}>{decimals}</Text>
          <Pressable style={styles.btnSmall} onPress={() => setDecimals(Math.min(12, decimals + 1))}><Text>+</Text></Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.rounding','Rounding')}</Text>
        <View style={{ flexDirection:'row', gap: 8 }}>
          {(['halfUp','floor','ceil','bankers'] as const).map(m => (
            <Pressable key={m} onPress={() => setRounding(m)} style={[styles.chip, rounding===m && styles.chipActive]}>
              <Text style={[styles.chipText, rounding===m && styles.chipTextActive]}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>{t('settings.export','Export')} / {t('settings.import','Import')}</Text>
        <View style={styles.buttons}>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => setJson(exportAll())}><Text style={styles.btnText}>{t('settings.export','Export')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => { try { importAll(json); Alert.alert(t('settings.import','Import'), t('settings.success','Success')); } catch (e:any) { Alert.alert(t('settings.import','Import'), e?.message || String(e)); } }}><Text style={styles.btnText}>{t('settings.import','Import')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={async () => { try { await (RNShare as any).Share.share({ message: exportAll() }); } catch {} }}><Text style={styles.btnText}>{t('settings.share','Share')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={async () => { try { const s = await Clipboard.getString(); if (s) setJson(s); } catch {} }}><Text style={styles.btnText}>{t('settings.paste','Paste')}</Text></Pressable>
        </View>
        <ScrollView style={styles.textbox}>
          <TextInput
            multiline
            placeholder="Exported JSON will appear here. Paste here to import."
            value={json}
            onChangeText={setJson}
          />
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>{t('settings.more','More')}</Text>
        <View style={styles.buttons}>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => nav?.navigate?.('Pro')}><Text style={styles.btnText}>{t('tabs.pro','Pro')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => nav?.navigate?.('About')}><Text style={styles.btnText}>{t('settings.about','About')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => nav?.navigate?.('Licenses')}><Text style={styles.btnText}>{t('licenses.title','Licenses')}</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => nav?.navigate?.('CustomUnits')}><Text style={styles.btnText}>{t('customUnits.title','Custom Units')}</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: '600' },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 8 },
  label: { fontSize: 16 },
  section: { marginTop: 16 },
  subtitle: { fontWeight:'600', marginBottom: 8 },
  buttons: { flexDirection:'row', gap: 12 },
  btn: { backgroundColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
  btnText: { color:'#fff', fontWeight:'600' },
  textbox: { marginTop: 8, borderWidth:1, borderColor:'#eee', borderRadius:10, padding: 8, maxHeight: 160 },
  btnSmall: { borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:10, paddingVertical:6, alignItems:'center' },
  chip: { borderWidth:1, borderColor:'#ddd', borderRadius: 12, paddingHorizontal:10, paddingVertical:6 },
  chipActive: { backgroundColor:'#111', borderColor:'#111' },
  chipText: { color:'#111' },
  chipTextActive: { color:'#fff' },
});
