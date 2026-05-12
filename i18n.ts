import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import esTranslations from '@/i18n/es.json';
import enTranslations from '@/i18n/en.json';
import catTranslations from '@/i18n/cat.json';

const resources = {
  es: { translation: esTranslations },
  en: { translation: enTranslations },
  cat: { translation: catTranslations },
};

const deviceLanguage = getLocales()[0]?.languageCode ?? 'es';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'es',
  interpolation: { escapeValue: false }
});

export default i18n;