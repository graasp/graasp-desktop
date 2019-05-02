import { toastr } from 'react-redux-toastr';
import {
  GET_SPACES,
  FLAG_GETTING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_LOADING_SPACE,
  CLEAR_SPACE,
  GET_SPACE_SUCCEEDED,
  FLAG_EXPORTING_SPACE,
  FLAG_DELETING_SPACE,
  DELETE_SPACE_SUCCESS,
  FLAG_SAVING_SPACE,
  SAVE_SPACE_SUCCEEDED,
} from '../../types';
import {
  ERROR_ZIP_CORRUPTED,
  ERROR_JSON_CORRUPTED,
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
  ERROR_DOWNLOADING_FILE,
} from '../../config/errors';
import { clearPhase } from '../phase';
import {
  DELETE_SPACE_CHANNEL,
  DELETED_SPACE_CHANNEL,
  EXPORT_SPACE_CHANNEL,
  EXPORTED_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
  LOAD_SPACE_CHANNEL,
  LOADED_SPACE_CHANNEL,
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL,
  RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
  SHOW_DELETE_SPACE_PROMPT_CHANNEL,
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL,
  SAVE_SPACE_CHANNEL,
} from '../../config/channels';
import {
  // ERROR_DOWNLOADING_MESSAGE,
  ERROR_DELETING_MESSAGE,
  ERROR_DOWNLOADING_MESSAGE,
  ERROR_EXPORTING_MESSAGE,
  ERROR_GETTING_SPACE_MESSAGE,
  ERROR_JSON_CORRUPTED_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_SAVING_SPACE_MESSAGE,
  ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE,
  ERROR_ZIP_CORRUPTED_MESSAGE,
  SUCCESS_DELETING_MESSAGE,
  SUCCESS_EXPORTING_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
  SUCCESS_SAVING_MESSAGE,
  SUCCESS_SPACE_LOADED_MESSAGE,
} from '../../config/messages';
import { createFlag, isErrorResponse } from '../common';
import { generateGetSpaceEndpoint } from '../../config/endpoints';
import { DEFAULT_GET_REQUEST } from '../../config/rest';

const flagGettingSpace = createFlag(FLAG_GETTING_SPACE);
const flagGettingSpaces = createFlag(FLAG_GETTING_SPACES);
const flagLoadingSpace = createFlag(FLAG_LOADING_SPACE);
const flagDeletingSpace = createFlag(FLAG_DELETING_SPACE);
const flagExportingSpace = createFlag(FLAG_EXPORTING_SPACE);
const flagSavingSpace = createFlag(FLAG_SAVING_SPACE);

// const getSpace = async ({ id, spaces }) => async (dispatch) => {
//   // raise flag
//   dispatch(flagGettingSpace(true));
//   // tell electron to download space
//   window.ipcRenderer.send(GET_SPACE_CHANNEL, { id, spaces });
//   // create listener
//   window.ipcRenderer.once(GET_SPACE_CHANNEL, (event, space) => {
//     // dispatch that the getter has succeeded
//     if (space === ERROR_GENERAL) {
//       toastr.error('Error', ERROR_DOWNLOADING_MESSAGE);
//     } else {
//       dispatch({
//         type: GET_SPACE_SUCCEEDED,
//         payload: space,
//       });
//     }
//     dispatch(flagGettingSpace(false));
//   });
//   // lower flag
//   //   // delete the listener
//   // });
// };

/**
 * helper function to wrap a listener to the get space channel around a promise
 * @param online
 * @returns {Promise<any>}
 */
const waitForSpace = ({ online }) =>
  new Promise((resolve, reject) => {
    // if online we are just using this to merge locally, so if the space
    // does not exist, it is not a big deal
    if (online) {
      return window.ipcRenderer.once(
        GET_SPACE_CHANNEL,
        async (event, space = {}) => {
          resolve(space);
        }
      );
    }
    // if offline, we want to error if the space does not exist
    return window.ipcRenderer.once(GET_SPACE_CHANNEL, async (event, space) => {
      // if there is no space offline, show error
      if (!space) {
        reject(new Error());
      }
      resolve(space);
    });
  });

const getLocalSpace = async ({ id }) => async dispatch => {
  try {
    dispatch(flagGettingSpace(true));

    // tell electron to get space
    window.ipcRenderer.send(GET_SPACE_CHANNEL, { id });

    const space = await waitForSpace({ online: false });

    dispatch({
      type: GET_SPACE_SUCCEEDED,
      payload: space,
    });
  } catch (err) {
    toastr.error('Error', ERROR_GETTING_SPACE_MESSAGE);
  } finally {
    dispatch(flagGettingSpace(false));
  }
};

const getRemoteSpace = async ({ id }) => async dispatch => {
  try {
    dispatch(flagGettingSpace(true));

    const url = generateGetSpaceEndpoint(id);
    const response = await fetch(url, DEFAULT_GET_REQUEST);

    // throws if it is an error
    await isErrorResponse(response);

    const remoteSpace = await response.json();
    let localSpace = {};

    // try to merge with local space if available
    try {
      window.ipcRenderer.send(GET_SPACE_CHANNEL, { id });
      localSpace = await waitForSpace({ online: true });
    } catch (localError) {
      // ignore error
    }

    // in the future we could probably try to deep merge
    const space = {
      ...remoteSpace,
      ...localSpace,
    };

    dispatch({
      type: GET_SPACE_SUCCEEDED,
      payload: space,
    });
  } catch (err) {
    toastr.error('Error', ERROR_GETTING_SPACE_MESSAGE);
  } finally {
    dispatch(flagGettingSpace(false));
  }
};

const getSpaces = () => dispatch => {
  dispatch(flagGettingSpaces(true));
  window.ipcRenderer.send(GET_SPACES_CHANNEL);
  // create listener
  window.ipcRenderer.once(GET_SPACES_CHANNEL, (event, spaces) => {
    // dispatch that the getter has succeeded
    dispatch({
      type: GET_SPACES,
      payload: spaces,
    });
    dispatch(flagGettingSpaces(false));
  });
};

const saveSpace = async ({ space }) => async dispatch => {
  try {
    dispatch(flagSavingSpace(true));

    // tell electron to get space
    window.ipcRenderer.send(SAVE_SPACE_CHANNEL, { space });

    // create listener
    window.ipcRenderer.once(SAVE_SPACE_CHANNEL, async (event, response) => {
      // if there is no response, show error
      if (!response) {
        return toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_SPACE_MESSAGE);
      }

      switch (response) {
        case ERROR_SPACE_ALREADY_AVAILABLE:
          return toastr.error(
            ERROR_MESSAGE_HEADER,
            ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE
          );

        case ERROR_DOWNLOADING_FILE:
          return toastr.error(ERROR_MESSAGE_HEADER, ERROR_DOWNLOADING_MESSAGE);

        // todo: check that it is actually a space before dispatching success
        default:
          toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_SAVING_MESSAGE);
          return dispatch({
            type: SAVE_SPACE_SUCCEEDED,
            payload: response,
          });
      }
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_SPACE_MESSAGE);
  } finally {
    dispatch(flagSavingSpace(false));
  }
};

const clearSpace = () => dispatch => {
  dispatch(clearPhase());
  return dispatch({
    type: CLEAR_SPACE,
  });
};

const exportSpace = (id, spaces, spaceName) => dispatch => {
  window.ipcRenderer.send(SHOW_EXPORT_SPACE_PROMPT_CHANNEL, spaceName);
  window.ipcRenderer.once(
    RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
    (event, archivePath) => {
      dispatch(flagExportingSpace(true));
      if (archivePath) {
        window.ipcRenderer.send(EXPORT_SPACE_CHANNEL, {
          archivePath,
          id,
          spaces,
        });
      } else {
        dispatch(flagExportingSpace(false));
      }
    }
  );
  window.ipcRenderer.once(EXPORTED_SPACE_CHANNEL, (event, response) => {
    if (response === ERROR_GENERAL) {
      toastr.error('Error', ERROR_EXPORTING_MESSAGE);
    } else {
      toastr.success('Success', SUCCESS_EXPORTING_MESSAGE);
    }
    dispatch(flagExportingSpace(false));
  });
};

const deleteSpace = ({ id }) => dispatch => {
  // show confirmation prompt
  window.ipcRenderer.send(SHOW_DELETE_SPACE_PROMPT_CHANNEL);
  window.ipcRenderer.once(
    RESPOND_DELETE_SPACE_PROMPT_CHANNEL,
    (event, response) => {
      if (response === 1) {
        dispatch(flagDeletingSpace(true));
        window.ipcRenderer.send(DELETE_SPACE_CHANNEL, { id });
      }
    }
  );
  window.ipcRenderer.once(DELETED_SPACE_CHANNEL, (event, response) => {
    if (response === ERROR_GENERAL) {
      toastr.error('Error', ERROR_DELETING_MESSAGE);
    } else {
      toastr.success('Success', SUCCESS_DELETING_MESSAGE);
      dispatch({
        type: DELETE_SPACE_SUCCESS,
        payload: true,
      });
    }
    dispatch(flagDeletingSpace(false));
  });
};

const loadSpace = ({ fileLocation }) => dispatch => {
  dispatch(flagLoadingSpace(true));
  window.ipcRenderer.send(LOAD_SPACE_CHANNEL, { fileLocation });
  window.ipcRenderer.once(LOADED_SPACE_CHANNEL, (event, newSpaces) => {
    switch (newSpaces) {
      case ERROR_ZIP_CORRUPTED:
        toastr.error('Error', ERROR_ZIP_CORRUPTED_MESSAGE);
        break;
      case ERROR_JSON_CORRUPTED:
        toastr.error('Error', ERROR_JSON_CORRUPTED_MESSAGE);
        break;
      case ERROR_SPACE_ALREADY_AVAILABLE:
        toastr.error('Error', ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE);
        break;
      default:
        toastr.success('Success', SUCCESS_SPACE_LOADED_MESSAGE);
        dispatch({
          type: GET_SPACES,
          payload: newSpaces,
        });
    }
    dispatch(flagLoadingSpace(false));
  });
};

const getSpace = ({ id }) => dispatch => {
  if (window.navigator.onLine) {
    dispatch(getRemoteSpace({ id }));
  } else {
    dispatch(getLocalSpace({ id }));
  }
};

export {
  loadSpace,
  clearSpace,
  deleteSpace,
  exportSpace,
  getRemoteSpace,
  getLocalSpace,
  getSpaces,
  getSpace,
  saveSpace,
};
