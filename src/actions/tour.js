import { TOUR_COMPLETED_CHANNEL } from '../config/channels';
import { ERROR_GENERAL } from '../config/errors';
import {
  INITIALIZE_TOUR,
  NAVIGATE_STOP_TOUR,
  NEXT_OR_PREV_TOUR,
  RESET_TOUR,
  RESTART_TOUR,
  START_TOUR,
  STOP_TOUR,
} from '../types/tour';

const nextStepTour = payload => dispatch =>
  dispatch({
    type: NEXT_OR_PREV_TOUR,
    payload,
  });

const navigateStopTour = payload => dispatch =>
  dispatch({
    type: NAVIGATE_STOP_TOUR,
    payload,
  });

const stopTour = () => dispatch =>
  dispatch({
    type: STOP_TOUR,
  });

const restartTour = () => dispatch =>
  dispatch({
    type: RESTART_TOUR,
  });

const startTour = () => dispatch =>
  dispatch({
    type: START_TOUR,
  });

const initializeTour = payload => dispatch =>
  dispatch({
    type: INITIALIZE_TOUR,
    payload,
  });

const resetTour = () => dispatch =>
  dispatch({
    type: RESET_TOUR,
  });

const completeTour = async tourName => dispatch => {
  try {
    dispatch({
      type: RESET_TOUR,
    });
    window.ipcRenderer.send(TOUR_COMPLETED_CHANNEL, { tourName });
    window.ipcRenderer.once(TOUR_COMPLETED_CHANNEL, async (event, error) => {
      if (error === ERROR_GENERAL) {
        console.error(error);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export {
  stopTour,
  nextStepTour,
  restartTour,
  startTour,
  navigateStopTour,
  resetTour,
  completeTour,
  initializeTour,
};
