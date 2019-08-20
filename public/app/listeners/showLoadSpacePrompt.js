// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_LOAD_SPACE_PROMPT_CHANNEL } = require('../config/channels');

const showLoadSpacePrompt = mainWindow => (event, options) => {
  dialog.showOpenDialog(null, options, filePaths => {
    mainWindow.webContents.send(RESPOND_LOAD_SPACE_PROMPT_CHANNEL, filePaths);
  });
};

module.exports = showLoadSpacePrompt;
