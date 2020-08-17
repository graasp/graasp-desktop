import { POST_FILE_CHANNEL, DELETE_FILE_CHANNEL } from '../config/channels';
import {
  POST_FILE_SUCCEEDED,
  POST_FILE_FAILED,
  DELETE_FILE_FAILED,
  DELETE_FILE_SUCCEEDED,
} from '../types';
import { ERROR_GENERAL } from '../config/errors';
import {
  ERROR_POSTING_FILE_MESSAGE,
  ERROR_DELETING_FILE_MESSAGE,
} from '../config/messages';

export const postFile = async (
  { userId, appInstanceId, spaceId, subSpaceId, format, data, type } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(POST_FILE_CHANNEL, {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      format,
      type,
      data,
    });

    window.ipcRenderer.once(POST_FILE_CHANNEL, async (event, response) => {
      if (response === ERROR_GENERAL) {
        callback({
          appInstanceId,
          type: POST_FILE_FAILED,
          payload: ERROR_POSTING_FILE_MESSAGE,
        });
      } else {
        callback({
          // have to include the appInstanceId to avoid broadcasting
          appInstanceId,
          type: POST_FILE_SUCCEEDED,
          payload: response,
        });
      }
    });
  } catch (err) {
    callback({
      appInstanceId,
      type: POST_FILE_FAILED,
      payload: ERROR_POSTING_FILE_MESSAGE,
    });
  }
};

export const deleteFile = async (payload = {}, callback) => {
  try {
    window.ipcRenderer.send(DELETE_FILE_CHANNEL, payload);
    const { appInstanceId } = payload;
    window.ipcRenderer.once(DELETE_FILE_CHANNEL, async (event, response) => {
      if (response === ERROR_GENERAL) {
        callback({
          appInstanceId,
          type: DELETE_FILE_FAILED,
          payload: ERROR_DELETING_FILE_MESSAGE,
        });
      } else {
        callback({
          // have to include the appInstanceId to avoid broadcasting
          appInstanceId,
          type: DELETE_FILE_SUCCEEDED,
          payload: response,
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
};
