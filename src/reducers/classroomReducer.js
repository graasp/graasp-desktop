import { Set, Map, List } from 'immutable';
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
} from '../types';
import { updateActivityList } from './common';

const INITIAL_STATE = Map({
  activity: List(),
  classrooms: Set(),
  current: Map(),
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
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_CLASSROOM_SUCCEEDED:
      return state.setIn(['current'], Map(payload));
    case GET_CLASSROOMS_SUCCEEDED:
      return state.set('classrooms', Set(payload));
    case ADD_CLASSROOM_SUCCEEDED:
      return state.updateIn(['classrooms'], classrooms =>
        classrooms.add(payload)
      );
    default:
      return state;
  }
};
