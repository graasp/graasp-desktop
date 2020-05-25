// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const {
  RESPOND_DELETE_CLASSROOM_PROMPT_CHANNEL,
} = require('../config/channels');
const logger = require('../logger');

const showDeleteClassroomPrompt = mainWindow => () => {
  logger.debug('showing delete classroom prompt');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0,
    message: 'Are you sure you want to delete this classroom?',
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(
      RESPOND_DELETE_CLASSROOM_PROMPT_CHANNEL,
      response
    );
  });
};

module.exports = showDeleteClassroomPrompt;
