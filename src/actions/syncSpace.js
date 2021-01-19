import { toastr } from 'react-redux-toastr';
import i18n from '../config/i18n';
import { createGetLocalSpace, createGetRemoteSpace, getSpaces } from './space';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  CLEAR_SYNC_SPACES,
  SELECT_SYNC_PHASE,
  CLEAR_SYNC_PHASES,
  FLAG_GETTING_SYNC_REMOTE_SPACE,
  FLAG_GETTING_SYNC_LOCAL_SPACE,
  SYNC_SPACE_SUCCEEDED,
  FLAG_SYNCING_SPACE,
} from '../types';
import { ERROR_GENERAL } from '../config/errors';
import { SYNC_SPACE_CHANNEL, SYNCED_SPACE_CHANNEL } from '../config/channels';
import {
  SUCCESS_SYNCING_MESSAGE,
  ERROR_SYNCING_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
  ERROR_MESSAGE_HEADER,
} from '../config/messages';
import { createFlag, isErrorResponse } from './common';
import { generateGetSpaceEndpoint } from '../config/endpoints';
import { DEFAULT_GET_REQUEST } from '../config/rest';

const flagSyncingSpace = createFlag(FLAG_SYNCING_SPACE);

export const syncSpace = async ({ id }) => async (dispatch) => {
  try {
    const url = generateGetSpaceEndpoint(id);
    const response = await fetch(url, DEFAULT_GET_REQUEST);
    // throws if it is an error
    await isErrorResponse(response);
    const remoteSpace = await response.json();

    dispatch(flagSyncingSpace(true));
    window.ipcRenderer.send(SYNC_SPACE_CHANNEL, { remoteSpace });

    // this runs once the space has been synced
    window.ipcRenderer.once(SYNCED_SPACE_CHANNEL, (event, res) => {
      if (res === ERROR_GENERAL) {
        toastr.error(
          i18n.t(ERROR_MESSAGE_HEADER),
          i18n.t(ERROR_SYNCING_MESSAGE)
        );
      } else {
        // update saved spaces in state
        dispatch(getSpaces());

        toastr.success(
          i18n.t(SUCCESS_MESSAGE_HEADER),
          i18n.t(SUCCESS_SYNCING_MESSAGE)
        );
        dispatch({
          type: SYNC_SPACE_SUCCEEDED,
          payload: res,
        });
      }
      dispatch(flagSyncingSpace(false));
    });
  } catch (err) {
    dispatch(flagSyncingSpace(false));
    toastr.error(i18n.t(ERROR_MESSAGE_HEADER), i18n.t(ERROR_SYNCING_MESSAGE));
  }
};

export const getRemoteSpaceForSync = (payload) =>
  createGetRemoteSpace(
    payload,
    GET_SYNC_REMOTE_SPACE_SUCCEEDED,
    FLAG_GETTING_SYNC_REMOTE_SPACE
  );

export const getLocalSpaceForSync = (payload) =>
  createGetLocalSpace(
    payload,
    GET_SYNC_LOCAL_SPACE_SUCCEEDED,
    FLAG_GETTING_SYNC_LOCAL_SPACE
  );

export const clearSpacesForSync = () => (dispatch) =>
  dispatch({
    type: CLEAR_SYNC_SPACES,
  });

export const clearPhasesForSync = () => (dispatch) =>
  dispatch({
    type: CLEAR_SYNC_PHASES,
  });

export const selectPhaseForSync = (phase) => (dispatch) => {
  dispatch({
    type: SELECT_SYNC_PHASE,
    payload: phase,
  });
};
