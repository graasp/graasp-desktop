const fse = require('fs-extra');
const path = require('path');
const { POST_FILE_CHANNEL } = require('../config/channels');
const { buildFilePath } = require('../config/config');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const postFile = mainWindow => (event, payload = {}) => {
  const { userId, spaceId, data } = payload;
  // download file given path
  const { path: filepath, name } = data;
  const savePath = buildFilePath({ userId, spaceId, name });
  const dirPath = path.dirname(savePath);
  try {
    fse.ensureDirSync(dirPath);
    fse.copySync(filepath, path.resolve(savePath));
    logger.debug(`the file ${name} was uploaded`);

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
