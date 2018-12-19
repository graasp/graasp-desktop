import Immutable from 'immutable';
import {
  CLEAR_PHASE,
  SELECT_PHASE,
} from '../types';

const INITIAL_STATE = Immutable.Map({
  current: Immutable.Map({
    content: Immutable.Map(),
    loading: false,
    error: null,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case CLEAR_PHASE:
      // set content to empty map
      return state.setIn(['current', 'content'], Immutable.Map());
    case SELECT_PHASE:
      return state.setIn(['current', 'content'], Immutable.Map(payload));
    default:
      return state;
  }
};
