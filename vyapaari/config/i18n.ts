// ✅ config/i18n.ts (no static JSON)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {}, // 🔄 will be added dynamically
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
