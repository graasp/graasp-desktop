import {
  GET_APP_INSTANCE_RESOURCES_CHANNEL,
  PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
  POST_APP_INSTANCE_RESOURCE_CHANNEL,
} from '../config/channels';
import {
  GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
  PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
} from '../types';

const getAppInstanceResources = async (
  { userId, appInstanceId, spaceId, subSpaceId, type } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(GET_APP_INSTANCE_RESOURCES_CHANNEL, {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      type,
    });

    window.ipcRenderer.once(
      GET_APP_INSTANCE_RESOURCES_CHANNEL,
      async (event, response) => {
        callback({
          type: GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const postAppInstanceResource = async (
  { userId, appInstanceId, spaceId, subSpaceId, format, type, data } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(POST_APP_INSTANCE_RESOURCE_CHANNEL, {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      format,
      type,
      data,
    });

    window.ipcRenderer.once(
      POST_APP_INSTANCE_RESOURCE_CHANNEL,
      async (event, response) => {
        callback({
          type: POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const patchAppInstanceResource = async (
  { id, data, appInstanceId, spaceId, subSpaceId } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, {
      id,
      data,
      appInstanceId,
      spaceId,
      subSpaceId,
    });

    window.ipcRenderer.once(
      PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
      async (event, response) => {
        callback({
          type: PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export {
  getAppInstanceResources,
  postAppInstanceResource,
  patchAppInstanceResource,
};
