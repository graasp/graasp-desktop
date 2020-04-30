import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { exportSpace } from '../../../actions';
import Styles from '../../../Styles';
import Loader from '../../common/Loader';
import Main from '../../common/Main';
import SpaceNotFound from '../SpaceNotFound';

const styles = theme => ({
  ...Styles(theme),
  buttonGroup: {
    textAlign: 'center',
  },
});

class ExportSelectionScreen extends Component {
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
    dispatchExportSpace: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      length: PropTypes.number.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
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
  };

  state = {
    space: true,
    actions: true,
    resources: true,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  handleSubmit = () => {
    const {
      userId,
      location: {
        state: {
          space: { id, name },
        },
      },
      dispatchExportSpace,
    } = this.props;
    const { space, actions, resources } = this.state;
    const selection = { space, actions, resources };
    dispatchExportSpace(id, name, userId, selection);
  };

  render() {
    const {
      classes,
      t,
      location: { state },
      activity,
    } = this.props;
    const {
      space: isSpaceChecked,
      resources: isResourcesChecked,
      actions: isActionsChecked,
    } = this.state;

    if (!state || !state.space) {
      return <SpaceNotFound />;
    }

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

    const spaceCheckbox = (
      <Checkbox
        checked={isSpaceChecked}
        onChange={this.handleChange}
        name="space"
        color="primary"
      />
    );

    const resourcesCheckbox = (
      <Checkbox
        checked={isResourcesChecked}
        onChange={this.handleChange}
        name="resources"
        color="primary"
      />
    );
    const actionsCheckbox = (
      <Checkbox
        checked={isActionsChecked}
        onChange={this.handleChange}
        name="actions"
        color="primary"
      />
    );

    return (
      <Main fullScreen>
        <div>
          <Typography align="center" variant="h4">
            {t('What do you want to export?')}
          </Typography>

          <br />
          <FormGroup>
            <FormControlLabel control={spaceCheckbox} label={t('This Space')} />
            <FormControlLabel
              control={resourcesCheckbox}
              label={t("This Space's User Inputs")}
            />
            <FormControlLabel
              control={actionsCheckbox}
              label={t("This Space's Analytics")}
            />
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
            >
              {t('Export')}
            </Button>
          </div>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ authentication, Space }) => ({
  userId: authentication.getIn(['user', 'id']),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchExportSpace: exportSpace,
};

const TranslatedComponent = withTranslation()(ExportSelectionScreen);

export default withRouter(
  withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(TranslatedComponent)
  )
);
