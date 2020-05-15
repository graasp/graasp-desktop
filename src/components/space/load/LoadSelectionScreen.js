import { toastr } from 'react-redux-toastr';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Banner from '../../common/Banner';
import { loadSpace, clearLoadSpace } from '../../../actions';
import Styles from '../../../Styles';
import Loader from '../../common/Loader';
import Main from '../../common/Main';
import { LOAD_SPACE_PATH } from '../../../config/paths';
import { USER_MODES } from '../../../config/constants';
import { isSpaceDifferent as isSpaceDifferentFunc } from '../../../utils/syncSpace';
import {
  ERROR_MESSAGE_HEADER,
  UNEXPECTED_ERROR_MESSAGE,
  ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE,
} from '../../../config/messages';
import {
  LOAD_LOAD_BUTTON_ID,
  LOAD_BACK_BUTTON_ID,
} from '../../../config/selectors';
import { LOAD_SPACE_STATUS } from '../../../reducers/loadSpaceReducer';
import LoadSpaceSelectors from './LoadSpaceSelectors';

const styles = theme => ({
  ...Styles(theme),
  buttonGroup: {
    textAlign: 'center',
  },
});

class LoadSelectionScreen extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      buttonGroup: PropTypes.string.isRequired,
      submitButton: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string }).isRequired,
    dispatchLoadSpace: PropTypes.func.isRequired,
    dispatchClearLoadSpace: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      state: PropTypes.shape({
        isSpaceDifferent: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    elements: PropTypes.instanceOf(Map).isRequired,
    extractPath: PropTypes.string.isRequired,
    isStudent: PropTypes.bool.isRequired,
    status: PropTypes.oneOf(Object.values(LOAD_SPACE_STATUS)).isRequired,
    space: PropTypes.instanceOf(Map).isRequired,
    savedSpace: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    savedSpace: Map(),
  };

  constructor(props) {
    super(props);
    const {
      history: { push },
      extractPath,
    } = props;

    if (!extractPath.length) {
      toastr.error(ERROR_MESSAGE_HEADER, UNEXPECTED_ERROR_MESSAGE);
      push(LOAD_SPACE_PATH);
    }
  }

  state = (() => {
    const { elements } = this.props;

    return {
      isSpaceDifferent: false,
      space: false,
      actions: !elements.get('actions').isEmpty(),
      appInstanceResources: !elements.get('appInstanceResources').isEmpty(),
    };
  })();

  componentDidUpdate(prevProps, { isSpaceDifferent: prevIsSpaceDifferent }) {
    const {
      status,
      history: { push },
      dispatchClearLoadSpace,
      extractPath,
    } = this.props;

    this.handleSpaceIsDifferent(prevIsSpaceDifferent);

    // when load is successful, redirect
    if (status === LOAD_SPACE_STATUS.DONE) {
      dispatchClearLoadSpace({ extractPath });
      push(LOAD_SPACE_PATH);
    }
  }

  componentWillUnmount() {
    const { dispatchClearLoadSpace, extractPath } = this.props;
    dispatchClearLoadSpace({ extractPath });
  }

  handleSpaceIsDifferent = prevIsSpaceDifferent => {
    const {
      space,
      savedSpace,
      history: { goBack },
      isStudent,
    } = this.props;

    const isSpaceDifferent = isSpaceDifferentFunc(savedSpace, space);

    // students cannot add out of date space data
    if (isStudent && isSpaceDifferent) {
      toastr.error(
        ERROR_MESSAGE_HEADER,
        ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE
      );
      goBack();
    }
    if (isSpaceDifferent !== prevIsSpaceDifferent) {
      this.setState({ isSpaceDifferent, space: isSpaceDifferent });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleBack = () => {
    const {
      history: { push },
      extractPath,
      dispatchClearLoadSpace,
    } = this.props;
    dispatchClearLoadSpace({ extractPath });
    push(LOAD_SPACE_PATH);
  };

  handleSubmit = () => {
    const { dispatchLoadSpace, elements, extractPath } = this.props;
    const { space, actions, appInstanceResources } = this.state;
    const selection = { space, actions, appInstanceResources };
    dispatchLoadSpace({
      extractPath,
      elements: elements.toJS(),
      selection,
    });
  };

  render() {
    const { classes, t, activity, elements, extractPath } = this.props;
    const {
      space: isSpaceChecked,
      appInstanceResources: isResourcesChecked,
      actions: isActionsChecked,
      isSpaceDifferent,
    } = this.state;

    const selection = [isSpaceChecked, isResourcesChecked, isActionsChecked];

    // corner case of empty extractPath is handled in constructor
    if (activity || !extractPath.length) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    return (
      <Main fullScreen>
        <div>
          <Typography align="center" variant="h4">
            {t('What do you want to load?')}
          </Typography>
          <br />

          <Banner
            text={t('Imported data will be reassigned as your own data')}
            type="error"
          />
          <LoadSpaceSelectors
            // space is always disabled:
            // when the space does not exist (force load)
            // when the space has change (force load)
            // when the space has no change (no load)
            isSpaceDisabled
            isSpaceDifferent={isSpaceDifferent}
            isSpaceChecked={isSpaceChecked}
            isResourcesChecked={isResourcesChecked}
            isActionsChecked={isActionsChecked}
            handleChange={this.handleChange}
            elements={elements}
          />

          <div className={classes.buttonGroup}>
            <Button
              id={LOAD_BACK_BUTTON_ID}
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.submitButton)}
              onClick={this.handleBack}
            >
              {t('Back')}
            </Button>
            <Button
              id={LOAD_LOAD_BUTTON_ID}
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.submitButton)}
              onClick={this.handleSubmit}
              // disable load button if nothing is to be loaded
              disabled={!selection.includes(true)}
            >
              {t('Load')}
            </Button>
          </div>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ loadSpace: loadSpaceReducer, authentication }) => ({
  elements: loadSpaceReducer.getIn(['extract', 'elements']),
  activity: Boolean(loadSpaceReducer.getIn(['activity']).size),
  extractPath: loadSpaceReducer.getIn(['extract', 'extractPath']),
  isStudent:
    authentication.getIn(['user', 'settings', 'userMode']) ===
    USER_MODES.STUDENT,
  status: loadSpaceReducer.getIn(['status']),
  savedSpace: loadSpaceReducer.getIn(['savedSpace']),
  space: loadSpaceReducer.getIn(['extract', 'elements', 'space']),
});

const mapDispatchToProps = {
  dispatchLoadSpace: loadSpace,
  dispatchClearLoadSpace: clearLoadSpace,
};

const TranslatedComponent = withTranslation()(LoadSelectionScreen);

export default withRouter(
  withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(TranslatedComponent)
  )
);
