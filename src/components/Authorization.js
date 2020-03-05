import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { replace } from 'connected-react-router';
import { LOGIN_PATH } from '../config/paths';
import { AUTHENTICATED } from '../config/constants';

// todo: remove eslint disable when parameter is used
// eslint-disable-next-line no-unused-vars
const Authorization = roles => ChildComponent => {
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
      replace(LOGIN_PATH);
    }

    static propTypes = {
      user: PropTypes.shape({
        username: PropTypes.string,
      }),
      authenticated: PropTypes.bool,
      dispatch: PropTypes.func.isRequired,
      match: PropTypes.shape({
        path: PropTypes.string,
      }).isRequired,
      activity: PropTypes.bool,
    };

    static defaultProps = {
      user: null,
      authenticated: false,
      activity: false,
    };

    componentDidMount() {
      const { authenticated, activity } = this.props;

      // check if authenticated
      if (!authenticated && !activity) {
        ComposedComponent.redirectToSignIn(this.props);
      }
      // todo: check if user has access to current view
    }

    componentDidUpdate() {
      const { authenticated } = this.props;
      if (!authenticated) {
        ComposedComponent.redirectToSignIn(this.props);
      }
      // todo: check if user has access to current view
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ Authentication }) => ({
    user: Authentication.get('user'),
    authenticated: Authentication.get('authenticated') === AUTHENTICATED,
    activity: Authentication.get('activity'),
  });

  return connect(mapStateToProps)(ComposedComponent);
};

export default Authorization;
