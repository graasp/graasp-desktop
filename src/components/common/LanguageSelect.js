import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { langs } from '../../config/i18n';
import { getLanguage, setLanguage } from '../../actions';
import Loader from './Loader';
import { LANGUAGE_SELECT_ID } from '../../config/selectors';
import { FORM_CONTROL_MIN_WIDTH } from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class LanguageSelect extends Component {
  static propTypes = {
    activity: PropTypes.bool.isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    dispatchSetLanguage: PropTypes.func.isRequired,
    dispatchGetLanguage: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetLanguage } = this.props;
    dispatchGetLanguage();
  }

  handleChangeLanguage = async ({ target }) => {
    const { i18n, dispatchSetLanguage } = this.props;
    const { value: lang } = target;
    await i18n.changeLanguage(lang);
    dispatchSetLanguage({ lang });
  };

  renderLanguageOptions = () =>
    Object.keys(langs).map(lang => (
      <MenuItem value={lang} key={lang}>
        <em>{langs[lang]}</em>
      </MenuItem>
    ));

  render() {
    const { classes, t, lang, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    return (
      <FormControl id={LANGUAGE_SELECT_ID} className={classes.formControl}>
        <InputLabel htmlFor="lang">{t('Language')}</InputLabel>
        <Select
          value={lang}
          onChange={this.handleChangeLanguage}
          inputProps={{
            name: 'lang',
            id: 'lang',
          }}
        >
          {this.renderLanguageOptions()}
        </Select>
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  lang: authentication.getIn(['user', 'settings', 'lang']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetLanguage: getLanguage,
  dispatchSetLanguage: setLanguage,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelect);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
