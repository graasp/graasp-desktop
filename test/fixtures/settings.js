import {
  DEFAULT_LANGUAGE,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_GEOLOCATION_ENABLED,
} from '../../src/config/constants';
import { USER_ALICE, USER_GRAASP, USER_BOB } from './users';

/* eslint-disable-next-line import/prefer-default-export */
export const settingsPerUser = {
  [USER_GRAASP.name]: {
    lang: DEFAULT_LANGUAGE,
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
  },
  [USER_ALICE.name]: {
    lang: 'fr',
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: true,
  },
  [USER_BOB.name]: {
    lang: 'ja',
    developerMode: true,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
  },
};
