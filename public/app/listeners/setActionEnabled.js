const { SET_ACTION_ENABLED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { DEFAULT_ACTION_ENABLED } = require('../config/config');
const logger = require('../logger');

const setActionEnabled = (mainWindow, db) => async (event, actionEnabled) => {
  try {
    db.set('user.settings.actionEnabled', actionEnabled).write();
    mainWindow.webContents.send(
      SET_ACTION_ENABLED_CHANNEL,
      actionEnabled || DEFAULT_ACTION_ENABLED
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_ACTION_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setActionEnabled;
