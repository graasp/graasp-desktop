import { Map } from 'immutable';
import {
  FLAG_GETTING_USER_FOLDER,
  GET_GEOLOCATION_SUCCEEDED,
  GET_USER_FOLDER_SUCCEEDED,
} from '../types';

const INITIAL_STATE = Map({
  current: Map({
    geolocation: Map(),
    folder: null,
    activity: false,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_USER_FOLDER:
      return state.setIn(['current', 'activity'], payload);
    case GET_USER_FOLDER_SUCCEEDED:
      return state.setIn(['current', 'folder'], payload);
    case GET_GEOLOCATION_SUCCEEDED:
      return state.setIn(['current', 'geolocation'], Map(payload));
    default:
      return state;
  }
};
