import { Map, List } from 'immutable';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACE,
  CLEAR_SYNC_SPACES,
} from '../types';
import { updateActivityList } from './common';

const INITIAL_STATE = Map({
  activity: List(),
  remoteSpace: Map(),
  localSpace: Map(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_SPACE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case CLEAR_SYNC_SPACES:
      return state.setIn(['remoteSpace'], Map()).setIn(['localSpace'], Map());
    case GET_SYNC_REMOTE_SPACE_SUCCEEDED:
      return state.setIn(['remoteSpace'], Map(payload));
    case GET_SYNC_LOCAL_SPACE_SUCCEEDED:
      return state.setIn(['localSpace'], Map(payload));
    default:
      return state;
  }
};
