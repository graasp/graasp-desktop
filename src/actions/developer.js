import { toastr } from 'react-redux-toastr';
import i18n from '../config/i18n';
import { createFlag } from './common';
import {
  FLAG_GETTING_DATABASE,
  GET_DATABASE_SUCCEEDED,
  FLAG_SETTING_DATABASE,
  SET_DATABASE_SUCCEEDED,
} from '../types';
import { GET_DATABASE_CHANNEL, SET_DATABASE_CHANNEL } from '../config/channels';
import { ERROR_GENERAL } from '../config/errors';
import {
  ERROR_GETTING_DATABASE,
  ERROR_MESSAGE_HEADER,
  ERROR_SETTING_DATABASE,
} from '../config/messages';

const flagGettingDatabase = createFlag(FLAG_GETTING_DATABASE);
const flagSettingDatabase = createFlag(FLAG_SETTING_DATABASE);

const getDatabase = async () => dispatch => {
  try {
    dispatch(flagGettingDatabase(true));
    window.ipcRenderer.send(GET_DATABASE_CHANNEL);
    window.ipcRenderer.once(GET_DATABASE_CHANNEL, (event, db) => {
      if (db === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, i18n.t(ERROR_GETTING_DATABASE));
      } else {
        dispatch({
          type: GET_DATABASE_SUCCEEDED,
          payload: db,
        });
      }
      dispatch(flagGettingDatabase(false));
    });
  } catch (err) {
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, i18n.t(ERROR_GETTING_DATABASE));
  }
};

const setDatabase = async database => dispatch => {
  try {
    dispatch(flagSettingDatabase(true));
    window.ipcRenderer.send(SET_DATABASE_CHANNEL, database);
    window.ipcRenderer.once(SET_DATABASE_CHANNEL, (event, db) => {
      if (db === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, i18n.t(ERROR_GETTING_DATABASE));
      } else {
        dispatch({
          type: SET_DATABASE_SUCCEEDED,
          payload: db,
        });
      }
      dispatch(flagSettingDatabase(false));
    });
  } catch (err) {
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, i18n.t(ERROR_SETTING_DATABASE));
  }
};

export { getDatabase, setDatabase };
