const { GET_APP_INSTANCE_RESOURCES_CHANNEL } = require('../config/channels');

const getAppInstanceResources = (mainWindow, db) => async (
  event,
  data = {}
) => {
  const defaultResponse = [];
  const { userId, appInstanceId, spaceId, subSpaceId, type } = data;
  try {
    // tools live on the parent
    const tool = spaceId === subSpaceId;

    let appInstanceResourcesHandle;

    // if not a tool, we need to go one step further into the phase
    if (!tool) {
      appInstanceResourcesHandle = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources');
    } else {
      appInstanceResourcesHandle = db
        .get('spaces')
        .find({ id: spaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources');
    }

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
