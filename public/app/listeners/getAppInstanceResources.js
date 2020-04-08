const { GET_APP_INSTANCE_RESOURCES_CHANNEL } = require('../config/channels');
const { APP_INSTANCE_RESOURCES_COLLECTION } = require('../db');

const getAppInstanceResources = (mainWindow, db) => (event, data = {}) => {
  const defaultResponse = [];
  const { userId, appInstanceId, type } = data;
  try {
    const appInstanceResourcesHandle = db
      .get(APP_INSTANCE_RESOURCES_COLLECTION)
      .filter({ appInstance: appInstanceId });

    // only filter by type if provided
    if (type) {
      appInstanceResourcesHandle.filter({ type });
    }

    // only filter by user if provided
    if (userId) {
      appInstanceResourcesHandle.filter({ user: userId });
    }

    const appInstanceResources = appInstanceResourcesHandle.value();

    const response = appInstanceResources || defaultResponse;

    // response is sent back to channel specific for this app instance
    mainWindow.webContents.send(
      `${GET_APP_INSTANCE_RESOURCES_CHANNEL}_${appInstanceId}`,
      {
        appInstanceId,
        payload: response,
      }
    );
  } catch (e) {
    console.error(e);
    // error is sent back to channel specific for this app instance
    mainWindow.webContents.send(
      `${GET_APP_INSTANCE_RESOURCES_CHANNEL}_${appInstanceId}`,
      {
        appInstanceId,
        payload: defaultResponse,
      }
    );
  }
};

module.exports = getAppInstanceResources;
