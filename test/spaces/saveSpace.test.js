/* eslint-disable no-unused-expressions */
import { mochaAsync, menuGoToSavedSpaces, clickOnSpaceCard } from '../utils';
import { createApplication, closeApplication } from '../application';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import {
  checkSpaceCardLayout,
  hasSavedSpaceLayout,
  hasSavedSpaceHomeLayout,
  visitAndSaveSpaceById,
} from './visitSpace.test';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import { USER_GRAASP } from '../fixtures/users';

describe('Save a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
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
        user: USER_GRAASP,
      });

      // check space is referenced in saved spaces
      await menuGoToSavedSpaces(client);

      await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

      // go to space
      await clickOnSpaceCard(client, id);

      await hasSavedSpaceHomeLayout(client, { name, description });
    })
  );
});
