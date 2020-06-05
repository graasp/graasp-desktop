import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { CLASSROOM_NAME_INPUT_ID } from '../../config/selectors';
import { isClassroomNameValid } from '../../utils/classroom';

const ClassroomNameTextField = ({ name, t, handleChange }) => {
  const isValid = isClassroomNameValid(name);
  let errorProps = {};
  if (!isValid) {
    errorProps = {
      ...errorProps,
      helperText: t(`Classroom's name is not valid`),
      error: true,
    };
  }

  return (
    <TextField
      id={CLASSROOM_NAME_INPUT_ID}
      autoFocus
      margin="dense"
      label={t("Classroom's Name")}
      type="text"
      fullWidth
      value={name}
      onChange={handleChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...errorProps}
    />
  );
};

ClassroomNameTextField.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const TranslatedComponent = withTranslation()(ClassroomNameTextField);

export default TranslatedComponent;
