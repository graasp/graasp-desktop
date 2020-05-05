import { toastr } from 'react-redux-toastr';
import {
  FLAG_LOADING_SPACE,
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE,
  FLAG_CLEARING_LOAD_SPACE,
  CLEAR_LOAD_SPACE_SUCCEEDED,
  LOAD_SPACE_SUCCEEDED,
  EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
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

const flagLoadingSpace = createFlag(FLAG_LOADING_SPACE);
const flagExtractingFileToLoadSpace = createFlag(
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE
);
const flagClearingLoadSpace = createFlag(FLAG_CLEARING_LOAD_SPACE);

export const loadSpace = payload => dispatch => {
  dispatch(flagLoadingSpace(true));
  window.ipcRenderer.send(LOAD_SPACE_CHANNEL, payload);
  window.ipcRenderer.once(LOADED_SPACE_CHANNEL, (event, response) => {
    switch (response) {
      case ERROR_GENERAL:
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOADING_MESSAGE);
        break;
      default:
        dispatch({
          type: LOAD_SPACE_SUCCEEDED,
        });
        toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_SPACE_LOADED_MESSAGE);
        setSpaceAsRecent({ spaceId: response.spaceId, recent: true })(dispatch);
    }
    dispatch(flagLoadingSpace(false));
  });
};

export const extractFileToLoadSpace = ({ fileLocation }) => dispatch => {
  dispatch(flagExtractingFileToLoadSpace(true));
  window.ipcRenderer.send(EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL, { fileLocation });
  window.ipcRenderer.once(
    EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
    (event, response) => {
      switch (response) {
        case ERROR_ZIP_CORRUPTED:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_ZIP_CORRUPTED_MESSAGE);
          break;
        case ERROR_JSON_CORRUPTED:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_JSON_CORRUPTED_MESSAGE);
          break;
        case ERROR_SPACE_ALREADY_AVAILABLE:
          toastr.error(
            ERROR_MESSAGE_HEADER,
            ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE
          );
          break;
        case ERROR_GENERAL:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOADING_MESSAGE);
          break;
        default:
          dispatch({
            type: EXTRACT_FILE_TO_LOAD_SPACE_SUCCEEDED,
            payload: response,
          });
      }
      dispatch(flagExtractingFileToLoadSpace(false));
    }
  );
};

export const clearLoadSpace = payload => dispatch => {
  dispatch(flagClearingLoadSpace(true));
  window.ipcRenderer.send(CLEAR_LOAD_SPACE_CHANNEL, payload);
  window.ipcRenderer.once(CLEAR_LOAD_SPACE_CHANNEL, (event, response) => {
    switch (response) {
      case ERROR_GENERAL:
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOADING_MESSAGE);
        break;
      default:
        dispatch({
          type: CLEAR_LOAD_SPACE_SUCCEEDED,
        });
    }
    dispatch(flagClearingLoadSpace(false));
  });
};
