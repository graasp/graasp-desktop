import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { getDatabase, setDatabase } from '../../actions';
import Loader from '../common/Loader';
import Styles from '../../Styles';

// reference: https://github.com/MicheleBertoli/react-count-to

class ActionTotalCount extends PureComponent {
  static propTypes = {
    speed: PropTypes.number.isRequired,
    delay: PropTypes.number,
    onComplete: PropTypes.func,
    digits: PropTypes.number,
    easing: PropTypes.func,
    database: PropTypes.shape({
      user: PropTypes.object,
      spaces: PropTypes.array,
      actions: PropTypes.array,
    }),
    dispatchGetDatabase: PropTypes.func.isRequired,
  };

  static defaultProps = {
    delay: 100,
    digits: 0,
    easing: t => t,
    database: {},
    onComplete: () => {},
  };

  state = {
    from: 0,
    counter: 0,
    to: null,
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
    this.start();
  }

  componentDidUpdate({ database: prevDatabase }) {
    const { database } = this.props;
    if (database && !_.isEmpty(database)) {
      if (!_.isEqual(database, prevDatabase)) {
        // get action count and set it to variable to
        const { actions } = database;
        const actionCount = actions.length;
        this.start(actionCount);
      }
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  start = actionCount => {
    this.setState({ to: actionCount });

    this.clear();
    const { from } = this.state;
    this.setState(
      {
        counter: from,
      },
      () => {
        const { speed, delay } = this.props;
        const now = Date.now();
        this.endDate = now + speed;
        this.scheduleNextUpdate(now, delay);
        this.raf = requestAnimationFrame(this.next);
      }
    );
  };

  next = () => {
    const now = Date.now();
    const { speed, onComplete, delay } = this.props;

    if (now >= this.nextUpdate) {
      const progress = Math.max(
        0,
        Math.min(1, 1 - (this.endDate - now) / speed)
      );
      this.updateCounter(progress);
      this.scheduleNextUpdate(now, delay);
    }

    if (now < this.endDate) {
      this.raf = requestAnimationFrame(this.next);
    } else if (onComplete) {
      onComplete();
    }
  };

  scheduleNextUpdate = (now, delay) => {
    this.nextUpdate = Math.min(now + delay, this.endDate);
  };

  updateCounter = progress => {
    const { easing } = this.props;
    const { to, from } = this.state;
    const delta = to - from;
    const counter = from + delta * easing(progress);
    this.setState({
      counter,
    });
  };

  clear = () => {
    cancelAnimationFrame(this.raf);
  };

  render() {
    const { digits } = this.props;
    const { counter } = this.state;

    if (!counter) {
      return <Loader />;
    }

    const value = counter.toFixed(digits);

    return (
      <>
        <Typography variant="h5">Total Action Count</Typography>
        <Grid container justify="center" alignItems="center">
          <Typography variant="h1">{value}</Typography>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = ({ Developer }) => ({
  database: Developer.get('database'),
});

const mapDispatchToProps = {
  dispatchGetDatabase: getDatabase,
  dispatchSetDatabase: setDatabase,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionTotalCount);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);
export default StyledComponent;
