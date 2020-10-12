/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import {
  mochaAsync,
  userSignIn,
  menuGoToSpacesNearby,
  menuGoToVisitSpace,
  menuGoToLoadSpace,
  menuGoToSettings,
  menuGoToDashboard,
  menuGoToSavedSpaces,
} from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import { USER_GRAASP } from './fixtures/users';

describe('Menu Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  before(
    mochaAsync(async () => {
      app = await createApplication();
      await userSignIn(app.client, USER_GRAASP);
    })
  );

  afterEach(function () {
    return closeApplication(app);
  });

  it(
    'MainMenu redirects to correct path',
    mochaAsync(async () => {
      const { client } = app;
      await menuGoToSpacesNearby(client);
      await menuGoToVisitSpace(client);
      await menuGoToLoadSpace(client);
      await menuGoToSettings(client);
      await menuGoToDashboard(client);
      await menuGoToSavedSpaces(client);
    })
  );
});
