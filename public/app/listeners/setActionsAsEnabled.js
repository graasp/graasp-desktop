const { SET_ACTIONS_AS_ENABLED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { DEFAULT_ACTIONS_AS_ENABLED } = require('../config/config');
const logger = require('../logger');

const setActionsAsEnabled = (mainWindow, db) => async (
  event,
  actionsAsEnabled
) => {
  try {
    db.set('user.settings.actionsAsEnabled', actionsAsEnabled).write();
    mainWindow.webContents.send(
      SET_ACTIONS_AS_ENABLED_CHANNEL,
      actionsAsEnabled || DEFAULT_ACTIONS_AS_ENABLED
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_ACTIONS_AS_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setActionsAsEnabled;
