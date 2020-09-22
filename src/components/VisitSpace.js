import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Styles from '../Styles';
import Loader from './LoadSpace';
import Main from './common/Main';
import {
  ERROR_MESSAGE_HEADER,
  INVALID_SPACE_ID_OR_URL,
  OFFLINE_ERROR_MESSAGE,
} from '../config/messages';
import { isValidSpaceId } from '../utils/validators';
import extractSpaceId from '../utils/extractSpaceId';
import {
  VISIT_BUTTON_ID,
  VISIT_INPUT_ID,
  VISIT_MAIN_ID,
} from '../config/selectors';

class VisitSpace extends Component {
  state = {
    spaceId: '',
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    activity: PropTypes.bool,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    activity: false,
  };

  handleChangeSpaceId = event => {
    const spaceId = event.target.value;
    this.setState({ spaceId });
  };

  handleClick = () => {
    const { history, t } = this.props;
    const { spaceId } = this.state;
    const id = extractSpaceId(spaceId) || spaceId;
    if (!window.navigator.onLine) {
      return toastr.error(t(ERROR_MESSAGE_HEADER), t(OFFLINE_ERROR_MESSAGE));
    }
    if (!isValidSpaceId(id)) {
      return toastr.error(t(ERROR_MESSAGE_HEADER), t(INVALID_SPACE_ID_OR_URL));
    }
    if (id && id !== '') {
      const { replace } = history;
      return replace(`/space/${id}`);
    }
    return false;
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  };

  render() {
    const { classes, activity, t } = this.props;
    const { spaceId } = this.state;

    if (activity) {
      return (
        <div className={classNames(classes.root, 'VisitSpace')}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    return (
      <Main id={VISIT_MAIN_ID} fullScreen>
        <FormControl className={classes.formControl}>
          <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
            {t('Visit a Space')}
          </Typography>
          <Input
            id={VISIT_INPUT_ID}
            className={classes.input}
            required
            onChange={this.handleChangeSpaceId}
            inputProps={{
              'aria-label': 'Space ID',
            }}
            onKeyPress={this.handleKeyPress}
            autoFocus
            value={spaceId}
            type="text"
          />
          <Button
            id={VISIT_BUTTON_ID}
            variant="contained"
            onClick={this.handleClick}
            color="primary"
            className={classes.button}
            disabled={!window.navigator.onLine || !spaceId || spaceId === ''}
          >
            {t('Visit')}
          </Button>
        </FormControl>
      </Main>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  activity: Boolean(Space.getIn(['current', 'activity']).size),
});

const ConnectedComponent = connect(mapStateToProps)(VisitSpace);

const TranslatedComponent = withTranslation()(ConnectedComponent);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  TranslatedComponent
);
export default withRouter(StyledComponent);
