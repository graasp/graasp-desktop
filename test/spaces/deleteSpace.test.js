import { expect } from 'chai';
import {
  mochaAsync,
  menuGoToSavedSpaces,
  expectElementToExist,
  buildSignedInUserForDatabase,
  clickOnSpaceCard,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_DELETE_BUTTON_CLASS,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';

describe('Delete a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  it(
    'Deleting from card removes space from Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({
        database: {
          spaces: [SPACE_ATOMIC_STRUCTURE],
          ...buildSignedInUserForDatabase(),
        },
        responses: { showMessageDialogResponse: 1 },
      });

      const { client } = app;

      await menuGoToSavedSpaces(client);

      const deleteButton = await client.$(
        `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
      );
      await deleteButton.click();

      // card not in saved spaces
      const card = await client.$(`#${buildSpaceCardId(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Deleting from toolbar removes space from Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({
        database: {
          spaces: [SPACE_ATOMIC_STRUCTURE],
          ...buildSignedInUserForDatabase(),
        },
        responses: { showMessageDialogResponse: 1 },
      });

      const { client } = app;

      await menuGoToSavedSpaces(client);
      await clickOnSpaceCard(client, id);

      const deleteButton = await client.$(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await deleteButton.click();

      // card not in saved spaces
      const card = await client.$(`#${buildSpaceCardId(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Cancel deleting keeps space in Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({
        database: {
          spaces: [SPACE_ATOMIC_STRUCTURE],
          ...buildSignedInUserForDatabase(),
        },
        responses: { showMessageDialogResponse: 0 },
      });

      const { client } = app;

      await menuGoToSavedSpaces(client);

      const deleteButton = await client.$(
        `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
      );
      await deleteButton.click();

      await menuGoToSavedSpaces(client);

      // card in saved spaces
      expectElementToExist(client, `#${buildSpaceCardId(id)}`);
    })
  );
});
