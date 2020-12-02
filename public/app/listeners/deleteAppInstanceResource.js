const { DELETE_APP_INSTANCE_RESOURCE_CHANNEL } = require('../config/channels');
const { APP_INSTANCE_RESOURCES_COLLECTION } = require('../db');

const deleteAppInstanceResource = (mainWindow, db) => (event, payload = {}) => {
  try {
    const { appInstanceId: appInstance, id } = payload;

    db.get(APP_INSTANCE_RESOURCES_COLLECTION)
      .remove({ appInstance, id })
      .write();

    mainWindow.webContents.send(DELETE_APP_INSTANCE_RESOURCE_CHANNEL, payload);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(DELETE_APP_INSTANCE_RESOURCE_CHANNEL, null);
  }
};

module.exports = deleteAppInstanceResource;
