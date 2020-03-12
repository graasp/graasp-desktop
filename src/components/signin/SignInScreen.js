import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../../assets/icon.png';
import MainMenu from '../common/MainMenu';
import Styles from '../../Styles';
import { signIn, signOut } from '../../actions/authentication';
import { AUTHENTICATED } from '../../config/constants';
import { HOME_PATH } from '../../config/paths';
import {
  LOGIN_USERNAME_INPUT_ID,
  LOGIN_BUTTON_ID,
} from '../../config/selectors';

const CssTextField = withStyles({
  root: {
    '& input': {
      color: 'white',
    },
    '& label, & label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);

class SignInScreen extends Component {
  state = {
    open: false,
    username: '',
    usernameIsEmpty: true,
  };

  styles = {
    root: {
      background: '#504FD2',
    },
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      dividerColor: PropTypes.string.isRequired,
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
    dispatchSignIn: PropTypes.func.isRequired,
    dispatchSignOut: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
  };

  componentDidMount = () => {
    const { authenticated } = this.props;
    // redirect to home if already authenticated
    if (authenticated) {
      this.redirect();
    }
  };

  redirect = () => {
    const {
      history: { replace },
    } = this.props;
    replace(HOME_PATH);
  };

  componentDidUpdate = () => {
    const { authenticated } = this.props;
    // redirect to home if already authenticated
    if (authenticated) {
      this.redirect();
    }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleSignIn = () => {
    const { username } = this.state;
    const { dispatchSignIn } = this.props;
    if (username.length) {
      dispatchSignIn({ username });
    }
  };

  handleAnonymousSignIn = () => {
    const { dispatchSignIn } = this.props;
    dispatchSignIn({ anonymous: true });
  };

  handleSignOut = () => {
    const { dispatchSignOut } = this.props;
    dispatchSignOut();
  };

  handleUsername = event => {
    const username = event.target ? event.target.value : event;
    const usernameIsEmpty = !username.length;
    this.setState({ username, usernameIsEmpty });
  };

  handleKeyPressed = event => {
    if (event.key === 'Enter') {
      this.handleSignIn();
    }
  };

  render() {
    const { classes, theme, t } = this.props;
    const { open, username, usernameIsEmpty } = this.state;

    return (
      <div className={classes.root} style={this.styles.root}>
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
          <FormControl>
            <img
              src={logo}
              alt="graasp logo"
              width="70%"
              style={{ margin: 'auto' }}
            />
            <CssTextField
              id={LOGIN_USERNAME_INPUT_ID}
              label={t('Username')}
              variant="outlined"
              onChange={this.handleUsername}
              onKeyPress={this.handleKeyPressed}
              value={username}
            />
            <br />
            <Button
              id={LOGIN_BUTTON_ID}
              variant="contained"
              onClick={this.handleSignIn}
              color="secondary"
              className={classes.button}
              disabled={usernameIsEmpty}
            >
              {t('Sign In')}
            </Button>

            <Divider
              variant="middle"
              classes={{ root: classes.dividerColor }}
            />

            <Button
              variant="contained"
              onClick={() => this.handleAnonymousSignIn(true)}
              color="secondary"
              className={classes.button}
            >
              {t('Sign In as Guest')}
            </Button>
          </FormControl>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  user: authentication.getIn(['user']),
  authenticated: authentication.getIn(['authenticated']) === AUTHENTICATED,
});

const mapDispatchToProps = {
  dispatchSignIn: signIn,
  dispatchSignOut: signOut,
};

const StyledComponent = withStyles(Styles, { withTheme: true })(SignInScreen);

const TranslatedComponent = withTranslation()(StyledComponent);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedComponent);

export default withRouter(ConnectedComponent);
