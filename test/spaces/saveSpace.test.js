/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToHome } from '../menu.test';
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

describe('Save a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );
  it(
    'Saving a space adds it to Saved Spaces',
    mochaAsync(async () => {
      const { client } = app;
      const { id, description, name } = SPACE_ATOMIC_STRUCTURE;

      await visitAndSaveSpaceById(client, id);

      await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);

      // check space is referenced in saved spaces
      await menuGoToHome(client);

      await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

      // go to space
      await client.click(`#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`);
      await client.pause(OPEN_SAVED_SPACE_PAUSE);

      await hasSavedSpaceHomeLayout(client, { name, description });
    })
  );
});
