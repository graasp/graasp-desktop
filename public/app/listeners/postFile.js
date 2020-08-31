const fs = require('fs');
const { POST_FILE_CHANNEL } = require('../config/channels');
const { buildFilesPath } = require('../config/config');
const { ensureDirectoryExistence } = require('../utilities');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const postFile = mainWindow => (event, payload = {}) => {
  try {
    const { userId, spaceId, data } = payload;

    // download file given path
    const { path, name } = data;

    const savePath = buildFilesPath({ userId, spaceId, name });
    ensureDirectoryExistence(savePath);
    fs.copyFile(path, savePath, err => {
      if (err) {
        throw err;
      }
      logger.debug(`the file ${name} was uploaded`);
    });

    // update data
    const newData = { name, uri: `file://${savePath}` };
    const newPayload = { ...payload, data: newData };

    // send back the resource
    mainWindow.webContents.send(POST_FILE_CHANNEL, newPayload);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(POST_FILE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = postFile;
