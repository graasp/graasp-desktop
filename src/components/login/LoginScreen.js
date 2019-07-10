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
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import MainMenu from '../common/MainMenu';
import Styles from '../../Styles';

class LoginScreen extends Component {
  state = {
    open: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
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

  handleClick = () => {};

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
          className={classNames('Main', classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <FormControl className={classes.formControl}>
            <Typography
              variant="h4"
              className={classes.screenTitle}
              align="center"
            >
              {t('Login')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {t('Login with Graasp')}
            </Button>

            <Divider />

            <TextField
              label="Enter your Username"
              floatingLabelText="Username"
            />
            <br />
            <TextField
              type="password"
              label="Enter your Password"
              floatingLabelText="Password"
            />
            <Button
              variant="contained"
              onClick={this.handleClick()}
              color="primary"
              className={classes.button}
            >
              {t('Login')}
            </Button>
          </FormControl>
        </main>
      </div>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(LoginScreen);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
