import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
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
import {
  EXPORT_SPACE_BUTTON_ID,
  EXPORT_SPACE_BACK_BUTTON_ID,
} from '../../../config/selectors';

const styles = theme => ({
  ...Styles(theme),
  buttonGroup: {
    textAlign: 'center',
  },

  spaceName: {
    component: 'span',
    fontStyle: 'italic',

    // following lines ensure long titles are shorten
    display: 'inline-block',
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    marginLeft: 1, // simulate left space
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
    const { actions, resources } = this.state;

    // always export space
    const selection = { space: true, actions, resources };
    dispatchExportSpace(id, name, userId, selection);
  };

  renderSpaceName = () => {
    const {
      theme,
      location: {
        state: {
          space: { name },
        },
      },
    } = this.props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Box {...styles(theme).spaceName}>{name}</Box>;
  };

  render() {
    const {
      classes,
      t,
      location: { state },
      activity,
    } = this.props;
    const {
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
          <Typography variant="h3" align="center">
            {t('Export Space ')}
          </Typography>

          <Typography variant="h5" align="center" style={{ display: 'flex' }}>
            {t('You are going to export')}
            {this.renderSpaceName()}
          </Typography>
          <Typography variant="h5" align="left">
            {t('Include')}
            {':'}
          </Typography>

          <br />
          <Grid
            container
            alignItems="center"
            alignContent="center"
            justify="center"
          >
            <Grid item xs={7}>
              <FormControlLabel
                control={resourcesCheckbox}
                label={t("This Space's User Inputs")}
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Actions are input a user save when using applications (ie. answer in Input Text App).'
                )}
                placement="right"
              >
                <InfoIcon color="primary" />
              </Tooltip>
            </Grid>
            <Grid item xs={7}>
              <FormControlLabel
                control={actionsCheckbox}
                label={t("This Space's Analytics")}
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Analytics are various statistics and user data a user left while using Graasp Desktop.'
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
              id={EXPORT_SPACE_BACK_BUTTON_ID}
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.submitButton)}
              onClick={this.handleBack}
            >
              {t('Back')}
            </Button>
            <Button
              id={EXPORT_SPACE_BUTTON_ID}
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
