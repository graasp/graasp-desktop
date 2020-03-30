import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Styles from '../../Styles';
import './SpaceDescription.css';
import Banner from '../common/Banner';
import Text from '../common/Text';
import {
  SPACE_START_PREVIEW_BUTTON,
  BANNER_WARNING_PREVIEW_ID,
  SPACE_DESCRIPTION_ID,
} from '../../config/selectors';

const style = {
  fontSize: 'large',
};

const renderPreviewWarning = t => {
  return (
    <Banner
      id={BANNER_WARNING_PREVIEW_ID}
      type="warning"
      text={t(
        'You are previewing this space. Any input or changes will not be saved.'
      )}
    />
  );
};

const SpaceDescription = ({ description, classes, start, saved }) => {
  const { t } = useTranslation();

  return (
    <div className="SpaceDescription">
      <div>
        {saved ? null : renderPreviewWarning(t)}
        <div className={classes.spaceDescription} id={SPACE_DESCRIPTION_ID}>
          <Text
            content={description}
            style={style}
            className="SpaceDescriptionText"
          />
        </div>
        <Button
          id={SPACE_START_PREVIEW_BUTTON}
          variant="contained"
          className={classes.button}
          onClick={start}
          size="large"
          color="primary"
          style={{ display: 'block', margin: '0 auto' }}
        >
          {saved ? t('Start') : t('Preview')}
        </Button>
      </div>
    </div>
  );
};

SpaceDescription.propTypes = {
  description: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    spaceDescription: PropTypes.string.isRequired,
  }).isRequired,
  start: PropTypes.func.isRequired,
  saved: PropTypes.bool,
};

SpaceDescription.defaultProps = {
  saved: false,
};

export default withStyles(Styles, { withTheme: true })(SpaceDescription);
