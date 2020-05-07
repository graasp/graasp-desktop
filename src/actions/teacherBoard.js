import { toastr } from 'react-redux-toastr';
import {
  ADD_CLASSROOM_SUCCEEDED,
  GET_CLASSROOMS_SUCCEEDED,
  FLAG_GETTING_CLASSROOMS,
  FLAG_ADDING_CLASSROOM,
  FLAG_DELETING_CLASSROOM,
  FLAG_EDITING_CLASSROOM,
  FLAG_GETTING_CLASSROOM,
  GET_CLASSROOM_SUCCEEDED,
} from '../types';
import {
  ERROR_GENERAL,
  ERROR_DUPLICATE_CLASSROOM_NAME,
} from '../config/errors';
import {
  ADD_CLASSROOM_CHANNEL,
  GET_CLASSROOMS_CHANNEL,
  DELETE_CLASSROOM_CHANNEL,
  SHOW_DELETE_CLASSROOM_PROMPT_CHANNEL,
  RESPOND_DELETE_CLASSROOM_PROMPT_CHANNEL,
  GET_CLASSROOM_CHANNEL,
  EDIT_CLASSROOM_CHANNEL,
} from '../config/channels';
import {
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_ADDING_CLASSROOM_MESSAGE,
  ERROR_DUPLICATE_CLASSROOM_NAME_MESSAGE,
  SUCCESS_DELETING_CLASSROOM_MESSAGE,
  SUCCESS_ADDING_CLASSROOM_MESSAGE,
  ERROR_DELETING_CLASSROOM_MESSAGE,
  ERROR_EDITING_CLASSROOM_MESSAGE,
  SUCCESS_EDITING_CLASSROOM_MESSAGE,
  ERROR_GETTING_CLASSROOM_MESSAGE,
} from '../config/messages';
import { createFlag } from './common';

const flagGettingClassroom = createFlag(FLAG_GETTING_CLASSROOM);
const flagGettingClassrooms = createFlag(FLAG_GETTING_CLASSROOMS);
const flagAddingClassroom = createFlag(FLAG_ADDING_CLASSROOM);
const flagDeletingClassroom = createFlag(FLAG_DELETING_CLASSROOM);
const flagEditingClassroom = createFlag(FLAG_EDITING_CLASSROOM);

export const getClassrooms = () => dispatch => {
  dispatch(flagGettingClassrooms(true));
  window.ipcRenderer.send(GET_CLASSROOMS_CHANNEL);
  // create listener
  window.ipcRenderer.once(GET_CLASSROOMS_CHANNEL, (event, classrooms) => {
    // dispatch that the getter has succeeded
    dispatch({
      type: GET_CLASSROOMS_SUCCEEDED,
      payload: classrooms,
    });
    dispatch(flagGettingClassrooms(false));
  });
};

export const getClassroom = async payload => async dispatch => {
  try {
    dispatch(flagGettingClassroom(true));

    // tell electron to get space
    window.ipcRenderer.send(GET_CLASSROOM_CHANNEL, payload);

    window.ipcRenderer.once(GET_CLASSROOM_CHANNEL, async (event, response) => {
      // if there is no response, show error
      if (!response) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_CLASSROOM_MESSAGE);
      }

      switch (response) {
        case ERROR_GENERAL:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_CLASSROOM_MESSAGE);
          break;
        // todo: check that it is actually a classroom before dispatching success
        default:
          dispatch({
            type: GET_CLASSROOM_SUCCEEDED,
            payload: response,
          });
      }
      return dispatch(flagGettingClassroom(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_CLASSROOM_MESSAGE);
  }
};

export const addClassroom = payload => dispatch => {
  try {
    dispatch(flagAddingClassroom(true));

    // tell electron to add classroom
    window.ipcRenderer.send(ADD_CLASSROOM_CHANNEL, payload);

    // create listener
    window.ipcRenderer.once(ADD_CLASSROOM_CHANNEL, async (event, response) => {
      // if there is no response, show error
      if (!response) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_CLASSROOM_MESSAGE);
      }

      switch (response) {
        case ERROR_DUPLICATE_CLASSROOM_NAME:
          toastr.error(
            ERROR_MESSAGE_HEADER,
            ERROR_DUPLICATE_CLASSROOM_NAME_MESSAGE
          );
          break;
        case ERROR_GENERAL:
          toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_CLASSROOM_MESSAGE);
          break;
        // todo: check that it is actually a classroom before dispatching success
        default:
          toastr.success(
            SUCCESS_MESSAGE_HEADER,
            SUCCESS_ADDING_CLASSROOM_MESSAGE
          );
          dispatch({
            type: ADD_CLASSROOM_SUCCEEDED,
            payload: response,
          });
      }
      return dispatch(flagAddingClassroom(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_CLASSROOM_MESSAGE);
    dispatch(flagAddingClassroom(false));
  }
};

export const deleteClassroom = ({ id }) => dispatch => {
  // show confirmation prompt
  window.ipcRenderer.send(SHOW_DELETE_CLASSROOM_PROMPT_CHANNEL);
  window.ipcRenderer.once(
    RESPOND_DELETE_CLASSROOM_PROMPT_CHANNEL,
    (event, response) => {
      if (response === 1) {
        dispatch(flagDeletingClassroom(true));
        window.ipcRenderer.send(DELETE_CLASSROOM_CHANNEL, { id });
      }
    }
  );
  window.ipcRenderer.once(DELETE_CLASSROOM_CHANNEL, (event, response) => {
    if (response === ERROR_GENERAL) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_CLASSROOM_MESSAGE);
    } else {
      // update saved classrooms in state
      dispatch(getClassrooms());

      toastr.success(
        SUCCESS_MESSAGE_HEADER,
        SUCCESS_DELETING_CLASSROOM_MESSAGE
      );
    }

    dispatch(flagDeletingClassroom(false));
  });
};

export const editClassroom = payload => dispatch => {
  dispatch(flagEditingClassroom(true));
  window.ipcRenderer.send(EDIT_CLASSROOM_CHANNEL, payload);
  window.ipcRenderer.once(EDIT_CLASSROOM_CHANNEL, (event, response) => {
    if (response === ERROR_GENERAL) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_EDITING_CLASSROOM_MESSAGE);
    } else {
      // update saved classrooms in state
      dispatch(getClassrooms());

      toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_EDITING_CLASSROOM_MESSAGE);
    }

    dispatch(flagEditingClassroom(false));
  });
};
