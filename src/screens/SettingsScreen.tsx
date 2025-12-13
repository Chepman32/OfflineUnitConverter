import React from 'react';
import { useOptionalNavigation } from '../navigation/safe';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AnimatedPress from '../components/AnimatedPress';
import { useAppStore } from '../store';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../i18n';
import { triggerLightHaptic } from '../utils/haptics';

const ACCORDION_HEIGHT = 160; // Approximate height of expanded content

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

  const measurementSystem = useAppStore(s => s.measurementSystem);
  const setMeasurementSystem = useAppStore(s => s.setMeasurementSystem);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const scrollRef = React.useRef<ScrollView>(null);
  const nav = useOptionalNavigation();
  const tokens = useTheme();

  const accordionHeight = useSharedValue(0);

  const accordionStyle = useAnimatedStyle(() => {
    return {
      height: accordionHeight.value === 0 ? 0 : accordionHeight.value,
      opacity: accordionHeight.value / ACCORDION_HEIGHT,
      overflow: 'hidden' as const,
    };
  });

  const toggleMore = () => {
    if (moreOpen) {
      // Closing
      if (reduceMotion) {
        accordionHeight.value = 0;
      } else {
        accordionHeight.value = withTiming(0, {
          duration: 300,
          easing: Easing.inOut(Easing.cubic),
        });
      }
      setMoreOpen(false);
      setTimeout(
        () => {
          scrollRef.current?.scrollTo({ y: 0, animated: !reduceMotion });
        },
        reduceMotion ? 0 : 300,
      );
    } else {
      // Opening
      setMoreOpen(true);
      if (reduceMotion) {
        accordionHeight.value = ACCORDION_HEIGHT;
      } else {
        accordionHeight.value = withTiming(ACCORDION_HEIGHT, {
          duration: 300,
          easing: Easing.inOut(Easing.cubic),
        });
      }
      setTimeout(
        () => {
          scrollRef.current?.scrollToEnd({ animated: !reduceMotion });
        },
        reduceMotion ? 0 : 300,
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: tokens.surface }]}
      contentContainerStyle={{ minHeight: '120%' }}
      showsVerticalScrollIndicator={true}
      ref={scrollRef}
    >
      <View style={styles.section}>
        <Text
          style={[styles.label, { color: tokens.onSurface, marginBottom: 12 }]}
        >
          {t('settings.theme', 'Theme')}
        </Text>
        <View style={styles.themeGrid}>
          {(['system', 'light', 'dark', 'solar', 'mono'] as const).map(m => (
            <AnimatedPress
              key={m}
              onPress={() => {
                setTheme(m);
              }}
              style={[
                styles.themeTile,
                { borderColor: tokens.border },
                themeMode === m && {
                  backgroundColor: tokens.accent,
                  borderColor: tokens.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.themeTileText,
                  { color: tokens.onSurface },
                  themeMode === m && { color: '#FFFFFF' },
                ]}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.reduceMotion', 'Reduce Motion')}
        </Text>
        <Switch value={reduceMotion} onValueChange={setReduceMotion} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.grouping', 'Thousands Grouping')}
        </Text>
        <Switch value={!!useGrouping} onValueChange={setUseGrouping} />
      </View>
      <View style={styles.section}>
        <Text
          style={[styles.label, { color: tokens.onSurface, marginBottom: 12 }]}
        >
          {t('settings.copy', 'Copy Mode')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {(['value', 'value_unit', 'expression'] as const).map(m => {
            const label = m === 'value_unit' ? 'Value & Unit' : m;
            return (
              <AnimatedPress
                key={m}
                onPress={() => setCopyMode(m)}
                style={[
                  styles.chip,
                  { borderColor: tokens.border },
                  copyMode === m && {
                    backgroundColor: tokens.accent,
                    borderColor: tokens.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    { color: tokens.onSurface },
                    copyMode === m && { color: '#FFFFFF' },
                  ]}
                >
                  {label}
                </Text>
              </AnimatedPress>
            );
          })}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.locale', 'Locale')}
        </Text>
        <TextInput
          accessibilityLabel={t('settings.locale', 'Locale')}
          value={locale ?? ''}
          onChangeText={v => setLocale(v || undefined)}
          placeholder="e.g. en-US"
          style={{
            borderWidth: 1,
            borderColor: tokens.inputBorder,
            backgroundColor: tokens.inputBackground,
            color: tokens.onSurface,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 6,
            minWidth: 100,
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.haptics', 'Haptics')}
        </Text>
        <Switch value={haptics} onValueChange={setHaptics} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.language', 'Language')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['en'] as const).map(lng => (
            <AnimatedPress
              key={lng}
              onPress={() => setLanguage(lng)}
              style={[
                styles.chip,
                { borderColor: tokens.border },
                language === lng && {
                  backgroundColor: tokens.accent,
                  borderColor: tokens.accent,
                },
              ]}
            >
              <Text
                style={[
                  { color: tokens.onSurface },
                  language === lng && { color: '#FFFFFF' },
                ]}
              >
                {lng}
              </Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.decimals', 'Decimals')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            style={[styles.btnSmall, { borderColor: tokens.border }]}
            onPress={() => {
              triggerLightHaptic();
              setDecimals(Math.max(0, decimals - 1));
            }}
          >
            <Text style={{ color: tokens.onSurface }}>-</Text>
          </Pressable>
          <Text
            style={{
              minWidth: 24,
              textAlign: 'center',
              color: tokens.onSurface,
            }}
          >
            {decimals}
          </Text>
          <Pressable
            style={[styles.btnSmall, { borderColor: tokens.border }]}
            onPress={() => {
              triggerLightHaptic();
              setDecimals(Math.min(12, decimals + 1));
            }}
          >
            <Text style={{ color: tokens.onSurface }}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.section}>
        <Text
          style={[styles.label, { color: tokens.onSurface, marginBottom: 12 }]}
        >
          {t('settings.rounding', 'Rounding')}
        </Text>
        <View style={styles.roundingGrid}>
          {(['halfUp', 'floor', 'ceil', 'bankers'] as const).map(m => (
            <Pressable
              key={m}
              onPress={() => {
                triggerLightHaptic();
                setRounding(m);
              }}
              style={[
                styles.roundingChip,
                { borderColor: tokens.border },
                rounding === m && {
                  backgroundColor: tokens.accent,
                  borderColor: tokens.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.roundingChipText,
                  { color: tokens.onSurface },
                  rounding === m && { color: '#FFFFFF' },
                ]}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: tokens.onSurface }]}>
          {t('settings.measurementSystem', 'Measurement System')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['metric', 'imperial'] as const).map(m => (
            <AnimatedPress
              key={m}
              onPress={() => setMeasurementSystem(m)}
              style={[
                styles.chip,
                { borderColor: tokens.border },
                measurementSystem === m && {
                  backgroundColor: tokens.accent,
                  borderColor: tokens.accent,
                },
              ]}
            >
              <Text
                style={[
                  { color: tokens.onSurface },
                  measurementSystem === m && { color: '#FFFFFF' },
                ]}
              >
                {m === 'metric'
                  ? t('settings.metric', 'Metric')
                  : t('settings.imperial', 'Imperial')}
              </Text>
            </AnimatedPress>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            triggerLightHaptic();
            toggleMore();
          }}
          style={[styles.accordionHeader, { borderColor: tokens.border }]}
        >
          <Text
            style={[
              styles.subtitle,
              { color: tokens.onSurface, marginBottom: 0 },
            ]}
          >
            {t('settings.more', 'More')}
          </Text>
          <Text style={{ color: tokens.onSurface }}>
            {moreOpen ? '−' : '+'}
          </Text>
        </Pressable>
        <Animated.View style={accordionStyle}>
          <View
            style={[
              styles.listBox,
              { borderColor: tokens.border, backgroundColor: tokens.surface },
            ]}
          >
            {[
              {
                label: t('settings.about', 'About'),
                action: () => nav?.navigate?.('About'),
              },
              {
                label: t('licenses.title', 'Licenses'),
                action: () => nav?.navigate?.('Licenses'),
              },
              {
                label: t('customUnits.title', 'Custom Units'),
                action: () => nav?.navigate?.('CustomUnits'),
              },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    triggerLightHaptic();
                    item.action();
                  }}
                  style={[
                    styles.listItem,
                    idx === arr.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text
                    style={[styles.listItemText, { color: tokens.onSurface }]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 150 },
  title: { fontSize: 20, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 12,
  },
  label: { fontSize: 16 },
  section: { marginTop: 16 },
  subtitle: { fontWeight: '600', marginBottom: 8 },
  btnSmall: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextActive: { color: '#fff' },
  roundingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roundingChip: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  roundingChipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeTile: {
    width: '30%',
    aspectRatio: 1.4,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  listBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listItemText: { fontSize: 17, fontWeight: '500' },
});
