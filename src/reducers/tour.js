import { Map } from 'immutable';
import {
  INITIALIZE_TOUR,
  NAVIGATE_STOP_TOUR,
  NEXT_OR_PREV_TOUR,
  RESET_TOUR,
  RESTART_TOUR,
  START_TOUR,
  STOP_TOUR,
} from '../types/tour';
import { tours, VISIT_SPACE_TOUR_STEPS } from '../config/tours';

const INITIAL_STATE = Map({
  key: 0, // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true, // Show next button
  stepIndex: 0, // Make the component controlled
  tour: tours.VISIT_SPACE_TOUR,
  steps: VISIT_SPACE_TOUR_STEPS,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case START_TOUR:
      return state.setIn(['run'], true);
    case RESET_TOUR:
      return state
        .setIn(['run'], false)
        .setIn(['stepIndex'], 0)
        .setIn(['key'], new Date());
    case STOP_TOUR:
      return state.setIn(['run'], false);
    case NEXT_OR_PREV_TOUR:
      return state.setIn(['stepIndex'], payload);
    case RESTART_TOUR:
      return state
        .setIn(['run'], true)
        .setIn(['stepIndex'], 0)
        .setIn(['key'], new Date().toISOString());
    case NAVIGATE_STOP_TOUR:
      return state.setIn(['run'], false).setIn(['stepIndex'], payload);
    case INITIALIZE_TOUR:
      return state
        .setIn(['run'], true)
        .setIn(['tour'], payload.tour)
        .setIn(['steps'], payload.steps)
        .setIn(['key'], new Date().toISOString());

    default:
      return state;
  }
};
