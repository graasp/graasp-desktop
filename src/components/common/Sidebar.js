import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { withTranslation } from 'react-i18next';
import MainMenu from './MainMenu';
import Styles from '../../Styles';
import DrawerHeader from './DrawerHeader';

const Sidebar = ({ classes, isSidebarOpen, handleDrawerClose }) => {
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <DrawerHeader handleDrawerClose={handleDrawerClose} />
      <MainMenu />
    </Drawer>
  );
};

Sidebar.propTypes = {
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
  isSidebarOpen: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

const StyledComponent = withStyles(Styles, { withTheme: true })(Sidebar);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
