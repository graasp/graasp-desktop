import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Styles from '../../Styles';
import { DRAWER_BUTTON_ID } from '../../config/selectors';

const Header = ({ classes, handleDrawerOpen, isSidebarOpen }) => {
  return (
    <AppBar
      position="fixed"
      className={classNames(classes.appBar, {
        [classes.appBarShift]: isSidebarOpen,
      })}
    >
      <Toolbar disableGutters={!isSidebarOpen}>
        <IconButton
          id={DRAWER_BUTTON_ID}
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
          className={classNames(
            classes.menuButton,
            isSidebarOpen && classes.hide
          )}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
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
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
};

const mapStateToProps = ({ Authentication }) => ({
  activity: Boolean(Authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Header);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
