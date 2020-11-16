/* eslint-disable func-names */
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  expectElementToExist,
  expectElementToNotExist,
  menuGoToSignOut,
  mochaAsync,
  userSignIn,
} from './utils';
import { closeApplication, createApplication } from './application';
import { USER_BOB, USER_SAM } from './fixtures/users';
import { TOUR_END_SELECTOR } from '../src/config/selectors';

describe('Tour Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        showOpenDialogResponse: 1,
        showTours: true,
      });
    })
  );

  after(function () {
    return closeApplication(app);
  });

  describe('Display tour on sign in', function () {
    afterEach(function () {
      return closeApplication(app);
    });

    it(
      `displays the tour after signing in`,
      mochaAsync(async () => {
        const { client } = app;
        await userSignIn(client, USER_BOB, false);
        await expectElementToExist(client, TOUR_END_SELECTOR);
      })
    );
  });

  describe('Tour close state store', function () {
    it(
      `does not display the tour again after closing and logging back in`,
      mochaAsync(async () => {
        const { client } = app;
        await userSignIn(client, USER_BOB, true);
        await menuGoToSignOut(client);
        await userSignIn(client, USER_BOB, false);
        await expectElementToNotExist(client, TOUR_END_SELECTOR);
      })
    );
    it(
      `shows tests for other users`,
      mochaAsync(async () => {
        const { client } = app;
        await userSignIn(client, USER_SAM, false);
        await expectElementToExist(client, TOUR_END_SELECTOR);
      })
    );
  });
});
