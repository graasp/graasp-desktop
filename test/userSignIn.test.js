import {
  LOGIN_USERNAME_INPUT_ID,
  LOGIN_BUTTON_ID,
} from '../src/config/selectors';
import { INPUT_TYPE_PAUSE, LOGIN_PAUSE } from './constants';

/* eslint-disable-next-line import/prefer-default-export */
export const userSignIn = async (client, { name }) => {
  await client.setValue(`#${LOGIN_USERNAME_INPUT_ID}`, name);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${LOGIN_BUTTON_ID}`);
  await client.pause(LOGIN_PAUSE);
};
