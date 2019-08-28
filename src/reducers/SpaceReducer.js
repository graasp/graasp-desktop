import { Set, Map, List } from 'immutable';
import {
  TOGGLE_SPACE_MENU,
  GET_SPACES,
  CLEAR_SPACE,
  GET_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACE,
  FLAG_DELETING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_LOADING_SPACE,
  FLAG_EXPORTING_SPACE,
  DELETE_SPACE_SUCCESS,
  SAVE_SPACE_SUCCEEDED,
  FLAG_SAVING_SPACE,
  FLAG_GETTING_SPACES_NEARBY,
  GET_SPACES_NEARBY_SUCCEEDED,
  FLAG_SYNCING_SPACE,
  SYNC_SPACE_SUCCEEDED,
} from '../types';
import { updateActivityList } from './common';

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
    case FLAG_LOADING_SPACE:
    case FLAG_EXPORTING_SPACE:
    case FLAG_DELETING_SPACE:
    case FLAG_SYNCING_SPACE:
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
      return state.setIn(['current', 'content'], Map(payload));
    case FLAG_GETTING_SPACES_NEARBY:
      return state.setIn(['nearby', 'activity'], payload);
    case GET_SPACES_NEARBY_SUCCEEDED:
      return state.setIn(['nearby', 'content'], Set(payload));
    default:
      return state;
  }
};
