import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SIGN_IN_PATH, HOME_PATH } from '../config/paths';
import { AUTHENTICATED, USER_MODES } from '../config/constants';

// todo: remove eslint disable when parameter is used
// eslint-disable-next-line no-unused-vars
const Authorization = (authorizedUserModes = []) => ChildComponent => {
  class ComposedComponent extends Component {
    static redirectToSignIn(props) {
      // pathname inside location matches the path in url
      const { location: { pathname } = {} } = props;
      if (pathname) {
        sessionStorage.setItem('redirect', pathname);
      }
      const {
        history: { replace },
      } = props;
      replace(SIGN_IN_PATH);
    }

    static redirectToHome(props) {
      // pathname inside location matches the path in url
      const { location: { pathname } = {} } = props;
      if (pathname) {
        sessionStorage.setItem('redirect', pathname);
      }
      const {
        history: { replace },
      } = props;
      replace(HOME_PATH);
    }

    static propTypes = {
      userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
      authenticated: PropTypes.bool,
      dispatch: PropTypes.func.isRequired,
      match: PropTypes.shape({
        path: PropTypes.string,
      }).isRequired,
      activity: PropTypes.bool,
    };

    static defaultProps = {
      authenticated: false,
      activity: false,
    };

    componentDidMount() {
      const { authenticated, activity, userMode } = this.props;

      // check if authenticated
      if (!authenticated && !activity) {
        ComposedComponent.redirectToSignIn(this.props);
      }
      if (
        authorizedUserModes.length &&
        !authorizedUserModes.includes(userMode)
      ) {
        ComposedComponent.redirectToHome(this.props);
      }
    }

    componentDidUpdate() {
      const { authenticated, userMode } = this.props;
      if (!authenticated) {
        ComposedComponent.redirectToSignIn(this.props);
      }
      if (
        authorizedUserModes.length &&
        !authorizedUserModes.includes(userMode)
      ) {
        ComposedComponent.redirectToHome(this.props);
      }
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ authentication }) => ({
    userMode: authentication.getIn(['user', 'settings', 'userMode']),
    authenticated: authentication.get('authenticated') === AUTHENTICATED,
    activity: Boolean(authentication.getIn(['current', 'activity']).size),
  });

  return connect(mapStateToProps)(ComposedComponent);
};

export default Authorization;
