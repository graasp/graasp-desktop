import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import { setFontSize } from '../../actions';
import {
  FONT_SIZE_MAX_VALUE,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MIN_VALUE,
} from '../../config/constants';

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

const FontSizeSlider = ({ fontSize, dispatchSetFontSize }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleSliderChange = (event, newValue) => {
    dispatchSetFontSize(newValue);
  };

  const handleInputChange = (event) => {
    dispatchSetFontSize(
      event.target.value === '' ? '' : Number(event.target.value)
    );
  };

  const handleBlur = () => {
    if (fontSize < FONT_SIZE_MIN_VALUE) {
      dispatchSetFontSize(FONT_SIZE_MIN_VALUE);
    } else if (fontSize > FONT_SIZE_MAX_VALUE) {
      dispatchSetFontSize(FONT_SIZE_MAX_VALUE);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="font-size" gutterBottom>
        {t('Font Size')}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormatSizeIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof fontSize === 'number' ? fontSize : DEFAULT_FONT_SIZE}
            onChange={handleSliderChange}
            aria-labelledby="font-size"
            min={FONT_SIZE_MIN_VALUE}
            max={FONT_SIZE_MAX_VALUE}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={fontSize}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: FONT_SIZE_MIN_VALUE,
              max: FONT_SIZE_MAX_VALUE,
              type: 'number',
              'aria-labelledby': 'font-size',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

FontSizeSlider.propTypes = {
  dispatchSetFontSize: PropTypes.func.isRequired,
  fontSize: PropTypes.string.isRequired,
};

const mapStateToProps = ({ authentication }) => ({
  fontSize:
    authentication.getIn(['user', 'settings', 'fontSize']) || DEFAULT_FONT_SIZE,
});

const mapDispatchToProps = {
  dispatchSetFontSize: setFontSize,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(FontSizeSlider);

export default ConnectedComponent;
