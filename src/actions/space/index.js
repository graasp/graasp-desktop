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
  window.ipcRenderer.send('space:get', { id, spaces });
  // create listener
  window.ipcRenderer.once('space:get', (event, space) => {
    // dispatch that the getter has succeeded
    if (space === ERROR_GENERAL) {
      toastr.error('Error', 'There was a problem downloading your files');
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
  window.ipcRenderer.send('spaces:get');
  // create listener
  window.ipcRenderer.once('spaces:get', (event, spaces) => {
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
  window.ipcRenderer.send('show-save-dialog', spaceTitle);
  window.ipcRenderer.once('save-dialog-path-selected', (event, archivePath) => {
    if (archivePath) {
      window.ipcRenderer.send('space:export', { archivePath, id, spaces });
    } else {
      dispatch(flagExportingSpace(false));
    }
  });
  window.ipcRenderer.once('space:exported', (event, newSpaces) => {
    switch (newSpaces) {
      case ERROR_GENERAL:
        toastr.error('Error', 'There was a problem exporting this space.');
        break;
      default:
        toastr.success('Success', 'Space was exported successfully');
    }
    dispatch(flagExportingSpace(false));
  });
};

const deleteSpace = ({ id }) => (dispatch) => {
  dispatch(flagDeletingSpace(true));
  window.ipcRenderer.send('show-message-dialog');
  window.ipcRenderer.once('message-dialog-respond', (event, respond) => {
    if (respond === 1) {
      window.ipcRenderer.send('space:delete', { id });
    } else {
      dispatch(flagExportingSpace(false));
    }
  });
  window.ipcRenderer.once('space:deleted', (event, deletedReply) => {
    switch (deletedReply) {
      case ERROR_GENERAL:
        toastr.error('Error', 'There was a problem deleting this space');
        break;
      default:
        toastr.success('Success', 'Space was deleted successfully');
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
  window.ipcRenderer.send('space:load', { fileLocation });
  window.ipcRenderer.once('space:loaded', (event, newSpaces) => {
    switch (newSpaces) {
      case ERROR_ZIP_CORRUPTED:
        toastr.error('Error', 'The archive provided is not formatted properly');
        break;
      case ERROR_JSON_CORRUPTED:
        toastr.error('Error', 'Space\'s Jon file is corrupted');
        break;
      case ERROR_SPACE_ALREADY_AVAILABLE:
        toastr.error('Error', 'A space with the same id is already available');
        break;
      default:
        toastr.success('Success', 'Space was loaded successfully!');
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
