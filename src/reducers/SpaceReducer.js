import { Set, Map, List } from 'immutable';
import {
  TOGGLE_SPACE_MENU,
  GET_SPACES,
  CLEAR_SPACE,
  GET_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACE,
  FLAG_DELETING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_EXPORTING_SPACE,
  DELETE_SPACE_SUCCESS,
  SAVE_SPACE_SUCCEEDED,
  FLAG_SAVING_SPACE,
  FLAG_GETTING_SPACES_NEARBY,
  GET_SPACES_NEARBY_SUCCEEDED,
  FLAG_SYNCING_SPACE,
  SYNC_SPACE_SUCCEEDED,
  FLAG_CLEARING_USER_INPUT,
  CLEAR_USER_INPUT_SUCCEEDED,
  SET_SPACE_SEARCH_QUERY_SUCCEEDED,
} from '../types';
import { updateActivityList } from './common';
import {
  HOME_PATH,
  SPACES_NEARBY_PATH,
  SAVED_SPACES_PATH,
} from '../config/paths';

const INITIAL_STATE = Map({
  current: Map({
    content: Map(),
    activity: List(),
    error: null,
    menu: Map({
      open: false,
    }),
    deleted: false,
  }),
  saved: Set(),
  nearby: Map({
    content: Set(),
    activity: false,
  }),
  search: Map({
    [HOME_PATH]: '',
    [SPACES_NEARBY_PATH]: '',
    [SAVED_SPACES_PATH]: '',
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_SPACE:
      // set content to empty map
      return state
        .setIn(['current', 'content'], Map())
        .setIn(['current', 'deleted'], false);
    case FLAG_SAVING_SPACE:
    case FLAG_GETTING_SPACE:
    case FLAG_GETTING_SPACES:
    case FLAG_EXPORTING_SPACE:
    case FLAG_DELETING_SPACE:
    case FLAG_SYNCING_SPACE:
    case FLAG_CLEARING_USER_INPUT:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload)
      );
    case DELETE_SPACE_SUCCESS:
      return state.setIn(['current', 'deleted'], payload);
    case GET_SPACES:
      return state.setIn(['saved'], Set(payload));
    case TOGGLE_SPACE_MENU:
      return state.setIn(['current', 'menu', 'open'], payload);
    case GET_SPACE_SUCCEEDED:
    case SAVE_SPACE_SUCCEEDED:
    case SYNC_SPACE_SUCCEEDED:
    case CLEAR_USER_INPUT_SUCCEEDED:
      return state.setIn(['current', 'content'], Map(payload));
    case FLAG_GETTING_SPACES_NEARBY:
      return state.setIn(['nearby', 'activity'], payload);
    case GET_SPACES_NEARBY_SUCCEEDED:
      return state.setIn(['nearby', 'content'], Set(payload));
    case SET_SPACE_SEARCH_QUERY_SUCCEEDED:
      return state.setIn(['search', payload.pathname], payload.value);
    default:
      return state;
  }
};
