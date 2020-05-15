import { Map, List, fromJS } from 'immutable';
import {
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE,
  FLAG_CLEARING_LOAD_SPACE,
  CLEAR_LOAD_SPACE_SUCCEEDED,
  FLAG_LOADING_SPACE,
  LOAD_SPACE_SUCCEEDED,
  EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACE_TO_LOAD_SPACE,
  GET_SPACE_TO_LOAD_SPACE_SUCCEEDED,
} from '../types';
import { updateActivityList } from './common';

export const LOAD_SPACE_STATUS = {
  READY: 'ready',
  RUNNING: 'running',
  DONE: 'done',
};

export const DEFAULT_EXTRACT_PARAMETERS = Map({
  extractPath: '',
  elements: Map({
    space: Map(),
    actions: List(),
    appInstanceResources: List(),
  }),
});

const INITIAL_STATE = Map({
  activity: List(),
  status: LOAD_SPACE_STATUS.READY,
  extract: DEFAULT_EXTRACT_PARAMETERS,
  savedSpace: Map(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_LOADING_SPACE:
    case FLAG_EXTRACTING_FILE_TO_LOAD_SPACE:
    case FLAG_CLEARING_LOAD_SPACE:
    case FLAG_GETTING_SPACE_TO_LOAD_SPACE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED: {
      return state
        .setIn(['extract'], fromJS(payload))
        .setIn(['status'], LOAD_SPACE_STATUS.RUNNING);
    }
    // clear extract info on cancel or on successful load
    case LOAD_SPACE_SUCCEEDED:
      return state
        .setIn(['extract'], DEFAULT_EXTRACT_PARAMETERS)
        .setIn(['status'], LOAD_SPACE_STATUS.DONE);
    case CLEAR_LOAD_SPACE_SUCCEEDED:
      return state
        .setIn(['extract'], DEFAULT_EXTRACT_PARAMETERS)
        .setIn(['status'], LOAD_SPACE_STATUS.READY)
        .setIn(['savedSpace'], Map());
    case GET_SPACE_TO_LOAD_SPACE_SUCCEEDED:
      return state.setIn(['savedSpace'], Map(payload));
    default:
      return state;
  }
};
