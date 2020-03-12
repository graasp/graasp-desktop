const { PATCH_APP_INSTANCE_RESOURCE_CHANNEL } = require('../config/channels');

const patchAppInstanceResource = (mainWindow, db) => async (
  event,
  payload = {}
) => {
  try {
    const { appInstanceId, spaceId, subSpaceId, data, id } = payload;
    const now = new Date();
    const fieldsToUpdate = {
      updatedAt: now,
      data,
    };

    let resource;

    // tools live on the parent
    const tool = spaceId === subSpaceId;

    // if not a tool, we need to go one step further into the phase
    if (!tool) {
      resource = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .find({ id })
        .assign(fieldsToUpdate)
        .value();
    } else {
      resource = db
        .get('spaces')
        .find({ id: spaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .find({ id })
        .assign(fieldsToUpdate)
        .value();
    }

    db.write();
    mainWindow.webContents.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, resource);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, null);
  }
};

module.exports = patchAppInstanceResource;
