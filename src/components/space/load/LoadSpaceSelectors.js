import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { withTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import { USER_MODES } from '../../../config/constants';
import { buildCheckboxLabel } from '../../../config/selectors';

class LoadSpaceSelectors extends Component {
  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    elements: PropTypes.instanceOf(Map).isRequired,
    isStudent: PropTypes.bool.isRequired,
    isActionsChecked: PropTypes.bool,
    isSpaceChecked: PropTypes.bool,
    isResourcesChecked: PropTypes.bool,
    t: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        isSpaceDifferent: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    isSpaceDifferent: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isActionsChecked: true,
    isResourcesChecked: true,
    isSpaceChecked: true,
  };

  renderCheckbox = (name, label, isChecked, disabled, emptyHelperText) => {
    const { handleChange, elements } = this.props;
    const checkbox = (
      <Checkbox
        checked={isChecked}
        onChange={handleChange}
        name={name}
        color="primary"
        disabled={disabled}
      />
    );

    const isEmpty = elements.get(name).isEmpty();

    return (
      <>
        <FormControlLabel
          id={buildCheckboxLabel(name)}
          control={checkbox}
          label={label}
        />
        {isEmpty && <FormHelperText>{emptyHelperText}</FormHelperText>}
      </>
    );
  };

  renderSpaceHelperText = () => {
    const { isStudent, t, isSpaceDifferent, elements } = this.props;

    if (isStudent) {
      return (
        <FormHelperText>{t('Students cannot load spaces')}</FormHelperText>
      );
    }

    if (isSpaceDifferent) {
      return (
        <FormHelperText>
          {t(`This space does not exist or is different`)}
        </FormHelperText>
      );
    }

    // when the zip space is not different and application already contains space
    if (!elements.get('space').isEmpty()) {
      return <FormHelperText>{t('This space already exists')}</FormHelperText>;
    }

    return null;
  };

  render() {
    const {
      t,
      isSpaceChecked,
      isResourcesChecked,
      isActionsChecked,
      elements,
    } = this.props;

    return (
      <Grid
        container
        alignItems="center"
        alignContent="center"
        justify="center"
      >
        <Grid item xs={7}>
          {this.renderCheckbox(
            t('space'),
            t('This Space'),
            isSpaceChecked,
            // space is always disabled:
            // when the space does not exist (force load)
            // when the space has change (force load)
            // when the space has no change (no load)
            true,
            t(`This file does not contain a space`)
          )}
          {this.renderSpaceHelperText()}
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={7}>
          {this.renderCheckbox(
            t('appInstanceResources'),
            t(`This Space's Resources`),
            isResourcesChecked,
            elements.get('appInstanceResources').isEmpty(),
            t(`This file does not contain any user input`)
          )}
        </Grid>
        <Grid item xs={1}>
          <Tooltip
            title={t(
              'Resources are user-generated content saved when using applications (e.g., answer submitted via an input box)'
            )}
            placement="right"
          >
            <InfoIcon color="primary" />
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          {this.renderCheckbox(
            t('actions'),
            t(`This Space's Actions`),
            isActionsChecked,
            elements.get('actions').isEmpty(),
            t(`This file does not contain any analytics`)
          )}
        </Grid>
        <Grid item xs={1}>
          <Tooltip
            title={t(
              'Actions are analytics generated when a user interacts with a space.'
            )}
            placement="right"
          >
            <InfoIcon color="primary" />
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  isStudent:
    authentication.getIn(['user', 'settings', 'userMode']) ===
    USER_MODES.STUDENT,
});

const TranslatedComponent = withTranslation()(LoadSpaceSelectors);

export default withRouter(connect(mapStateToProps, null)(TranslatedComponent));
