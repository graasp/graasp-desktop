// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const {
  RESPOND_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL,
} = require('../config/channels');
const logger = require('../logger');
const { ERROR_NO_USER_TO_DELETE } = require('../config/errors');

const showDeleteUsersInClassroomPrompt = mainWindow => (
  event,
  { users = [] }
) => {
  logger.debug('showing delete user in classroom prompt');

  if (!users.length) {
    logger.error('no user to delete');
    mainWindow.webContents.send(
      RESPOND_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL,
      ERROR_NO_USER_TO_DELETE
    );
  } else {
    const usernamesString = users
      .map(({ username }) => `- ${username}`)
      .join('\n');

    const options = {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      cancelId: 0,
      message: `Are you sure you want to delete the following users:\n\n${usernamesString}\n\nfrom this classroom?`,
    };

    dialog.showMessageBox(mainWindow, options).then(({ response }) => {
      mainWindow.webContents.send(
        RESPOND_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL,
        response
      );
    });
  }
};

module.exports = showDeleteUsersInClassroomPrompt;
