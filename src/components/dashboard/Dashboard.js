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
import { FILTER_ALL_SPACE_ID } from '../../config/constants';
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
    spaceId: FILTER_ALL_SPACE_ID,
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
      actions: PropTypes.arrayOf(PropTypes.object),
    }),
    dispatchGetDatabase: PropTypes.func.isRequired,
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

  renderSpaceFilter = () => {
    const { database, t } = this.props;
    const { spaceId } = this.state;

    if (!database || _.isEmpty(database)) {
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
          <MenuItem value={FILTER_ALL_SPACE_ID}>
            <em>{t('All Spaces')}</em>
          </MenuItem>
          {database.spaces.map(space => (
            <MenuItem value={space.id}>{space.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderActionWidgets = () => {
    const { database, t, classes } = this.props;
    const { spaceId } = this.state;

    let filteredActions = database.actions;
    if (spaceId !== FILTER_ALL_SPACE_ID) {
      filteredActions = filteredActions.filter(
        ({ spaceId: id }) => id === spaceId
      );
    }

    if (_.isEmpty(filteredActions)) {
      return <p>{t('No action has been recorded.')}</p>;
    }

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

  render() {
    const { classes, t, database } = this.props;
    const { spaceId } = this.state;

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
            <Grid item xs={12} sm={9}>
              <Typography variant="h4" className={classes.screenTitle}>
                {t('Dashboard')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              {this.renderSpaceFilter()}
            </Grid>
          </Grid>

          {this.renderActionWidgets()}

          <ActionEditor spaceId={spaceId} />
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ Developer }) => ({
  database: Developer.get('database'),
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
