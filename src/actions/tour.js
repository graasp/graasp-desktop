import { COMPLETE_TOUR_CHANNEL } from '../config/channels';
import { ERROR_GENERAL } from '../config/errors';
import {
  INITIALIZE_TOUR,
  NAVIGATE_STOP_TOUR,
  NEXT_TOUR_STEP,
  PREV_TOUR_STEP,
  RESET_TOUR,
  RESTART_TOUR,
  START_TOUR,
  STOP_TOUR,
} from '../types/tour';

const goToNextStep = payload => dispatch =>
  dispatch({
    type: NEXT_TOUR_STEP,
    payload,
  });

const goToPrevStep = payload => dispatch =>
  dispatch({
    type: PREV_TOUR_STEP,
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
    window.ipcRenderer.send(COMPLETE_TOUR_CHANNEL, { tourName });
    window.ipcRenderer.once(COMPLETE_TOUR_CHANNEL, async (event, error) => {
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
  goToNextStep,
  goToPrevStep,
  restartTour,
  startTour,
  navigateStopTour,
  resetTour,
  completeTour,
  initializeTour,
};
