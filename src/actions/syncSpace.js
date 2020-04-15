import { createGetLocalSpace, createGetRemoteSpace } from './space';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  CLEAR_SYNC_SPACES,
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
