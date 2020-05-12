/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import fs from 'fs';
import { mochaAsync, createRandomString } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToSavedSpaces } from '../menu.test';
import {
  buildSpaceCardId,
  SPACE_EXPORT_BUTTON_CLASS,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import {
  EXPORT_SPACE_PAUSE,
  EXPORT_FILEPATH,
  DEFAULT_GLOBAL_TIMEOUT,
} from '../constants';
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP } from '../fixtures/users';

describe('Export a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'Exporting from toolbar saves space in local computer',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;

      app = await createApplication({ showSaveDialogResponse: filepath });

      const { client } = app;

      await userSignIn(client, USER_GRAASP);

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
      await client.pause(EXPORT_SPACE_PAUSE);

      // check exported files locally
      expect(fs.existsSync(filepath)).to.be.true;
    })
  );
  it(
    'Exporting from card saves space in local computer',
    mochaAsync(async () => {
      const {
        space: { id },
      } = SPACE_ATOMIC_STRUCTURE;

      const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
      app = await createApplication({ showSaveDialogResponse: filepath });

      const { client } = app;

      await userSignIn(client, USER_GRAASP);

      await visitAndSaveSpaceById(client, id);

      await menuGoToSavedSpaces(client);

      await client.click(
        `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
      );
      await client.pause(EXPORT_SPACE_PAUSE);

      // check exported files locally
      expect(fs.existsSync(filepath)).to.be.true;
    })
  );
});
