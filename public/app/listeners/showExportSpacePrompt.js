// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_EXPORT_SPACE_PROMPT_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const showExportSpacePrompt = mainWindow => (event, spaceTitle) => {
  logger.debug('showing export space prompt');
  const options = {
    title: 'Save As',
    defaultPath: `${spaceTitle}.zip`,
  };
  dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
    mainWindow.webContents.send(RESPOND_EXPORT_SPACE_PROMPT_CHANNEL, filePath);
  });
};

module.exports = showExportSpacePrompt;
