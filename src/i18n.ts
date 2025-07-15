import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './locales';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already escapes values
    },
  });

export default i18n;
