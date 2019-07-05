// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_EXPORT_SPACE_PROMPT_CHANNEL } = require('../config/channels');

const showExportSpace = mainWindow => (event, spaceTitle) => {
  const options = {
    title: 'Save As',
    defaultPath: `${spaceTitle}.zip`,
  };
  dialog.showSaveDialog(null, options, filePath => {
    mainWindow.webContents.send(RESPOND_EXPORT_SPACE_PROMPT_CHANNEL, filePath);
  });
};

module.exports = showExportSpace;
