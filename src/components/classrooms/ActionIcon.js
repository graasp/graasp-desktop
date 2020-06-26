import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/icons/Assessment';
import { withTranslation } from 'react-i18next';

const ActionIcon = ({ className, text, t }) => {
  return (
    <>
      <Icon className={className} />
      {text && <span>{t('Actions')}</span>}
    </>
  );
};

ActionIcon.propTypes = {
  className: PropTypes.string,
  text: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

ActionIcon.defaultProps = {
  className: '',
  text: false,
};

export default withTranslation()(ActionIcon);
