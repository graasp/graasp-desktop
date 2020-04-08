import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import logo from '../../logo.svg';
import Styles from '../../Styles';
import { signIn, signOut } from '../../actions/authentication';
import { AUTHENTICATED } from '../../config/constants';
import { HOME_PATH } from '../../config/paths';
import Main from '../common/Main';
import {
  LOGIN_USERNAME_INPUT_ID,
  LOGIN_BUTTON_ID,
  SIGN_IN_MAIN_ID,
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

const styles = theme => ({
  ...Styles(theme),
  graaspLogo: { padding: '0px 45px', width: '95%' },
});

class SignInScreen extends Component {
  state = {
    username: '',
    usernameIsEmpty: true,
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
      fullScreen: PropTypes.string.isRequired,
      graaspLogo: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
      palette: PropTypes.shape({
        primary: PropTypes.shape({
          main: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
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
    const {
      classes,
      t,
      theme: {
        palette: {
          primary: { main },
        },
      },
    } = this.props;
    const { username, usernameIsEmpty } = this.state;

    return (
      <Main id={SIGN_IN_MAIN_ID} style={{ background: main }} fullScreen>
        <FormControl>
          <img
            src={logo}
            alt={t('Graasp logo')}
            className={classes.graaspLogo}
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

          <Divider variant="middle" classes={{ root: classes.dividerColor }} />

          <Button
            variant="contained"
            onClick={() => this.handleAnonymousSignIn(true)}
            color="secondary"
            className={classes.button}
          >
            {t('Sign In as Guest')}
          </Button>
        </FormControl>
      </Main>
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

const StyledComponent = withStyles(styles, { withTheme: true })(SignInScreen);

const TranslatedComponent = withTranslation()(StyledComponent);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedComponent);

export default withRouter(ConnectedComponent);
