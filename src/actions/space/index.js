import { toastr } from 'react-redux-toastr';
import {
  GET_SPACES,
  FLAG_GETTING_SPACE,
  FLAG_GETTING_SPACES,
  FLAG_LOADING_SPACE,
  CLEAR_SPACE,
  ON_GET_SPACE_SUCCESS,
} from '../../types/space';
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

const getSpace = async ({ id, spaces }) => async (dispatch) => {
  // raise flag
  dispatch(flagGettingSpace(true));
  // tell electron to download space
  window.ipcRenderer.send('space:get', { id, spaces });
  // create listener
  window.ipcRenderer.on('space:gotten', (event, space) => {
    // dispatch that the getter has succeeded
    if (space === 1) {
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
  window.ipcRenderer.on('spaces:get', (event, spaces) => {
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

const loadSpace = ({ fileLocation }) => (dispatch) => {
  dispatch(flagLoadingSpace(true));
  window.ipcRenderer.send('space:load', { fileLocation });
  window.ipcRenderer.on('space:loaded', (event, newSpaces) => {
    switch (newSpaces) {
      case 1:
        toastr.error('Error', 'The archive provided is not formatted properly');
        break;
      case 2:
        toastr.error('Error', 'Space\'s Jon file is corrupted');
        break;
      case 3:
        toastr.error('Error', 'A space with the same id is already available');
        break;
      default:
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
  getSpace,
  getSpaces,
};
