import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Styles from '../../Styles';
import { HOME_PATH, VISIT_PATH } from '../../config/paths';
import Main from '../common/Main';

const SpaceNotFound = ({ history: { replace }, classes, t }) => {
  return (
    <Main fullScreen>
      <div>
        <Typography
          align="center"
          variant="h5"
          color="inherit"
          style={{ margin: '2rem' }}
        >
          {t('Space Not Found')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => replace(HOME_PATH)}
        >
          {t('Home')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => replace(VISIT_PATH)}
        >
          {t('Visit Another Space')}
        </Button>
      </div>
    </Main>
  );
};

SpaceNotFound.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    appBar: PropTypes.string.isRequired,
    appBarShift: PropTypes.string.isRequired,
    menuButton: PropTypes.string.isRequired,
    hide: PropTypes.string.isRequired,
    drawer: PropTypes.string.isRequired,
    drawerPaper: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    contentShift: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    length: PropTypes.number.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const StyledComponent = withStyles(Styles, { withTheme: true })(SpaceNotFound);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
