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
import { setSideBarIsOpen } from '../../actions';

class Main extends Component {
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
    style: PropTypes.shape({
      background: PropTypes.string,
    }),
    showSearch: PropTypes.bool,
    handleOnSearch: PropTypes.func,
    dispatchSetSideBarIsOpen: PropTypes.func.isRequired,
    open: PropTypes.bool,
  };

  static defaultProps = {
    fullScreen: false,
    showSearch: false,
    handleOnSearch: () => {},
    id: null,
    style: {},
    open: false,
  };

  handleDrawerOpen = () => {
    const { dispatchSetSideBarIsOpen } = this.props;
    dispatchSetSideBarIsOpen(true);
  };

  handleDrawerClose = () => {
    const { dispatchSetSideBarIsOpen } = this.props;
    dispatchSetSideBarIsOpen(false);
  };

  render() {
    const {
      classes,
      children,
      fullScreen,
      id,
      style,
      showSearch,
      handleOnSearch,
      open,
    } = this.props;

    return (
      <div className={classes.root} style={style}>
        <CssBaseline />
        <Header
          showSearch={showSearch}
          isSidebarOpen={open}
          handleDrawerOpen={this.handleDrawerOpen}
          handleOnSearch={handleOnSearch}
        />

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

const mapStateToProps = ({ authentication, layout }) => ({
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
  open: layout.getIn(['sideBarState', 'open']),
});

const mapDispatchToProps = {
  dispatchSetSideBarIsOpen: setSideBarIsOpen,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Main);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
