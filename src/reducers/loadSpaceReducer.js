import { Map, List, fromJS } from 'immutable';
import {
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE,
  FLAG_CANCELING_TO_LOAD_SPACE,
  CANCEL_LOAD_SPACE_SUCCEEDED,
  FLAG_LOADING_SPACE,
  LOAD_SPACE_SUCCEEDED,
  EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
} from '../types';
import { updateActivityList } from './common';

const DEFAULT_EXTRACT_PARAMETERS = Map({
  extractPath: '',
  savedSpace: Map(),
  spaceId: null, // ?
  elements: Map({
    space: Map(),
    actions: List(),
    resources: List(),
  }),
});

const INITIAL_STATE = Map({
  activity: List(),
  extract: DEFAULT_EXTRACT_PARAMETERS,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_LOADING_SPACE:
    case FLAG_EXTRACTING_FILE_TO_LOAD_SPACE:
    case FLAG_CANCELING_TO_LOAD_SPACE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED: {
      return state.setIn(['extract'], fromJS(payload));
    }
    // clear extract info on cancel or on successful load
    case LOAD_SPACE_SUCCEEDED:
    case CANCEL_LOAD_SPACE_SUCCEEDED:
      return state.setIn(['extract'], DEFAULT_EXTRACT_PARAMETERS);
    default:
      return state;
  }
};
