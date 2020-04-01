/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToHome, menuGoToSignOut } from '../menu.test';
import {
  buildSpaceCardId,
  SPACE_CARD_LINK_CLASS,
  PHASE_MENU_LIST_ID,
  PHASE_MENU_ITEM,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_PATH,
} from '../fixtures/spaces';
import { loadSpaceById } from './loadSpace.test';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  OPEN_SAVED_SPACE_PAUSE,
  LOAD_PHASE_PAUSE,
} from '../constants';
import { userLogin } from '../userLogin.test';
import { USER_GRAASP, USER_BOB, USER_ALICE } from '../fixtures/users';
import {
  typeInTextInputApp,
  checkUserInputInTextInputApp,
} from '../apps/textInputApp';

const userInputTextForUser = name => {
  return `user input from ${name}`;
};

describe('Save User Input in a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Use graasp user', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });
        await userLogin(app.client, USER_GRAASP);
      })
    );

    it(
      'User input when typing in text app is saved ',
      mochaAsync(async () => {
        const { client } = app;
        const text = 'user input';
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId } = phases[0].items[1];

        // load space with user input
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE,
          SPACE_ATOMIC_STRUCTURE_PATH
        );

        // go to orientation tab
        await client.click(`#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${0}`);
        await client.pause(LOAD_PHASE_PAUSE);

        // type in text input app
        await typeInTextInputApp(client, textInputAppId, text);

        // go back to home
        await menuGoToHome(client);

        // check user input is saved
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await client.pause(OPEN_SAVED_SPACE_PAUSE);

        await client.click(`#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${0}`);
        await checkUserInputInTextInputApp(client, textInputAppId, text);
      })
    );
  });

  describe('Multiple users scenarios', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });
      })
    );

    it(
      'User input when typing in text app is saved for different users',
      mochaAsync(async () => {
        const { client } = app;
        const users = [USER_GRAASP, USER_ALICE, USER_BOB];

        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId } = phases[0].items[1];

        for (const [index, user] of users.entries()) {
          await userLogin(app.client, user);
          const text = userInputTextForUser(user.name);

          // first user load space
          if (index === 0) {
            // load space with user input
            await loadSpaceById(
              client,
              SPACE_ATOMIC_STRUCTURE,
              SPACE_ATOMIC_STRUCTURE_PATH
            );
          }
          // next users go to home
          // this should change if users don't share spaces
          else {
            await client.click(
              `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
            );
            await client.pause(OPEN_SAVED_SPACE_PAUSE);
          }

          // go to orientation tab
          await client.click(
            `#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${0}`
          );
          await client.pause(LOAD_PHASE_PAUSE);

          // type in text input app
          await typeInTextInputApp(client, textInputAppId, text);

          // go back to home
          await menuGoToHome(client);

          // check user input is saved
          await client.click(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await client.pause(OPEN_SAVED_SPACE_PAUSE);

          await client.click(
            `#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${0}`
          );
          await checkUserInputInTextInputApp(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }

        // check user input still exist after logout
        for (const user of users) {
          await userLogin(client, user);
          const text = userInputTextForUser(user.name);

          await client.click(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await client.pause(OPEN_SAVED_SPACE_PAUSE);

          await client.click(
            `#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${0}`
          );
          await checkUserInputInTextInputApp(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }
      })
    );
  });
});
