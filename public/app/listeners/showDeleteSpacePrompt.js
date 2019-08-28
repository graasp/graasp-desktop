// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_DELETE_SPACE_PROMPT_CHANNEL } = require('../config/channels');

const showDeleteSpacePrompt = mainWindow => () => {
  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0,
    message: 'Are you sure you want to delete this space?',
  };
  dialog.showMessageBox(mainWindow, options, respond => {
    mainWindow.webContents.send(RESPOND_DELETE_SPACE_PROMPT_CHANNEL, respond);
  });
};

module.exports = showDeleteSpacePrompt;
