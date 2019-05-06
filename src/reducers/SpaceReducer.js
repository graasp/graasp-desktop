import Immutable from 'immutable';
import {
  GET_SPACE,
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
} from '../types';

const INITIAL_STATE = Immutable.Map({
  current: Immutable.Map({
    content: Immutable.Map(),
    activity: false,
    error: null,
    menu: Immutable.Map({
      open: false,
    }),
    deleted: false,
  }),
  saved: Immutable.Set(),
  nearby: Immutable.Map({
    content: Immutable.Set(),
    activity: false,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_SPACE:
      // set content to empty map
      return state
        .setIn(['current', 'content'], Immutable.Map())
        .setIn(['current', 'deleted'], false);
    case FLAG_SAVING_SPACE:
      return state.setIn(['current', 'activity'], payload);
    case FLAG_GETTING_SPACE:
      return state.setIn(['current', 'activity'], payload);
    case FLAG_GETTING_SPACES:
      return state.setIn(['current', 'activity'], payload);
    case FLAG_LOADING_SPACE:
      return state.setIn(['current', 'activity'], payload);
    case FLAG_EXPORTING_SPACE:
      return state.setIn(['current', 'activity'], payload);
    case FLAG_DELETING_SPACE:
      return state.setIn(['current', 'activity'], payload);
    case DELETE_SPACE_SUCCESS:
      return state.setIn(['current', 'deleted'], payload);
    case GET_SPACES:
      return state.setIn(['saved'], payload);
    case GET_SPACE:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    case TOGGLE_SPACE_MENU:
      return state.setIn(['current', 'menu', 'open'], payload);
    case GET_SPACE_SUCCEEDED:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    case SAVE_SPACE_SUCCEEDED:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    case FLAG_GETTING_SPACES_NEARBY:
      return state.setIn(['nearby', 'activity'], payload);
    case GET_SPACES_NEARBY_SUCCEEDED:
      return state.setIn(['nearby', 'content'], payload);
    default:
      return state;
  }
};
