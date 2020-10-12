/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import {
  mochaAsync,
  userSignIn,
  menuGoToSavedSpaces,
  menuGoToSignOut,
  menuGoToPhase,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_CARD_LINK_CLASS,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_PATH,
} from '../fixtures/spaces';
import { loadSpaceById } from './loadSpace.test';
import { DEFAULT_GLOBAL_TIMEOUT, OPEN_SAVED_SPACE_PAUSE } from '../constants';
import { USER_GRAASP, USER_BOB, USER_ALICE } from '../fixtures/users';
import {
  typeInTextInputApp,
  checkTextInputAppContainsText,
} from '../apps/textInputApp';

const userInputTextForUser = (name) => {
  return `user input from ${name}`;
};

describe('Save User Input in a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('Use graasp user', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });
        await userSignIn(app.client, USER_GRAASP);
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
        await loadSpaceById(client, SPACE_ATOMIC_STRUCTURE_PATH, id);

        // go to orientation tab
        await menuGoToPhase(client, 0);

        // type in text input app
        await typeInTextInputApp(client, textInputAppId, text);

        // go back to home
        await menuGoToSavedSpaces(client);

        // check user input is saved
        const spaceCardLink = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await spaceCardLink.click();
        await client.pause(OPEN_SAVED_SPACE_PAUSE);

        await menuGoToPhase(client, 0);
        await checkTextInputAppContainsText(client, textInputAppId, text);
      })
    );
  });

  describe('Multiple users scenarios', function () {
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
          await userSignIn(app.client, user);
          await menuGoToSavedSpaces(client);
          const text = userInputTextForUser(user.name);

          // first user load space
          if (index === 0) {
            // load space with user input
            await loadSpaceById(client, SPACE_ATOMIC_STRUCTURE_PATH, id);
          }
          // next users go to home
          // this should change if users don't share spaces
          else {
            const spaceCard = await client.$(
              `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
            );
            await spaceCard.click();
            await client.pause(OPEN_SAVED_SPACE_PAUSE);
          }

          // go to orientation tab
          await menuGoToPhase(client, 0);

          // type in text input app
          await typeInTextInputApp(client, textInputAppId, text);

          // go back to home
          await menuGoToSavedSpaces(client);

          // check user input is saved
          const spaceCard = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await spaceCard.click();
          await client.pause(OPEN_SAVED_SPACE_PAUSE);

          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }

        // check user input still exist after logout
        for (const user of users) {
          await userSignIn(client, user);
          await menuGoToSavedSpaces(client);
          const text = userInputTextForUser(user.name);

          const spaceCard = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await spaceCard.click();
          await client.pause(OPEN_SAVED_SPACE_PAUSE);

          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }
      })
    );
  });
});
