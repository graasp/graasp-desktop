/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToHome } from '../menu.test';
import {
  buildSpaceCardId,
  SPACE_CLEAR_BUTTON_CLASS,
  SPACE_CARD_LINK_CLASS,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH,
  SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
} from '../fixtures/spaces';
import { loadSpaceById } from './loadSpace.test';
import { hasSavedSpaceLayout } from './visitSpace.test';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  TOOLTIP_FADE_OUT_PAUSE,
  OPEN_SAVED_SPACE_PAUSE,
} from '../constants';
import { userLogin } from '../userLogin.test';
import { USER_GRAASP } from '../fixtures/users';

// @TODO this should be changed to load user input from zip
describe.skip('Clear User Input in a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Mock positive response for dialog', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });
        await userLogin(app.client, USER_GRAASP);
      })
    );

    it(
      'Clear from toolbar remove all user input in apps',
      mochaAsync(async () => {
        const { client } = app;

        // load space with user input
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH
        );

        await client.click(`.${SPACE_CLEAR_BUTTON_CLASS}`);
        await client.pause(TOOLTIP_FADE_OUT_PAUSE);

        const resources = {};

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, resources);
      })
    );

    it(
      'Clear from card remove all user input in apps',
      mochaAsync(async () => {
        const { client } = app;
        const { id } = SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT;

        // load space with user input
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH
        );

        await menuGoToHome(client);

        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_CLEAR_BUTTON_CLASS}`
        );
        await client.pause(TOOLTIP_FADE_OUT_PAUSE);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await client.pause(OPEN_SAVED_SPACE_PAUSE);

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );
  });

  describe('Mock negative response for dialog', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 0 });
        await userLogin(app.client, USER_GRAASP);
      })
    );

    it(
      'Cancel clear still contains user input',
      mochaAsync(async () => {
        const { client } = app;

        // load space with user input
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH
        );

        await client.click(`.${SPACE_CLEAR_BUTTON_CLASS}`);
        await client.pause(TOOLTIP_FADE_OUT_PAUSE);

        await hasSavedSpaceLayout(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT
        );
      })
    );
  });
});
