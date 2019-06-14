import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Typography, withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Styles from '../../Styles';
import './SpaceDescription.css';
import { DEFAULT_LANGUAGE } from '../../config/constants';
import Banner from '../common/Banner';

const renderPreviewWarning = t => {
  return (
    <Banner
      type="warning"
      text={t(
        'Warning: You are previewing this space. Any input or changes will not be saved.'
      )}
    />
  );
};

const SpaceDescription = ({ description, classes, start, lang, saved }) => {
  const { i18n } = useTranslation();

  // we use the fixed translation for spaces as they
  // are meant to be consumed in the predefined language
  const t = i18n.getFixedT(lang);
  return (
    <div className="SpaceDescription">
      <div>
        {saved ? null : renderPreviewWarning(t)}
        <Typography variant="h4" className={classes.spaceDescription}>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Typography>
        <Button
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
  lang: PropTypes.string,
  classes: PropTypes.shape({ appBar: PropTypes.string.isRequired }).isRequired,
  start: PropTypes.func.isRequired,
  saved: PropTypes.bool,
};

SpaceDescription.defaultProps = {
  lang: DEFAULT_LANGUAGE,
  saved: false,
};

export default withStyles(Styles, { withTheme: true })(SpaceDescription);
