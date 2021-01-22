import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Resizable } from 're-resizable';
import { withStyles } from '@material-ui/core/styles';
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

const iconStyle = {
  background: 'white',
  borderRadius: '12px',
};

const styles = () => ({
  resizable: { marginTop: '2rem', marginBottom: '2rem' },
  icon: iconStyle,
  openIcon: {
    ...iconStyle,
    transform: 'rotate(-90deg)',
  },
  closedIcon: {
    ...iconStyle,
    transform: 'rotate(90deg)',
  },
  wrapper: { height: '100%', overflowY: 'hidden' },
  iframe: { width: '100%', height: '100%' },
  footer: {
    width: '100%',
    textAlign: 'center',
    marginTop: '-8px',
  },
});

class PhasePdf extends Component {
  static propTypes = {
    url: PropTypes.string,
    asset: PropTypes.string,
    name: PropTypes.string,
    folder: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      resizable: PropTypes.string.isRequired,
      openIcon: PropTypes.string.isRequired,
      closedIcon: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
      iframe: PropTypes.string.isRequired,
      footer: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }).isRequired,
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
    const { classes } = this.props;
    const { height } = this.state;
    if (height >= MAX_APP_HEIGHT) {
      return (
        <PlayCircleFilledIcon color="primary" className={classes.openIcon} />
      );
    }
    if (height <= MIN_APP_HEIGHT) {
      return (
        <PlayCircleFilledIcon color="primary" className={classes.closedIcon} />
      );
    }
    return <SwapVerticalCircleIcon color="primary" className={classes.icon} />;
  };

  render() {
    const { url, asset, name, id, folder, classes } = this.props;

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
        className={classes.resizable}
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
            <div className={classes.footer}>{this.renderHandleIcon()}</div>
          ),
        }}
      >
        <div className={classes.wrapper}>
          <iframe
            title={name}
            className={classes.iframe}
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
const StyledComponent = withStyles(styles)(ConnectedComponent);
export default StyledComponent;
