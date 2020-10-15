/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync, userSignIn } from './utils';
import { createApplication, closeApplication } from './application';
import {
  SPACE_SEARCH_INPUT_ID,
  SPACE_MEDIA_CARD_CLASS,
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  SPACE_SEARCH_PAUSE,
  TOOLTIP_FADE_OUT_PAUSE,
} from './constants';
import { USER_GRAASP } from './fixtures/users';
import { loadSpaceById } from './spaces/loadSpace.test';
import { searchSpacesFixtures } from './fixtures/searchSpaces';

const searchQuery = async (client, query) => {
  await (await client.$(`#${SPACE_SEARCH_INPUT_ID}`)).setValue(query);
  await client.pause(SPACE_SEARCH_PAUSE);
};

describe('Space Search Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
      await userSignIn(app.client, USER_GRAASP);
    })
  );

  afterEach(function () {
    return closeApplication(app);
  });

  searchSpacesFixtures.forEach(([spaceFilepaths, query, resultSpaceIds]) => {
    it(
      `Search query "${query}" displays correct spaces`,
      mochaAsync(async () => {
        const { client } = app;

        for (const filepath of spaceFilepaths) {
          await loadSpaceById(client, filepath);
        }

        await client.pause(TOOLTIP_FADE_OUT_PAUSE);

        await searchQuery(client, query);

        // if expect no matching space
        if (resultSpaceIds.length === 0) {
          const isCardExisting = await (
            await client.$(`.${SPACE_MEDIA_CARD_CLASS}`)
          ).isExisting();
          expect(isCardExisting).to.be.false;
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
