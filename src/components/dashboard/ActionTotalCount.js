import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CountUp from 'react-countup';
import _ from 'lodash';
import Loader from '../common/Loader';

const styles = () => ({
  actionCounter: {
    fontSize: '6rem',
  },
});

// reference: https://github.com/MicheleBertoli/react-count-to

class ActionTotalCount extends PureComponent {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      actionCounter: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    actions: [],
  };

  render() {
    const { classes, t, actions } = this.props;

    if (!actions || _.isEmpty(actions)) {
      return <Loader />;
    }

    const count = actions.length;

    return (
      <>
        <Typography variant="h5">{t('Total Action Count')}</Typography>
        <Grid container justify="center" alignItems="center">
          <CountUp end={count} duration={5} className={classes.actionCounter} />
        </Grid>
      </>
    );
  }
}
const StyledComponent = withStyles(styles, { withTheme: true })(
  ActionTotalCount
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
