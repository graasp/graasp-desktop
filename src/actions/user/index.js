import { toastr } from 'react-redux-toastr';
import { getCurrentPosition } from '../../utils/geolocation';
import {
  GET_GEOLOCATION_SUCCEEDED,
  GET_USER_FOLDER_SUCCEEDED,
  FLAG_GETTING_USER_FOLDER,
} from '../../types';
import {
  ERROR_GETTING_GEOLOCATION,
  ERROR_GETTING_USER_FOLDER,
  ERROR_MESSAGE_HEADER,
} from '../../config/messages';
import { GET_USER_FOLDER_CHANNEL } from '../../config/channels';
import { createFlag } from '../common';
import { ERROR_GENERAL } from '../../config/errors';

const flagGettingUserFolder = createFlag(FLAG_GETTING_USER_FOLDER);

const getGeolocation = async () => async dispatch => {
  // only fetch location if online
  if (window.navigator.onLine) {
    try {
      const geolocation = await getCurrentPosition();
      const payload = {
        coords: {
          accuracy: geolocation.coords.accuracy,
          altitude: geolocation.coords.altitude,
          altitudeAccuracy: geolocation.coords.altitudeAccuracy,
          heading: geolocation.coords.heading,
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude,
          speed: geolocation.coords.speed,
        },
        timestamp: geolocation.timestamp,
      };
      dispatch({
        type: GET_GEOLOCATION_SUCCEEDED,
        payload,
      });
    } catch (e) {
      console.error(e);
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_GEOLOCATION);
    }
  }
};

const getUserFolder = async () => dispatch => {
  try {
    dispatch(flagGettingUserFolder(true));
    window.ipcRenderer.send(GET_USER_FOLDER_CHANNEL);
    window.ipcRenderer.once(GET_USER_FOLDER_CHANNEL, (event, folder) => {
      if (folder === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_USER_FOLDER);
      } else {
        dispatch({
          type: GET_USER_FOLDER_SUCCEEDED,
          payload: folder,
        });
      }
      dispatch(flagGettingUserFolder(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_USER_FOLDER);
  }
};

export { getUserFolder, getGeolocation };
