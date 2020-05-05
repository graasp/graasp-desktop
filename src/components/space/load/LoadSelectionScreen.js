import { toastr } from 'react-redux-toastr';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import _ from 'lodash';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import { loadSpace, clearLoadSpace } from '../../../actions';
import Styles from '../../../Styles';
import Loader from '../../common/Loader';
import Main from '../../common/Main';
import { LOAD_SPACE_PATH } from '../../../config/paths';
import { USER_MODES } from '../../../config/constants';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_STUDENT_FORBIDDEN_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
} from '../../../config/messages';
import {
  LOAD_LOAD_BUTTON_ID,
  LOAD_BACK_BUTTON_ID,
  buildCheckboxLabel,
} from '../../../config/selectors';
import { LOAD_SPACE_STATUS } from '../../../reducers/loadSpaceReducer';

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
      appBar: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
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
      }),
    }).isRequired,
    t: PropTypes.func.isRequired,
    elements: PropTypes.instanceOf(Map).isRequired,
    extractPath: PropTypes.string.isRequired,
    isStudent: PropTypes.bool.isRequired,
    status: PropTypes.oneOf(Object.values(LOAD_SPACE_STATUS)).isRequired,
  };

  constructor(props) {
    super(props);
    const {
      isStudent,
      location: { state = {} },
      history: { goBack, push },
      extractPath,
    } = props;

    if (_.isEmpty(state) || !extractPath.length) {
      toastr.error(ERROR_MESSAGE_HEADER, UNEXPECTED_ERROR_MESSAGE);
      push(LOAD_SPACE_PATH);
    }
    // students cannot add out of date space data
    else if (isStudent && state.isSpaceDifferent) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_STUDENT_FORBIDDEN_MESSAGE);
      goBack();
    }
  }

  /* eslint-disable react/destructuring-assignment */
  state = {
    // check space if it is not empty and is different from saved space
    // student cannot load spaces
    space: this.props.location.state
      ? this.props.location.state.isSpaceDifferent
      : false,
    actions: !this.props.elements.get('actions').isEmpty(),
    appInstanceResources: !this.props.elements
      .get('appInstanceResources')
      .isEmpty(),
  };
  /* eslint-enable react/destructuring-assignment */

  componentDidUpdate() {
    const {
      status,
      history: { push },
      dispatchClearLoadSpace,
      extractPath,
    } = this.props;

    // when load is successful, redirect
    if (status === LOAD_SPACE_STATUS.SUCCESS) {
      dispatchClearLoadSpace({ extractPath });
      push(LOAD_SPACE_PATH);
    }
  }

  componentWillUnmount() {
    const { dispatchClearLoadSpace, extractPath } = this.props;
    dispatchClearLoadSpace({ extractPath });
  }

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

  renderCheckbox = (name, label, isChecked, disabled, emptyHelperText) => {
    const checkbox = (
      <Checkbox
        checked={isChecked}
        onChange={this.handleChange}
        name={name}
        color="primary"
        disabled={disabled}
      />
    );

    const { elements } = this.props;
    const isEmpty = elements.get(name).isEmpty();

    return (
      <>
        <FormControlLabel
          id={buildCheckboxLabel(name)}
          control={checkbox}
          label={label}
        />
        {isEmpty && <FormHelperText>{emptyHelperText}</FormHelperText>}
      </>
    );
  };

  renderSpaceHelperText = () => {
    const {
      isStudent,
      t,
      location: {
        state: { isSpaceDifferent },
      },
      elements,
    } = this.props;

    if (isStudent) {
      return (
        <FormHelperText>{t('Students cannot load spaces')}</FormHelperText>
      );
    }

    if (isSpaceDifferent) {
      return (
        <FormHelperText>
          {t(`The Space does not exist or is different`)}
        </FormHelperText>
      );
    }

    // when the zip space is not different and application already contains space
    if (!elements.get('space').isEmpty()) {
      return <FormHelperText>{t('This space already exists')}</FormHelperText>;
    }

    return null;
  };

  render() {
    const { classes, t, activity, elements, extractPath } = this.props;
    const {
      space: isSpaceChecked,
      appInstanceResources: isResourcesChecked,
      actions: isActionsChecked,
    } = this.state;

    const selection = [isSpaceChecked, isResourcesChecked, isActionsChecked];

    // if extractPath is undefined, it returns in componentDidUpdate
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
          <Grid
            container
            alignItems="center"
            alignContent="center"
            justify="center"
          >
            <Grid item xs={7}>
              {this.renderCheckbox(
                t('space'),
                t('This Space'),
                isSpaceChecked,
                // space is always disabled:
                // when the space does not exist (force load)
                // when the space has change (force load)
                // when the space has no change (no load)
                true,
                t(`This file does not contain a space`)
              )}
              {this.renderSpaceHelperText()}
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={7}>
              {this.renderCheckbox(
                t('appInstanceResources'),
                t(`This Space's Resources`),
                isResourcesChecked,
                elements.get('appInstanceResources').isEmpty(),
                t(`This file does not contain any user input`)
              )}
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Resources are inputs a user save when using applications (ie. answer in Input Text App).'
                )}
                placement="right"
              >
                <InfoIcon color="primary" />
              </Tooltip>
            </Grid>
            <Grid item xs={7}>
              {this.renderCheckbox(
                t('actions'),
                t(`This Space's Actions`),
                isActionsChecked,
                elements.get('actions').isEmpty(),
                t(`This file does not contain any analytics`)
              )}
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Actions are various analytics and user data a user left while using Graasp Desktop.'
                )}
                placement="right"
              >
                <InfoIcon color="primary" />
              </Tooltip>
            </Grid>
          </Grid>
          <br />
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
