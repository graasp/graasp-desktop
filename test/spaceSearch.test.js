/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { menuGoToSavedSpaces, mochaAsync, clearInput } from './utils';
import { createApplication, closeApplication } from './application';
import {
  SPACE_SEARCH_INPUT_ID,
  SPACE_MEDIA_CARD_CLASS,
  SPACE_NOT_AVAILABLE_TEXT_ID,
} from '../src/config/selectors';
import {
  buildSignedUserForDatabase,
  DEFAULT_GLOBAL_TIMEOUT,
  SPACE_SEARCH_PAUSE,
} from './constants';
import { searchSpacesFixtures } from './fixtures/searchSpaces';
import { SPACE_ATOMIC_STRUCTURE, SPACE_APOLLO_11 } from './fixtures/spaces';

const searchQuery = async (client, query) => {
  await clearInput(client, `#${SPACE_SEARCH_INPUT_ID}`);
  const input = await client.$(`#${SPACE_SEARCH_INPUT_ID}`);
  await input.setValue(query);
  await client.pause(SPACE_SEARCH_PAUSE);
};

describe('Space Search Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  before(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          spaces: [SPACE_ATOMIC_STRUCTURE, SPACE_APOLLO_11],
          ...buildSignedUserForDatabase(),
        },
      });
    })
  );

  after(function () {
    return closeApplication(app);
  });

  searchSpacesFixtures.forEach(([query, resultSpaceIds]) => {
    it(
      `Search query "${query}" displays correct spaces`,
      mochaAsync(async () => {
        const { client } = app;

        await menuGoToSavedSpaces(client);

        await searchQuery(client, query);

        // if expect no matching space
        if (resultSpaceIds.length === 0) {
          const isCardExisting = await (
            await client.$(`#${SPACE_NOT_AVAILABLE_TEXT_ID}`)
          ).isExisting();
          expect(isCardExisting).to.be.true;
        } else {
          // check displayed cards are result space ids
          const cardIds = [];
          for (const card of await client.$$(`.${SPACE_MEDIA_CARD_CLASS}`)) {
            cardIds.push(await card.getAttribute('id'));
          }
          expect(cardIds).to.have.length(resultSpaceIds.length);
          expect(cardIds).to.include.members(resultSpaceIds);
        }
      })
    );
  });
});
