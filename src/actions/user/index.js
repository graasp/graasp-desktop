import { toastr } from 'react-redux-toastr';
import { getCurrentPosition } from '../../utils/geolocation';
import { GET_GEOLOCATION_SUCCEEDED } from '../../types';
import {
  ERROR_GETTING_GEOLOCATION,
  ERROR_MESSAGE_HEADER,
} from '../../config/messages';

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

export {
  // eslint-disable-next-line import/prefer-default-export
  getGeolocation,
};
