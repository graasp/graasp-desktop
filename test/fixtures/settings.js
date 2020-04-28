import {
  DEFAULT_LANGUAGE,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_GEOLOCATION_ENABLED,
  SYNC_MODES,
  DEFAULT_SYNC_MODES,
} from '../../src/config/constants';
import { USER_ALICE, USER_GRAASP, USER_BOB } from './users';

/* eslint-disable-next-line import/prefer-default-export */
export const settingsPerUser = {
  [USER_GRAASP.name]: {
    lang: DEFAULT_LANGUAGE,
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
    syncMode: DEFAULT_SYNC_MODES,
  },
  [USER_ALICE.name]: {
    lang: 'fr',
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: true,
    syncMode: SYNC_MODES.ADVANCED,
  },
  [USER_BOB.name]: {
    lang: 'ja',
    developerMode: true,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
    syncMode: SYNC_MODES.VISUAL,
  },
};
