const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  dialog,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const ObjectId = require('bson-objectid');
const { autoUpdater } = require('electron-updater');
const Sentry = require('@sentry/electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const logger = require('./app/logger');
const { ensureDatabaseExists, bootstrapDatabase } = require('./app/db');
const {
  VAR_FOLDER,
  DATABASE_PATH,
  DEFAULT_LANG,
  DEFAULT_DEVELOPER_MODE,
} = require('./app/config/config');
const {
  LOAD_SPACE_CHANNEL,
  EXPORT_SPACE_CHANNEL,
  DELETE_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL,
  SHOW_DELETE_SPACE_PROMPT_CHANNEL,
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
  SAVE_SPACE_CHANNEL,
  GET_USER_FOLDER_CHANNEL,
  GET_LANGUAGE_CHANNEL,
  SET_LANGUAGE_CHANNEL,
  GET_APP_INSTANCE_RESOURCES_CHANNEL,
  POST_APP_INSTANCE_RESOURCE_CHANNEL,
  PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
  GET_APP_INSTANCE_CHANNEL,
  GET_DEVELOPER_MODE_CHANNEL,
  SET_DEVELOPER_MODE_CHANNEL,
  GET_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
  SHOW_SYNC_SPACE_PROMPT_CHANNEL,
  SYNC_SPACE_CHANNEL,
} = require('./app/config/channels');
const { ERROR_GENERAL } = require('./app/config/errors');
const env = require('./env.json');
const {
  loadSpace,
  saveSpace,
  getSpaces,
  showSyncSpacePrompt,
  syncSpace,
  getSpace,
  deleteSpace,
  exportSpace,
  showLoadSpace,
  showExportSpace,
} = require('./app/listeners');

// add keys to process
Object.keys(env).forEach(key => {
  process.env[key] = env[key];
});

let mainWindow;

// set up sentry
const { SENTRY_DSN, GOOGLE_ANALYTICS_ID } = process.env;
Sentry.init({ dsn: SENTRY_DSN });

// get unique identifier for this machine
const machineId = machineIdSync();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 880,
    show: false,
    movable: true,
    webPreferences: {
      nodeIntegration: false,
      preload: `${__dirname}/app/preload.js`,
      webSecurity: false,
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './index.html')}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      // eslint-disable-next-line global-require
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        logger.info(`added extension: ${name}`);
      })
      .catch(err => {
        logger.error(err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        logger.info(`added extension: ${name}`);
      })
      .catch(err => {
        logger.error(err);
      });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

// const handleLoad = () => {
//   logger.info('load');
// };

const generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        // {
        //   label: 'Load Space',
        //   click() {
        //     handleLoad();
        //   },
        // },
        {
          label: 'About',
          role: 'about',
        },
        {
          label: 'Quit',
          role: 'quit',
        },
      ],
    },
    { type: 'separator' },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(
              'https://github.com/react-epfl/graasp-desktop/blob/master/README.md'
            );
          },
          label: 'Learn More',
        },
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(
              'https://github.com/react-epfl/graasp-desktop/issues'
            );
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on('ready', async () => {
  // updater
  autoUpdater.logger = logger;
  autoUpdater.checkForUpdatesAndNotify();

  await ensureDatabaseExists(DATABASE_PATH);
  const db = bootstrapDatabase(DATABASE_PATH);

  createWindow();
  generateMenu();

  // record page view
  const visitor = ua(GOOGLE_ANALYTICS_ID, machineId);
  visitor.pageview('/').send();

  // called when saving a space
  ipcMain.on(SAVE_SPACE_CHANNEL, saveSpace(mainWindow, db));

  // called when getting a space
  ipcMain.on(GET_SPACE_CHANNEL, getSpace(mainWindow, db));

  // called when getting all spaces
  ipcMain.on(GET_SPACES_CHANNEL, getSpaces(mainWindow, db));

  // called when deleting a space
  ipcMain.on(DELETE_SPACE_CHANNEL, deleteSpace(mainWindow, db));

  // called when loading a space
  ipcMain.on(LOAD_SPACE_CHANNEL, loadSpace(mainWindow, db));

  // called when exporting a space
  ipcMain.on(EXPORT_SPACE_CHANNEL, exportSpace(mainWindow, db));

  // prompt when loading a space
  ipcMain.on(SHOW_LOAD_SPACE_PROMPT_CHANNEL, showLoadSpace(mainWindow));

  // prompt when exporting a space
  ipcMain.on(SHOW_EXPORT_SPACE_PROMPT_CHANNEL, showExportSpace(mainWindow));

  // prompt when deleting a space
  ipcMain.on(SHOW_DELETE_SPACE_PROMPT_CHANNEL, () => {
    const options = {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      cancelId: 0,
      message: 'Are you sure you want to delete this space?',
    };
    dialog.showMessageBox(null, options, respond => {
      mainWindow.webContents.send(RESPOND_DELETE_SPACE_PROMPT_CHANNEL, respond);
    });
  });

  // called when getting user folder
  ipcMain.on(GET_USER_FOLDER_CHANNEL, () => {
    try {
      mainWindow.webContents.send(GET_USER_FOLDER_CHANNEL, VAR_FOLDER);
    } catch (e) {
      logger.error(e);
      mainWindow.webContents.send(GET_USER_FOLDER_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when getting language
  ipcMain.on(GET_LANGUAGE_CHANNEL, () => {
    try {
      const lang = db.get('user.lang').value() || DEFAULT_LANG;
      mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, lang);
    } catch (e) {
      logger.error(e);
      mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when setting language
  ipcMain.on(SET_LANGUAGE_CHANNEL, (event, lang) => {
    try {
      db.set('user.lang', lang).write();
      mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, lang);
    } catch (e) {
      logger.error(e);
      mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when getting developer mode
  ipcMain.on(GET_DEVELOPER_MODE_CHANNEL, () => {
    try {
      const developerMode =
        db.get('user.developerMode').value() || DEFAULT_DEVELOPER_MODE;
      mainWindow.webContents.send(GET_DEVELOPER_MODE_CHANNEL, developerMode);
    } catch (e) {
      logger.error(e);
      mainWindow.webContents.send(GET_DEVELOPER_MODE_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when setting developer mode
  ipcMain.on(SET_DEVELOPER_MODE_CHANNEL, (event, developerMode) => {
    try {
      db.set('user.developerMode', developerMode).write();
      mainWindow.webContents.send(SET_DEVELOPER_MODE_CHANNEL, developerMode);
    } catch (e) {
      logger.error(e);
      mainWindow.webContents.send(SET_DEVELOPER_MODE_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when getting AppInstanceResources
  ipcMain.on(GET_APP_INSTANCE_RESOURCES_CHANNEL, (event, data = {}) => {
    const defaultResponse = [];
    try {
      const { userId, appInstanceId, spaceId, subSpaceId, type } = data;
      const appInstanceResourcesHandle = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources');

      // only filter by type if provided
      if (type) {
        appInstanceResourcesHandle.filter({ type });
      }

      // only filter by user if provided
      if (userId) {
        appInstanceResourcesHandle.filter({ user: userId });
      }

      const appInstanceResources = appInstanceResourcesHandle.value();

      const response = appInstanceResources || defaultResponse;
      mainWindow.webContents.send(GET_APP_INSTANCE_RESOURCES_CHANNEL, response);
    } catch (e) {
      console.error(e);
      mainWindow.webContents.send(
        GET_APP_INSTANCE_RESOURCES_CHANNEL,
        defaultResponse
      );
    }
  });

  // called when creating an AppInstanceResource
  ipcMain.on(POST_APP_INSTANCE_RESOURCE_CHANNEL, (event, payload = {}) => {
    try {
      const {
        userId,
        appInstanceId,
        spaceId,
        subSpaceId,
        format,
        type,
        data,
        visibility = 'private',
      } = payload;

      // prepare the timestamp
      const now = new Date();

      // prepare the resource that we will create
      const resourceToWrite = {
        appInstance: appInstanceId,
        createdAt: now,
        updatedAt: now,
        data,
        format,
        type,
        visibility,
        user: userId,
        id: ObjectId().str,
      };

      // write the resource to the database
      db.get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .push(resourceToWrite)
        .write();

      // send back the resource
      mainWindow.webContents.send(
        POST_APP_INSTANCE_RESOURCE_CHANNEL,
        resourceToWrite
      );
    } catch (e) {
      console.error(e);
      mainWindow.webContents.send(POST_APP_INSTANCE_RESOURCE_CHANNEL, null);
    }
  });

  // called when updating an AppInstanceResource
  ipcMain.on(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, (event, payload = {}) => {
    try {
      const { appInstanceId, spaceId, subSpaceId, data, id } = payload;
      const now = new Date();
      const fieldsToUpdate = {
        updatedAt: now,
        data,
      };
      const resource = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id: appInstanceId })
        .get('resources')
        .find({ id })
        .assign(fieldsToUpdate)
        .value();
      db.write();
      mainWindow.webContents.send(
        PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
        resource
      );
    } catch (e) {
      console.error(e);
      mainWindow.webContents.send(PATCH_APP_INSTANCE_RESOURCE_CHANNEL, null);
    }
  });

  // called when getting an AppInstance
  ipcMain.on(GET_APP_INSTANCE_CHANNEL, (event, payload = {}) => {
    try {
      const { spaceId, subSpaceId, id } = payload;
      const appInstance = db
        .get('spaces')
        .find({ id: spaceId })
        .get('phases')
        .find({ id: subSpaceId })
        .get('items')
        .filter(item => item.appInstance)
        .map(item => item.appInstance)
        .find({ id })
        .value();

      mainWindow.webContents.send(GET_APP_INSTANCE_CHANNEL, appInstance);
    } catch (e) {
      console.error(e);
      mainWindow.webContents.send(GET_APP_INSTANCE_CHANNEL, null);
    }
  });

  // called when getting the database
  ipcMain.on(GET_DATABASE_CHANNEL, async () => {
    try {
      // get space from local db
      const database = db.getState();
      mainWindow.webContents.send(GET_DATABASE_CHANNEL, database);
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(GET_DATABASE_CHANNEL, null);
    }
  });

  // called when setting the database
  ipcMain.on(SET_DATABASE_CHANNEL, async (event, payload) => {
    try {
      // get space from local db
      db.setState(payload).write();
      const database = db.getState();

      mainWindow.webContents.send(SET_DATABASE_CHANNEL, database);
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(SET_DATABASE_CHANNEL, null);
    }
  });

  // prompt when syncing a space
  ipcMain.on(SHOW_SYNC_SPACE_PROMPT_CHANNEL, showSyncSpacePrompt(mainWindow));

  // called when syncing a space
  ipcMain.on(SYNC_SPACE_CHANNEL, syncSpace(mainWindow, db));
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});
