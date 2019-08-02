import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core//Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MainMenu from '../common/MainMenu';
import Styles from '../../Styles';
import { HOME_PATH, VISIT_PATH } from '../../config/paths';

class SpaceNotFound extends Component {
  state = {
    open: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const {
      history: { replace },
      classes,
      theme,
      t,
    } = this.props;
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
          <div>
            <Typography variant="h5" color="inherit" style={{ margin: '2rem' }}>
              {t('Space Not Found')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => replace(HOME_PATH)}
            >
              {t('Home')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => replace(VISIT_PATH)}
            >
              {t('Visit Another Space')}
            </Button>
          </div>
        </main>
      </div>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(SpaceNotFound);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
