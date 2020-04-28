import { createGetLocalSpace, createGetRemoteSpace } from './space';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  CLEAR_SYNC_SPACES,
  SELECT_SYNC_PHASE,
  CLEAR_SYNC_PHASES,
  FLAG_GETTING_SYNC_REMOTE_SPACE,
  FLAG_GETTING_SYNC_LOCAL_SPACE,
} from '../types';

export const getRemoteSpaceForSync = payload =>
  createGetRemoteSpace(
    payload,
    GET_SYNC_REMOTE_SPACE_SUCCEEDED,
    FLAG_GETTING_SYNC_REMOTE_SPACE
  );

export const getLocalSpaceForSync = payload =>
  createGetLocalSpace(
    payload,
    GET_SYNC_LOCAL_SPACE_SUCCEEDED,
    FLAG_GETTING_SYNC_LOCAL_SPACE
  );

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
