import { toastr } from 'react-redux-toastr';
import {
  GET_SPACES,
  FLAG_GETTING_SPACE,
  FLAG_GETTING_SPACES,
  CLEAR_SPACE,
  GET_SPACE_SUCCEEDED,
  FLAG_DELETING_SPACE,
  DELETE_SPACE_SUCCESS,
  FLAG_SAVING_SPACE,
  SAVE_SPACE_SUCCEEDED,
  FLAG_GETTING_SPACES_NEARBY,
  GET_SPACES_NEARBY_SUCCEEDED,
  FLAG_CLEARING_USER_INPUT,
  SET_SPACE_SEARCH_QUERY_SUCCEEDED,
} from '../types';
import {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
  ERROR_DOWNLOADING_FILE,
} from '../config/errors';
import { clearPhase } from './phase';
import {
  DELETE_SPACE_CHANNEL,
  DELETED_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
  SHOW_DELETE_SPACE_PROMPT_CHANNEL,
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL,
  SAVE_SPACE_CHANNEL,
  CLEAR_USER_INPUT_CHANNEL,
  CLEARED_USER_INPUT_CHANNEL,
  RESPOND_CLEAR_USER_INPUT_PROMPT_CHANNEL,
  SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL,
} from '../config/channels';
import {
  // ERROR_DOWNLOADING_MESSAGE,
  ERROR_DELETING_MESSAGE,
  ERROR_DOWNLOADING_MESSAGE,
  ERROR_GETTING_SPACE_MESSAGE,
  ERROR_GETTING_SPACES_NEARBY,
  ERROR_MESSAGE_HEADER,
  ERROR_SAVING_SPACE_MESSAGE,
  ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE,
  SUCCESS_DELETING_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
  SUCCESS_SAVING_MESSAGE,
  ERROR_CLEARING_USER_INPUT_MESSAGE,
  SUCCESS_CLEARING_USER_INPUT_MESSAGE,
} from '../config/messages';
import { createFlag, isErrorResponse } from './common';
import {
  generateGetSpaceEndpoint,
  GET_SPACES_NEARBY_ENDPOINT,
} from '../config/endpoints';
import { DEFAULT_GET_REQUEST } from '../config/rest';
import { DEFAULT_RADIUS } from '../config/constants';
import { setSpaceAsFavorite, setSpaceAsRecent } from './user';

const flagGettingSpaces = createFlag(FLAG_GETTING_SPACES);
const flagDeletingSpace = createFlag(FLAG_DELETING_SPACE);
const flagSavingSpace = createFlag(FLAG_SAVING_SPACE);
const flagGettingSpacesNearby = createFlag(FLAG_GETTING_SPACES_NEARBY);
const flagClearingUserInput = createFlag(FLAG_CLEARING_USER_INPUT);
/**
 * helper function to wrap a listener to the get space channel around a promise
 * @param {Boolean} online
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

const createGetLocalSpace = async (
  { id },
  type,
  flagType,
  showError = true
) => async dispatch => {
  const flagGettingSpace = createFlag(flagType);
  try {
    dispatch(flagGettingSpace(true));

    // tell electron to get space
    window.ipcRenderer.send(GET_SPACE_CHANNEL, { id });

    const space = await waitForSpace({ online: false });

    dispatch({
      type,
      payload: space,
    });
  } catch (err) {
    if (showError) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SPACE_MESSAGE);
    }
  } finally {
    dispatch(flagGettingSpace(false));
  }
};

const getLocalSpace = payload =>
  createGetLocalSpace(payload, GET_SPACE_SUCCEEDED, FLAG_GETTING_SPACE);

const createGetRemoteSpace = async (
  { id },
  type,
  flagType
) => async dispatch => {
  const flagGettingSpace = createFlag(flagType);
  try {
    dispatch(flagGettingSpace(true));

    const url = generateGetSpaceEndpoint(id);
    const response = await fetch(url, DEFAULT_GET_REQUEST);

    // throws if it is an error
    await isErrorResponse(response);

    const remoteSpace = await response.json();

    // in the future we might want to merge local and remote spaces
    // let localSpace = {};

    // // try to merge with local space if available
    // try {
    //   window.ipcRenderer.send(GET_SPACE_CHANNEL, { id });
    //   localSpace = await waitForSpace({ online: true });
    // } catch (localError) {
    //   // ignore error
    // }

    // in the future we could probably try to deep merge
    // const space = {
    //   ...remoteSpace,
    //   ...localSpace,
    // };

    dispatch({
      type,
      payload: remoteSpace,
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SPACE_MESSAGE);
  } finally {
    dispatch(flagGettingSpace(false));
  }
};

const getRemoteSpace = payload =>
  createGetRemoteSpace(payload, GET_SPACE_SUCCEEDED, FLAG_GETTING_SPACE);

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
        dispatch(flagSavingSpace(false));
        return toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_SPACE_MESSAGE);
      }

      switch (response) {
        case ERROR_SPACE_ALREADY_AVAILABLE:
          toastr.error(
            ERROR_MESSAGE_HEADER,
            ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE
          );
          break;

        case ERROR_DOWNLOADING_FILE:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_DOWNLOADING_MESSAGE);
          break;

        // todo: check that it is actually a space before dispatching success
        default:
          toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_SAVING_MESSAGE);
          dispatch({
            type: SAVE_SPACE_SUCCEEDED,
            payload: response,
          });
      }
      return dispatch(flagSavingSpace(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_SPACE_MESSAGE);
    dispatch(flagSavingSpace(false));
  }
};

const clearSpace = () => dispatch => {
  dispatch(clearPhase());
  return dispatch({
    type: CLEAR_SPACE,
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
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_MESSAGE);
    } else {
      // update saved spaces in state
      dispatch(getSpaces());

      toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_DELETING_MESSAGE);
      dispatch({
        type: DELETE_SPACE_SUCCESS,
        payload: true,
      });
    }

    // delete in favorite
    setSpaceAsFavorite({ favorite: false, spaceId: id })(dispatch);

    // delete in recent
    setSpaceAsRecent({ recent: false, spaceId: id })(dispatch);

    dispatch(flagDeletingSpace(false));
  });
};

const clearUserInput = async ({ spaceId, userId }) => async dispatch => {
  try {
    // show confirmation prompt
    window.ipcRenderer.send(SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL);

    // listen for response from prompt
    window.ipcRenderer.once(
      RESPOND_CLEAR_USER_INPUT_PROMPT_CHANNEL,
      (event, response) => {
        if (response === 1) {
          dispatch(flagClearingUserInput(true));
          window.ipcRenderer.send(CLEAR_USER_INPUT_CHANNEL, {
            spaceId,
            userId,
          });
        }
      }
    );

    // listen for response from backend
    window.ipcRenderer.once(CLEARED_USER_INPUT_CHANNEL, (event, response) => {
      if (response === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_CLEARING_USER_INPUT_MESSAGE);
      } else {
        toastr.success(
          SUCCESS_MESSAGE_HEADER,
          SUCCESS_CLEARING_USER_INPUT_MESSAGE
        );
        dispatch({
          type: GET_SPACE_SUCCEEDED,
          payload: response,
        });
      }
      dispatch(flagClearingUserInput(false));
    });
  } catch (err) {
    dispatch(flagClearingUserInput(false));
  }
};

const getSpace = ({ id, saved = false, user }) => dispatch => {
  // only get the space from the api if not saved
  if (!saved) {
    dispatch(getRemoteSpace({ id }));
  } else {
    dispatch(getLocalSpace({ id, user }));
  }
};

const getSpacesNearby = async ({
  latitude,
  longitude,
  radius = DEFAULT_RADIUS,
}) => async dispatch => {
  try {
    dispatch(flagGettingSpacesNearby(true));

    const url = `${GET_SPACES_NEARBY_ENDPOINT}?lat=${latitude}&lon=${longitude}&radius=${radius}`;
    const response = await fetch(url, DEFAULT_GET_REQUEST);

    // throws if it is an error
    await isErrorResponse(response);

    const spaces = await response.json();

    dispatch({
      type: GET_SPACES_NEARBY_SUCCEEDED,
      payload: spaces,
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SPACES_NEARBY);
  } finally {
    dispatch(flagGettingSpacesNearby(false));
  }
};

const setSearchQuery = async payload => async dispatch => {
  dispatch({
    type: SET_SPACE_SEARCH_QUERY_SUCCEEDED,
    payload,
  });
};

export {
  clearSpace,
  deleteSpace,
  getRemoteSpace,
  getLocalSpace,
  getSpaces,
  getSpace,
  saveSpace,
  getSpacesNearby,
  clearUserInput,
  createGetLocalSpace,
  createGetRemoteSpace,
  setSearchQuery,
};
