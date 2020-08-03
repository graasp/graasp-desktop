import { POST_ACTION_SUCCEEDED } from '../types';
import { POST_ACTION_CHANNEL } from '../config/channels';
import {
  DEFAULT_ACTIONS_AS_ENABLED,
  DEFAULT_GEOLOCATION_ENABLED,
} from '../config/constants';

const postAction = async (
  {
    userId: actionUserId,
    appInstanceId,
    spaceId,
    subSpaceId,
    format,
    data,
    verb,
    visibility,
  } = {},
  user,
  callback
) => () => {
  try {
    const mutableUser = user.toJS();
    const {
      id,
      settings: {
        actionsEnabled = DEFAULT_ACTIONS_AS_ENABLED,
        geolocationEnabled = DEFAULT_GEOLOCATION_ENABLED,
      },
      geolocation,
    } = mutableUser;

    if (actionsEnabled) {
      // get user id
      let userId = actionUserId;
      if (!actionUserId) {
        userId = id;
      }

      // add geolocation to action if enabled
      let geolocationLatLong = null;
      if (geolocationEnabled) {
        const { latitude, longitude } = geolocation;
        geolocationLatLong = { ll: [latitude, longitude] };
      }

      window.ipcRenderer.send(POST_ACTION_CHANNEL, {
        userId,
        appInstanceId,
        spaceId,
        subSpaceId,
        format,
        data,
        verb,
        geolocation: geolocationLatLong,
        visibility,
      });

      // if action from app, wait in app channel
      if (appInstanceId) {
        window.ipcRenderer.once(
          `${POST_ACTION_CHANNEL}_${appInstanceId}`,
          async (event, response) => {
            callback({
              // have to include the appInstanceId to avoid broadcasting
              appInstanceId,
              type: POST_ACTION_SUCCEEDED,
              payload: response,
            });
          }
        );
      }
    }
  } catch (err) {
    // do nothing
  }
};

// eslint-disable-next-line import/prefer-default-export
export { postAction };
