import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
// import ta from './locales/ta.json';
// import bn from './locales/bn.json';

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.locale || 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    //   ta: { translation: ta },
    //   bn: { translation: bn },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
