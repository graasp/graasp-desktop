import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withTranslation } from 'react-i18next';
import MainMenu from './MainMenu';
import Styles from '../../Styles';

const Sidebar = ({ classes, theme, isSidebarOpen, handleDrawerClose }) => {
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
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
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
