import { NativeModules, Platform } from 'react-native';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// All supported languages with their resources
const resources: Record<string, { translation: any }> = {};

const loadResources = () => {
  if (Object.keys(resources).length > 0) return resources;

  resources.en = { translation: require('./resources/en').default };
  resources.zh = { translation: require('./resources/zh').default };
  resources.ja = { translation: require('./resources/ja').default };
  resources.ko = { translation: require('./resources/ko').default };
  resources.de = { translation: require('./resources/de').default };
  resources.fr = { translation: require('./resources/fr').default };
  resources.es = { translation: require('./resources/es').default };
  resources['pt-BR'] = { translation: require('./resources/pt-BR').default };
  resources.ar = { translation: require('./resources/ar').default };
  resources.ru = { translation: require('./resources/ru').default };
  resources.it = { translation: require('./resources/it').default };
  resources.nl = { translation: require('./resources/nl').default };
  resources.tr = { translation: require('./resources/tr').default };
  resources.th = { translation: require('./resources/th').default };
  resources.vi = { translation: require('./resources/vi').default };
  resources.id = { translation: require('./resources/id').default };
  resources.pl = { translation: require('./resources/pl').default };
  resources.uk = { translation: require('./resources/uk').default };
  resources.hi = { translation: require('./resources/hi').default };
  resources.he = { translation: require('./resources/he').default };
  resources.sv = { translation: require('./resources/sv').default };
  resources.no = { translation: require('./resources/no').default };
  resources.da = { translation: require('./resources/da').default };
  resources.fi = { translation: require('./resources/fi').default };
  resources.cs = { translation: require('./resources/cs').default };
  resources.hu = { translation: require('./resources/hu').default };
  resources.ro = { translation: require('./resources/ro').default };
  resources.el = { translation: require('./resources/el').default };
  resources.ms = { translation: require('./resources/ms').default };
  resources.fil = { translation: require('./resources/fil').default };

  return resources;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: 'en' },
  { code: 'zh', name: '中文', flag: 'zh' },
  { code: 'ja', name: '日本語', flag: 'ja' },
  { code: 'ko', name: '한국어', flag: 'ko' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'pt-BR', name: 'Português (BR)', flag: 'pt-BR' },
  { code: 'ar', name: 'العربية', flag: 'ar' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'tr', name: 'Türkçe', flag: 'tr' },
  { code: 'th', name: 'ไทย', flag: 'th' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'vi' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'id' },
  { code: 'pl', name: 'Polski', flag: 'pl' },
  { code: 'uk', name: 'Українська', flag: 'uk' },
  { code: 'hi', name: 'हिन्दी', flag: 'hi' },
  { code: 'he', name: 'עברית', flag: 'he' },
  { code: 'sv', name: 'Svenska', flag: 'sv' },
  { code: 'no', name: 'Norsk', flag: 'no' },
  { code: 'da', name: 'Dansk', flag: 'da' },
  { code: 'fi', name: 'Suomi', flag: 'fi' },
  { code: 'cs', name: 'Čeština', flag: 'cs' },
  { code: 'hu', name: 'Magyar', flag: 'hu' },
  { code: 'ro', name: 'Română', flag: 'ro' },
  { code: 'el', name: 'Ελληνικά', flag: 'el' },
  { code: 'ms', name: 'Bahasa Melayu', flag: 'ms' },
  { code: 'fil', name: 'Filipino', flag: 'fil' },
];

// Initialize i18next
const res = loadResources();
i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: res,
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
  },
});

export function getDeviceLanguage(): string {
  try {
    let locale: string | undefined;
    if (Platform.OS === 'ios') {
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
    } else {
      locale = NativeModules.I18nManager?.localeIdentifier;
    }
    if (locale) {
      const langCode = locale.split(/[_-]/)[0].toLowerCase();
      if (
        SUPPORTED_LANGUAGES.some(
          l => l.code === langCode || l.code.startsWith(langCode),
        )
      ) {
        return langCode;
      }
    }
  } catch {}
  return 'en';
}

export function t(key: string, fallback?: string): string {
  return i18next.t(key, fallback) as string;
}

export function setLanguage(lng?: string) {
  if (!lng) return;
  i18next.changeLanguage(lng);
}

export { i18next };
