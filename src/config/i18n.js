import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../langs/en';
import fr from '../langs/fr';

i18n.use(initReactI18next).init({
  resources: {
    en_ALL: en,
    fr_ALL: fr,
  },
  fallbackLng: 'en_ALL',
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
  // bg_ALL: "български",
  // ca_ALL: "Català",
  // cs_ALL: "čeština",
  // de_ALL: "Deutsch",
  // el_ALL: "Ελληνικά",
  en_ALL: 'English',
  // es_ALL: "Español",
  // et_ALL: "Eesti",
  // fi_ALL: "Suomi",
  fr_ALL: 'Français',
  // hu_ALL: "Magyar",
  // it_ALL: "Italiano",
  // ja_ALL: "日本語",
  // ka_ALL: "ქართული",
  // lt_ALL: "lietuvių kalba",
  // lv_ALL: "Latviešu",
  // nl_ALL: "Nederlands",
  // pt_ALL: "Português",
  // ro_ALL: "Română",
  // ru_ALL: "Русский",
  // sk_ALL: "Slovenský",
  // sl_ALL: "Slovenščina",
  // sr_ALL: "српски језик",
  // sw_ALL: "Kiswahili",
  // tr_ALL: "Türkçe",
  // uk_ALL: "Українська",
  // vi_ALL: "Tiếng Việt",
  // zh_ALL: "简体中文",
  // zh_tw: "繁體中文",
};

export { langs };

export default i18n;
