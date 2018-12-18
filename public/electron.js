const { app, BrowserWindow, shell, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const isOnline = require('is-online');
const fsPromises = fs.promises;
const fse = require('fs-extra');
const electronDl = require('electron-dl');
const { download } = electronDl;
const extract = require('extract-zip');
const archiver = require('archiver');
const { ncp } = require('ncp');


let mainWindow;

const savedSpacesPath = app.getPath('userData') + '/.meta';
const spacesFileName = 'spaces.json';
const ERROR_ZIP_CORRUPTED = 'ERROR_ZIP_CORRUPTED';
const ERROR_JSON_CORRUPTED = 'ERROR_JSON_CORRUPTED';
const ERROR_SPACE_ALREADY_AVAILABLE = 'ERROR_SPACE_ALREADY_AVAILABLE';
const ERROR_GENERAL = 'ERROR_GENERAL';

createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 880,
    show: false,
    movable: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
      webSecurity: false
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

handleLoad = () => {
  console.log('load');
};

generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [{
        label: 'Load Space',
        click() { this.handleLoad() }},
        { role: 'about' },
        { role: 'quit' }],
    },
    {type:'separator'},
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
            require('electron').shell.openExternal(
              'https://getstream.io/winds',
            );
          },
          label: 'Learn More',
        },
        {
          click() {
            require('electron').shell.openExternal(
              'https://github.com/GetStream/Winds/issues',
            );
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on('ready', () => {
  createWindow();
  generateMenu();
  ipcMain.on('space:get', async (event, { id, spaces }) => {
    try {
      const space = spaces.find(el => Number(el.id) === Number(id));
      const { phases } = space;
      for (const phase of phases) {
        const { items = [] } = phase;
        for (let i=0; i < items.length; i++) {
          const { resource } = items[i];
          if (resource) {
            const {
              uri,
              hash,
              type,
            } = resource;
            const fileName = `${hash}.${type}`;
            const filePath = `${savedSpacesPath}/${fileName}`;
            const fileAvailable = await checkFileAvailable(filePath);
            if (fileAvailable){
              phase.items[i].asset = filePath;
            } else {
              const isConnected = await isOnline();
              if(isConnected) {
                await download(mainWindow, uri, { directory: savedSpacesPath, filename: fileName })
                  .then(dl => {
                    phase.items[i].asset = dl.getSavePath();
                  })
              } else {
                mainWindow.webContents.send(
                  'space:get',
                  ERROR_GENERAL
                );
              }
            }
          }
        }
      }
      mainWindow.webContents.send(
        'space:get',
        space
      );
    } catch (err) {
      console.log('error:', err);
    }
  });
  ipcMain.on('spaces:get', () => {
      let spaces = [];
      const spacesPath = `${savedSpacesPath}/${spacesFileName}`;
      fs.readFile(spacesPath, 'utf8', (err, data) => {
        // we dont have saved spaces yet
        if (err) {
          mainWindow.webContents.send(
            'spaces:get',
            spaces
          );
        } else {
          spaces = JSON.parse(data);
          mainWindow.webContents.send(
            'spaces:get',
            spaces
          );
        }
      });
  });
  ipcMain.on('space:delete', async (event, { id }) => {
    try {
      let spaces = [];
      const spacesPath = `${savedSpacesPath}/${spacesFileName}`;
      fs.readFile(spacesPath, 'utf8', async (err, data) => {
        if (err) {
          mainWindow.webContents.send(
            'space:deleted',
            ERROR_GENERAL
          );
        } else {
          spaces = JSON.parse(data);
          const newSpaces = spaces.filter(el => Number(el.id) !== Number(id));
          const spacesString = JSON.stringify(newSpaces);
          await fsPromises.writeFile(`${savedSpacesPath}/${spacesFileName}`, spacesString);
          mainWindow.webContents.send(
            'space:deleted',
          );
        }
      });
    } catch {
      mainWindow.webContents.send(
        'space:deleted',
        ERROR_GENERAL
      );
    }
  });
  ipcMain.on('space:load', async (event, { fileLocation }) => {
    try {
      const extractPath = `${savedSpacesPath}/temp/`;
      extract(fileLocation, {dir: extractPath}, async err => {
        if (err) {
          console.log(err);
        } else {
          let space = {};
          const spacePath = `${extractPath}/space.json`;
          fs.readFile(spacePath, 'utf8', async (err, data) => {
            if (err) {
              mainWindow.webContents.send(
                'space:loaded',
                ERROR_ZIP_CORRUPTED
              );
              fse.remove(extractPath, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            } else {
              ncp(extractPath, savedSpacesPath, async (err) => {
                if (err) {
                  return console.error(err);
                }
                let spaces = [];
                space = JSON.parse(data);
                const spacesPath = `${savedSpacesPath}/${spacesFileName}`;
                fs.readFile(spacesPath, 'utf8', async (err, data) => {
                  // we dont have saved spaces yet
                  if (err) {
                    spaces.push(space);
                    const spacesString = JSON.stringify(spaces);
                    await fsPromises.writeFile(`${savedSpacesPath}/${spacesFileName}`, spacesString);
                    mainWindow.webContents.send(
                      'space:loaded',
                      spaces
                    );
                  } else {
                    try {
                      spaces = JSON.parse(data);
                    } catch (e) {
                      mainWindow.webContents.send(
                        'space:loaded',
                        ERROR_JSON_CORRUPTED
                      );
                    }
                    const spaceId = Number(space.id);
                    const available = spaces.find(({ id }) => (Number(id) === spaceId));
                    if (!available) {
                      spaces.push(space);
                      const spacesString = JSON.stringify(spaces);
                      await fsPromises.writeFile(`${savedSpacesPath}/${spacesFileName}`, spacesString);
                      mainWindow.webContents.send(
                        'space:loaded',
                        spaces
                      );
                    } else {
                      mainWindow.webContents.send(
                        'space:loaded',
                        ERROR_SPACE_ALREADY_AVAILABLE
                      );
                    }
                  }
                  fs.unlink(`${savedSpacesPath}/space.json`, (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                  fse.remove(extractPath, (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                });
              });
            }
          });
        }
      });
    } catch (err) {
      console.log('error:', err);
    }
  });
  ipcMain.on('space:export', async (event, { archivePath, id, spaces } ) => {
    try {
      const space = spaces.find(el => Number(el.id) === Number(id));
      const { phases } = space;
      const spacesString = JSON.stringify(space);
      const ssPath = `${savedSpacesPath}/space.json`;
      await fsPromises.writeFile(ssPath, spacesString);
      const filesPaths = [ssPath];
      for (const phase of phases) {
        const { items = [] } = phase;
        for (let i = 0; i < items.length; i += 1) {
          const { resource } = items[i];
          if (resource) {
            const {
              hash,
              type,
            } = resource;
            const fileName = `${hash}.${type}`;
            const filePath = `${savedSpacesPath}/${fileName}`;
            const fileAvailable = await checkFileAvailable(filePath);
            if (fileAvailable){
              filesPaths.push(filePath);
            }
          }
        }
      }
      const output = fs.createWriteStream(archivePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      output.on('close', () => {
        fs.unlink(ssPath, (err) => {
          if (err) {
            console.log(err);
          }
        });
        mainWindow.webContents.send(
          'space:exported',
        );
      });
      output.on('end', () => {
        mainWindow.webContents.send(
          'space:exported',
          ERROR_GENERAL
        );
      });
      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          console.log(err);
        }
      });
      archive.on('error', err => {
        mainWindow.webContents.send(
          'space:exported',
          ERROR_GENERAL
        );
      });
      archive.pipe(output);
      filesPaths.forEach( path => {
        const pathArr = path.split('/');
        archive.file(path, { name: pathArr[pathArr.length - 1 ] });
      });
      archive.finalize();
    } catch (err) {
      console.log(err);
      mainWindow.webContents.send(
        'space:exported',
        ERROR_GENERAL
      );
    }
  });
  ipcMain.on('show-open-dialog', (event, options)=> {
    dialog.showOpenDialog(null, options, (filePaths) => {
      mainWindow.webContents.send('open-dialog-paths-selected', filePaths)
    });
  });
  ipcMain.on('show-save-dialog', (event, spaceTitle) => {
    const options = {
      title: 'Save As',
      defaultPath: `${spaceTitle}.zip`,
    };
    dialog.showSaveDialog(null, options, (filePath) => {
      mainWindow.webContents.send('save-dialog-path-selected', filePath)
    });
  });
  ipcMain.on('show-message-dialog', () => {
    const options = {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      cancelId: 0,
      message: 'Are you sure you want to delete this space?'
    };
    dialog.showMessageBox(null, options, (respond) => {
      mainWindow.webContents.send('message-dialog-respond', respond)
    });
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

const checkFileAvailable = (filePath) =>
  new Promise(resolve => fs.access(filePath, fs.constants.F_OK, err => resolve(!err)));
