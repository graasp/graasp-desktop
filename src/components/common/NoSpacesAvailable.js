import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography/Typography';
import { SPACE_NOT_AVAILABLE_TEXT_ID } from '../../config/selectors';

const NoSpacesAvailable = ({ t }) => (
  <div className="Main">
    <Typography id={SPACE_NOT_AVAILABLE_TEXT_ID} variant="h5" color="inherit">
      {t('No Spaces Available')}
    </Typography>
  </div>
);

NoSpacesAvailable.propTypes = {
  t: PropTypes.func.isRequired,
};

const TranslatedComponent = withTranslation()(NoSpacesAvailable);

export default TranslatedComponent;
