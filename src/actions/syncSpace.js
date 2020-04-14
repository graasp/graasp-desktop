import { createGetLocalSpace, createGetRemoteSpace } from './space';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  CLEAR_SYNC_SPACES,
  SELECT_SYNC_PHASE,
  CLEAR_SYNC_PHASES,
} from '../types';

export const getRemoteSpaceForSync = payload =>
  createGetRemoteSpace(payload, GET_SYNC_REMOTE_SPACE_SUCCEEDED);

export const getLocalSpaceForSync = payload =>
  createGetLocalSpace(payload, GET_SYNC_LOCAL_SPACE_SUCCEEDED);

export const clearSpacesForSync = () => dispatch => {
  return dispatch({
    type: CLEAR_SYNC_SPACES,
  });
};

export const clearPhasesForSync = () => dispatch => {
  return dispatch({
    type: CLEAR_SYNC_PHASES,
  });
};

export const selectPhaseForSync = phase => dispatch => {
  dispatch({
    type: SELECT_SYNC_PHASE,
    payload: phase,
  });
};
