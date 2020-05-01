import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
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
import { isSpaceUpToDate } from '../../../utils/syncSpace';

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
        space: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      }),
    }).isRequired,
    t: PropTypes.func.isRequired,
    elements: PropTypes.instanceOf(Map).isRequired,
    extractPath: PropTypes.string.isRequired,
    savedSpace: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    savedSpace: Map(),
  };

  /* eslint-disable react/destructuring-assignment */
  state = {
    // check space if it is not empty and is different from saved space
    space: !this.props.elements.get('space').isEmpty(),
    actions: !this.props.elements.get('actions').isEmpty(),
    resources: !this.props.elements.get('resources').isEmpty(),
    isSpaceDifferent: true,
  };
  /* eslint-enable react/destructuring-assignment */

  componentDidMount() {
    const { savedSpace, elements } = this.props;
    const space = elements.get('space');

    // space is different if zip space is not empty and the space does not exist locally or
    // there is a difference between currently saved space and space in zip
    // it changes space checkbox as well
    const isSpaceDifferent =
      !space.isEmpty() &&
      (savedSpace.isEmpty() ||
        !isSpaceUpToDate(space.toJS(), savedSpace.toJS()));

    this.setState({ isSpaceDifferent, space: isSpaceDifferent });
  }

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

  render() {
    const { classes, t, activity, elements } = this.props;
    const {
      space: isSpaceChecked,
      resources: isResourcesChecked,
      actions: isActionsChecked,
      isSpaceDifferent,
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
            {isSpaceDifferent ? (
              <FormHelperText>
                {t(`The Space is different from local`)}
              </FormHelperText>
            ) : (
              <FormHelperText>{t('This space already exist')}</FormHelperText>
            )}

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

const mapStateToProps = ({ loadSpace: loadSpaceReducer }) => ({
  elements: loadSpaceReducer.getIn(['extract', 'elements']),
  savedSpace: loadSpaceReducer.getIn(['extract', 'savedSpace']),
  activity: Boolean(loadSpaceReducer.getIn(['activity']).size),
  extractPath: loadSpaceReducer.getIn(['extract', 'extractPath']),
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
