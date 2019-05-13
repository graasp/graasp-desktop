import { Map } from 'immutable';
import {
  FLAG_GETTING_USER_FOLDER,
  FLAG_SETTING_LANGUAGE,
  FLAG_GETTING_LANGUAGE,
  GET_GEOLOCATION_SUCCEEDED,
  GET_USER_FOLDER_SUCCEEDED,
  SET_LANGUAGE_SUCCEEDED,
  GET_LANGUAGE_SUCCEEDED,
} from '../types';
import { DEFAULT_LANGUAGE } from '../config/constants';

const INITIAL_STATE = Map({
  current: Map({
    geolocation: Map(),
    folder: null,
    activity: false,
    lang: DEFAULT_LANGUAGE,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_SETTING_LANGUAGE:
    case FLAG_GETTING_LANGUAGE:
    case FLAG_GETTING_USER_FOLDER:
      return state.setIn(['current', 'activity'], payload);
    case GET_USER_FOLDER_SUCCEEDED:
      return state.setIn(['current', 'folder'], payload);
    case GET_GEOLOCATION_SUCCEEDED:
      return state.setIn(['current', 'geolocation'], Map(payload));
    case SET_LANGUAGE_SUCCEEDED:
      return state.setIn(['current', 'lang'], payload);
    case GET_LANGUAGE_SUCCEEDED:
      return state.setIn(['current', 'lang'], payload);
    default:
      return state;
  }
};
