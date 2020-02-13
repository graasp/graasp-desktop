// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const {
  RESPOND_CLEAR_USER_INPUT_PROMPT_CHANNEL,
} = require('../config/channels');
const logger = require('../logger');

const showClearUserInputPrompt = mainWindow => () => {
  logger.debug('showing clear user input prompt');
  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Clear'],
    defaultId: 0,
    cancelId: 0,
    message:
      'Are you sure you want to clear all of the user input in this space?',
  };
  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(
      RESPOND_CLEAR_USER_INPUT_PROMPT_CHANNEL,
      response
    );
  });
};

module.exports = showClearUserInputPrompt;
