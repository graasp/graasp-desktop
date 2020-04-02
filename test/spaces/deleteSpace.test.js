/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToHome } from '../menu.test';
import {
  buildSpaceCardId,
  SPACE_DELETE_BUTTON_CLASS,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import { DELETE_SPACE_PAUSE, DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP } from '../fixtures/users';

describe('Delete a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'Deleting from card removes space from Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 1 });

      const { client } = app;

      await userSignIn(client, USER_GRAASP);

      await visitAndSaveSpaceById(client, id);

      await menuGoToHome(client);

      await client.click(
        `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
      );
      await client.pause(DELETE_SPACE_PAUSE);

      // card not in saved spaces
      const card = await client.element(`#${buildSpaceCardId(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Deleting from toolbar removes space from Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 1 });

      const { client } = app;

      await userSignIn(client, USER_GRAASP);

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await client.pause(DELETE_SPACE_PAUSE);

      // card not in saved spaces
      const card = await client.element(`#${buildSpaceCardId(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Cancel deleting keeps space in Saved Spaces',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 0 });

      const { client } = app;

      await userSignIn(client, USER_GRAASP);

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await client.pause(DELETE_SPACE_PAUSE);

      await menuGoToHome(client);

      // card not in saved spaces
      const card = await client.element(`#${buildSpaceCardId(id)}`);
      expect(card.value).to.exist;
    })
  );
});
