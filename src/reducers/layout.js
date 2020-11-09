import { Map } from 'immutable';
import {
  OPEN_TOOLS,
  CLOSE_TOOLS,
  SET_TOOLS_WIDTH,
  SET_SIDE_BAR_IS_OPEN,
} from '../types';
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
    case SET_SIDE_BAR_IS_OPEN:
      return state.setIn(['sideBarState', 'open'], payload);
    default:
      return state;
  }
};
