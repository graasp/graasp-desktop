const { SET_ACTIONS_AS_ENABLED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { DEFAULT_ACTIONS_AS_ENABLED } = require('../config/config');
const logger = require('../logger');

const setActionsAsEnabled = (mainWindow, db) => async (
  event,
  actionsEnabled
) => {
  try {
    db.set('user.settings.actionsEnabled', actionsEnabled).write();
    mainWindow.webContents.send(
      SET_ACTIONS_AS_ENABLED_CHANNEL,
      actionsEnabled || DEFAULT_ACTIONS_AS_ENABLED
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_ACTIONS_AS_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setActionsAsEnabled;
