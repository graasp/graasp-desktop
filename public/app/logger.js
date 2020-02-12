const logger = require('electron-log');
const env = require('../env.json');
const { DEFAULT_LOGGING_LEVEL } = require('./config/config');

// add keys to process
Object.keys(env).forEach(key => {
  process.env[key] = env[key];
});

const { LOGGING_LEVEL } = process.env;

logger.transports.file.level = LOGGING_LEVEL || DEFAULT_LOGGING_LEVEL;

module.exports = logger;
