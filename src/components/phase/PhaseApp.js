import React, { Component } from 'react';
import { Map } from 'immutable';
import Qs from 'qs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Resizable } from 're-resizable';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import './PhaseApp.css';
import {
  GET_APP_INSTANCE_RESOURCES,
  PATCH_APP_INSTANCE_RESOURCE,
  GET_APP_INSTANCE,
  POST_APP_INSTANCE_RESOURCE,
  DELETE_APP_INSTANCE_RESOURCE,
  APP_INSTANCE_RESOURCE_TYPES,
  POST_ACTION,
  ACTION_TYPES,
  POST_FILE,
  FILE_TYPES,
  DELETE_FILE,
} from '../../types';
import {
  getAppInstanceResources,
  patchAppInstanceResource,
  postAppInstanceResource,
  deleteAppInstanceResource,
  getAppInstance,
  postAction,
  postFile,
  deleteFile,
} from '../../actions';
import {
  DEFAULT_LANGUAGE,
  SMART_GATEWAY_QUERY_STRING_DIVIDER,
} from '../../config/constants';
import { isSmartGatewayUrl } from '../../utils/url';
import { getHeight, setHeight } from '../../actions/layout';
import {
  DEFAULT_APP_HEIGHT,
  MAX_APP_HEIGHT,
  MIN_APP_HEIGHT,
} from '../../config/layout';
import { buildPhaseAppName } from '../../config/selectors';

const style = {
  marginTop: '2rem',
  marginBottom: '2rem',
};

const iconStyle = { background: 'white', borderRadius: '12px' };

class PhaseApp extends Component {
  static propTypes = {
    url: PropTypes.string,
    asset: PropTypes.string,
    name: PropTypes.string,
    folder: PropTypes.string.isRequired,
    dispatchGetAppInstance: PropTypes.func.isRequired,
    dispatchPostAction: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    phaseId: PropTypes.string.isRequired,
    spaceId: PropTypes.string.isRequired,
    lang: PropTypes.string,
    userId: PropTypes.string,
    appInstance: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    user: PropTypes.instanceOf(Map).isRequired,
    actionsEnabled: PropTypes.bool.isRequired,
    isSpaceSaved: PropTypes.bool,
  };

  static defaultProps = {
    url: null,
    asset: null,
    appInstance: null,
    name: 'Image',
    lang: DEFAULT_LANGUAGE,
    userId: null,
    isSpaceSaved: false,
  };

  state = {
    height: DEFAULT_APP_HEIGHT,
  };

  constructor(props) {
    super(props);
    const { id } = props;
    this.state.height = getHeight(id) || DEFAULT_APP_HEIGHT;
  }

  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage);
  }

  postMessage = (data) => {
    // get component app instance id
    const { appInstance } = this.props;
    const { id: componentAppInstanceId } = appInstance || {};
    // get app instance id in message
    const { appInstanceId: messageAppInstanceId } = data;

    // only post message to intended app instance
    if (componentAppInstanceId === messageAppInstanceId) {
      const message = JSON.stringify(data);

      if (this.iframe.contentWindow.postMessage) {
        this.iframe.contentWindow.postMessage(message, '*');
      } else {
        console.error('unable to find postMessage');
      }
    }
  };

  handleReceiveMessage = (event) => {
    try {
      const {
        dispatchGetAppInstance,
        appInstance,
        dispatchPostAction,
        user,
        isSpaceSaved,
      } = this.props;

      // get app instance id in message
      const { id: componentAppInstanceId } = appInstance || {};

      const { type, payload } = JSON.parse(event.data);
      let { id: messageAppInstanceId } = payload;
      if (
        [
          ...APP_INSTANCE_RESOURCE_TYPES,
          ...ACTION_TYPES,
          ...FILE_TYPES,
        ].includes(type)
      ) {
        ({ appInstanceId: messageAppInstanceId } = payload);
      }

      // only receive message from intended app instance
      // save data if space is saved
      if (componentAppInstanceId === messageAppInstanceId) {
        switch (type) {
          case GET_APP_INSTANCE:
            return dispatchGetAppInstance(payload, this.postMessage);
          case GET_APP_INSTANCE_RESOURCES:
            return getAppInstanceResources(payload, this.postMessage);
          case POST_APP_INSTANCE_RESOURCE:
            if (isSpaceSaved) {
              return postAppInstanceResource(payload, this.postMessage);
            }
            break;
          case PATCH_APP_INSTANCE_RESOURCE:
            if (isSpaceSaved) {
              return patchAppInstanceResource(payload, this.postMessage);
            }
            break;
          case DELETE_APP_INSTANCE_RESOURCE:
            if (isSpaceSaved) {
              return deleteAppInstanceResource(payload, this.postMessage);
            }
            break;
          case POST_ACTION: {
            if (isSpaceSaved) {
              return dispatchPostAction(payload, user, this.postMessage);
            }
            break;
          }
          case POST_FILE: {
            if (isSpaceSaved) {
              return postFile(payload, this.postMessage);
            }
            break;
          }
          case DELETE_FILE: {
            if (isSpaceSaved) {
              return deleteFile(payload, this.postMessage);
            }
            break;
          }
          default:
            return false;
        }
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  renderHandleIcon = () => {
    const { height } = this.state;
    if (height >= MAX_APP_HEIGHT) {
      return (
        <PlayCircleFilledIcon
          color="primary"
          style={{
            ...iconStyle,
            transform: 'rotate(-90deg)',
          }}
        />
      );
    }
    if (height <= MIN_APP_HEIGHT) {
      return (
        <PlayCircleFilledIcon
          color="primary"
          style={{
            ...iconStyle,
            transform: 'rotate(90deg)',
          }}
        />
      );
    }
    return <SwapVerticalCircleIcon color="primary" style={iconStyle} />;
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
      userId,
      actionsEnabled,
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
      analytics: actionsEnabled,
    };

    const queryString = Qs.stringify(params);

    // get style
    const { height } = this.state;
    return (
      <Resizable
        style={style}
        defaultSize={{
          height,
          width: 'auto',
        }}
        minHeight={MIN_APP_HEIGHT}
        maxHeight={MAX_APP_HEIGHT}
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        onResizeStop={(e, direction, ref, d) => {
          const { height: oldHeight } = this.state;
          const newHeight = oldHeight + d.height;
          this.setState({
            height: newHeight,
          });
          setHeight(id, newHeight);
        }}
        handleComponent={{
          bottom: (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '-8px',
              }}
            >
              {this.renderHandleIcon()}
            </div>
          ),
        }}
      >
        <div style={{ height: '100%', overflowY: 'hidden' }}>
          <iframe
            title={name}
            className="App"
            name={buildPhaseAppName(id)}
            src={uri + divider + queryString}
            ref={(c) => {
              this.iframe = c;
            }}
          />
        </div>
      </Resizable>
    );
  }
}

const mapStateToProps = ({ authentication, Space }) => ({
  folder: authentication.getIn(['current', 'folder']),
  // get language from space, otherwise fall back on user language
  lang:
    Space.getIn(['current', 'content', 'language']) ||
    authentication.getIn(['user', 'settings', 'lang']),

  geolocation: authentication.getIn(['user', 'settings', 'geolocation']),
  geolocationEnabled: authentication.getIn([
    'user',
    'settings',
    'geolocationEnabled',
  ]),
  userId: authentication.getIn(['user', 'id']),
  user: authentication.getIn(['user']),
  actionsEnabled: authentication.getIn(['user', 'settings', 'actionsEnabled']),
  isSpaceSaved: Space.getIn(['current', 'content', 'saved']),
});

const mapDispatchToProps = {
  dispatchGetAppInstance: getAppInstance,
  dispatchPostAction: postAction,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaseApp);

export default ConnectedComponent;
