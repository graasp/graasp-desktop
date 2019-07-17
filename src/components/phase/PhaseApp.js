import React, { Component } from 'react';
import Qs from 'qs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './PhaseApp.css';
import {
  GET_APP_INSTANCE_RESOURCES,
  PATCH_APP_INSTANCE_RESOURCE,
  GET_APP_INSTANCE,
  POST_APP_INSTANCE_RESOURCE,
} from '../../types';
import {
  getAppInstanceResources,
  patchAppInstanceResource,
  postAppInstanceResource,
  getAppInstance,
} from '../../actions';
import {
  DEFAULT_LANGUAGE,
  SMART_GATEWAY_QUERY_STRING_DIVIDER,
} from '../../config/constants';
import { isSmartGatewayUrl } from '../../utils/url';

class PhaseApp extends Component {
  static propTypes = {
    url: PropTypes.string,
    asset: PropTypes.string,
    name: PropTypes.string,
    folder: PropTypes.string.isRequired,
    dispatchGetAppInstance: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    phaseId: PropTypes.string.isRequired,
    spaceId: PropTypes.string.isRequired,
    lang: PropTypes.string,
    appInstance: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    url: null,
    asset: null,
    appInstance: null,
    name: 'Image',
    lang: DEFAULT_LANGUAGE,
  };

  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage);
  }

  postMessage = data => {
    // get component app instance id
    const { appInstance } = this.props;
    const { id: componentAppInstanceId } = appInstance || {};
    // get app instance id in message
    const { appInstanceId: messageAppInstanceId } = data;

    // only post message to intended app instance
    if (componentAppInstanceId !== messageAppInstanceId) {
      return;
    }

    const message = JSON.stringify(data);

    if (this.iframe.contentWindow.postMessage) {
      this.iframe.contentWindow.postMessage(message, '*');
    } else {
      console.error('unable to find postMessage');
    }
  };

  handleReceiveMessage = event => {
    try {
      const { dispatchGetAppInstance } = this.props;
      const { type, payload } = JSON.parse(event.data);

      switch (type) {
        case GET_APP_INSTANCE_RESOURCES:
          return getAppInstanceResources(payload, this.postMessage);
        case POST_APP_INSTANCE_RESOURCE:
          return postAppInstanceResource(payload, this.postMessage);
        case PATCH_APP_INSTANCE_RESOURCE:
          return patchAppInstanceResource(payload, this.postMessage);
        case GET_APP_INSTANCE:
          return dispatchGetAppInstance(payload, this.postMessage);
        default:
          return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  render() {
    const {
      url,
      lang,
      asset,
      name,
      id,
      folder,
      spaceId,
      phaseId,
      appInstance,
    } = this.props;
    let uri = url;
    if (asset) {
      // assets with absolute paths are usually for testing
      if (asset.startsWith('/')) {
        uri = `file://${asset}`;
      } else {
        uri = `file://${folder}/${asset}`;
      }
    }

    // todo: get user dynamically, currently we are just using a fake one
    const userId = '5ce422795fe28eeca1001e0a';

    // for some reason, smart gateway urls use `#` instead of `?` as a query string indicator
    const divider = isSmartGatewayUrl(url)
      ? SMART_GATEWAY_QUERY_STRING_DIVIDER
      : '?';

    // handle existing query strings
    let existingParams = {};
    const existingQueryString = uri.split('?')[1];
    if (existingQueryString) {
      existingParams = Qs.parse(existingQueryString);
    }

    const { id: appInstanceId } = appInstance || {};

    const params = {
      ...existingParams,
      spaceId,
      userId,
      lang,
      appInstanceId,
      itemId: id,
      offline: true,
      subSpaceId: phaseId,
    };

    const queryString = Qs.stringify(params);

    return (
      <div className="AppDiv">
        <iframe
          title={name}
          className="App"
          src={uri + divider + queryString}
          ref={c => {
            this.iframe = c;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ User, Space }) => ({
  folder: User.getIn(['current', 'folder']),
  // get language from space, otherwise fall back on user language
  lang:
    Space.getIn(['current', 'content', 'language']) ||
    User.getIn(['current', 'lang']),
});

const mapDispatchToProps = {
  dispatchGetAppInstance: getAppInstance,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaseApp);

export default ConnectedComponent;
