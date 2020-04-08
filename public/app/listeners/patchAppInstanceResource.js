const { PATCH_APP_INSTANCE_RESOURCE_CHANNEL } = require('../config/channels');
const { APP_INSTANCE_RESOURCES_COLLECTION } = require('../db');

const patchAppInstanceResource = (mainWindow, db) => (event, payload = {}) => {
  try {
    const { appInstanceId: appInstance, data, id } = payload;
    const now = new Date();
    const fieldsToUpdate = {
      updatedAt: now,
      data,
    };

    const resource = db
      .get(APP_INSTANCE_RESOURCES_COLLECTION)
      .find({ appInstance, id })
      .assign(fieldsToUpdate)
      .value();

    db.write();
    mainWindow.webContents.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, resource);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, null);
  }
};

module.exports = patchAppInstanceResource;
