const { Application } = require('spectron');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

const createApplication = (dialogResponse = undefined) => {
  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0 };

  if (dialogResponse !== undefined) {
    env.DIALOG_RESPONSE = dialogResponse;
  }

  return new Application({
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
};

const closeApplication = app => {
  if (app && app.isRunning()) {
    return app.stop();
  }
  return true;
};

module.exports = { createApplication, closeApplication };
