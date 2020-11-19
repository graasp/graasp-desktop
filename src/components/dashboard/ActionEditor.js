import React, { Component } from 'react';
import _ from 'lodash';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import Loader from '../common/Loader';
import Styles from '../../Styles';

// eslint-disable-next-line react/prefer-stateless-function
export class ActionEditor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      button: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  };

  static defaultProps = {
    actions: [],
  };

  render() {
    const { actions, t } = this.props;

    if (!actions) {
      return <Loader />;
    }

    if (_.isEmpty(actions)) {
      return <p>{t('The database is empty.')}</p>;
    }

    return (
      <div>
        <Typography variant="h6">{t('Action Database')}</Typography>
        <ReactJson name="actions" collapsed src={actions} />
      </div>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(ActionEditor);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
