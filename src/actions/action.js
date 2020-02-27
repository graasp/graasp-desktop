import { POST_ACTION_SUCCEEDED } from '../types';
import { POST_ACTION_CHANNEL } from '../config/channels';

const postAction = async (
  {
    userId,
    id: appInstanceId,
    spaceId,
    subSpaceId,
    format,
    data,
    verb,
    geolocation,
    visibility,
  } = {},
  callback
) => () => {
  try {
    window.ipcRenderer.send(POST_ACTION_CHANNEL, {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      format,
      data,
      verb,
      geolocation,
      visibility,
    });

    window.ipcRenderer.once(POST_ACTION_CHANNEL, async (event, response) => {
      callback({
        // have to include the appInstanceId to avoid broadcasting
        appInstanceId,
        type: POST_ACTION_SUCCEEDED,
        payload: response,
      });
    });
  } catch (err) {
    // do nothing
  }
};

// eslint-disable-next-line import/prefer-default-export
export { postAction };
