import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import ActionBarChart from './ActionBarChart';
import ActionLineChart from './ActionLineChart';
import ActionTotalCount from './ActionTotalCount';
import ActionPieChart from './ActionPieChart';
import MainMenu from '../common/MainMenu';
import ActionEditor from './ActionEditor';
import Loader from '../common/Loader';
import { getDatabase } from '../../actions';
import { FILTER_ALL_SPACE_ID } from '../../config/constants';

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
    open: false,
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

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

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
        <InputLabel>{t('Filter by space')}</InputLabel>
        <Select
          label="Filter by space"
          value={spaceId}
          onChange={this.handleSpaceChange}
        >
          <MenuItem value={FILTER_ALL_SPACE_ID}>
            <em>All Spaces</em>
          </MenuItem>
          {database.spaces.map(space => (
            <MenuItem value={space.id}>{space.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  render() {
    const { classes, theme, t, database } = this.props;
    const { open, spaceId } = this.state;

    if (!database || _.isEmpty(database)) {
      return <Loader />;
    }

    let filteredActions = database.actions;
    if (spaceId !== FILTER_ALL_SPACE_ID) {
      filteredActions = filteredActions.filter(
        ({ spaceId: id }) => id === spaceId
      );
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <MainMenu />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
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

            <Grid
              style={{ display: 'flex' }}
              spacing={5}
              container
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
                <ActionBarChart
                  spaces={database.spaces}
                  actions={filteredActions}
                />
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

            <ActionEditor spaceId={spaceId} />
          </div>
        </main>
      </div>
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
