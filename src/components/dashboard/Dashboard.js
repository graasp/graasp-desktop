import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
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
import PropTypes from 'prop-types';
import ActionBarChart from './ActionBarChart';
import ActionLineChart from './ActionLineChart';
import ActionTotalCount from './ActionTotalCount';
import ActionPieChart from './ActionPieChart';
import MainMenu from '../common/MainMenu';
import ActionEditor from './ActionEditor';

const styles = theme => ({
  dashboard: { padding: theme.spacing(3) },
  dashboardGridItem: { height: '350px' },
});

export class Dashboard extends Component {
  state = {
    open: false,
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
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, t } = this.props;
    const { open } = this.state;

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
            <Typography variant="h4" className={classes.screenTitle}>
              {t('Action Dashboard')}
            </Typography>
            <br />
            <Grid
              style={{ display: 'flex' }}
              spacing={5}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
                <ActionBarChart />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
                <ActionLineChart />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
                <ActionPieChart />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.dashboardGridItem}>
                <ActionTotalCount speed={1234} />
              </Grid>
            </Grid>

            <ActionEditor />
          </div>
        </main>
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(Dashboard);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
