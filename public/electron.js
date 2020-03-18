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
const openAboutWindow = require('about-window').default;
const logger = require('./app/logger');
const { ensureDatabaseExists, bootstrapDatabase } = require('./app/db');
const {
  DATABASE_PATH,
  ICON_PATH,
  PRODUCT_NAME,
  escapeEscapeCharacter,
} = require('./app/config/config');
const {
  LOAD_SPACE_CHANNEL,
  EXPORT_SPACE_CHANNEL,
  DELETE_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
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
  GET_GEOLOCATION_ENABLED_CHANNEL,
  SET_GEOLOCATION_ENABLED_CHANNEL,
  GET_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
  SHOW_SYNC_SPACE_PROMPT_CHANNEL,
  SYNC_SPACE_CHANNEL,
  CLEAR_USER_INPUT_CHANNEL,
  SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL,
  POST_ACTION_CHANNEL,
} = require('./app/config/channels');
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
  showLoadSpacePrompt,
  showExportSpacePrompt,
  showDeleteSpacePrompt,
  getGeolocationEnabled,
  setGeolocationEnabled,
  getUserFolder,
  setLanguage,
  getLanguage,
  getDeveloperMode,
  setDeveloperMode,
  clearUserInput,
  showClearUserInputPrompt,
  postAction,
} = require('./app/listeners');
const isMac = require('./app/utils/isMac');

// add keys to process
Object.keys(env).forEach(key => {
  process.env[key] = env[key];
});

// mock of electron dialog for tests
if (process.env.NODE_ENV === 'test' && process.env.DIALOG_RESPONSE) {
  const response = JSON.parse(process.env.DIALOG_RESPONSE);
  dialog.showMessageBox = () => {
    return Promise.resolve({ response });
  };
}

let mainWindow;

// only set up sentry if dsn is provided
const { SENTRY_DSN, GOOGLE_ANALYTICS_ID } = process.env;
if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN });
}

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
    isDev || process.env.NODE_ENV === 'test'
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

const macAppMenu = [
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
];
const standardAppMenu = [];
const macFileSubmenu = [{ role: 'close' }];
const standardFileSubmenu = [
  {
    label: 'About',
    click: () => {
      openAboutWindow({
        // asset for icon is in the public/assets folder
        base_path: escapeEscapeCharacter(app.getAppPath()),
        icon_path: path.join(__dirname, ICON_PATH),
        copyright: 'Copyright © 2019 React',
        product_name: PRODUCT_NAME,
        use_version_info: false,
        adjust_window_size: true,
        win_options: {
          parent: mainWindow,
          resizable: false,
          minimizable: false,
          maximizable: false,
          movable: true,
          frame: true,
        },
        // automatically show info from package.json
        package_json_dir: path.join(__dirname, '../'),
        bug_link_text: 'Report a Bug/Issue',
        // we cannot use homepage from package.json as
        // create-react-app uses it to build the frontend
        homepage: 'https://graasp.eu/',
      });
    },
  },
  { role: 'quit' },
];

const learnMoreLink =
  'https://github.com/react-epfl/graasp-desktop/blob/master/README.md';
const fileIssueLink = 'https://github.com/react-epfl/graasp-desktop/issues';

const generateMenu = () => {
  const template = [
    ...(isMac() ? macAppMenu : standardAppMenu),
    {
      label: 'File',
      submenu: [...(isMac() ? macFileSubmenu : standardFileSubmenu)],
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
        { role: 'selectAll' },
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
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac()
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(learnMoreLink);
          },
          label: 'Learn More',
        },
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(fileIssueLink);
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ];

  if (isMac()) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    // this causes the menu to change on mac after first use
    // and it's no longer possible to use the mac defaults
    Menu.setApplicationMenu(null);
    mainWindow.setMenu(Menu.buildFromTemplate(template));
  }
};

app.on('ready', async () => {
  // updater
  autoUpdater.logger = logger;

  // noinspection ES6MissingAwait
  autoUpdater
    .checkForUpdatesAndNotify()
    .then()
    .catch(err => logger.error(err));

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
  ipcMain.on(SHOW_LOAD_SPACE_PROMPT_CHANNEL, showLoadSpacePrompt(mainWindow));

  // prompt when exporting a space
  ipcMain.on(
    SHOW_EXPORT_SPACE_PROMPT_CHANNEL,
    showExportSpacePrompt(mainWindow)
  );

  // prompt when deleting a space
  ipcMain.on(
    SHOW_DELETE_SPACE_PROMPT_CHANNEL,
    showDeleteSpacePrompt(mainWindow)
  );

  // prompt when clearing the user input in a space
  ipcMain.on(
    SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL,
    showClearUserInputPrompt(mainWindow)
  );

  ipcMain.on(CLEAR_USER_INPUT_CHANNEL, clearUserInput(mainWindow, db));

  // called when getting user folder
  ipcMain.on(GET_USER_FOLDER_CHANNEL, getUserFolder(mainWindow));

  // called when getting language
  ipcMain.on(GET_LANGUAGE_CHANNEL, getLanguage(mainWindow, db));

  // called when setting language
  ipcMain.on(SET_LANGUAGE_CHANNEL, setLanguage(mainWindow, db));

  // called when getting developer mode
  ipcMain.on(GET_DEVELOPER_MODE_CHANNEL, getDeveloperMode(mainWindow, db));

  // called when setting developer mode
  ipcMain.on(SET_DEVELOPER_MODE_CHANNEL, setDeveloperMode(mainWindow, db));

  // called when getting geolocation enabled
  ipcMain.on(
    GET_GEOLOCATION_ENABLED_CHANNEL,
    getGeolocationEnabled(mainWindow, db)
  );

  // called when setting geolocation enabled
  ipcMain.on(
    SET_GEOLOCATION_ENABLED_CHANNEL,
    setGeolocationEnabled(mainWindow, db)
  );

  // called when creating an action
  ipcMain.on(POST_ACTION_CHANNEL, postAction(mainWindow, db));

  // called when getting AppInstanceResources
  ipcMain.on(GET_APP_INSTANCE_RESOURCES_CHANNEL, (event, data = {}) => {
    const defaultResponse = [];
    const { userId, appInstanceId, spaceId, subSpaceId, type } = data;
    try {
      // tools live on the parent
      const tool = spaceId === subSpaceId;

      let appInstanceResourcesHandle;

      // if not a tool, we need to go one step further into the phase
      if (!tool) {
        appInstanceResourcesHandle = db
          .get('spaces')
          .find({ id: spaceId })
          .get('phases')
          .find({ id: subSpaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id: appInstanceId })
          .get('resources');
      } else {
        appInstanceResourcesHandle = db
          .get('spaces')
          .find({ id: spaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id: appInstanceId })
          .get('resources');
      }

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

      // response is sent back to channel specific for this app instance
      mainWindow.webContents.send(
        `${GET_APP_INSTANCE_RESOURCES_CHANNEL}_${appInstanceId}`,
        {
          appInstanceId,
          payload: response,
        }
      );
    } catch (e) {
      console.error(e);
      // error is sent back to channel specific for this app instance
      mainWindow.webContents.send(
        `${GET_APP_INSTANCE_RESOURCES_CHANNEL}_${appInstanceId}`,
        {
          appInstanceId,
          payload: defaultResponse,
        }
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

      // tools live on the parent
      const tool = spaceId === subSpaceId;

      // write the resource to the database
      // if not a tool, we need to go one step further into the phase
      if (!tool) {
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
      } else {
        db.get('spaces')
          .find({ id: spaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id: appInstanceId })
          .get('resources')
          .push(resourceToWrite)
          .write();
      }

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

      let resource;

      // tools live on the parent
      const tool = spaceId === subSpaceId;

      // if not a tool, we need to go one step further into the phase
      if (!tool) {
        resource = db
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
      } else {
        resource = db
          .get('spaces')
          .find({ id: spaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id: appInstanceId })
          .get('resources')
          .find({ id })
          .assign(fieldsToUpdate)
          .value();
      }

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

      let appInstance;

      // tools live on the parent
      const tool = spaceId === subSpaceId;

      // if not a tool, we need to go one step further into the phase
      if (!tool) {
        appInstance = db
          .get('spaces')
          .find({ id: spaceId })
          .get('phases')
          .find({ id: subSpaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id })
          .value();
      } else {
        appInstance = db
          .get('spaces')
          .find({ id: spaceId })
          .get('items')
          .filter(item => item.appInstance)
          .map(item => item.appInstance)
          .find({ id })
          .value();
      }

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
