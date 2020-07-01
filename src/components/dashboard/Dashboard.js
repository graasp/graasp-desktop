import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import ActionBarChart from './ActionBarChart';
import ActionLineChart from './ActionLineChart';
import ActionTotalCount from './ActionTotalCount';
import ActionPieChart from './ActionPieChart';
import ActionEditor from './ActionEditor';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getDatabase } from '../../actions';
import {
  SELECT_ALL_SPACES_ID,
  SELECT_ALL_USERS_ID,
  USER_MODES,
} from '../../config/constants';
import { DASHBOARD_MAIN_ID } from '../../config/selectors';

const styles = theme => ({
  dashboard: { padding: theme.spacing(3) },
  dashboardGridItem: { height: '350px' },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
});

export class Dashboard extends Component {
  state = {
    spaceId: SELECT_ALL_SPACES_ID,
    filteredUserId: SELECT_ALL_USERS_ID,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      dashboard: PropTypes.string.isRequired,
      dashboardGridItem: PropTypes.string.isRequired,
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
      developer: PropTypes.string.isRequired,
      screenTitle: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    database: PropTypes.shape({
      user: PropTypes.object,
      spaces: PropTypes.arrayOf(PropTypes.object),
      users: PropTypes.arrayOf(PropTypes.object),
      actions: PropTypes.arrayOf(PropTypes.object),
    }),
    dispatchGetDatabase: PropTypes.func.isRequired,
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    database: {},
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
  }

  handleSpaceChange = event => {
    this.setState({ spaceId: event.target.value });
  };

  handleUserChange = event => {
    this.setState({ filteredUserId: event.target.value });
  };

  renderSpaceFilter = () => {
    const { database, t } = this.props;
    const { spaceId } = this.state;

    if (!database) {
      return <Loader />;
    }

    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel>{t('Filter by Space')}</InputLabel>
        <Select
          label="Filter by Space"
          value={spaceId}
          onChange={this.handleSpaceChange}
        >
          <MenuItem value={SELECT_ALL_SPACES_ID}>
            <em>{t('All Spaces')}</em>
          </MenuItem>
          {database.spaces.map(space => (
            <MenuItem value={space.id}>{space.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderUserFilter = () => {
    const { database, t, userMode } = this.props;
    const { filteredUserId } = this.state;

    if (!database) {
      return <Loader />;
    }

    if (userMode !== USER_MODES.TEACHER) {
      return null;
    }

    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel>{t('Filter by User')}</InputLabel>
        <Select
          label="Filter by User"
          value={filteredUserId}
          onChange={this.handleUserChange}
        >
          <MenuItem value={SELECT_ALL_USERS_ID}>
            <em>{t('All Users')}</em>
          </MenuItem>
          {database.users.map(user => (
            <MenuItem value={user.id}>{user.username}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderActionWidgets = filteredActions => {
    const { database, classes } = this.props;

    return (
      <Grid
        style={{ display: 'flex' }}
        spacing={5}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
          <ActionBarChart spaces={database.spaces} actions={filteredActions} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
          <ActionLineChart actions={filteredActions} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
          <ActionPieChart actions={filteredActions} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
          <ActionTotalCount actions={filteredActions} />
        </Grid>
      </Grid>
    );
  };

  renderContent = () => {
    const { t, database, userMode, userId } = this.props;
    const { spaceId, filteredUserId } = this.state;

    let filteredActions = database.actions;
    const { users } = database;
    const isStudent = userMode === USER_MODES.STUDENT;

    filteredActions = filteredActions.filter(({ user }) => {
      const isOwnAction = user === userId;
      const actionUser = users.find(({ id }) => id === user);
      const isAccessible =
        actionUser && actionUser.settings.actionAccessibility;
      const filteredUserSelected = filteredUserId !== SELECT_ALL_USERS_ID;

      // filter action per user if userMode is student
      return (
        (isStudent && isOwnAction) ||
        // filter actions per selected user if selected
        // only teachers have access to user filter
        // actions are displayed either if the user set action as accessible or
        // actions are own by the current user
        (!isStudent &&
          (!filteredUserSelected || user === filteredUserId) &&
          (isAccessible || isOwnAction))
      );
    });

    // filter action per space
    if (spaceId !== SELECT_ALL_SPACES_ID) {
      filteredActions = filteredActions.filter(
        ({ spaceId: id }) => id === spaceId
      );
    }

    return filteredActions.length ? (
      <>
        {this.renderActionWidgets(filteredActions)}
        <ActionEditor actions={filteredActions} />
      </>
    ) : (
      <Typography>{t('No action has been recorded.')}</Typography>
    );
  };

  render() {
    const { classes, t, database } = this.props;

    if (!database) {
      return <Loader />;
    }

    if (_.isEmpty(database)) {
      return <p>{t('The database is empty.')}</p>;
    }

    return (
      <Main id={DASHBOARD_MAIN_ID}>
        <div className={classes.dashboard}>
          <Grid
            style={{ display: 'flex' }}
            container
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" className={classes.screenTitle}>
                {t('Dashboard')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              {this.renderUserFilter()}
            </Grid>
            <Grid item xs={12} sm={3}>
              {this.renderSpaceFilter()}
            </Grid>
          </Grid>

          {this.renderContent()}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ Developer, authentication }) => ({
  database: Developer.get('database'),
  userId: authentication.getIn(['user', 'id']),
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
});

const mapDispatchToProps = {
  dispatchGetDatabase: getDatabase,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
