import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOptionalNavigation } from '../navigation/safe';
import { useTheme } from '../theme/ThemeProvider';
import { useAppStore } from '../store';
import LiquidGlassButton from '../components/LiquidGlassButton';
import { triggerLightHaptic } from '../utils/haptics';

const { width, height } = Dimensions.get('window');

const onboarding1 = require('../assets/onboarding/onboarding1.png');
const onboarding2 = require('../assets/onboarding/onboarding2.png');
const onboarding3 = require('../assets/onboarding/onboarding3.png');
const onboarding4 = require('../assets/onboarding/onboarding4.png');

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const nav = useOptionalNavigation();
  const theme = useTheme();
  const setSeen = useAppStore(s => s.setOnboardingSeen);
  const measurementSystem = useAppStore(s => s.measurementSystem);
  const setMeasurementSystem = useAppStore(s => s.setMeasurementSystem);
  const reduceMotion = useAppStore(s => s.reduceMotion);
  const [index, setIndex] = React.useState(0);
  const scroller = React.useRef<ScrollView | null>(null);

  const pages = [
    {
      key: 'offline',
      image: onboarding1,
      title: t('onboarding.card1.title'),
      text: t('onboarding.card1.text'),
    },
    {
      key: 'accurate',
      image: onboarding2,
      title: t('onboarding.card2.title'),
      text: t('onboarding.card2.text'),
    },
    {
      key: 'simple',
      image: onboarding3,
      title: t('onboarding.card3.title'),
      text: t('onboarding.card3.text'),
    },
    {
      key: 'categories',
      image: onboarding4,
      title: t('onboarding.card4.title'),
      text: t('onboarding.card4.text'),
    },
    {
      key: 'measurementSystem',
      image: null,
      title: t('onboarding.card6.title'),
      text: t('onboarding.card6.text'),
      interactive: true,
    },
    {
      key: 'getStarted',
      image: null,
      title: t('onboarding.card5.title'),
      text: t('onboarding.card5.text'),
    },
  ];

  const next = () => {
    if (index < pages.length - 1) {
      const x = (index + 1) * width;
      scroller.current?.scrollTo({ x, animated: !reduceMotion });
      setIndex(i => Math.min(i + 1, pages.length - 1));
    } else {
      setSeen(true);
      nav?.navigate?.('Main');
    }
  };

  const skip = () => {
    setSeen(true);
    nav?.navigate?.('Main');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Pressable
        accessibilityRole="button"
        style={styles.skipBtn}
        onPress={skip}
      >
        <Text style={[styles.skipText, { color: theme.onSurfaceSecondary }]}>
          {t('common.skip')}
        </Text>
      </Pressable>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        contentContainerStyle={styles.scrollContent}
      >
        {pages.map(p => (
          <View key={p.key} style={[styles.page, { width }]}>
            {p.image ? (
              <Image
                source={p.image}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.textOnlyPage}>
                <Text style={[styles.pageTitle, { color: theme.onSurface }]}>
                  {p.title}
                </Text>
                <Text
                  style={[styles.pageText, { color: theme.onSurfaceSecondary }]}
                >
                  {p.text}
                </Text>
                {p.key === 'measurementSystem' && (
                  <View style={styles.systemPicker}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        triggerLightHaptic();
                        setMeasurementSystem('metric');
                      }}
                      style={[
                        styles.systemOption,
                        {
                          borderColor:
                            measurementSystem === 'metric'
                              ? theme.accent
                              : theme.border,
                          backgroundColor:
                            measurementSystem === 'metric'
                              ? theme.accent
                              : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.systemOptionText,
                          {
                            color:
                              measurementSystem === 'metric'
                                ? '#fff'
                                : theme.onSurface,
                          },
                        ]}
                      >
                        {t('settings.metric')}
                      </Text>
                      <Text
                        style={[
                          styles.systemOptionSubtext,
                          {
                            color:
                              measurementSystem === 'metric'
                                ? '#fff'
                                : theme.onSurfaceSecondary,
                          },
                        ]}
                      >
                        km, kg, °C
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        triggerLightHaptic();
                        setMeasurementSystem('imperial');
                      }}
                      style={[
                        styles.systemOption,
                        {
                          borderColor:
                            measurementSystem === 'imperial'
                              ? theme.accent
                              : theme.border,
                          backgroundColor:
                            measurementSystem === 'imperial'
                              ? theme.accent
                              : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.systemOptionText,
                          {
                            color:
                              measurementSystem === 'imperial'
                                ? '#fff'
                                : theme.onSurface,
                          },
                        ]}
                      >
                        {t('settings.imperial')}
                      </Text>
                      <Text
                        style={[
                          styles.systemOptionSubtext,
                          {
                            color:
                              measurementSystem === 'imperial'
                                ? '#fff'
                                : theme.onSurfaceSecondary,
                          },
                        ]}
                      >
                        mi, lb, °F
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((p, i) => (
            <View
              key={p.key}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? theme.accent : theme.onSurfaceSecondary,
                  opacity: i === index ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        <LiquidGlassButton
          title={
            index === pages.length - 1
              ? t('common.getStarted')
              : t('common.next')
          }
          onPress={next}
          style={styles.nextBtn}
          animated={index === pages.length - 1 && !reduceMotion}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    alignItems: 'center',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width,
    height: height * 0.75,
  },
  textOnlyPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  systemPicker: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  systemOption: {
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  systemOptionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  systemOptionSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextBtn: {
    width: width * 0.9,
  },
});
