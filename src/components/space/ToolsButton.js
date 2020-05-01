import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import BuildIcon from '@material-ui/icons/Build';
import CloseIcon from '@material-ui/icons/Close';
import { closeTools, openTools } from '../../actions';
import { TOOLS_BUTTON_CLASS } from '../../config/selectors';

class ToolsButton extends Component {
  static styles = theme => ({
    fab: {
      margin: theme.spacing(),
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  });

  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string,
      main: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchOpenTools: PropTypes.func.isRequired,
    dispatchCloseTools: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  render() {
    const {
      classes,
      t,
      dispatchOpenTools,
      open,
      dispatchCloseTools,
    } = this.props;

    return (
      <Fab
        color="primary"
        aria-label={t('Settings')}
        className={clsx(classes.fab, TOOLS_BUTTON_CLASS)}
        onClick={open ? dispatchCloseTools : dispatchOpenTools}
      >
        {open ? <CloseIcon /> : <BuildIcon />}
      </Fab>
    );
  }
}

const mapStateToProps = ({ layout }) => ({
  open: layout.getIn(['tools', 'open']),
});

const mapDispatchToProps = {
  dispatchOpenTools: openTools,
  dispatchCloseTools: closeTools,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolsButton);

const StyledComponent = withStyles(ToolsButton.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
