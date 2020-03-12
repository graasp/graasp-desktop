const ObjectId = require('bson-objectid');
const { POST_APP_INSTANCE_RESOURCE_CHANNEL } = require('../config/channels');

const postAppInstanceResource = (mainWindow, db) => async (
  event,
  payload = {}
) => {
  try {
    const {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
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
      createdAt: now,
      updatedAt: now,
      data,
      format,
      type,
      visibility,
      user: userId,
      id: ObjectId().str,
    };

    // tools live on the parent
    const tool = spaceId === subSpaceId;

    // write the resource to the database
    // if not a tool, we need to go one step further into the phase
    if (!tool) {
      db.get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .push(resourceToWrite)
        .write();
    } else {
      db.get('spaces')
        .find({ id: spaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .push(resourceToWrite)
        .write();
    }

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
