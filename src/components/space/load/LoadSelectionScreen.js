import { toastr } from 'react-redux-toastr';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import _ from 'lodash';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import { loadSpace, cancelLoadSpace } from '../../../actions';
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
    dispatchCancelLoadSpace: PropTypes.func.isRequired,
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
  };

  constructor(props) {
    super(props);
    const {
      isStudent,
      location: { state = {} },
      history: { goBack, push },
    } = props;

    if (_.isEmpty(state)) {
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
    resources: !this.props.elements.get('resources').isEmpty(),
  };
  /* eslint-enable react/destructuring-assignment */

  componentWillUnmount() {
    const { dispatchCancelLoadSpace, extractPath } = this.props;
    dispatchCancelLoadSpace({ extractPath });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleBack = () => {
    const {
      history: { goBack },
      extractPath,
      dispatchCancelLoadSpace,
    } = this.props;
    goBack();
    dispatchCancelLoadSpace({ extractPath });
  };

  handleSubmit = async () => {
    const {
      dispatchLoadSpace,
      elements,
      extractPath,
      history: { push },
    } = this.props;
    const { space, actions, resources } = this.state;
    const selection = { space, actions, resources };
    await dispatchLoadSpace({
      extractPath,
      elements: elements.toJS(),
      selection,
    });
    push(LOAD_SPACE_PATH);
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
        <FormControlLabel control={checkbox} label={label} />
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
    } = this.props;

    if (isStudent) {
      return (
        <FormHelperText>{t('Students cannot load spaces')}</FormHelperText>
      );
    }

    return isSpaceDifferent ? (
      <FormHelperText>
        {t(`The Space does not exist or is different`)}
      </FormHelperText>
    ) : (
      <FormHelperText>{t('This space already exists')}</FormHelperText>
    );
  };

  render() {
    const { classes, t, activity, elements } = this.props;
    const {
      space: isSpaceChecked,
      resources: isResourcesChecked,
      actions: isActionsChecked,
    } = this.state;

    const selection = { isSpaceChecked, isResourcesChecked, isActionsChecked };

    if (activity) {
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
          <FormGroup>
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

            {this.renderCheckbox(
              t('resources'),
              t(`This Space's User Inputs`),
              isResourcesChecked,
              elements.get('resources').isEmpty(),
              t(`This file does not contain any user input`)
            )}

            {this.renderCheckbox(
              t('actions'),
              t(`This Space's analytics`),
              isActionsChecked,
              elements.get('actions').isEmpty(),
              t(`This file does not contain any analytics`)
            )}
          </FormGroup>
          <br />
          <div className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.submitButton)}
              onClick={this.handleBack}
            >
              {t('Back')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.submitButton)}
              onClick={this.handleSubmit}
              // disable load button if nothing is to be loaded
              disabled={!Object.values(selection).includes(true)}
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
});

const mapDispatchToProps = {
  dispatchLoadSpace: loadSpace,
  dispatchCancelLoadSpace: cancelLoadSpace,
};

const TranslatedComponent = withTranslation()(LoadSelectionScreen);

export default withRouter(
  withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(TranslatedComponent)
  )
);
