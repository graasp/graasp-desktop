import { TOUR_DELAY_500 } from '../config/constants';

const handleStartTour = (dispatchStartTour) =>
  setTimeout(() => dispatchStartTour(), TOUR_DELAY_500);

export {
  // eslint-disable-next-line import/prefer-default-export
  handleStartTour,
};
