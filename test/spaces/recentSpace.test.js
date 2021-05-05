import { expect } from 'chai';
import {
  mochaAsync,
  expectElementToExist,
  expectElementToNotExist,
  userSignIn,
  menuGoToHome,
  menuGoToSignOut,
  buildSignedInUserForDatabase,
  menuGoToSavedSpaces,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_MEDIA_CARD_CLASS,
  RECENT_SPACES_WRAPPER_ID,
  HOME_MAIN_ID,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_APOLLO_11,
  SPACE_AIR_POLLUTION,
  SPACE_LIGHT_COLOR,
  SPACE_MOON,
  SPACE_AMPHIBIANS,
  SPACE_WITH_MULTIPLE_CHANGES,
} from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import { USER_GRAASP, USER_BOB } from '../fixtures/users';
import { loadSpaceById } from './loadSpace.test';
import { MAX_RECENT_SPACES } from '../../src/config/constants';

describe('Recent Spaces', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  const spaces = [
    SPACE_WITH_MULTIPLE_CHANGES,
    SPACE_APOLLO_11,
    SPACE_AIR_POLLUTION,
    SPACE_LIGHT_COLOR,
    SPACE_MOON,
    SPACE_AMPHIBIANS,
  ];

  afterEach(() => closeApplication(app));

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        api: [...spaces, SPACE_ATOMIC_STRUCTURE],
        database: {
          ...buildSignedInUserForDatabase(),
          spaces,
        },
      });
    })
  );

  describe('Add to Recent Spaces when', () => {
    it(
      'Loading',
      mochaAsync(async () => {
        const {
          space: { id },
          path,
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        await loadSpaceById(client, path);

        // check space is in home
        await menuGoToHome(client);
        await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
      })
    );

    it(
      'Visiting and Saving',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const { client } = app;

        await visitAndSaveSpaceById(client, id);

        // check space is in home
        await menuGoToHome(client);
        await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
      })
    );

    describe('Opening saved spaces', () => {
      it(
        `Display only ${MAX_RECENT_SPACES} most recent spaces`,
        mochaAsync(async () => {
          const { client } = app;

          if (spaces.length < MAX_RECENT_SPACES + 1) {
            throw new Error(
              "spaces don't contain enough spaces to make the test work correctly"
            );
          }

          // open one more space than MAX_RECENT_SPACES
          for (const {
            space: { id },
          } of spaces.slice(-(MAX_RECENT_SPACES + 1))) {
            await menuGoToSavedSpaces(client);
            const card = await client.$(`#${buildSpaceCardId(id)}`);
            await card.click();
          }

          // check spaces is in home : first space should not be displayed
          await menuGoToHome(client);
          const mediaCards = await client.$$(
            `#${RECENT_SPACES_WRAPPER_ID} .${SPACE_MEDIA_CARD_CLASS}`
          );
          const mediaCardsIds = [];
          for (const card of mediaCards) {
            mediaCardsIds.push(await card.getAttribute('id'));
          }
          expect(mediaCardsIds.length).to.equal(MAX_RECENT_SPACES);

          // we do not check order because in the dom it doesn't have the same order
          spaces
            // drop first visited space
            .slice(1)
            // get corresponding ids
            .map(({ space: { id } }) => buildSpaceCardId(id))
            // check all spaces are displayed in home
            .forEach((id) => {
              expect(mediaCardsIds.includes(id)).to.be.true;
            });
        })
      );
    });
  });

  it(
    'Recent Spaces are saved per user',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      // check space is in home
      await menuGoToHome(client);
      await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
      await menuGoToSignOut(client);

      // sign in as Bob, no recent spaces
      await userSignIn(client, USER_BOB);
      await expectElementToNotExist(
        client,
        `#${HOME_MAIN_ID}`,
        buildSpaceCardId(id)
      );
      await menuGoToSignOut(client);

      // sign in as graasp, recent spaces still saved
      await userSignIn(client, USER_GRAASP);
      await expectElementToExist(client, `#${buildSpaceCardId(id)}`);
    })
  );
});
