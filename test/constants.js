import path from 'path';
import {
  AUTHENTICATED,
  DEFAULT_SYNC_MODE,
  DEFAULT_USER_MODE,
} from '../src/config/constants';
import { USER_GRAASP } from './fixtures/users';

export const EXPORT_FILEPATH = path.join(__dirname, './tmp/exportSpace');
export const APPS_FOLDER = 'apps';

export const buildSignedUserForDatabase = ({
  syncMode = DEFAULT_SYNC_MODE,
} = {}) => ({
  users: [USER_GRAASP],
  user: {
    id: USER_GRAASP.id,
    username: USER_GRAASP.username,
    createdAt: '2020-11-23T14:54:49.092Z',
    anonymous: false,
    geolocation: null,
    settings: {
      lang: 'en',
      developerMode: false,
      geolocationEnabled: false,
      syncMode,
      userMode: USER_GRAASP?.settings?.userMode || DEFAULT_USER_MODE,
      actionAccessibility: false,
      actionsEnabled: true,
    },
    favoriteSpaces: [],
    recentSpaces: [],
    tour: {
      visitSpace: true,
      settings: true,
    },
    lastSignIn: '2020-11-23T14:54:49.092Z',
    authenticated: AUTHENTICATED,
  },
});

export const DEFAULT_GLOBAL_TIMEOUT = 270000;
export const SAVE_USER_INPUT_TIMEOUT = 370000;
export const TOOLTIP_FADE_OUT_PAUSE = 10000;
export const INPUT_TYPE_PAUSE = 2000;
export const VISIT_SPACE_PAUSE = 5000;
export const OPEN_SAVED_SPACE_PAUSE = 2000;
export const LOAD_SPACE_PAUSE = 2000;
export const EXPORT_SPACE_PAUSE = 2000;
export const DELETE_SPACE_PAUSE = 2000;
export const SAVE_SPACE_PAUSE = 15000;
export const LOAD_TAB_PAUSE = 3000;
export const OPEN_DRAWER_PAUSE = 1000;
export const SETTINGS_LOAD_PAUSE = 2000;
export const LOGIN_PAUSE = 2000;
export const SAVE_USER_INPUT_PAUSE = 2000;
export const LOAD_PHASE_PAUSE = 2000;
export const SYNC_SPACE_PAUSE = 5000;
export const SYNC_OPEN_SCREEN_PAUSE = 5000;
export const OPEN_TOOLS_PAUSE = 1000;
export const SPACE_SEARCH_PAUSE = 3000;
export const SET_SPACE_AS_FAVORITE_PAUSE = 1000;
export const LOAD_SELECTION_SPACE_PAUSE = 5000;
export const EXPORT_SELECTION_SPACE_PAUSE = 1000;
export const MODAL_OPEN_PAUSE = 1000;
export const MODAL_CLOSE_PAUSE = 1000;
export const DELETE_CLASSROOM_PAUSE = 1000;
export const OPEN_CLASSROOM_PAUSE = 1000;
export const DELETE_USER_IN_CLASSROOM_PAUSE = 1000;
export const CLEAR_INPUT_PAUSE = 1000;
export const OPEN_IMPORT_DATA_IN_CLASSROOM_PAUSE = 1000;
export const SELECT_OPEN_PAUSE = 500;
