const fs = require('fs');
const rimraf = require('rimraf');
const logger = require('../logger');
const { createSpaceDirectory } = require('../utilities');
const { SPACES_COLLECTION } = require('../db');
const {
  SYNCED_SPACE_CHANNEL,
  SYNC_SPACE_CHANNEL,
} = require('../config/channels');
const { DEFAULT_LANG, VAR_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');
const { downloadSpaceResources } = require('../download');

// use promisified fs
const fsPromises = fs.promises;

const syncSpace = (mainWindow, db) => async (event, { remoteSpace }) => {
  logger.debug('syncing space');

  try {
    const { id } = remoteSpace;
    // get handle to spaces collection
    const spaces = db.get(SPACES_COLLECTION);
    const { language } = remoteSpace;
    const localSpace = spaces.find({ id }).value();

    // fail if local space is no longer available
    if (!localSpace) {
      return mainWindow.webContents.send(SYNC_SPACE_CHANNEL, ERROR_GENERAL);
    }

    const absoluteSpacePath = `${VAR_FOLDER}/${id}`;
    const tmpPath = createSpaceDirectory({ id, tmp: true });

    // use language defined in space otherwise fall back on
    // user language, otherwise fall back on the global default
    const userLang = db.get('user.settings.lang').value();
    const lang = language || userLang || DEFAULT_LANG;

    const spaceToSave = await downloadSpaceResources({
      lang,
      space: remoteSpace,
      absoluteSpacePath: tmpPath,
    });

    // delete previous space contents
    spaces.remove({ id }).write();
    rimraf.sync(absoluteSpacePath);

    // rename the temporary path as the final one
    await fsPromises.rename(tmpPath, absoluteSpacePath);

    // mark space as saved
    spaceToSave.saved = true;
    spaces.push(spaceToSave).write();

    return mainWindow.webContents.send(SYNCED_SPACE_CHANNEL, spaceToSave);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SYNCED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = syncSpace;
