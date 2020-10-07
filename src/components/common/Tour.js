import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  completeTour,
  initializeTour,
  navigateStopTour,
  goToNextStep,
  resetTour,
  startTour,
} from '../../actions';
import { HOME_PATH, SETTINGS_PATH, VISIT_PATH } from '../../config/paths';
import {
  AUTHENTICATED,
  EXAMPLE_VISIT_SPACE_LINK,
  THEME_COLORS,
  TOUR_DELAY_500,
  TOUR_DELAY_750,
  TOUR_Z_INDEX,
  USER_MODES,
} from '../../config/constants';
import {
  DRAWER_BUTTON_ID,
  SPACE_PREVIEW_ICON_CLASS,
  VISIT_SPACE_INPUT_CLASS,
} from '../../config/selectors';
import { waitForElement } from '../../utils/elements';
import {
  SETTINGS_TOUR_STEPS,
  tours,
  VISIT_SPACE_TOUR_STEPS,
} from '../../config/tours';

// eslint-disable-next-line react/prefer-stateless-function
export class Tour extends Component {
  static propTypes = {
    dispatchNextStep: PropTypes.func.isRequired,
    dispatchStartTour: PropTypes.func.isRequired,
    dispatchNavigateAndStopTour: PropTypes.func.isRequired,
    dispatchTourCompleted: PropTypes.func.isRequired,
    dispatchResetTour: PropTypes.func.isRequired,
    dispatchInitializeTour: PropTypes.func.isRequired,
    tourKey: PropTypes.string.isRequired,
    currentTour: PropTypes.oneOf(tours).isRequired,
    run: PropTypes.bool.isRequired,
    continuous: PropTypes.bool.isRequired,
    stepIndex: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        target: PropTypes.string.isRequired,
        title: PropTypes.string,
        content: PropTypes.string.isRequired,
        disableBeacon: PropTypes.bool,
      })
    ).isRequired,
    signInActivity: PropTypes.bool.isRequired,
    visitSpaceTourRan: PropTypes.bool.isRequired,
    settingsTourRan: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const {
      signInActivity,
      authenticated,
      visitSpaceTourRan,
      settingsTourRan,
      dispatchResetTour,
      dispatchInitializeTour,
      location: { pathname },
      currentTour,
      run,
    } = this.props;
    const { signInActivity: prevSignInActivity } = prevProps;

    if (
      pathname === HOME_PATH &&
      prevSignInActivity &&
      !signInActivity &&
      authenticated &&
      !visitSpaceTourRan
    ) {
      // waits to ensure the first step element is rendered
      setTimeout(
        () =>
          dispatchInitializeTour({
            tour: tours.VISIT_SPACE_TOUR,
            steps: VISIT_SPACE_TOUR_STEPS,
          }),
        TOUR_DELAY_750
      );
    }

    if (prevSignInActivity && !signInActivity && !authenticated) {
      dispatchResetTour();
    }

    if (
      pathname === SETTINGS_PATH &&
      authenticated &&
      !settingsTourRan &&
      currentTour !== tours.SETTINGS_TOUR &&
      !run
    ) {
      setTimeout(
        () =>
          dispatchInitializeTour({
            tour: tours.SETTINGS_TOUR,
            steps: SETTINGS_TOUR_STEPS,
          }),
        TOUR_DELAY_750
      );
    }
  }

  render() {
    const {
      history: { push, replace },
      tourKey,
      run,
      continuous,
      stepIndex,
      steps,
      dispatchStartTour,
      dispatchNextStep,
      dispatchNavigateAndStopTour,
      dispatchTourCompleted,
      currentTour,
      t,
    } = this.props;
    const callback = async data => {
      const { action, index, type, status } = data;
      if (
        action === ACTIONS.CLOSE ||
        (status === STATUS.SKIPPED && run) ||
        status === STATUS.FINISHED
      ) {
        dispatchTourCompleted(currentTour);
      } else if (
        type === EVENTS.STEP_AFTER ||
        type === EVENTS.TARGET_NOT_FOUND
      ) {
        const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        switch (currentTour) {
          case tours.VISIT_SPACE_TOUR:
            switch (newStepIndex) {
              case 1:
                push(VISIT_PATH);
                dispatchNavigateAndStopTour(newStepIndex);
                await waitForElement({
                  selector: `.${VISIT_SPACE_INPUT_CLASS}`,
                });
                document.getElementById(DRAWER_BUTTON_ID).click();
                setTimeout(() => dispatchStartTour(), TOUR_DELAY_500);
                break;
              case 2:
                replace(EXAMPLE_VISIT_SPACE_LINK);
                dispatchNavigateAndStopTour(newStepIndex);
                await waitForElement({
                  selector: `.${SPACE_PREVIEW_ICON_CLASS}`,
                });
                dispatchStartTour();
                break;
              case 3:
                dispatchNextStep(newStepIndex);
                break;
              case 4:
                dispatchNextStep(newStepIndex);
                break;
              case 5:
              default:
                dispatchTourCompleted(tours.VISIT_SPACE_TOUR);
                break;
            }
            break;
          case tours.SETTINGS_TOUR:
            switch (newStepIndex) {
              case 1:
                dispatchNextStep(newStepIndex);
                break;
              case 2:
                dispatchNextStep(newStepIndex);
                break;
              case 3:
              default:
                dispatchTourCompleted(tours.SETTINGS_TOUR);
                break;
            }
            break;
          default:
            dispatchTourCompleted(tours.VISIT_SPACE_TOUR);
        }
      }
    };

    return (
      <JoyRide
        run={run}
        steps={steps}
        key={tourKey}
        continuous={continuous}
        stepIndex={stepIndex}
        showProgress
        styles={{
          buttonClose: {
            display: 'none',
          },
          options: {
            primaryColor: THEME_COLORS[USER_MODES.TEACHER],
            zIndex: TOUR_Z_INDEX,
          },
        }}
        floaterProps={{
          disableAnimation: true,
        }}
        callback={callback}
        locale={{
          last: t('End tour'),
          skip: t('Close tour'),
        }}
        showSkipButton
        hideBackButton
        disableOverlayClose
      />
    );
  }
}

const mapStateToProps = ({ tour, authentication }) => ({
  tourKey: tour.getIn(['key']),
  currentTour: tour.getIn(['tour']),
  run: tour.getIn(['run']),
  continuous: tour.getIn(['continuous']),
  stepIndex: tour.getIn(['stepIndex']),
  steps: tour.getIn(['steps']),
  signInActivity: Boolean(authentication.getIn(['current', 'activity']).size),
  visitSpaceTourRan: authentication.getIn(['user', 'tour', 'visitSpace']),
  settingsTourRan: authentication.getIn(['user', 'tour', 'settings']),
  authenticated:
    authentication.getIn(['user', 'authenticated']) === AUTHENTICATED,
});

const mapDispatchToProps = {
  dispatchNextStep: goToNextStep,
  dispatchStartTour: startTour,
  dispatchNavigateAndStopTour: navigateStopTour,
  dispatchTourCompleted: completeTour,
  dispatchResetTour: resetTour,
  dispatchInitializeTour: initializeTour,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Tour);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(TranslatedComponent);
