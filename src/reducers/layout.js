import { Map } from 'immutable';
import { OPEN_TOOLS, CLOSE_TOOLS, SET_TOOLS_WIDTH } from '../types';
import { DEFAULT_TOOLS_WIDTH } from '../config/layout';

const INITIAL_STATE = Map({
  tools: Map({
    open: false,
    width: DEFAULT_TOOLS_WIDTH,
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case OPEN_TOOLS:
      return state.setIn(['tools', 'open'], true);
    case CLOSE_TOOLS:
      return state.setIn(['tools', 'open'], false);
    case SET_TOOLS_WIDTH:
      return state.setIn(['tools', 'width'], payload);
    default:
      return state;
  }
};
