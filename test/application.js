import { Application } from 'spectron';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';

const createApplication = async (
  {
    showMessageDialogResponse,
    showSaveDialogResponse,
    showOpenDialogResponse,
  } = {
    showMessageDialogResponse: undefined,
    showSaveDialogResponse: undefined,
    showOpenDialogResponse: undefined,
  }
) => {
  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0 };

  if (showMessageDialogResponse !== undefined) {
    env.SHOW_MESSAGE_DIALOG_RESPONSE = showMessageDialogResponse;
  }

  if (showSaveDialogResponse !== undefined) {
    env.SHOW_SAVE_DIALOG_RESPONSE = showSaveDialogResponse;
  }

  if (showOpenDialogResponse !== undefined) {
    env.SHOW_OPEN_DIALOG_RESPONSE = showOpenDialogResponse;
  }

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
    args: [path.join(__dirname, '../public/electron.js')],
    env,
  });

  await app.start();
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
