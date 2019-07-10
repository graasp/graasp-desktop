import { Map, List } from 'immutable';
import {
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
import {
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_LANGUAGE,
  DEFAULT_GEOLOCATION_ENABLED,
} from '../config/constants';
import { updateActivityList } from './common';

const INITIAL_STATE = Map({
  current: Map({
    geolocation: Map(),
    folder: null,
    activity: List(),
    lang: DEFAULT_LANGUAGE,
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
  }),
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
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload)
      );
    case GET_USER_FOLDER_SUCCEEDED:
      return state.setIn(['current', 'folder'], payload);
    case GET_GEOLOCATION_SUCCEEDED:
      return state.setIn(['current', 'geolocation'], Map(payload));
    case GET_LANGUAGE_SUCCEEDED:
    case SET_LANGUAGE_SUCCEEDED:
      return state.setIn(['current', 'lang'], payload);
    case GET_DEVELOPER_MODE_SUCCEEDED:
    case SET_DEVELOPER_MODE_SUCCEEDED:
      return state.setIn(['current', 'developerMode'], payload);
    case GET_GEOLOCATION_ENABLED_SUCCEEDED:
    case SET_GEOLOCATION_ENABLED_SUCCEEDED:
      return state.setIn(['current', 'geolocationEnabled'], payload);
    default:
      return state;
  }
};
