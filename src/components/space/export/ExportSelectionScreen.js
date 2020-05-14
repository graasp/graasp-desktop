import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { exportSpace, getDatabase, clearExportSpace } from '../../../actions';
import Styles from '../../../Styles';
import Loader from '../../common/Loader';
import Main from '../../common/Main';
import {
  EXPORT_SPACE_BUTTON_ID,
  EXPORT_SPACE_BACK_BUTTON_ID,
  buildCheckboxLabel,
} from '../../../config/selectors';
import { EXPORT_SPACE_STATUS } from '../../../reducers/exportSpaceReducer';
import {
  ERROR_MESSAGE_HEADER,
  UNEXPECTED_ERROR_MESSAGE,
} from '../../../config/messages';

const styles = theme => ({
  ...Styles(theme),
  buttonGroup: {
    textAlign: 'center',
  },
  paragraph: { display: 'flex', justifyContent: 'center' },
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
      paragraph: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string }).isRequired,
    dispatchExportSpace: PropTypes.func.isRequired,
    dispatchGetDatabase: PropTypes.func.isRequired,
    dispatchClearExportSpace: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      length: PropTypes.number.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      state: PropTypes.shape({
        from: PropTypes.string,
      }),
    }).isRequired,
    t: PropTypes.func.isRequired,
    database: PropTypes.shape({
      actions: PropTypes.arrayOf(PropTypes.object),
      appInstanceResources: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    space: PropTypes.instanceOf(Map).isRequired,
    status: PropTypes.oneOf(Object.values(EXPORT_SPACE_STATUS)).isRequired,
  };

  state = {
    actions: true,
    resources: true,
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
  }

  componentDidUpdate() {
    this.handleStatusChange();
  }

  componentWillUnmount() {
    const { dispatchClearExportSpace } = this.props;
    dispatchClearExportSpace();
  }

  handleStatusChange = () => {
    const {
      status,
      history: { goBack },
      dispatchClearExportSpace,
      space,
    } = this.props;

    // when export is successful, redirect
    if (status === EXPORT_SPACE_STATUS.DONE) {
      dispatchClearExportSpace();
      goBack();
    }
    // during export return with error if space to export is not defined
    else if (space.isEmpty() && status === EXPORT_SPACE_STATUS.RUNNING) {
      toastr.error(ERROR_MESSAGE_HEADER, UNEXPECTED_ERROR_MESSAGE);
      goBack();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleBack = () => {
    const {
      dispatchClearExportSpace,
      history: { goBack },
    } = this.props;
    dispatchClearExportSpace();
    goBack();
  };

  handleSubmit = () => {
    const { userId, space, dispatchExportSpace } = this.props;
    const { actions, resources } = this.state;
    const id = space.get('id');
    const name = space.get('name');
    // always export space
    const selection = { space: true, actions, resources };
    dispatchExportSpace(id, name, userId, selection);
  };

  renderSpaceName = () => {
    const { theme, space } = this.props;
    const name = space.get('name');
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Box {...styles(theme).spaceName}>{name}</Box>;
  };

  renderCheckbox(collectionName, label, isChecked, emptyHelperText) {
    const { database, space, userId } = this.props;

    const id = space.get('id');
    const content = database ? database[collectionName] : [];
    const hasContent = content.filter(
      ({ user, spaceId }) => user === userId && spaceId === id
    ).length;

    const checkbox = (
      <Checkbox
        checked={isChecked && hasContent}
        onChange={this.handleChange}
        name={collectionName}
        color="primary"
        disabled={!hasContent}
      />
    );

    return (
      <>
        <FormControlLabel
          id={buildCheckboxLabel(collectionName)}
          control={checkbox}
          label={label}
        />
        {!hasContent && <FormHelperText>{emptyHelperText}</FormHelperText>}
      </>
    );
  }

  render() {
    const { classes, t, activity, space } = this.props;

    const {
      resources: isResourcesChecked,
      actions: isActionsChecked,
    } = this.state;

    // corner case of empty space is handled in handleStatusChange
    if (activity || space.isEmpty()) {
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
          <Typography variant="h3" align="center">
            {t('Export Space')}
          </Typography>

          <Typography variant="h5" align="center" className={classes.paragraph}>
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
              {this.renderCheckbox(
                'appInstanceResources',
                t("This Space's Resources"),
                isResourcesChecked,
                t('No Resource available for this Space')
              )}
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Resources are user-generated content saved when using applications (e.g., answer submitted via an input box)'
                )}
                placement="right"
              >
                <InfoIcon color="primary" />
              </Tooltip>
            </Grid>
            <Grid item xs={7}>
              {this.renderCheckbox(
                'actions',
                t("This Space's Actions"),
                isActionsChecked,
                t('No Action available for this Space')
              )}
            </Grid>
            <Grid item xs={1}>
              <Tooltip
                title={t(
                  'Actions are analytics generated when a user interacts with a space.'
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

const mapStateToProps = ({
  authentication,
  exportSpace: exportSpaceReducer,
  Developer,
}) => ({
  userId: authentication.getIn(['user', 'id']),
  database: Developer.get('database'),
  activity: Boolean(exportSpaceReducer.getIn(['activity']).size),
  space: exportSpaceReducer.getIn(['space']),
  status: exportSpaceReducer.getIn(['status']),
});

const mapDispatchToProps = {
  dispatchExportSpace: exportSpace,
  dispatchGetDatabase: getDatabase,
  dispatchClearExportSpace: clearExportSpace,
};

const TranslatedComponent = withTranslation()(ExportSelectionScreen);

export default withRouter(
  withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(TranslatedComponent)
  )
);
