const {
  dialog,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const { RESPOND_SYNC_SPACE_PROMPT_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const showSyncSpacePrompt = mainWindow => () => {
  logger.debug('showing sync space prompt');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Sync'],
    defaultId: 0,
    cancelId: 0,
    message:
      'Are you sure you want to sync this space? All user input will be deleted.',
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(RESPOND_SYNC_SPACE_PROMPT_CHANNEL, response);
  });
};

module.exports = showSyncSpacePrompt;
