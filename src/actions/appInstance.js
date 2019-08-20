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
    // first check to see if items are available in the content
    // of the phase that is currently in the redux store
    const { Phase } = getState();
    const items = Phase.getIn(['current', 'content', 'items']) || [];

    // only consider items that have app instances
    const appInstances = items
      .filter(item => item.appInstance)
      .map(item => item.appInstance);

    // find the app instance with this id
    const appInstance = _.find(appInstances, ['id', id]);

    if (appInstance) {
      callback({
        appInstanceId: id,
        type: GET_APP_INSTANCE_SUCCEEDED,
        payload: appInstance,
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
            appInstanceId: id,
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
