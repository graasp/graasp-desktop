// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { RESPOND_DELETE_SPACE_PROMPT_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const showDeleteSpacePrompt = mainWindow => (event, { message, buttons }) => {
  logger.debug('showing delete space prompt');

  const options = {
    type: 'warning',
    buttons,
    defaultId: 0,
    cancelId: 0,
    message,
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(RESPOND_DELETE_SPACE_PROMPT_CHANNEL, response);
  });
};

module.exports = showDeleteSpacePrompt;
