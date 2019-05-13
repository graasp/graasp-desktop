import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../langs/en';
import fr from '../langs/fr';

i18n.use(initReactI18next).init({
  resources: {
    en_all: en,
    fr_all: fr,
  },
  fallbackLng: 'en_all',
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
  // bg_all: "български",
  // ca_all: "Català",
  // cs_all: "čeština",
  // de_all: "Deutsch",
  // el_all: "Ελληνικά",
  en_all: 'English',
  // es_all: "Español",
  // et_all: "Eesti",
  // fi_all: "Suomi",
  fr_all: 'Français',
  // hu_all: "Magyar",
  // it_all: "Italiano",
  // ja_all: "日本語",
  // ka_all: "ქართული",
  // lt_all: "lietuvių kalba",
  // lv_all: "Latviešu",
  // nl_all: "Nederlands",
  // pt_all: "Português",
  // ro_all: "Română",
  // ru_all: "Русский",
  // sk_all: "Slovenský",
  // sl_all: "Slovenščina",
  // sr_all: "српски језик",
  // sw_all: "Kiswahili",
  // tr_all: "Türkçe",
  // uk_all: "Українська",
  // vi_all: "Tiếng Việt",
  // zh_all: "简体中文",
  // zh_tw: "繁體中文",
};

export { langs };

export default i18n;
