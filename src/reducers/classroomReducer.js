import { Set, Map, List, fromJS } from 'immutable';
import {
  GET_CLASSROOMS_SUCCEEDED,
  ADD_CLASSROOM_SUCCEEDED,
  FLAG_ADDING_CLASSROOM,
  FLAG_GETTING_CLASSROOMS,
  FLAG_EDITING_CLASSROOM,
  FLAG_DELETING_CLASSROOM,
  GET_CLASSROOM_SUCCEEDED,
  FLAG_GETTING_CLASSROOM,
  FLAG_ADDING_USER_IN_CLASSROOM,
  FLAG_DELETING_USERS_IN_CLASSROOM,
  FLAG_EDITING_USER_IN_CLASSROOM,
  FLAG_EXTRACTING_FILE_TO_LOAD_SPACE_IN_CLASSROOM,
  EXTRACT_FILE_TO_LOAD_SPACE_IN_CLASSROOM_SUCCEEDED,
  FLAG_CLEARING_LOAD_SPACE_IN_CLASSROOM,
  FLAG_LOADING_SPACE_IN_CLASSROOM,
  LOAD_SPACE_IN_CLASSROOM_SUCCEEDED,
  CLEAR_LOAD_SPACE_IN_CLASSROOM_SUCCEEDED,
  GET_SPACE_TO_LOAD_IN_CLASSROOM_SUCCEEDED,
  FLAG_GETTING_SPACE_IN_CLASSROOM,
  FLAG_GETTING_SPACE_TO_LOAD_IN_CLASSROOM,
} from '../types';
import { updateActivityList } from './common';
import {
  DEFAULT_EXTRACT_PARAMETERS,
  LOAD_SPACE_STATUS,
} from './loadSpaceReducer';

const INITIAL_STATE = Map({
  activity: List(),
  classrooms: Set(),
  current: Map({
    classroom: Map(),
    load: Map({
      extract: DEFAULT_EXTRACT_PARAMETERS,
      status: LOAD_SPACE_STATUS.READY,
      savedSpace: Map(),
    }),
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_CLASSROOM:
    case FLAG_ADDING_CLASSROOM:
    case FLAG_GETTING_CLASSROOMS:
    case FLAG_DELETING_CLASSROOM:
    case FLAG_EDITING_CLASSROOM:
    case FLAG_DELETING_USERS_IN_CLASSROOM:
    case FLAG_ADDING_USER_IN_CLASSROOM:
    case FLAG_EDITING_USER_IN_CLASSROOM:
    case FLAG_CLEARING_LOAD_SPACE_IN_CLASSROOM:
    case FLAG_LOADING_SPACE_IN_CLASSROOM:
    case FLAG_EXTRACTING_FILE_TO_LOAD_SPACE_IN_CLASSROOM:
    case FLAG_GETTING_SPACE_IN_CLASSROOM:
    case FLAG_GETTING_SPACE_TO_LOAD_IN_CLASSROOM:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_CLASSROOM_SUCCEEDED:
      return state.setIn(['current', 'classroom'], Map(payload));
    case GET_CLASSROOMS_SUCCEEDED:
      return state.set('classrooms', Set(payload));
    case ADD_CLASSROOM_SUCCEEDED:
      return state.updateIn(['classrooms'], classrooms =>
        classrooms.add(payload)
      );
    case EXTRACT_FILE_TO_LOAD_SPACE_IN_CLASSROOM_SUCCEEDED:
      return state
        .setIn(['current', 'load', 'extract'], fromJS(payload))
        .setIn(['current', 'load', 'status'], LOAD_SPACE_STATUS.RUNNING);
    // clear extract info on cancel or on successful load
    case LOAD_SPACE_IN_CLASSROOM_SUCCEEDED:
      return state
        .setIn(['current', 'load', 'extract'], DEFAULT_EXTRACT_PARAMETERS)
        .setIn(['current', 'load', 'status'], LOAD_SPACE_STATUS.DONE);
    case CLEAR_LOAD_SPACE_IN_CLASSROOM_SUCCEEDED:
      return state
        .setIn(['current', 'load', 'extract'], DEFAULT_EXTRACT_PARAMETERS)
        .setIn(['current', 'load', 'status'], LOAD_SPACE_STATUS.READY);
    case GET_SPACE_TO_LOAD_IN_CLASSROOM_SUCCEEDED:
      return state.setIn(['current', 'load', 'savedSpace'], Map(payload));
    default:
      return state;
  }
};
