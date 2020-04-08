import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SIGN_IN_PATH, HOME_PATH } from '../config/paths';
import { AUTHENTICATED } from '../config/constants';

// todo: remove eslint disable when parameter is used
// eslint-disable-next-line no-unused-vars
const Authorization = () => ChildComponent => {
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

  const mapStateToProps = ({ authentication }) => ({
    user: authentication.get('user'),
    authenticated: authentication.get('authenticated') === AUTHENTICATED,
    activity: Boolean(authentication.getIn(['current', 'activity']).size),
  });

  return connect(mapStateToProps)(ComposedComponent);
};

export default Authorization;
