/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { mochaAsync, userSignIn, menuGoToSavedSpaces } from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_CARD_LINK_CLASS,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import {
  checkSpaceCardLayout,
  hasSavedSpaceLayout,
  hasSavedSpaceHomeLayout,
  visitAndSaveSpaceById,
} from './visitSpace.test';
import { OPEN_SAVED_SPACE_PAUSE, DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import { USER_GRAASP } from '../fixtures/users';

describe('Save a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  let globalUser;

  afterEach(function () {
    return closeApplication(app);
  });

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
      globalUser = USER_GRAASP;
      await userSignIn(app.client, globalUser);
    })
  );
  it(
    'Saving a space adds it to Saved Spaces',
    mochaAsync(async () => {
      const { client } = app;
      const {
        space: { id, description, name },
      } = SPACE_ATOMIC_STRUCTURE;

      await visitAndSaveSpaceById(client, id);

      await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, {
        user: globalUser,
      });

      // check space is referenced in saved spaces
      await menuGoToSavedSpaces(client);

      await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

      // go to space
      const spaceCardLink = await client.$(
        `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
      );
      await spaceCardLink.click();
      await client.pause(OPEN_SAVED_SPACE_PAUSE);

      await hasSavedSpaceHomeLayout(client, { name, description });
    })
  );
});
