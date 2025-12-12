import { NativeModules, Platform } from 'react-native';

let i18nextLib: any;

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
      // Extract language code (e.g., 'en_US' -> 'en', 'uk-UA' -> 'uk')
      return locale.split(/[_-]/)[0].toLowerCase();
    }
  } catch {}
  return 'en';
}

export function t(key: string, fallback?: string) {
  if (i18nextLib === undefined) {
    try {
       
      i18nextLib = require('i18next');
       
      const initReactI18next = require('react-i18next').initReactI18next;
       
      const en = require('./resources/en').default;
      if (!i18nextLib.isInitialized) {
        i18nextLib.use(initReactI18next).init({
          lng: 'en',
          fallbackLng: 'en',
          resources: { en: { translation: en } },
          interpolation: { escapeValue: false },
        });
      }
    } catch {
      i18nextLib = null;
    }
  }
  if (i18nextLib) return i18nextLib.t(key);
  return fallback ?? key;
}

export function setLanguage(lng?: string) {
  if (!lng) return;
  if (i18nextLib === undefined) {
    try {
       
      i18nextLib = require('i18next');
       
      const initReactI18next = require('react-i18next').initReactI18next;
       
      const en = require('./resources/en').default;
      if (!i18nextLib.isInitialized) {
        i18nextLib.use(initReactI18next).init({
          lng: 'en',
          resources: { en: { translation: en } },
          interpolation: { escapeValue: false },
        });
      }
    } catch {
      i18nextLib = null;
    }
  }
  try {
    i18nextLib?.changeLanguage?.(lng);
  } catch {}
}
