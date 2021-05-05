/* eslint-disable no-await-in-loop */
import {
  mochaAsync,
  menuGoToVisitSpace,
  menuGoToLoadSpace,
  menuGoToSettings,
  menuGoToDashboard,
  menuGoToSavedSpaces,
} from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';

describe('Menu Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  before(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );

  afterEach(() => closeApplication(app));

  it(
    'MainMenu redirects to correct path',
    mochaAsync(async () => {
      const { client } = app;
      await menuGoToVisitSpace(client);
      await menuGoToLoadSpace(client);
      await menuGoToSettings(client);
      await menuGoToDashboard(client);
      await menuGoToSavedSpaces(client);
    })
  );
});
