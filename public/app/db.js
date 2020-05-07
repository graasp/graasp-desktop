const mkdirp = require('mkdirp');
const low = require('lowdb');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');
const { DATABASE_PATH, VAR_FOLDER, DEFAULT_LANG } = require('./config/config');

// use promisified fs
const fsPromises = fs.promises;

const SPACES_COLLECTION = 'spaces';
const ACTIONS_COLLECTION = 'actions';
const USERS_COLLECTION = 'users';
const APP_INSTANCE_RESOURCES_COLLECTION = 'appInstanceResources';
const CLASSROOMS_COLLECTION = 'classrooms';

// bootstrap database
const ensureDatabaseExists = async (dbPath = DATABASE_PATH) => {
  try {
    await fsPromises.readFile(dbPath, { encoding: 'utf8' });
  } catch (readErr) {
    logger.error(readErr);
    try {
      mkdirp.sync(VAR_FOLDER);
      await fsPromises.writeFile(dbPath, '');
    } catch (writeErr) {
      logger.error(writeErr);
    }
  }
};

const bootstrapDatabase = (dbPath = DATABASE_PATH) => {
  const adapter = new FileSync(dbPath);
  const db = low(adapter);

  // set some defaults (required if json file is empty)
  db.defaults({
    [SPACES_COLLECTION]: [],
    [USERS_COLLECTION]: [],
    user: { lang: DEFAULT_LANG },
    [ACTIONS_COLLECTION]: [],
    [APP_INSTANCE_RESOURCES_COLLECTION]: [],
    [CLASSROOMS_COLLECTION]: [],
  }).write();
  return db;
};

module.exports = {
  SPACES_COLLECTION,
  USERS_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
  CLASSROOMS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
};
