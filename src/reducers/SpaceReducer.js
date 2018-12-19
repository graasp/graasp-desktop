import Immutable from 'immutable';
import {
  GET_SPACE,
  TOGGLE_SPACE_MENU,
  GET_SPACES,
  CLEAR_SPACE,
  ON_GET_SPACE_SUCCESS,
  FLAG_GETTING_SPACE,
  FLAG_DELETING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_LOADING_SPACE,
  FLAG_EXPORTING_SPACE,
  ON_SPACE_DELETED,
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
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_SPACE:
      // set content to empty map
      return state
        .setIn(['current', 'content'], Immutable.Map())
        .setIn(['current', 'deleted'], false);
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
    case ON_SPACE_DELETED:
      return state.setIn(['current', 'deleted'], payload);
    case GET_SPACES:
      return state.setIn(['saved'], payload);
    case GET_SPACE:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    case TOGGLE_SPACE_MENU:
      return state.setIn(['current', 'menu', 'open'], payload);
    case ON_GET_SPACE_SUCCESS:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    default:
      return state;
  }
};
