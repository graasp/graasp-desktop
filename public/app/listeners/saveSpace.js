const isOnline = require('is-online');
const { SAVE_SPACE_CHANNEL } = require('../config/channels');
const {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_DOWNLOADING_FILE,
} = require('../config/errors');
const logger = require('../logger');
const { DEFAULT_LANG } = require('../config/config');
const { createSpaceDirectory } = require('../utilities');
const { downloadSpaceResources } = require('../download');
const { SPACES_COLLECTION } = require('../db');

const saveSpace = (mainWindow, db) => async (event, { space }) => {
  logger.debug('saving space');

  try {
    // get handle to spaces collection
    const spaces = db.get(SPACES_COLLECTION);
    const { id, language } = space;
    const existingSpace = spaces.find({ id }).value();

    if (existingSpace) {
      return mainWindow.webContents.send(
        SAVE_SPACE_CHANNEL,
        ERROR_SPACE_ALREADY_AVAILABLE
      );
    }

    // only download if connection is available
    const isConnected = await isOnline();
    if (!isConnected) {
      return mainWindow.webContents.send(
        SAVE_SPACE_CHANNEL,
        ERROR_DOWNLOADING_FILE
      );
    }

    // create directory where resources will be stored
    const absoluteSpacePath = createSpaceDirectory({ id });

    // use language defined in space otherwise fall back on
    // user language, otherwise fall back on the global default
    const userLang = db.get('user.lang').value();
    const lang = language || userLang || DEFAULT_LANG;

    const spaceToSave = await downloadSpaceResources({
      lang,
      space,
      absoluteSpacePath,
    });

    // mark space as saved
    spaceToSave.saved = true;
    spaces.push(spaceToSave).write();
    return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, spaceToSave);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, null);
  }
};

module.exports = saveSpace;
