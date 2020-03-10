import { Map, List } from 'immutable';
import {
  FLAG_SIGNING_IN,
  SIGN_IN_SUCCEEDED,
  IS_AUTHENTICATED_SUCCEEDED,
  SIGN_OUT_SUCCEEDED,
  FLAG_SIGNING_OUT,
  FLAG_GETTING_USER_FOLDER,
  FLAG_SETTING_LANGUAGE,
  FLAG_GETTING_LANGUAGE,
  GET_GEOLOCATION_SUCCEEDED,
  GET_USER_FOLDER_SUCCEEDED,
  SET_LANGUAGE_SUCCEEDED,
  GET_LANGUAGE_SUCCEEDED,
  GET_DEVELOPER_MODE_SUCCEEDED,
  SET_DEVELOPER_MODE_SUCCEEDED,
  FLAG_SETTING_DEVELOPER_MODE,
  FLAG_GETTING_DEVELOPER_MODE,
  GET_GEOLOCATION_ENABLED_SUCCEEDED,
  SET_GEOLOCATION_ENABLED_SUCCEEDED,
  FLAG_SETTING_GEOLOCATION_ENABLED,
  FLAG_GETTING_GEOLOCATION_ENABLED,
} from '../types';
import { updateActivityList } from './common';
import {
  AUTHENTICATED,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_LANGUAGE,
  DEFAULT_GEOLOCATION_ENABLED,
} from '../config/constants';

export const DEFAULT_USER_SETTINGS = {
  lang: DEFAULT_LANGUAGE,
  developerMode: DEFAULT_DEVELOPER_MODE,
  geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
};

export const DEFAULT_USER = {
  geolocation: Map(),
  settings: { ...DEFAULT_USER_SETTINGS },
};

export const INITIAL_STATE = Map({
  current: {
    activity: List(),
    folder: null,
  },
  authenticated: false,
  user: Map(DEFAULT_USER),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_SETTING_LANGUAGE:
    case FLAG_GETTING_LANGUAGE:
    case FLAG_GETTING_USER_FOLDER:
    case FLAG_SETTING_DEVELOPER_MODE:
    case FLAG_GETTING_DEVELOPER_MODE:
    case FLAG_SETTING_GEOLOCATION_ENABLED:
    case FLAG_GETTING_GEOLOCATION_ENABLED:
    case FLAG_SIGNING_IN:
    case FLAG_SIGNING_OUT:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload)
      );
    case SIGN_IN_SUCCEEDED: {
      return state
        .setIn(['user'], { ...DEFAULT_USER, ...payload })
        .setIn(['authenticated'], AUTHENTICATED);
    }
    case SIGN_OUT_SUCCEEDED:
      return state
        .setIn(['user'], Map(DEFAULT_USER))
        .setIn(['authenticated'], false);
    case IS_AUTHENTICATED_SUCCEEDED:
      return state.setIn(['authenticated'], payload);
    case GET_USER_FOLDER_SUCCEEDED:
      return state.setIn(['current', 'folder'], payload);
    case GET_GEOLOCATION_SUCCEEDED:
      return state.setIn(['user', 'geolocation'], Map(payload));
    case GET_LANGUAGE_SUCCEEDED:
    case SET_LANGUAGE_SUCCEEDED:
      return state.setIn(['user', 'settings', 'lang'], payload);
    case GET_DEVELOPER_MODE_SUCCEEDED:
    case SET_DEVELOPER_MODE_SUCCEEDED:
      return state.setIn(['user', 'settings', 'developerMode'], payload);
    case GET_GEOLOCATION_ENABLED_SUCCEEDED:
    case SET_GEOLOCATION_ENABLED_SUCCEEDED:
      return state.setIn(['user', 'settings', 'geolocationEnabled'], payload);
    default:
      return state;
  }
};
