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
const fs = require('fs');
const isOnline = require('is-online');
const electronDl = require('electron-dl');
const rimraf = require('rimraf');
const extract = require('extract-zip');
const archiver = require('archiver');
const ObjectId = require('bson-objectid');
const { autoUpdater } = require('electron-updater');
const Sentry = require('@sentry/electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const logger = require('./app/logger');
const { getDownloadUrl } = require('./app/download');
const {
  getExtension,
  isDownloadable,
  generateHash,
  createSpaceDirectory,
} = require('./app/utilities');
const {
  ensureDatabaseExists,
  bootstrapDatabase,
  SPACES_COLLECTION,
} = require('./app/db');
const {
  VAR_FOLDER,
  DATABASE_PATH,
  TEMPORARY_EXTRACT_FOLDER,
  DEFAULT_LANG,
  DEFAULT_DEVELOPER_MODE,
} = require('./app/config/config');
const {
  LOAD_SPACE_CHANNEL,
  LOADED_SPACE_CHANNEL,
  EXPORT_SPACE_CHANNEL,
  EXPORTED_SPACE_CHANNEL,
  DELETE_SPACE_CHANNEL,
  DELETED_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
  RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL,
  SHOW_DELETE_SPACE_PROMPT_CHANNEL,
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
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
} = require('./app/config/channels');
const {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_DOWNLOADING_FILE,
  ERROR_GENERAL,
  ERROR_ZIP_CORRUPTED,
} = require('./app/config/errors');
const mapping = require('./app/config/mapping');
const env = require('./env.json');

// add keys to process
Object.keys(env).forEach(key => {
  process.env[key] = env[key];
});

// use promisified fs
const fsPromises = fs.promises;

const isFileAvailable = filePath =>
  new Promise(resolve =>
    fs.access(filePath, fs.constants.F_OK, err => resolve(!err))
  );

const { download } = electronDl;
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
  ipcMain.on(SAVE_SPACE_CHANNEL, async (event, { space }) => {
    // make a working copy of the space to save
    const spaceToSave = { ...space };
    try {
      // get handle to spaces collection
      const spaces = db.get(SPACES_COLLECTION);
      const { id, language } = space;
      const existingSpace = spaces.find({ id }).value();

      if (existingSpace) {
        return mainWindow.webContents.send(
          SAVE_SPACE_CHANNEL,
          ERROR_SPACE_ALREADY_AVAILABLE
        );
      }

      // only download if connection is available
      const isConnected = await isOnline();
      if (!isConnected) {
        return mainWindow.webContents.send(
          SAVE_SPACE_CHANNEL,
          ERROR_DOWNLOADING_FILE
        );
      }

      // create directory where resources will be stored
      createSpaceDirectory({ id });

      const { phases, image } = spaceToSave;

      const spacePath = id;

      // use language defined in space otherwise fall back on
      // user language, otherwise fall back on the global default
      const userLang = db.get('user.lang').value();
      const lang = language || userLang || DEFAULT_LANG;

      // todo: follow new format
      // if there is a background/thumbnail image, save it
      if (image) {
        const { thumbnailUrl, backgroundUrl } = image;
        const assets = [
          { url: thumbnailUrl, key: 'thumbnailAsset' },
          { url: backgroundUrl, key: 'backgroundAsset' },
        ];

        // eslint-disable-next-line no-restricted-syntax
        for (const asset of assets) {
          const { url, key } = asset;
          if (url) {
            const ext = getExtension({ url });
            const hash = generateHash({ url });
            const imageFileName = `${hash}.${ext}`;
            const imagePath = `${spacePath}/${imageFileName}`;
            const absoluteSpacePath = `${VAR_FOLDER}/${spacePath}`;
            const absoluteImagePath = `${VAR_FOLDER}/${imagePath}`;
            // eslint-disable-next-line no-await-in-loop
            const imageAvailable = await isFileAvailable(absoluteImagePath);
            if (!imageAvailable) {
              // eslint-disable-next-line no-await-in-loop
              await download(mainWindow, url, {
                directory: absoluteSpacePath,
                filename: imageFileName,
              });
            }
            spaceToSave.image[key] = imagePath;
          }
        }
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const phase of phases) {
        const { items = [] } = phase;
        for (let i = 0; i < items.length; i += 1) {
          const resource = items[i];
          if (resource && isDownloadable(resource)) {
            let { url } = resource;

            // check mappings for files
            if (mapping[url]) {
              url = mapping[url];
            }

            // download from proxy url if available
            // eslint-disable-next-line no-await-in-loop
            const downloadUrl = await getDownloadUrl({ url, lang });
            if (downloadUrl) {
              url = downloadUrl;
            }

            // generate hash and get extension to save file
            const hash = generateHash(resource);
            const ext = getExtension(resource);
            const fileName = `${hash}.${ext}`;
            const filePath = `${spacePath}/${fileName}`;
            const absoluteSpacePath = `${VAR_FOLDER}/${spacePath}`;
            const absoluteFilePath = `${VAR_FOLDER}/${filePath}`;
            phase.items[i].hash = hash;

            // eslint-disable-next-line no-await-in-loop
            const fileAvailable = await isFileAvailable(absoluteFilePath);

            // if the file is available, point this resource to its path
            if (!fileAvailable) {
              // eslint-disable-next-line no-await-in-loop
              await download(mainWindow, url, {
                directory: absoluteSpacePath,
                filename: fileName,
              });
            }
            phase.items[i].asset = filePath;
          }
        }
      }
      // mark space as saved
      spaceToSave.saved = true;
      spaces.push(spaceToSave).write();
      return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, spaceToSave);
    } catch (err) {
      logger.error(err);
      return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, null);
    }
  });

  // called when getting a space
  ipcMain.on(GET_SPACE_CHANNEL, async (event, { id }) => {
    try {
      // get space from local db
      const space = db
        .get(SPACES_COLLECTION)
        .find({ id })
        .value();
      mainWindow.webContents.send(GET_SPACE_CHANNEL, space);
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(GET_SPACE_CHANNEL, null);
    }
  });

  // called when getting all spaces
  ipcMain.on(GET_SPACES_CHANNEL, async () => {
    try {
      // get handle to spaces collection
      const spaces = db.get(SPACES_COLLECTION).value();
      mainWindow.webContents.send(GET_SPACES_CHANNEL, spaces);
    } catch (e) {
      logger.error(e);
    }
  });

  // called when deleting a space
  ipcMain.on(DELETE_SPACE_CHANNEL, async (event, { id }) => {
    try {
      db.get(SPACES_COLLECTION)
        .remove({ id })
        .write();
      rimraf.sync(`${VAR_FOLDER}/${id}`);
      mainWindow.webContents.send(DELETED_SPACE_CHANNEL);
    } catch (err) {
      mainWindow.webContents.send(DELETED_SPACE_CHANNEL, ERROR_GENERAL);
    }
  });

  // called when loading a space
  ipcMain.on(LOAD_SPACE_CHANNEL, async (event, { fileLocation }) => {
    const extractPath = `${VAR_FOLDER}/${TEMPORARY_EXTRACT_FOLDER}`;
    try {
      extract(fileLocation, { dir: extractPath }, async extractError => {
        if (extractError) {
          logger.error(extractError);
          return mainWindow.webContents.send(
            LOADED_SPACE_CHANNEL,
            ERROR_GENERAL
          );
        }
        // get basic information from manifest
        const manifestPath = `${extractPath}/manifest.json`;
        // abort if there is no manifest
        const hasManifest = await isFileAvailable(manifestPath);
        if (!hasManifest) {
          rimraf.sync(extractPath);
          return mainWindow.webContents.send(
            LOADED_SPACE_CHANNEL,
            ERROR_ZIP_CORRUPTED
          );
        }
        const manifestString = await fsPromises.readFile(manifestPath);
        const manifest = JSON.parse(manifestString);
        const { id } = manifest;
        const spacePath = `${extractPath}/${id}.json`;

        // get handle to spaces collection
        const spaces = db.get(SPACES_COLLECTION);
        const existingSpace = spaces.find({ id }).value();

        // abort if there is already a space with that id
        if (existingSpace) {
          rimraf.sync(extractPath);
          return mainWindow.webContents.send(
            LOADED_SPACE_CHANNEL,
            ERROR_SPACE_ALREADY_AVAILABLE
          );
        }

        // abort if there is no space
        const hasSpace = await isFileAvailable(spacePath);
        if (!hasSpace) {
          rimraf.sync(extractPath);
          return mainWindow.webContents.send(
            LOADED_SPACE_CHANNEL,
            ERROR_ZIP_CORRUPTED
          );
        }

        const spaceString = await fsPromises.readFile(spacePath);
        const space = JSON.parse(spaceString);
        const finalPath = `${VAR_FOLDER}/${id}`;
        await fsPromises.rename(extractPath, finalPath);

        // write to database
        spaces.push(space).write();

        return mainWindow.webContents.send(LOADED_SPACE_CHANNEL);
      });
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      rimraf.sync(extractPath);
    }
  });

  // called when exporting a space
  ipcMain.on(EXPORT_SPACE_CHANNEL, async (event, { archivePath, id }) => {
    try {
      // get space from local database
      const space = db
        .get(SPACES_COLLECTION)
        .find({ id })
        .value();

      // abort if space does not exist
      if (!space) {
        mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
      } else {
        // stringify space
        const spaceString = JSON.stringify(space);
        const spaceDirectory = `${VAR_FOLDER}/${id}`;
        const spacePath = `${spaceDirectory}/${id}.json`;

        // create manifest
        const manifest = {
          id,
          version: app.getVersion(),
          createdAt: new Date().toISOString(),
        };
        const manifestString = JSON.stringify(manifest);
        const manifestPath = `${spaceDirectory}/manifest.json`;

        // write space and manifest to json file inside space folder
        await fsPromises.writeFile(spacePath, spaceString);
        await fsPromises.writeFile(manifestPath, manifestString);

        // prepare output file for zip
        const output = fs.createWriteStream(archivePath);
        output.on('close', () => {
          mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL);
        });
        output.on('end', () => {
          mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
        });

        // archive space folder into zip
        const archive = archiver('zip', {
          zlib: { level: 9 },
        });
        archive.on('warning', err => {
          if (err.code === 'ENOENT') {
            logger.error(err);
          }
        });
        archive.on('error', () => {
          mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
        });
        archive.pipe(output);
        archive.directory(spaceDirectory, false);
        archive.finalize();
      }
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
    }
  });

  // prompt when loading a space
  ipcMain.on(SHOW_LOAD_SPACE_PROMPT_CHANNEL, (event, options) => {
    dialog.showOpenDialog(null, options, filePaths => {
      mainWindow.webContents.send(RESPOND_LOAD_SPACE_PROMPT_CHANNEL, filePaths);
    });
  });

  // prompt when exporting a space
  ipcMain.on(SHOW_EXPORT_SPACE_PROMPT_CHANNEL, (event, spaceTitle) => {
    const options = {
      title: 'Save As',
      defaultPath: `${spaceTitle}.zip`,
    };
    dialog.showSaveDialog(null, options, filePath => {
      mainWindow.webContents.send(
        RESPOND_EXPORT_SPACE_PROMPT_CHANNEL,
        filePath
      );
    });
  });

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
        .find({ id: appInstanceId })
        .get('appInstanceResources');

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
        .find({ id: appInstanceId })
        .get('appInstanceResources')
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
        .find({ id: appInstanceId })
        .get('appInstanceResources')
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
        .find({ appInstanceId: id })
        .get('appInstance')
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
