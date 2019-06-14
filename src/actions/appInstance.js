import _ from 'lodash';
import {
  GET_APP_INSTANCE_CHANNEL,
  PATCH_APP_INSTANCE_CHANNEL,
} from '../config/channels';
import {
  GET_APP_INSTANCE_SUCCEEDED,
  PATCH_APP_INSTANCE_SUCCEEDED,
} from '../types';

const getAppInstance = async (
  { id, spaceId, subSpaceId } = {},
  callback
) => async (dispatch, getState) => {
  try {
    // first check to see if app instance is available in the redux store
    const { Phase } = getState();
    const items = Phase.getIn(['current', 'content', 'items']);
    const item = items && _.find(items, ['id', id]);
    if (item && item.appInstance) {
      callback({
        type: GET_APP_INSTANCE_SUCCEEDED,
        payload: item.appInstance,
      });
    } else {
      window.ipcRenderer.send(GET_APP_INSTANCE_CHANNEL, {
        id,
        spaceId,
        subSpaceId,
      });

      window.ipcRenderer.once(
        GET_APP_INSTANCE_CHANNEL,
        async (event, response) => {
          callback({
            type: GET_APP_INSTANCE_SUCCEEDED,
            payload: response,
          });
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

// todo: currently we do not need this as there is no way of configuring apps yet
const patchAppInstance = async (
  { id, data, spaceId, subSpaceId } = {},
  callback
) => {
  try {
    window.ipcRenderer.send(PATCH_APP_INSTANCE_CHANNEL, {
      id,
      data,
      spaceId,
      subSpaceId,
    });

    window.ipcRenderer.once(
      PATCH_APP_INSTANCE_CHANNEL,
      async (event, response) => {
        callback({
          type: PATCH_APP_INSTANCE_SUCCEEDED,
          payload: response,
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export { getAppInstance, patchAppInstance };
