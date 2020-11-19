import {
  GET_APP_INSTANCE_RESOURCES_CHANNEL,
  PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
  POST_APP_INSTANCE_RESOURCE_CHANNEL,
  DELETE_APP_INSTANCE_RESOURCE_CHANNEL,
} from '../config/channels';
import {
  GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
  PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
  DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
} from '../types';

const getAppInstanceResources = async (
  { userId, appInstanceId, spaceId, subSpaceId, type } = {},
  callback
) => {
  try {
    // send a message to the generic channel
    window.ipcRenderer.send(GET_APP_INSTANCE_RESOURCES_CHANNEL, {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      type,
    });

    // set a listener to a channel specific for this app instance
    window.ipcRenderer.once(
      `${GET_APP_INSTANCE_RESOURCES_CHANNEL}_${appInstanceId}`,
      async (event, response) => {
        const { payload, appInstanceId: responseAppInstanceId } = response;
        callback({
          payload,
          // have to include the appInstanceId to avoid broadcasting
          appInstanceId: responseAppInstanceId,
          type: GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
        });
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
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
          // have to include the appInstanceId to avoid broadcasting
          appInstanceId,
          type: POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
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
          appInstanceId,
          type: PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const deleteAppInstanceResource = async (
  { id, data, appInstanceId, spaceId, subSpaceId, type } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(DELETE_APP_INSTANCE_RESOURCE_CHANNEL, {
      id,
      data,
      appInstanceId,
      spaceId,
      subSpaceId,
      type,
    });

    window.ipcRenderer.once(
      DELETE_APP_INSTANCE_RESOURCE_CHANNEL,
      async (event, response) => {
        callback({
          appInstanceId,
          type: DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export {
  getAppInstanceResources,
  postAppInstanceResource,
  patchAppInstanceResource,
  deleteAppInstanceResource,
};
