import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/icons/AssignmentInd';
import { withTranslation } from 'react-i18next';

const ResourceIcon = ({ className, text, t }) => {
  return (
    <>
      <Icon className={className} />
      {text && <span>{t('Resources')}</span>}
    </>
  );
};

ResourceIcon.propTypes = {
  className: PropTypes.string,
  text: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

ResourceIcon.defaultProps = {
  className: '',
  text: false,
};

export default withTranslation()(ResourceIcon);
