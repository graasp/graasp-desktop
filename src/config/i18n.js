import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../langs/en';
import fr from '../langs/fr';

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
  },
  fallbackLng: 'en',
  // debug only when not in production
  debug: process.env.NODE_ENV !== 'production',
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

const langs = {
  // bg: "български",
  // ca: "Català",
  // cs: "čeština",
  // de: "Deutsch",
  // el: "Ελληνικά",
  en: 'English',
  // es: "Español",
  // et: "Eesti",
  // fi: "Suomi",
  fr: 'Français',
  // hu: "Magyar",
  // it: "Italiano",
  // ja: "日本語",
  // ka: "ქართული",
  // lt: "lietuvių kalba",
  // lv: "Latviešu",
  // nl: "Nederlands",
  // pt: "Português",
  // ro: "Română",
  // ru: "Русский",
  // sk: "Slovenský",
  // sl: "Slovenščina",
  // sr: "српски језик",
  // sw: "Kiswahili",
  // tr: "Türkçe",
  // uk: "Українська",
  // vi: "Tiếng Việt",
  // zh: "简体中文",
  // zh_tw: "繁體中文",
};

export { langs };

export default i18n;
