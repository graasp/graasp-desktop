const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  dialog,
  protocol,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
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
  DELETE_APP_INSTANCE_RESOURCE_CHANNEL,
  PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
  GET_APP_INSTANCE_CHANNEL,
  GET_DEVELOPER_MODE_CHANNEL,
  SET_DEVELOPER_MODE_CHANNEL,
  GET_SYNC_MODE_CHANNEL,
  SET_SYNC_MODE_CHANNEL,
  GET_GEOLOCATION_ENABLED_CHANNEL,
  SET_GEOLOCATION_ENABLED_CHANNEL,
  GET_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
  SYNC_SPACE_CHANNEL,
  CLEAR_USER_INPUT_CHANNEL,
  SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL,
  POST_ACTION_CHANNEL,
  SIGN_IN_CHANNEL,
  SIGN_OUT_CHANNEL,
  IS_AUTHENTICATED_CHANNEL,
  GET_USER_MODE_CHANNEL,
  SET_USER_MODE_CHANNEL,
  SET_SPACE_AS_FAVORITE_CHANNEL,
  SET_SPACE_AS_RECENT_CHANNEL,
  EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
  CLEAR_LOAD_SPACE_CHANNEL,
  ADD_CLASSROOM_CHANNEL,
  GET_CLASSROOMS_CHANNEL,
  DELETE_CLASSROOM_CHANNEL,
  SHOW_DELETE_CLASSROOM_PROMPT_CHANNEL,
  EDIT_CLASSROOM_CHANNEL,
  GET_CLASSROOM_CHANNEL,
  ADD_USER_IN_CLASSROOM_CHANNEL,
  DELETE_USERS_IN_CLASSROOM_CHANNEL,
  SHOW_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL,
  EDIT_USER_IN_CLASSROOM_CHANNEL,
  GET_SPACE_IN_CLASSROOM_CHANNEL,
  LOAD_SPACE_IN_CLASSROOM_CHANNEL,
  SET_ACTION_ACCESSIBILITY_CHANNEL,
  SET_ACTIONS_AS_ENABLED_CHANNEL,
  COMPLETE_TOUR_CHANNEL,
  POST_FILE_CHANNEL,
  DELETE_FILE_CHANNEL,
} = require('./app/config/channels');
const env = require('./env.json');
const {
  loadSpace,
  saveSpace,
  getSpaces,
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
  signIn,
  signOut,
  isAuthenticated,
  getAppInstanceResources,
  postAppInstanceResource,
  patchAppInstanceResource,
  deleteAppInstanceResource,
  getAppInstance,
  setSyncMode,
  getSyncMode,
  setUserMode,
  getUserMode,
  setSpaceAsFavorite,
  setSpaceAsRecent,
  clearLoadSpace,
  extractFileToLoadSpace,
  addClassroom,
  getClassrooms,
  deleteClassroom,
  showDeleteClassroomPrompt,
  editClassroom,
  getClassroom,
  addUserInClassroom,
  showDeleteUsersInClassroomPrompt,
  deleteUsersInClassroom,
  editUserInClassroom,
  getSpaceInClassroom,
  loadSpaceInClassroom,
  setActionAccessibility,
  setActionsAsEnabled,
  windowAllClosed,
  completeTour,
  postFile,
  deleteFile,
} = require('./app/listeners');
const isMac = require('./app/utils/isMac');

// add keys to process
Object.keys(env).forEach((key) => {
  process.env[key] = env[key];
});

// mock of electron dialog for tests
if (process.env.NODE_ENV === 'test') {
  if (process.env.SHOW_MESSAGE_DIALOG_RESPONSE) {
    const response = JSON.parse(process.env.SHOW_MESSAGE_DIALOG_RESPONSE);
    dialog.showMessageBox = () => {
      return Promise.resolve({ response });
    };
  }
  if (process.env.SHOW_SAVE_DIALOG_RESPONSE) {
    dialog.showSaveDialog = () => {
      return Promise.resolve({
        filePath: process.env.SHOW_SAVE_DIALOG_RESPONSE,
      });
    };
  }
  if (process.env.SHOW_OPEN_DIALOG_RESPONSE) {
    dialog.showOpenDialog = () => {
      return Promise.resolve({
        filePaths: process.env.SHOW_OPEN_DIALOG_RESPONSE,
      });
    };
  }
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
      default: loadExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      // eslint-disable-next-line global-require
    } = require('electron-devtools-installer');

    loadExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        logger.info(`added extension: ${name}`);
      })
      .catch((err) => {
        logger.error(err);
      });

    loadExtension(REDUX_DEVTOOLS)
      .then((name) => {
        logger.info(`added extension: ${name}`);
      })
      .catch((err) => {
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
    .catch((err) => logger.error(err));

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

  // prompt when loading a space
  ipcMain.on(SHOW_LOAD_SPACE_PROMPT_CHANNEL, showLoadSpacePrompt(mainWindow));

  // called when loading a space
  ipcMain.on(LOAD_SPACE_CHANNEL, loadSpace(mainWindow, db));

  // called when requesting to load a space
  ipcMain.on(
    EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
    extractFileToLoadSpace(mainWindow, db)
  );

  // called when clearing load space
  ipcMain.on(CLEAR_LOAD_SPACE_CHANNEL, clearLoadSpace(mainWindow));

  // called when exporting a space
  ipcMain.on(EXPORT_SPACE_CHANNEL, exportSpace(mainWindow, db));

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

  // called when setting sync mode
  ipcMain.on(SET_SYNC_MODE_CHANNEL, setSyncMode(mainWindow, db));

  // called when getting sync mode
  ipcMain.on(GET_SYNC_MODE_CHANNEL, getSyncMode(mainWindow, db));

  // called when setting space as favorite
  ipcMain.on(SET_SPACE_AS_FAVORITE_CHANNEL, setSpaceAsFavorite(mainWindow, db));

  // called when setting space as recent
  ipcMain.on(SET_SPACE_AS_RECENT_CHANNEL, setSpaceAsRecent(mainWindow, db));

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

  // called when setting action accessibility
  ipcMain.on(
    SET_ACTION_ACCESSIBILITY_CHANNEL,
    setActionAccessibility(mainWindow, db)
  );

  // called when setting action enabled
  ipcMain.on(
    SET_ACTIONS_AS_ENABLED_CHANNEL,
    setActionsAsEnabled(mainWindow, db)
  );

  // called when getting student mode
  ipcMain.on(GET_USER_MODE_CHANNEL, getUserMode(mainWindow, db));

  // called when setting student mode
  ipcMain.on(SET_USER_MODE_CHANNEL, setUserMode(mainWindow, db));

  // called when creating an action
  ipcMain.on(POST_ACTION_CHANNEL, postAction(mainWindow, db));

  // called when creating a file
  ipcMain.on(POST_FILE_CHANNEL, postFile(mainWindow, db));

  // called when creating a file
  ipcMain.on(DELETE_FILE_CHANNEL, deleteFile(mainWindow, db));

  // called when logging in a user
  ipcMain.on(SIGN_IN_CHANNEL, signIn(mainWindow, db));

  // called when logging out a user
  ipcMain.on(SIGN_OUT_CHANNEL, signOut(mainWindow, db));

  // called when getting authenticated
  ipcMain.on(IS_AUTHENTICATED_CHANNEL, isAuthenticated(mainWindow, db));

  // called when getting AppInstanceResources
  ipcMain.on(
    GET_APP_INSTANCE_RESOURCES_CHANNEL,
    getAppInstanceResources(mainWindow, db)
  );

  // called when creating an AppInstanceResource
  ipcMain.on(
    POST_APP_INSTANCE_RESOURCE_CHANNEL,
    postAppInstanceResource(mainWindow, db)
  );

  // called when updating an AppInstanceResource
  ipcMain.on(
    PATCH_APP_INSTANCE_RESOURCE_CHANNEL,
    patchAppInstanceResource(mainWindow, db)
  );

  // called when deleting an AppInstanceResource
  ipcMain.on(
    DELETE_APP_INSTANCE_RESOURCE_CHANNEL,
    deleteAppInstanceResource(mainWindow, db)
  );

  // called when getting an AppInstance
  ipcMain.on(GET_APP_INSTANCE_CHANNEL, getAppInstance(mainWindow, db));

  // called when getting classrooms
  ipcMain.on(GET_CLASSROOMS_CHANNEL, getClassrooms(mainWindow, db));

  // called when getting a classroom
  ipcMain.on(GET_CLASSROOM_CHANNEL, getClassroom(mainWindow, db));

  // called when adding a classroom
  ipcMain.on(ADD_CLASSROOM_CHANNEL, addClassroom(mainWindow, db));

  // called when editing a classroom
  ipcMain.on(EDIT_CLASSROOM_CHANNEL, editClassroom(mainWindow, db));

  // called when adding a user in a classroom
  ipcMain.on(ADD_USER_IN_CLASSROOM_CHANNEL, addUserInClassroom(mainWindow, db));

  // prompt when deleting a user in a classroom
  ipcMain.on(
    SHOW_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL,
    showDeleteUsersInClassroomPrompt(mainWindow, db)
  );

  // called when deleting a user in a classroom
  ipcMain.on(
    DELETE_USERS_IN_CLASSROOM_CHANNEL,
    deleteUsersInClassroom(mainWindow, db)
  );

  // prompt when deleting a classroom
  ipcMain.on(
    SHOW_DELETE_CLASSROOM_PROMPT_CHANNEL,
    showDeleteClassroomPrompt(mainWindow, db)
  );

  // called when deleting a classroom
  ipcMain.on(DELETE_CLASSROOM_CHANNEL, deleteClassroom(mainWindow, db));

  // called when editing a user in a classroom
  ipcMain.on(
    EDIT_USER_IN_CLASSROOM_CHANNEL,
    editUserInClassroom(mainWindow, db)
  );

  // called when loading a space in a classroom
  ipcMain.on(
    LOAD_SPACE_IN_CLASSROOM_CHANNEL,
    loadSpaceInClassroom(mainWindow, db)
  );

  // called when getting a space in a classroom
  ipcMain.on(
    GET_SPACE_IN_CLASSROOM_CHANNEL,
    getSpaceInClassroom(mainWindow, db)
  );

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

  // called when syncing a space
  ipcMain.on(SYNC_SPACE_CHANNEL, syncSpace(mainWindow, db));

  // called when a tour is closed or completed
  ipcMain.on(COMPLETE_TOUR_CHANNEL, completeTour(mainWindow, db));
});

app.on('window-all-closed', () => windowAllClosed(mainWindow));

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});

// enable file:// url scheme
// solution from https://github.com/electron/electron/issues/23757
app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
});
