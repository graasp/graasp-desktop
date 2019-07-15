import { toastr } from 'react-redux-toastr';
import {
  FLAG_LOGGING_IN,
  FLAG_LOGGING_OUT,
  LOGIN_USER_SUCCEEDED,
  LOGOUT_USER_SUCCEEDED,
  FLAG_GETTING_AUTHENTICATED,
  GET_AUTHENTICATED_SUCCEEDED,
} from '../types';
import {
  ERROR_LOGGING_IN_USER,
  ERROR_GETTING_AUTHENTICATED,
  ERROR_MESSAGE_HEADER,
  ERROR_LOGGING_OUT_USER,
} from '../config/messages';
import {
  LOGIN_USER_CHANNEL,
  LOGOUT_USER_CHANNEL,
  GET_AUTHENTICATED_CHANNEL,
} from '../config/channels';
import { createFlag } from './common';
import { ERROR_GENERAL } from '../config/errors';

const flagLoggingInUser = createFlag(FLAG_LOGGING_IN);
const flagLoggingOutUser = createFlag(FLAG_LOGGING_OUT);
const flagGettingAuthenticated = createFlag(FLAG_GETTING_AUTHENTICATED);

const signInUser = ({ username }) => dispatch => {
  try {
    dispatch(flagLoggingInUser(true));
    window.ipcRenderer.send(LOGIN_USER_CHANNEL, { username });
    window.ipcRenderer.once(LOGIN_USER_CHANNEL, (event, user) => {
      if (user === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOGGING_IN_USER);
      } else {
        dispatch({
          type: LOGIN_USER_SUCCEEDED,
          payload: user,
        });
      }
      dispatch(flagLoggingInUser(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOGGING_IN_USER);
    dispatch(flagLoggingInUser(false));
  }
};

const signOutUser = () => dispatch => {
  try {
    dispatch(flagLoggingOutUser(true));
    window.ipcRenderer.send(LOGOUT_USER_CHANNEL);
    window.ipcRenderer.once(LOGOUT_USER_CHANNEL, (event, response) => {
      if (response === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOGGING_OUT_USER);
      } else {
        dispatch({
          type: LOGOUT_USER_SUCCEEDED,
          payload: response,
        });
      }
      dispatch(flagLoggingOutUser(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOGGING_OUT_USER);
    dispatch(flagLoggingOutUser(false));
  }
};

const getAuthenticated = async () => dispatch => {
  try {
    dispatch(flagGettingAuthenticated(true));
    window.ipcRenderer.send(GET_AUTHENTICATED_CHANNEL);
    window.ipcRenderer.once(
      GET_AUTHENTICATED_CHANNEL,
      (event, authenticated) => {
        if (authenticated === ERROR_GENERAL) {
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_AUTHENTICATED);
        } else {
          dispatch({
            type: GET_AUTHENTICATED_SUCCEEDED,
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

export { signInUser, signOutUser, getAuthenticated };
