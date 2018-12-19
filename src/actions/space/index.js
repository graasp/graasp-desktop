import { toastr } from 'react-redux-toastr';
import {
  GET_SPACES,
  FLAG_GETTING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_LOADING_SPACE,
  CLEAR_SPACE,
  ON_GET_SPACE_SUCCESS,
  FLAG_EXPORTING_SPACE,
  FLAG_DELETING_SPACE,
  ON_SPACE_DELETED,
} from '../../types/space';
import {
  ERROR_ZIP_CORRUPTED,
  ERROR_JSON_CORRUPTED,
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
} from '../../config/errors';
import { clearPhase } from '../phase';
import {
  DELETE_SPACE_CHANNEL,
  DELETED_SPACE_CHANNEL,
  EXPORT_SPACE_CHANNEL,
  EXPORTED_SPACE_CHANNEL,
  GET_SPACE_CHANNEL,
  GET_SPACES_CHANNEL,
  LOAD_SPACE_CHANNEL,
  LOADED_SPACE_CHANNEL,
  MESSAGE_DIALOG_RESPOND_CHANNEL,
  SAVE_DIALOG_PATH_SELECTED_CHANNEL,
  SHOW_MESSAGE_DIALOG_CHANNEL,
  SHOW_SAVE_DIALOG_CHANNEL,
} from '../../config/channels';
import {
  ERROR_DELETING_MESSAGE,
  ERROR_DOWNLOADING_MESSAGE,
  ERROR_EXPORTING_MESSAGE,
  ERROR_JSON_CORRUPTED_MESSAGE,
  ERROR_SPACE_AVAILABLE_MESSAGE,
  ERROR_ZIP_CORRUPTED_MESSAGE,
  SUCCESS_DELETING_MESSAGE,
  SUCCESS_EXPORTING_MESSAGE, SUCCESS_SPACE_LOADED_MESSAGE
} from '../../config/messages';

const flagGettingSpace = flag => dispatch => dispatch({
  type: FLAG_GETTING_SPACE,
  payload: flag,
});

const flagGettingSpaces = flag => dispatch => dispatch({
  type: FLAG_GETTING_SPACES,
  payload: flag,
});

const flagLoadingSpace = flag => dispatch => dispatch({
  type: FLAG_LOADING_SPACE,
  payload: flag,
});

const flagDeletingSpace = flag => dispatch => dispatch({
  type: FLAG_DELETING_SPACE,
  payload: flag,
});

const flagExportingSpace = flag => dispatch => dispatch({
  type: FLAG_EXPORTING_SPACE,
  payload: flag,
});

const getSpace = async ({ id, spaces }) => async (dispatch) => {
  // raise flag
  dispatch(flagGettingSpace(true));
  // tell electron to download space
  window.ipcRenderer.send(GET_SPACE_CHANNEL, { id, spaces });
  // create listener
  window.ipcRenderer.once(GET_SPACE_CHANNEL, (event, space) => {
    // dispatch that the getter has succeeded
    if (space === ERROR_GENERAL) {
      toastr.error('Error', ERROR_DOWNLOADING_MESSAGE);
    } else {
      dispatch({
        type: ON_GET_SPACE_SUCCESS,
        payload: space,
      });
    }
    dispatch(flagGettingSpace(false));
  });
  // lower flag
  //   // delete the listener
  // });
};

const getSpaces = () => (dispatch) => {
  dispatch(flagGettingSpaces(true));
  window.ipcRenderer.send(GET_SPACES_CHANNEL);
  // create listener
  window.ipcRenderer.once(GET_SPACES_CHANNEL, (event, spaces) => {
    // dispatch that the getter has succeeded
    dispatch({
      type: GET_SPACES,
      payload: spaces,
    });
    dispatch(flagGettingSpaces(false));
  });
};

const clearSpace = () => (dispatch) => {
  dispatch(clearPhase());
  return dispatch({
    type: CLEAR_SPACE,
  });
};

const exportSpace = (id, spaces, spaceTitle) => (dispatch) => {
  dispatch(flagExportingSpace(true));
  window.ipcRenderer.send(SHOW_SAVE_DIALOG_CHANNEL, spaceTitle);
  window.ipcRenderer.once(SAVE_DIALOG_PATH_SELECTED_CHANNEL, (event, archivePath) => {
    if (archivePath) {
      window.ipcRenderer.send(EXPORT_SPACE_CHANNEL, { archivePath, id, spaces });
    } else {
      dispatch(flagExportingSpace(false));
    }
  });
  window.ipcRenderer.once(EXPORTED_SPACE_CHANNEL, (event, newSpaces) => {
    switch (newSpaces) {
      case ERROR_GENERAL:
        toastr.error('Error', ERROR_EXPORTING_MESSAGE);
        break;
      default:
        toastr.success('Success', SUCCESS_EXPORTING_MESSAGE);
    }
    dispatch(flagExportingSpace(false));
  });
};

const deleteSpace = ({ id }) => (dispatch) => {
  dispatch(flagDeletingSpace(true));
  window.ipcRenderer.send(SHOW_MESSAGE_DIALOG_CHANNEL);
  window.ipcRenderer.once(MESSAGE_DIALOG_RESPOND_CHANNEL, (event, respond) => {
    if (respond === 1) {
      window.ipcRenderer.send(DELETE_SPACE_CHANNEL, { id });
    } else {
      dispatch(flagExportingSpace(false));
    }
  });
  window.ipcRenderer.once(DELETED_SPACE_CHANNEL, (event, deletedReply) => {
    switch (deletedReply) {
      case ERROR_GENERAL:
        toastr.error('Error', ERROR_DELETING_MESSAGE);
        break;
      default:
        toastr.success('Success', SUCCESS_DELETING_MESSAGE);
        dispatch({
          type: ON_SPACE_DELETED,
          payload: true,
        });
    }
    dispatch(flagDeletingSpace(false));
  });
};


const loadSpace = ({ fileLocation }) => (dispatch) => {
  dispatch(flagLoadingSpace(true));
  window.ipcRenderer.send(LOAD_SPACE_CHANNEL, { fileLocation });
  window.ipcRenderer.once(LOADED_SPACE_CHANNEL, (event, newSpaces) => {
    switch (newSpaces) {
      case ERROR_ZIP_CORRUPTED:
        toastr.error('Error', ERROR_ZIP_CORRUPTED_MESSAGE);
        break;
      case ERROR_JSON_CORRUPTED:
        toastr.error('Error', ERROR_JSON_CORRUPTED_MESSAGE);
        break;
      case ERROR_SPACE_ALREADY_AVAILABLE:
        toastr.error('Error', ERROR_SPACE_AVAILABLE_MESSAGE);
        break;
      default:
        toastr.success('Success', SUCCESS_SPACE_LOADED_MESSAGE);
        dispatch({
          type: GET_SPACES,
          payload: newSpaces,
        });
    }
    dispatch(flagLoadingSpace(false));
  });
};

// const saveSpace = async () => async (dispatch) => {
//   // download all clips si that they are easily fetched later
//   try {
//     await Promise.all([].map(async (asset, i) => {
//       const baseUrl = '';
//       const { uri, hash, id, type } = asset;
//       const asset = new Asset({
//         uri,
//         hash,
//         name: id,
//         type: 'mp3',
//       });
//       await asset.downloadAsync();
//       // quiz.questions[i].clip.asset = asset;
//     }));
//   } catch (err) {
//     console.error(err);
//   }
// }

export {
  loadSpace,
  clearSpace,
  deleteSpace,
  exportSpace,
  getSpace,
  getSpaces,
};
