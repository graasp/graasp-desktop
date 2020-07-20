import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getGeolocationEnabled, setGeolocationEnabled } from '../../actions';
import Loader from './Loader';
import { CONTROL_TYPES, FORM_CONTROL_MIN_WIDTH } from '../../config/constants';
import { GEOLOCATION_CONTROL_ID } from '../../config/selectors';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class GeolocationControl extends Component {
  static propTypes = {
    geolocationEnabled: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetGeolocationEnabled: PropTypes.func.isRequired,
    dispatchSetGeolocationEnabled: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
    controlType: PropTypes.oneOf(Object.keys(CONTROL_TYPES)),
  };

  static defaultProps = {
    controlType: CONTROL_TYPES.SWITCH,
  };

  constructor(props) {
    super(props);
    const { dispatchGetGeolocationEnabled } = this.props;
    dispatchGetGeolocationEnabled();
  }

  handleClick = async () => {
    const { dispatchSetGeolocationEnabled } = this.props;
    dispatchSetGeolocationEnabled(true);
  };

  handleChange = async ({ target }) => {
    const { dispatchSetGeolocationEnabled } = this.props;
    const { checked } = target;
    dispatchSetGeolocationEnabled(checked);
  };

  render() {
    const {
      classes,
      t,
      geolocationEnabled,
      activity,
      controlType = CONTROL_TYPES.SWITCH,
    } = this.props;

    if (activity) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        checked={geolocationEnabled}
        onChange={this.handleChange}
        value={geolocationEnabled}
        color="primary"
      />
    );

    return (
      <FormControl id={GEOLOCATION_CONTROL_ID} className={classes.formControl}>
        {(() => {
          switch (controlType) {
            case CONTROL_TYPES.BUTTON:
              return (
                <Button
                  variant="contained"
                  onClick={this.handleClick}
                  color="primary"
                >
                  {t('Enable Geolocation')}
                </Button>
              );
            case CONTROL_TYPES.SWITCH:
            default:
              return (
                <FormControlLabel
                  control={switchControl}
                  label={t('Geolocation Enabled')}
                />
              );
          }
        })()}
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  geolocationEnabled: authentication.getIn([
    'user',
    'settings',
    'geolocationEnabled',
  ]),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetGeolocationEnabled: getGeolocationEnabled,
  dispatchSetGeolocationEnabled: setGeolocationEnabled,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(GeolocationControl);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
