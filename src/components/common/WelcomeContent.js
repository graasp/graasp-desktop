import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography/Typography';
import { Online } from 'react-detect-offline';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Styles from '../../Styles';
import logo from '../../data/icon.png';
import {
  SAVED_SPACES_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
} from '../../config/paths';

const styles = theme => ({
  ...Styles(theme),
  wrapper: {
    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    height: '80%',

    '& .MuiButtonGroup-groupedContainedPrimary:not(:last-child)': {
      borderColor: 'white',
    },
  },
  graaspLogo: {
    width: '35%',
    maxWidth: '400px',
    minWidth: '200px',
    marginTop: theme.spacing(3),
  },

  // similar layout to buttons in ButtonGroup for wrapped buttons
  wrappedButton: {
    background: theme.palette.primary.main,
    borderRadius: 0,
    borderRight: '1px solid white',
    color: 'white',
    padding: theme.spacing(0, 3),

    '&:hover': {
      background: theme.palette.primary.main,
    },
    // add border radius when is last button
    '&.MuiButtonBase-root:last-child': {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  },
});

class WelcomeContent extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      graaspLogo: PropTypes.string.isRequired,
      wrappedButton: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    hasSavedSpaces: PropTypes.bool.isRequired,
  };

  handleGoToVisitSpace = () => {
    const {
      history: { push },
    } = this.props;
    push(VISIT_PATH);
  };

  handleGoToLoadSpace = () => {
    const {
      history: { push },
    } = this.props;
    push(LOAD_SPACE_PATH);
  };

  handleGoToSavedSpaces = () => {
    const {
      history: { push },
    } = this.props;
    push(SAVED_SPACES_PATH);
  };

  render() {
    const { classes, t, hasSavedSpaces } = this.props;
    return (
      <div className={classes.wrapper}>
        <img src={logo} alt={t('Graasp logo')} className={classes.graaspLogo} />
        <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
          {t('Welcome to Graasp Desktop')}
        </Typography>
        <ButtonGroup
          disableElevation
          variant="contained"
          color="primary"
          aria-label="contained group primary button"
        >
          <Button onClick={this.handleGoToLoadSpace}>
            {t('Load a Space')}
          </Button>
          ,
          <Online>
            {
              // class wrappedButton is necessary to match the layout when encapsulated with Online tag
            }
            <Button
              className={classes.wrappedButton}
              onClick={this.handleGoToVisitSpace}
            >
              {t('Visit a Space')}
            </Button>
          </Online>
          {hasSavedSpaces && (
            <Button onClick={this.handleGoToSavedSpaces}>
              {t('Go to Saved Spaces')}
            </Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(WelcomeContent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
