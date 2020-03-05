import { toastr } from 'react-redux-toastr';
import {
  FLAG_SIGNING_IN,
  FLAG_SIGNING_OUT,
  FLAG_GETTING_AUTHENTICATED,
  SIGN_IN_SUCCEEDED,
  SIGN_OUT_SUCCEEDED,
  IS_AUTHENTICATED_SUCCEEDED,
} from '../types';
import {
  ERROR_SIGNING_IN,
  ERROR_MESSAGE_HEADER,
  ERROR_SIGNING_OUT,
  ERROR_GETTING_AUTHENTICATED,
} from '../config/messages';
import {
  SIGN_IN_CHANNEL,
  SIGN_OUT_CHANNEL,
  IS_AUTHENTICATED_CHANNEL,
} from '../config/channels';
import { createFlag } from './common';
import { ERROR_GENERAL } from '../config/errors';

const flagSigningInUser = createFlag(FLAG_SIGNING_IN);
const flagSigningOutUser = createFlag(FLAG_SIGNING_OUT);
const flagGettingAuthenticated = createFlag(FLAG_GETTING_AUTHENTICATED);

const signIn = async ({ username, password }) => async dispatch => {
  try {
    dispatch(flagSigningInUser(true));
    window.ipcRenderer.send(SIGN_IN_CHANNEL, { username, password });
    window.ipcRenderer.once(SIGN_IN_CHANNEL, async (event, user) => {
      if (user === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_IN);
      } else {
        // obtain user cookie
        // await fetch(REACT_APP_GRAASP_LOGIN, {
        //   body: `email=${encodeURIComponent(
        //     user.username
        //   )}&password=${encodeURIComponent(user.password)}`,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        //   method: 'post',
        // });

        dispatch({
          type: SIGN_IN_SUCCEEDED,
          payload: user,
        });
      }
      dispatch(flagSigningInUser(false));
    });
  } catch (e) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_IN);
    dispatch(flagSigningInUser(false));
  }
};

const signOutUser = () => dispatch => {
  try {
    dispatch(flagSigningOutUser(true));
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
      dispatch(flagSigningOutUser(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SIGNING_OUT);
    dispatch(flagSigningOutUser(false));
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
