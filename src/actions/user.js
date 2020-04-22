import { toastr } from 'react-redux-toastr';
import { getCurrentPosition } from '../utils/geolocation';
import {
  GET_GEOLOCATION_SUCCEEDED,
  GET_USER_FOLDER_SUCCEEDED,
  FLAG_GETTING_USER_FOLDER,
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  GET_LANGUAGE_SUCCEEDED,
  SET_LANGUAGE_SUCCEEDED,
  FLAG_GETTING_DEVELOPER_MODE,
  FLAG_SETTING_DEVELOPER_MODE,
  GET_DEVELOPER_MODE_SUCCEEDED,
  SET_DEVELOPER_MODE_SUCCEEDED,
  FLAG_GETTING_GEOLOCATION_ENABLED,
  FLAG_SETTING_GEOLOCATION_ENABLED,
  FLAG_GETTING_SYNC_MODE,
  FLAG_SETTING_SYNC_MODE,
  GET_GEOLOCATION_ENABLED_SUCCEEDED,
  SET_GEOLOCATION_ENABLED_SUCCEEDED,
  SET_SYNC_MODE_SUCCEEDED,
  GET_SYNC_MODE_SUCCEEDED,
  FLAG_GETTING_STUDENT_MODE,
  FLAG_SETTING_STUDENT_MODE,
  GET_STUDENT_MODE_SUCCEEDED,
  SET_STUDENT_MODE_SUCCEEDED,
} from '../types';
import {
  ERROR_GETTING_GEOLOCATION,
  ERROR_GETTING_LANGUAGE,
  ERROR_GETTING_USER_FOLDER,
  ERROR_MESSAGE_HEADER,
  ERROR_SETTING_LANGUAGE,
  ERROR_SETTING_DEVELOPER_MODE,
  ERROR_GETTING_DEVELOPER_MODE,
  ERROR_SETTING_GEOLOCATION_ENABLED,
  ERROR_GETTING_GEOLOCATION_ENABLED,
  ERROR_GETTING_SYNC_MODE,
  ERROR_SETTING_SYNC_MODE,
  ERROR_GETTING_STUDENT_MODE,
  ERROR_SETTING_STUDENT_MODE,
} from '../config/messages';
import {
  GET_USER_FOLDER_CHANNEL,
  GET_LANGUAGE_CHANNEL,
  SET_LANGUAGE_CHANNEL,
  GET_DEVELOPER_MODE_CHANNEL,
  SET_DEVELOPER_MODE_CHANNEL,
  GET_GEOLOCATION_ENABLED_CHANNEL,
  SET_GEOLOCATION_ENABLED_CHANNEL,
  GET_SYNC_MODE_CHANNEL,
  SET_SYNC_MODE_CHANNEL,
  GET_STUDENT_MODE_CHANNEL,
  SET_STUDENT_MODE_CHANNEL,
} from '../config/channels';
import { createFlag } from './common';
import { ERROR_GENERAL } from '../config/errors';

const flagGettingUserFolder = createFlag(FLAG_GETTING_USER_FOLDER);
const flagGettingLanguage = createFlag(FLAG_GETTING_LANGUAGE);
const flagSettingLanguage = createFlag(FLAG_SETTING_LANGUAGE);
const flagGettingDeveloperMode = createFlag(FLAG_GETTING_DEVELOPER_MODE);
const flagSettingDeveloperMode = createFlag(FLAG_SETTING_DEVELOPER_MODE);
const flagGettingGeolocationEnabled = createFlag(
  FLAG_GETTING_GEOLOCATION_ENABLED
);
const flagSettingGeolocationEnabled = createFlag(
  FLAG_SETTING_GEOLOCATION_ENABLED
);
const flagGettingSyncMode = createFlag(FLAG_GETTING_SYNC_MODE);
const flagSettingSyncMode = createFlag(FLAG_SETTING_SYNC_MODE);
const flagGettingStudentMode = createFlag(FLAG_GETTING_STUDENT_MODE);
const flagSettingStudentMode = createFlag(FLAG_SETTING_STUDENT_MODE);

const getGeolocation = async () => async dispatch => {
  // only fetch location if online
  if (window.navigator.onLine) {
    try {
      const geolocation = await getCurrentPosition();
      const payload = {
        coords: {
          accuracy: geolocation.coords.accuracy,
          altitude: geolocation.coords.altitude,
          altitudeAccuracy: geolocation.coords.altitudeAccuracy,
          heading: geolocation.coords.heading,
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude,
          speed: geolocation.coords.speed,
        },
        timestamp: geolocation.timestamp,
      };
      dispatch({
        type: GET_GEOLOCATION_SUCCEEDED,
        payload,
      });
    } catch (e) {
      console.error(e);
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_GEOLOCATION);
    }
  }
};

const getUserFolder = async () => dispatch => {
  try {
    dispatch(flagGettingUserFolder(true));
    window.ipcRenderer.send(GET_USER_FOLDER_CHANNEL);
    window.ipcRenderer.once(GET_USER_FOLDER_CHANNEL, (event, folder) => {
      if (folder === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_USER_FOLDER);
      } else {
        dispatch({
          type: GET_USER_FOLDER_SUCCEEDED,
          payload: folder,
        });
      }
      dispatch(flagGettingUserFolder(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_USER_FOLDER);
    dispatch(flagGettingUserFolder(false));
  }
};

const getLanguage = async () => dispatch => {
  try {
    dispatch(flagGettingLanguage(true));
    window.ipcRenderer.send(GET_LANGUAGE_CHANNEL);
    window.ipcRenderer.once(GET_LANGUAGE_CHANNEL, (event, lang) => {
      if (lang === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_LANGUAGE);
      } else {
        dispatch({
          type: GET_LANGUAGE_SUCCEEDED,
          payload: lang,
        });
      }
      dispatch(flagGettingLanguage(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_LANGUAGE);
  }
};

const setLanguage = async ({ lang }) => dispatch => {
  try {
    dispatch(flagSettingLanguage(true));
    window.ipcRenderer.send(SET_LANGUAGE_CHANNEL, lang);
    window.ipcRenderer.once(SET_LANGUAGE_CHANNEL, (event, language) => {
      if (language === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_LANGUAGE);
      } else {
        dispatch({
          type: SET_LANGUAGE_SUCCEEDED,
          payload: language,
        });
      }
      dispatch(flagSettingLanguage(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_LANGUAGE);
  }
};

const getDeveloperMode = async () => dispatch => {
  try {
    dispatch(flagGettingDeveloperMode(true));
    window.ipcRenderer.send(GET_DEVELOPER_MODE_CHANNEL);
    window.ipcRenderer.once(
      GET_DEVELOPER_MODE_CHANNEL,
      (event, developerMode) => {
        if (developerMode === ERROR_GENERAL) {
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DEVELOPER_MODE);
        } else {
          dispatch({
            type: GET_DEVELOPER_MODE_SUCCEEDED,
            payload: developerMode,
          });
        }
        dispatch(flagGettingDeveloperMode(false));
      }
    );
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DEVELOPER_MODE);
  }
};

const setDeveloperMode = async developerMode => dispatch => {
  try {
    dispatch(flagSettingDeveloperMode(true));
    window.ipcRenderer.send(SET_DEVELOPER_MODE_CHANNEL, developerMode);
    window.ipcRenderer.once(SET_DEVELOPER_MODE_CHANNEL, (event, mode) => {
      if (mode === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_DEVELOPER_MODE);
      } else {
        dispatch({
          type: SET_DEVELOPER_MODE_SUCCEEDED,
          payload: mode,
        });
      }
      dispatch(flagSettingDeveloperMode(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_DEVELOPER_MODE);
  }
};

const getGeolocationEnabled = async () => dispatch => {
  try {
    dispatch(flagGettingGeolocationEnabled(true));
    window.ipcRenderer.send(GET_GEOLOCATION_ENABLED_CHANNEL);
    window.ipcRenderer.once(
      GET_GEOLOCATION_ENABLED_CHANNEL,
      (event, geolocationEnabled) => {
        if (geolocationEnabled === ERROR_GENERAL) {
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_GEOLOCATION_ENABLED);
        } else {
          dispatch({
            type: GET_GEOLOCATION_ENABLED_SUCCEEDED,
            payload: geolocationEnabled,
          });
        }
        dispatch(flagGettingGeolocationEnabled(false));
      }
    );
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_GEOLOCATION_ENABLED);
  }
};

const setGeolocationEnabled = async geolocationEnabled => dispatch => {
  try {
    dispatch(flagSettingGeolocationEnabled(true));
    window.ipcRenderer.send(
      SET_GEOLOCATION_ENABLED_CHANNEL,
      geolocationEnabled
    );
    window.ipcRenderer.once(
      SET_GEOLOCATION_ENABLED_CHANNEL,
      (event, enabled) => {
        if (enabled === ERROR_GENERAL) {
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_GEOLOCATION_ENABLED);
        } else {
          dispatch({
            type: SET_GEOLOCATION_ENABLED_SUCCEEDED,
            payload: enabled,
          });
        }
        dispatch(flagSettingGeolocationEnabled(false));
      }
    );
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_GEOLOCATION_ENABLED);
  }
};

const getSyncMode = async () => dispatch => {
  try {
    dispatch(flagGettingSyncMode(true));
    window.ipcRenderer.send(GET_SYNC_MODE_CHANNEL);
    window.ipcRenderer.once(GET_SYNC_MODE_CHANNEL, (event, mode) => {
      if (mode === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SYNC_MODE);
      } else {
        dispatch({
          type: GET_SYNC_MODE_SUCCEEDED,
          payload: mode,
        });
      }
      dispatch(flagGettingSyncMode(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SYNC_MODE);
  }
};

const setSyncMode = async syncMode => dispatch => {
  try {
    dispatch(flagSettingSyncMode(true));
    window.ipcRenderer.send(SET_SYNC_MODE_CHANNEL, syncMode);
    window.ipcRenderer.once(SET_SYNC_MODE_CHANNEL, (event, mode) => {
      if (mode === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_SYNC_MODE);
      } else {
        dispatch({
          type: SET_SYNC_MODE_SUCCEEDED,
          payload: mode,
        });
      }
      dispatch(flagSettingSyncMode(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_SYNC_MODE);
  }
};

const getStudentMode = async () => dispatch => {
  try {
    dispatch(flagGettingStudentMode(true));
    window.ipcRenderer.send(GET_STUDENT_MODE_CHANNEL);
    window.ipcRenderer.once(GET_STUDENT_MODE_CHANNEL, (event, studentMode) => {
      if (studentMode === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_STUDENT_MODE);
      } else {
        dispatch({
          type: GET_STUDENT_MODE_SUCCEEDED,
          payload: studentMode,
        });
      }
      dispatch(flagGettingStudentMode(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_STUDENT_MODE);
  }
};

const setStudentMode = async syncAdvancedMode => dispatch => {
  try {
    dispatch(flagSettingStudentMode(true));
    window.ipcRenderer.send(SET_STUDENT_MODE_CHANNEL, syncAdvancedMode);
    window.ipcRenderer.once(SET_STUDENT_MODE_CHANNEL, (event, mode) => {
      if (mode === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_STUDENT_MODE);
      } else {
        dispatch({
          type: SET_STUDENT_MODE_SUCCEEDED,
          payload: mode,
        });
      }
      dispatch(flagSettingStudentMode(false));
    });
  } catch (e) {
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_STUDENT_MODE);
  }
};

export {
  getUserFolder,
  getGeolocation,
  getLanguage,
  setLanguage,
  getDeveloperMode,
  setDeveloperMode,
  getGeolocationEnabled,
  setGeolocationEnabled,
  getSyncMode,
  setSyncMode,
  getStudentMode,
  setStudentMode,
};
