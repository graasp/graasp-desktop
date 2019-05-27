import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Styles from '../../Styles';
import './SpaceDescription.css';
import { DEFAULT_LANGUAGE } from '../../config/constants';

const SpaceDescription = ({ description, classes, start, lang }) => {
  const { i18n } = useTranslation();

  // we use the fixed translation for spaces as they
  // are meant to be consumed in the predefined language
  const t = i18n.getFixedT(lang);
  return (
    <div className="SpaceDescription">
      <div>
        <h4 style={{ textAlign: 'center' }}>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </h4>
        <Button
          variant="contained"
          className={classes.button}
          onClick={start}
          color="primary"
          style={{ display: 'block', margin: '0 auto' }}
        >
          {t('Start')}
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
};

SpaceDescription.defaultProps = {
  lang: DEFAULT_LANGUAGE,
};

export default withStyles(Styles, { withTheme: true })(SpaceDescription);
