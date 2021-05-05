import { Application } from 'spectron';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';
import fse from 'fs-extra';
import extract from 'extract-zip';
import { buildSignedInUserForDatabase, prepareSpaceForApi } from './utils';

const getFormattedTime = () => {
  const today = new Date();
  const y = today.getFullYear();
  // JavaScript months are 0-based.
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  return `${y}${m}${d}_${h}-${mi}-${s}`;
};

const setUpDatabase = async (database = buildSignedInUserForDatabase()) => {
  const tmpDatabasePath = path.join(__dirname, 'tmp', getFormattedTime());
  const varFolder = path.join(tmpDatabasePath, 'var');
  fse.ensureDirSync(varFolder);

  const db = {
    ...database,
    spaces: [],
    appInstanceResources: [],
    actions: [],
  };

  if (database) {
    // add paths data in var
    const spaces = database?.spaces || [];
    // eslint-disable-next-line no-restricted-syntax
    for (const {
      path: spacePath,
      space,
      appInstanceResources,
      actions,
    } of spaces) {
      // eslint-disable-next-line no-await-in-loop
      await extract(path.join(__dirname, './fixtures/spaces', spacePath), {
        dir: `${varFolder}/${space.id}`,
      });
      db.spaces.push(space);
      db.appInstanceResources = db.appInstanceResources.concat(
        appInstanceResources
      );
      db.actions = db.actions.concat(actions);
    }

    const classrooms = database?.classrooms || [];
    // eslint-disable-next-line no-restricted-syntax
    for (const { id } of classrooms) {
      fse.ensureDirSync(path.join(varFolder, id));
    }

    // set db
    fse.writeFileSync(`${varFolder}/db.json`, JSON.stringify(db));
  }

  return tmpDatabasePath;
};

const createApplication = async ({
  database = buildSignedInUserForDatabase(),
  responses = {
    showMessageDialogResponse: undefined,
    showSaveDialogResponse: undefined,
    showOpenDialogResponse: undefined,
    showTours: 0,
  },
  api = [],
} = {}) => {
  const {
    showMessageDialogResponse,
    showSaveDialogResponse,
    showOpenDialogResponse,
    showTours,
  } = responses;
  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0, SHOW_TOURS: showTours };

  if (showMessageDialogResponse !== undefined) {
    env.SHOW_MESSAGE_DIALOG_RESPONSE = showMessageDialogResponse;
  }

  if (showSaveDialogResponse !== undefined) {
    env.SHOW_SAVE_DIALOG_RESPONSE = showSaveDialogResponse;
  }

  if (showOpenDialogResponse !== undefined) {
    env.SHOW_OPEN_DIALOG_RESPONSE = showOpenDialogResponse;
  }

  // mock spaces fetch using the api
  // when not defined, provide default api database
  env.API_DATABASE = JSON.stringify(
    api.map((space) => prepareSpaceForApi(space))
  );

  // set up database
  const tmpDatabasePath = await setUpDatabase(database);

  // locally use the public electron application
  // for CI use the build application
  const applicationPath = process.env.CI
    ? path.join(__dirname, '../build/electron.js')
    : path.join(__dirname, '../public/electron.js');

  const app = new Application({
    // Your electron path can be any binary
    // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
    // But for the sake of the example we fetch it from our node_modules.
    path: electronPath,

    // Assuming you have the following directory structure

    //  |__ my project
    //     |__ ...
    //     |__ main.js
    //     |__ package.json
    //     |__ index.html
    //     |__ ...
    //     |__ test
    //        |__ spec.js  <- You are here! ~ Well you should be.

    // The following line tells spectron to look and use the main.js file
    // and the package.json located 1 level above.
    args: [applicationPath],
    // use a specific application folder and var folder to save data
    chromeDriverArgs: [`--user-data-dir=${tmpDatabasePath}`],
    env,
  });

  await app.start();

  app.client.addCommand('getUserDataPath', () =>
    path.join(app.client.capabilities.chrome.userDataDir, 'var')
  );

  await app.client.pause(1000);
  return app;
};

const closeApplication = (app) => {
  if (app && app.isRunning()) {
    return app.stop();
  }
  return true;
};

export { createApplication, closeApplication };
