import { toastr } from 'react-redux-toastr';
import i18n from '../config/i18n';
import {
  FLAG_LOADING_SPACE,
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE,
  FLAG_CLEARING_LOAD_SPACE,
  CLEAR_LOAD_SPACE_SUCCEEDED,
  LOAD_SPACE_SUCCEEDED,
  EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACE_TO_LOAD_SPACE,
  GET_SPACE_TO_LOAD_SPACE_SUCCEEDED,
} from '../types';
import {
  ERROR_ZIP_CORRUPTED,
  ERROR_JSON_CORRUPTED,
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
} from '../config/errors';
import {
  LOAD_SPACE_CHANNEL,
  LOADED_SPACE_CHANNEL,
  CLEAR_LOAD_SPACE_CHANNEL,
  EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
} from '../config/channels';
import {
  ERROR_JSON_CORRUPTED_MESSAGE,
  ERROR_LOADING_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE,
  ERROR_ZIP_CORRUPTED_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
  SUCCESS_SPACE_LOADED_MESSAGE,
} from '../config/messages';
import { createFlag } from './common';
import { setSpaceAsRecent } from './user';
import { createGetLocalSpace } from './space';

const flagLoadingSpace = createFlag(FLAG_LOADING_SPACE);

export const loadSpace = payload => dispatch => {
  dispatch(flagLoadingSpace(true));
  window.ipcRenderer.send(LOAD_SPACE_CHANNEL, payload);
  window.ipcRenderer.once(LOADED_SPACE_CHANNEL, (event, response) => {
    switch (response) {
      case ERROR_GENERAL:
        toastr.error(
          i18n.t(ERROR_MESSAGE_HEADER),
          i18n.t(ERROR_LOADING_MESSAGE)
        );
        break;
      default:
        dispatch({
          type: LOAD_SPACE_SUCCEEDED,
        });
        toastr.success(
          i18n.t(SUCCESS_MESSAGE_HEADER),
          i18n.t(SUCCESS_SPACE_LOADED_MESSAGE)
        );
        setSpaceAsRecent({ spaceId: response.spaceId, recent: true })(dispatch);
    }
    dispatch(flagLoadingSpace(false));
  });
};

export const getSpaceToLoadSpace = payload =>
  createGetLocalSpace(
    payload,
    GET_SPACE_TO_LOAD_SPACE_SUCCEEDED,
    FLAG_GETTING_SPACE_TO_LOAD_SPACE,
    false
  );

export const createExtractFile = (
  { fileLocation, classroomId = null },
  type,
  flagType,
  getSpace
) => dispatch => {
  const flagExtractingFile = createFlag(flagType);
  dispatch(flagExtractingFile(true));
  window.ipcRenderer.send(EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL, { fileLocation });
  window.ipcRenderer.once(
    EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
    async (event, response) => {
      switch (response) {
        case ERROR_ZIP_CORRUPTED:
          toastr.error(
            i18n.t(ERROR_MESSAGE_HEADER),
            i18n.t(ERROR_ZIP_CORRUPTED_MESSAGE)
          );
          break;
        case ERROR_JSON_CORRUPTED:
          toastr.error(
            i18n.t(ERROR_MESSAGE_HEADER),
            i18n.t(ERROR_JSON_CORRUPTED_MESSAGE)
          );
          break;
        case ERROR_SPACE_ALREADY_AVAILABLE:
          toastr.error(
            i18n.t(ERROR_MESSAGE_HEADER),
            i18n.t(ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE)
          );
          break;
        case ERROR_GENERAL:
          toastr.error(
            i18n.t(ERROR_MESSAGE_HEADER),
            i18n.t(ERROR_LOADING_MESSAGE)
          );
          break;
        default:
          // wait for saved space
          await dispatch(getSpace({ classroomId, id: response.spaceId }));

          dispatch({
            type,
            payload: response,
          });
      }
      dispatch(flagExtractingFile(false));
    }
  );
};

export const extractFileToLoadSpace = payload =>
  createExtractFile(
    payload,
    EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
    FLAG_EXTRACTING_FILE_TO_LOAD_SPACE,
    getSpaceToLoadSpace
  );

export const createClearLoadSpace = (payload, type, flagType) => dispatch => {
  const flagClearingLoadSpace = createFlag(flagType);
  dispatch(flagClearingLoadSpace(true));
  window.ipcRenderer.send(CLEAR_LOAD_SPACE_CHANNEL, payload);
  window.ipcRenderer.once(CLEAR_LOAD_SPACE_CHANNEL, (event, response) => {
    switch (response) {
      case ERROR_GENERAL:
        toastr.error(
          i18n.t(ERROR_MESSAGE_HEADER),
          i18n.t(ERROR_LOADING_MESSAGE)
        );
        break;
      default:
        dispatch({
          type,
        });
    }
    dispatch(flagClearingLoadSpace(false));
  });
};

export const clearLoadSpace = payload =>
  createClearLoadSpace(
    payload,
    CLEAR_LOAD_SPACE_SUCCEEDED,
    FLAG_CLEARING_LOAD_SPACE
  );
