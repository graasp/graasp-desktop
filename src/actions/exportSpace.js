import { toastr } from 'react-redux-toastr';
import {
  FLAG_EXPORTING_SPACE,
  EXPORT_SPACE_SUCCESS,
  CLEAR_EXPORT_SPACE,
  SET_EXPORT_SPACE,
  FLAG_CLEARING_EXPORT_SPACE,
  FLAG_SETTING_EXPORT_SPACE,
} from '../types';
import { ERROR_GENERAL } from '../config/errors';
import {
  EXPORT_SPACE_CHANNEL,
  EXPORTED_SPACE_CHANNEL,
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL,
  RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
} from '../config/channels';
import {
  ERROR_EXPORTING_MESSAGE,
  ERROR_MESSAGE_HEADER,
  SUCCESS_EXPORTING_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
} from '../config/messages';
import { createFlag } from './common';

const flagExportingSpace = createFlag(FLAG_EXPORTING_SPACE);
const flagSettingExportSpace = createFlag(FLAG_SETTING_EXPORT_SPACE);
const flagClearingExportSpace = createFlag(FLAG_CLEARING_EXPORT_SPACE);

export const exportSpace = (id, spaceName, userId, selection) => dispatch => {
  window.ipcRenderer.send(SHOW_EXPORT_SPACE_PROMPT_CHANNEL, spaceName);
  window.ipcRenderer.once(
    RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
    (event, archivePath) => {
      dispatch(flagExportingSpace(true));
      if (archivePath) {
        window.ipcRenderer.send(EXPORT_SPACE_CHANNEL, {
          archivePath,
          id,
          userId,
          selection,
        });
      } else {
        dispatch(flagExportingSpace(false));
      }
    }
  );
  window.ipcRenderer.once(EXPORTED_SPACE_CHANNEL, (event, response) => {
    if (response === ERROR_GENERAL) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_EXPORTING_MESSAGE);
    } else {
      toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_EXPORTING_MESSAGE);
      dispatch({
        type: EXPORT_SPACE_SUCCESS,
      });
    }
    dispatch(flagExportingSpace(false));
  });
};

export const setSpaceForExport = payload => dispatch => {
  dispatch(flagSettingExportSpace(true));
  dispatch({
    type: SET_EXPORT_SPACE,
    payload,
  });
  dispatch(flagSettingExportSpace(false));
};

export const clearExportSpace = () => dispatch => {
  dispatch(flagClearingExportSpace(true));
  dispatch({
    type: CLEAR_EXPORT_SPACE,
  });
  dispatch(flagClearingExportSpace(false));
};
