import {
  DEFAULT_LANGUAGE,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_GEOLOCATION_ENABLED,
  SYNC_MODES,
  DEFAULT_SYNC_MODE,
} from '../../src/config/constants';
import { USER_ALICE, USER_GRAASP, USER_CEDRIC } from './users';

/* eslint-disable-next-line import/prefer-default-export */
export const settingsPerUser = {
  [USER_GRAASP.username]: {
    lang: DEFAULT_LANGUAGE,
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED, // todo: remove
    syncMode: DEFAULT_SYNC_MODE,
  },
  [USER_ALICE.username]: {
    lang: 'fr',
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED, // todo: remove
    syncMode: SYNC_MODES.ADVANCED,
  },
  [USER_CEDRIC.username]: {
    lang: 'ja',
    developerMode: true,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED, // todo: remove
    syncMode: SYNC_MODES.VISUAL,
  },
};
