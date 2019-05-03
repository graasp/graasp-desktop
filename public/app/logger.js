const logger = require('electron-log');

logger.transports.file.level = 'info';

module.exports = logger;
