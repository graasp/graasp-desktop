const mkdirp = require('mkdirp');
const low = require('lowdb');
const fs = require('fs');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');
const extract = require('extract-zip');
const logger = require('./logger');
const {
  DATABASE_PATH,
  VAR_FOLDER,
  APPS_FOLDER,
  DEFAULT_LANG,
  PREPACKAGED_APPS_FOLDER_NAME,
} = require('./config/config');

// use promisified fs
const fsPromises = fs.promises;

const SPACES_COLLECTION = 'spaces';
const ACTIONS_COLLECTION = 'actions';
const USER_COLLECTION = 'user';
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
    [USER_COLLECTION]: { lang: DEFAULT_LANG },
    [ACTIONS_COLLECTION]: [],
    [APP_INSTANCE_RESOURCES_COLLECTION]: [],
    [CLASSROOMS_COLLECTION]: [],
  }).write();
  return db;
};

// save all prepackaged apps in var folder
const ensurePrepackagedAppsExist = () => {
  try {
    // create the apps folder if it doesn't already exist
    if (!fs.existsSync(APPS_FOLDER)) {
      mkdirp(APPS_FOLDER);
    }

    const localAppsFolder = path.join(__dirname, PREPACKAGED_APPS_FOLDER_NAME);
    const apps = fs
      .readdirSync(localAppsFolder, { withFileTypes: true })
      .filter(({ name }) => !name.startsWith('.')); // remove hidden files
    apps.forEach(({ name }) => {
      const srcPath = path.join(localAppsFolder, name);
      const nameWithoutExt = name.substr(0, name.indexOf('.'));
      const destPath = path.join(APPS_FOLDER, nameWithoutExt);
      // check if file is in apps folder
      if (!fs.existsSync(destPath)) {
        // extract zip in var/apps folder
        extract(srcPath, { dir: destPath });
      }
    });
    logger.debug('prepackaged apps are successfully copied');
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  SPACES_COLLECTION,
  USER_COLLECTION,
  USERS_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
  CLASSROOMS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
  ensurePrepackagedAppsExist,
};
