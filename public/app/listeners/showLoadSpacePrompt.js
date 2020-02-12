// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_LOAD_SPACE_PROMPT_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const showLoadSpacePrompt = mainWindow => (event, options) => {
  logger.debug('showing load space prompt');
  dialog.showOpenDialog(mainWindow, options).then(({ filePaths }) => {
    mainWindow.webContents.send(RESPOND_LOAD_SPACE_PROMPT_CHANNEL, filePaths);
  });
};

module.exports = showLoadSpacePrompt;
