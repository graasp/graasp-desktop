import { toastr } from 'react-redux-toastr';
import {
  FLAG_SIGNING_IN,
  FLAG_SIGNING_OUT,
  SIGN_IN_SUCCEEDED,
  SIGN_OUT_SUCCEEDED,
  FLAG_GETTING_AUTHENTICATED,
  IS_AUTHENTICATED_SUCCEEDED,
} from '../types';
import {
  ERROR_SIGNING_IN,
  ERROR_GETTING_AUTHENTICATED,
  ERROR_MESSAGE_HEADER,
  ERROR_SIGNING_OUT,
} from '../config/messages';
import {
  SIGN_IN_CHANNEL,
  SIGN_OUT_CHANNEL,
  IS_AUTHENTICATED_CHANNEL,
} from '../config/channels';
import { REACT_APP_GRAASP_LOGIN } from '../config/endpoints';
import { createFlag } from './common';
import { ERROR_GENERAL } from '../config/errors';

const flagLoggingInUser = createFlag(FLAG_SIGNING_IN);
const flagLoggingOutUser = createFlag(FLAG_SIGNING_OUT);
const flagGettingAuthenticated = createFlag(FLAG_GETTING_AUTHENTICATED);

const signIn = async ({ username, password }) => async dispatch => {
  try {
    dispatch(flagLoggingInUser(true));
    window.ipcRenderer.send(SIGN_IN_CHANNEL, { username, password });
    window.ipcRenderer.once(SIGN_IN_CHANNEL, async (event, user) => {
      if (user === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_IN);
      } else {
        // obtain user cookie
        await fetch(REACT_APP_GRAASP_LOGIN, {
          body: `email=${user.username}&password=${user.password}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'post',
        });

        dispatch({
          type: SIGN_IN_SUCCEEDED,
          payload: user,
        });
      }
      dispatch(flagLoggingInUser(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_IN);
    dispatch(flagLoggingInUser(false));
  }
};

const signOutUser = () => dispatch => {
  try {
    dispatch(flagLoggingOutUser(true));
    window.ipcRenderer.send(SIGN_OUT_CHANNEL);
    window.ipcRenderer.once(SIGN_OUT_CHANNEL, (event, response) => {
      if (response === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_OUT);
      } else {
        dispatch({
          type: SIGN_OUT_SUCCEEDED,
          payload: response,
        });
      }
      dispatch(flagLoggingOutUser(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_OUT);
    dispatch(flagLoggingOutUser(false));
  }
};

const isAuthenticated = async () => dispatch => {
  try {
    dispatch(flagGettingAuthenticated(true));
    window.ipcRenderer.send(IS_AUTHENTICATED_CHANNEL);
    window.ipcRenderer.once(
      IS_AUTHENTICATED_CHANNEL,
      (event, authenticated) => {
        if (authenticated === ERROR_GENERAL) {
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_AUTHENTICATED);
        } else {
          dispatch({
            type: IS_AUTHENTICATED_SUCCEEDED,
            payload: authenticated,
          });
        }
        dispatch(flagGettingAuthenticated(false));
      }
    );
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_AUTHENTICATED);
    dispatch(flagGettingAuthenticated(false));
  }
};

export { signIn, signOutUser, isAuthenticated };
