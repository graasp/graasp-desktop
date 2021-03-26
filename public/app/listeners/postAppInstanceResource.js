const ObjectId = require('bson-objectid');
const { POST_APP_INSTANCE_RESOURCE_CHANNEL } = require('../config/channels');
const { APP_INSTANCE_RESOURCES_COLLECTION } = require('../db');

const postAppInstanceResource = (mainWindow, db) => (event, payload = {}) => {
  try {
    const {
      userId,
      appInstanceId,
      spaceId,
      format,
      type,
      data,
      visibility = 'private',
    } = payload;

    // prepare the timestamp
    const now = new Date();

    // prepare the resource that we will create
    const resourceToWrite = {
      appInstance: appInstanceId,
      spaceId,
      createdAt: now,
      updatedAt: now,
      data,
      format,
      type,
      visibility,
      user: userId,
      id: ObjectId().toHexString(),
    };

    // write the resource to the database
    db.get(APP_INSTANCE_RESOURCES_COLLECTION).push(resourceToWrite).write();

    // send back the resource
    mainWindow.webContents.send(
      POST_APP_INSTANCE_RESOURCE_CHANNEL,
      resourceToWrite
    );
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(POST_APP_INSTANCE_RESOURCE_CHANNEL, null);
  }
};

module.exports = postAppInstanceResource;
