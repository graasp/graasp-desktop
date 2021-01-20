import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Resizable } from 're-resizable';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import './PhaseApp.css';
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

class PhasePdf extends Component {
  static propTypes = {
    url: PropTypes.string,
    asset: PropTypes.string,
    name: PropTypes.string,
    folder: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  };

  static defaultProps = {
    url: null,
    asset: null,
    name: 'Pdf',
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
    const { url, asset, name, id, folder } = this.props;

    // replace 'download' by 'raw' to display the resource
    // when the space is not saved
    let uri = url.replace('download', 'raw');
    if (asset) {
      // assets with absolute paths are usually for testing
      if (asset.startsWith('/')) {
        uri = `file://${asset}`;
      } else {
        uri = `file://${folder}/${asset}`;
      }
    }

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
            className="Pdf"
            name={buildPhaseAppName(id)}
            src={uri}
            ref={(c) => {
              this.iframe = c;
            }}
          />
        </div>
      </Resizable>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  folder: authentication.getIn(['current', 'folder']),
});

const ConnectedComponent = connect(mapStateToProps)(PhasePdf);

export default ConnectedComponent;
