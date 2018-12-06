const { app, BrowserWindow, shell, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const isOnline = require('is-online');
const fsPromises = fs.promises;
const electronDl = require('electron-dl');
const { download } = electronDl;
const extract = require('extract-zip');


let mainWindow;

const savedSpacesPath = app.getPath('userData') + '/.meta';

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

generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [{ label: 'Load Space', click() { app.quit() }}, { role: 'about' }, { role: 'quit' }],
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
    const space = spaces.find(el => el.id === Number(id));
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
            const fileAvailable = await checkFileAvailable({ filePath });
            if (fileAvailable){
              phase.items[i].asset = filePath;
            } else {
              const isConnected = await isOnline();
              if(isConnected) {
                await download(mainWindow, uri, { directory: savedSpacesPath, filename: fileName })
                  .then(dl => {
                    phase.items[i].asset = dl.getSavePath();
                  })
                  .catch(console.log('error'));
              } else {
                mainWindow.webContents.send(
                  'space:gotten',
                  1
                );
              }
            }
          }
        }
      }
      mainWindow.webContents.send(
        'space:gotten',
        space
      );
    } catch (err) {
      console.log('error:', err);
    }
  });
  ipcMain.on('spaces:get', () => {
      let spaces = [];
      const spacesPath = `${savedSpacesPath}/ss.json`;
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
  ipcMain.on('space:load', async (event, { fileLocation }) => {
    try {
      extract(fileLocation, {dir: savedSpacesPath}, async err => {
        if (err) {
          console.log(err);
        } else {
          let space = {};
          const spacePath = `${savedSpacesPath}/space.json`;
          fs.readFile(spacePath, 'utf8', async (err, data) => {
            if (err) {
              mainWindow.webContents.send(
                'space:loaded',
                1
              );
            } else {
              let spaces = [];
              space = JSON.parse(data);
              const spacesPath = `${savedSpacesPath}/ss.json`;
              fs.readFile(spacesPath, 'utf8', async (err, data) => {
                // we dont have saved spaces yet
                if (err) {
                  spaces.push(space);
                  const spacesString = JSON.stringify(spaces);
                  await fsPromises.writeFile(`${savedSpacesPath}/ss.json`, spacesString);
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
                      2
                    );
                  }
                  const spaceId = Number(space.id);
                  const available = spaces.find(({ id }) => (Number(id) === spaceId));
                  if (!available) {
                    spaces.push(space);
                    const spacesString = JSON.stringify(spaces);
                    await fsPromises.writeFile(`${savedSpacesPath}/ss.json`, spacesString);
                    mainWindow.webContents.send(
                      'space:loaded',
                      spaces
                    );
                  } else {
                    mainWindow.webContents.send(
                      'space:loaded',
                      3
                    );
                  }
                }
              });
            }
            fs.unlink(spacePath, (err) => {
              if (err) {
                console.log(err);
              }
            });
          });
        }
      });
    } catch (err) {
      console.log('error:', err);
    }
  });
  ipcMain.on('show-open-dialog', ()=> {
    const options = {
      filters: [
        { name: 'zip', extensions: ['zip'] },
      ],
    };
    dialog.showOpenDialog(null, options, (filePaths) => {
      mainWindow.webContents.send('open-dialog-paths-selected', filePaths)
    });
  })
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

const checkFileAvailable = ({ filePath }) =>
  new Promise(resolve => fs.access(filePath, fs.constants.F_OK, err => resolve(!err)));
