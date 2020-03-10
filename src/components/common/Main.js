import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Styles from '../../Styles';
import Header from './Header';
import Sidebar from './Sidebar';

class Main extends Component {
  state = {
    open: false,
  };

  static propTypes = {
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
      formControl: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      fullScreen: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
    fullScreen: PropTypes.bool,
    id: PropTypes.string,
  };

  static defaultProps = {
    fullScreen: false,
    id: null,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, children, fullScreen, id } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Header isSidebarOpen={open} handleDrawerOpen={this.handleDrawerOpen} />

        <Sidebar
          isSidebarOpen={open}
          handleDrawerClose={this.handleDrawerClose}
        />

        <main
          id={id}
          className={classNames(classes.content, {
            [classes.contentShift]: open,
            [classes.fullScreen]: fullScreen,
          })}
        >
          <div className={classes.drawerHeader} />
          {children}
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ Authentication }) => ({
  activity: Boolean(Authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Main);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
