/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  mochaAsync,
  expectElementToExist,
  expectElementToNotExist,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  menuGoToSavedSpaces,
  menuGoToHome,
  menuGoToSignOut,
} from '../menu.test';
import {
  buildSpaceCardId,
  SPACE_FAVORITE_BUTTON_CLASS,
  SPACE_CARD_LINK_CLASS,
  FAVORITE_SPACES_WRAPPER_ID,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import {
  SET_SPACE_AS_FAVORITE_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
  OPEN_SAVED_SPACE_PAUSE,
} from '../constants';
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP, USER_ALICE, USER_BOB } from '../fixtures/users';

describe('Set space as favorite', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Buttons', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        await userSignIn(app.client, USER_GRAASP);
      })
    );

    it(
      'Set a space as favorite from card',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        await visitAndSaveSpaceById(client, id);

        await menuGoToSavedSpaces(client);

        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_FAVORITE_BUTTON_CLASS}`
        );
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);

        // check space is in home
        await menuGoToHome(client);
        await expectElementToExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );

        // uncheck favorite
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_FAVORITE_BUTTON_CLASS}`
        );
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);

        // space should not be in favorite spaces
        await expectElementToNotExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );
      })
    );

    it(
      'Set a space as favorite from toolbar',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        await visitAndSaveSpaceById(client, id);

        await client.click(`.${SPACE_FAVORITE_BUTTON_CLASS}`);
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);

        // check space is in home tab
        await menuGoToHome(client);
        await expectElementToExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );

        // uncheck favorite
        await menuGoToSavedSpaces(client);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await client.pause(OPEN_SAVED_SPACE_PAUSE);
        await client.click(`.${SPACE_FAVORITE_BUTTON_CLASS}`);
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);

        // space should not be in home
        await menuGoToHome(client);
        await expectElementToNotExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );
      })
    );
  });

  describe('Multi-users', function() {
    it(
      'Set a space as favorite is different per user',
      mochaAsync(async () => {
        app = await createApplication();

        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        // sign in with alice, add space and set as favorite
        await userSignIn(client, USER_ALICE);
        await visitAndSaveSpaceById(client, id);
        await client.click(`.${SPACE_FAVORITE_BUTTON_CLASS}`);
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);
        await menuGoToSignOut(client);

        // sign in with bob, no favorite
        await userSignIn(app.client, USER_BOB);
        await expectElementToNotExist(client, `#${buildSpaceCardId(id)}`);
        await menuGoToSignOut(client);

        // sign in with alice, still favorite
        await userSignIn(app.client, USER_ALICE);
        await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
      })
    );
  });
});
