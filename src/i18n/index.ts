let i18nextLib: any;
export function t(key: string, fallback?: string) {
  if (i18nextLib === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      i18nextLib = require('i18next');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const initReactI18next = require('react-i18next').initReactI18next;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  if (i18nextLib) return i18nextLib.t(key);
  return fallback ?? key;
}

export function setLanguage(lng?: string) {
  if (!lng) return;
  if (i18nextLib === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      i18nextLib = require('i18next');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const initReactI18next = require('react-i18next').initReactI18next;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  try { i18nextLib?.changeLanguage?.(lng); } catch {}
}
