import {
  mochaAsync,
  expectElementToExist,
  expectElementToNotExist,
  menuGoToSavedSpaces,
  buildSignedInUserForDatabase,
  menuGoToHome,
  menuGoToSignOut,
  userSignIn,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_FAVORITE_BUTTON_CLASS,
  SPACE_CARD_LINK_CLASS,
  FAVORITE_SPACES_WRAPPER_ID,
  HOME_MAIN_ID,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import {
  SET_SPACE_AS_FAVORITE_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
} from '../constants';
import { USER_GRAASP, USER_ALICE, USER_BOB } from '../fixtures/users';

describe('Set space as favorite', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  describe('Buttons', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
            ...buildSignedInUserForDatabase(USER_GRAASP),
          },
        });
      })
    );

    it(
      'Set a space as favorite from card',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        await menuGoToSavedSpaces(client);

        const favoriteButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_FAVORITE_BUTTON_CLASS}`
        );
        await favoriteButton.click();
        await client.pause(SET_SPACE_AS_FAVORITE_PAUSE);

        // check space is in home
        await menuGoToHome(client);
        await expectElementToExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );

        // uncheck favorite
        await favoriteButton.click();

        // space should not be in favorite spaces
        await expectElementToNotExist(
          client,
          `#${HOME_MAIN_ID}`,
          buildSpaceCardId(id)
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

        await menuGoToSavedSpaces(client);

        const favoriteButton = await client.$(
          `.${SPACE_FAVORITE_BUTTON_CLASS}`
        );
        await favoriteButton.click();

        // check space is in home tab
        await menuGoToHome(client);
        await expectElementToExist(
          client,
          `#${FAVORITE_SPACES_WRAPPER_ID} #${buildSpaceCardId(id)}`
        );

        // uncheck favorite
        await menuGoToSavedSpaces(client);
        const spaceCardLink = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await spaceCardLink.click();
        await favoriteButton.click();

        // space should not be in home
        await menuGoToHome(client);
        // no favorite spaces at all
        await expectElementToNotExist(
          client,
          `#${HOME_MAIN_ID}`,
          FAVORITE_SPACES_WRAPPER_ID
        );
      })
    );
  });

  describe('Multi-users', () => {
    it(
      'Set a space as favorite is different per user',
      mochaAsync(async () => {
        app = await createApplication({ database: {} });

        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        // sign in with alice, add space and set as favorite
        await userSignIn(client, USER_ALICE);
        await visitAndSaveSpaceById(client, id);
        const favoriteButton = await client.$(
          `.${SPACE_FAVORITE_BUTTON_CLASS}`
        );
        await favoriteButton.click();
        await menuGoToSignOut(client);

        // sign in with bob, no favorite
        await userSignIn(app.client, USER_BOB);
        await expectElementToNotExist(
          client,
          `#${HOME_MAIN_ID}`,
          buildSpaceCardId(id)
        );
        await menuGoToSignOut(client);

        // sign in with alice, still favorite
        await userSignIn(app.client, USER_ALICE);
        await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
      })
    );
  });
});
