const { GET_APP_INSTANCE_CHANNEL } = require('../config/channels');

const getAppInstance = (mainWindow, db) => (event, payload = {}) => {
  try {
    const { spaceId, subSpaceId, id } = payload;

    let appInstance;

    // tools live on the parent
    const tool = spaceId === subSpaceId;

    // if not a tool, we need to go one step further into the phase
    if (!tool) {
      appInstance = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter((item) => item.appInstance)
        .map((item) => item.appInstance)
        .find({ id })
        .value();
    } else {
      appInstance = db
        .get('spaces')
        .find({ id: spaceId })
        .get('items')
        .filter((item) => item.appInstance)
        .map((item) => item.appInstance)
        .find({ id })
        .value();
    }

    mainWindow.webContents.send(GET_APP_INSTANCE_CHANNEL, appInstance);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(GET_APP_INSTANCE_CHANNEL, null);
  }
};

module.exports = getAppInstance;
