import { expect } from 'chai';
import { buildPhaseAppName } from '../../src/config/selectors';
import { INPUT_TYPE_PAUSE, SAVE_USER_INPUT_PAUSE } from '../constants';

const INPUT_TEXT_FIELD_SELECTOR = '#inputTextField';
const SAVE_BUTTON_SELECTOR = 'button';

export const typeInTextInputApp = async (client, id, text) => {
  await client.switchToFrame(
    await client.$(`[name="${buildPhaseAppName(id)}"]`)
  );
  await (await client.$(INPUT_TEXT_FIELD_SELECTOR)).setValue(text);
  await client.pause(INPUT_TYPE_PAUSE);

  // click on save button
  await (await client.$(SAVE_BUTTON_SELECTOR)).click();
  await client.pause(SAVE_USER_INPUT_PAUSE);

  // reset client on parent frame
  await client.switchToFrame(null);
};

export const checkTextInputAppContainsText = async (client, id, text) => {
  await client.switchToFrame(
    await client.$(`[name="${buildPhaseAppName(id)}"]`)
  );
  const inputText = await (await client.$(INPUT_TEXT_FIELD_SELECTOR)).getText();

  expect(inputText).to.equal(text);
  // reset client on parent frame
  await client.switchToFrame(null);
};
