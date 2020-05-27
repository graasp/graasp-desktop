import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import _ from 'lodash';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableToolbar from './TableToolbar';
import { TABLE_ORDER, TABLE_HEAD_CELL_IDS } from '../../config/constants';
import { deleteUsersInClassroom } from '../../actions';
import EditUserInClassroomButton from './EditUserInClassroomButton';
import {
  CLASSROOM_TABLE_BODY_ID,
  DELETE_USER_IN_CLASSROOM_BUTTON_CLASS,
  SELECT_USER_IN_CLASSROOM_CLASS,
} from '../../config/selectors';

const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
});

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === TABLE_ORDER.DESC
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const createHeadCell = (id, label, numeric = false, disablePadding = true) => ({
  id,
  numeric,
  disablePadding,
  label,
});

const createStudentRow = ({ id, username }) => {
  return {
    id,
    [TABLE_HEAD_CELL_IDS.USERNAME]: username,
  };
};

// inspired from material table
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/tables/EnhancedTable.js
class StudentsTable extends Component {
  static propTypes = {
    classroom: PropTypes.instanceOf(Map).isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      paper: PropTypes.string.isRequired,
      table: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchDeleteUsersInClassroom: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  state = (() => {
    const { classroom } = this.props;
    const rows = classroom.get('users').map(createStudentRow);

    return {
      order: TABLE_ORDER.ASC,
      orderBy: TABLE_HEAD_CELL_IDS.USERNAME,
      selected: [],
      page: 0,
      dense: false,
      rowsPerPage: 5,
      rows,
    };
  })();

  buildHeadCells = () => {
    const { t } = this.props;
    return [
      createHeadCell(TABLE_HEAD_CELL_IDS.USERNAME, t('Username')),
      createHeadCell(TABLE_HEAD_CELL_IDS.OPERATIONS, t('Operations')),
      // todo : add header cell per space
    ];
  };

  handleRequestSort = (event, property) => {
    const { orderBy, order } = this.state;
    const isAsc = orderBy === property && order === TABLE_ORDER.ASC;
    this.setState({
      order: isAsc ? TABLE_ORDER.DESC : TABLE_ORDER.ASC,
      orderBy: property,
    });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      const { rows } = this.state;
      const newSelecteds = _.cloneDeep(rows);
      this.setState({ selected: newSelecteds });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, row) => {
    const { selected } = this.state;
    const selectedIndex = selected.findIndex(thisRow =>
      _.isEqual(row, thisRow)
    );
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 10);
    this.setState({ page: 0, rowsPerPage });
  };

  handleChangeDense = event => {
    this.setState({ dense: event.target.checked });
  };

  handleDeleteUser = row => {
    const {
      dispatchDeleteUsersInClassroom,
      classroom,
      userId: teacherId,
    } = this.props;
    dispatchDeleteUsersInClassroom({
      users: [row],
      teacherId,
      classroomId: classroom.get('id'),
    });
  };

  renderDenseSwitch = () => {
    const { t } = this.props;
    const { dense } = this.state;
    const switchEl = (
      <Switch
        checked={dense}
        color="primary"
        onChange={this.handleChangeDense}
      />
    );
    return <FormControlLabel control={switchEl} label={t('Dense padding')} />;
  };

  renderDeleteUserButton = row => {
    const { t } = this.props;
    return (
      <Tooltip title={t('Delete this user.')}>
        <IconButton
          className={DELETE_USER_IN_CLASSROOM_BUTTON_CLASS}
          color="inherit"
          onClick={() => this.handleDeleteUser(row)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  renderUserOperations = row => {
    const { classroom } = this.props;
    return (
      <TableCell>
        {this.renderDeleteUserButton(row)}
        <EditUserInClassroomButton
          classroomId={classroom.get('id')}
          user={row}
        />
      </TableCell>
    );
  };

  findRowSelectedIndex = row => {
    const { selected } = this.state;
    return selected.findIndex(thisRow => _.isEqual(row, thisRow));
  };

  render() {
    const {
      selected,
      page,
      rowsPerPage,
      dense,
      order,
      orderBy,
      rows,
    } = this.state;

    const { classes, classroom } = this.props;

    const headCells = this.buildHeadCells();

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableToolbar selected={selected} classroom={classroom} />
          <TableContainer>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeader
                headCells={headCells}
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody id={CLASSROOM_TABLE_BODY_ID}>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    const username = row[TABLE_HEAD_CELL_IDS.USERNAME];

                    const isItemSelected =
                      this.findRowSelectedIndex(row) !== -1;

                    const handleOnClick = event => {
                      this.handleClick(event, row);
                    };

                    return (
                      <TableRow
                        data-name={username}
                        hover
                        onClick={handleOnClick}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            color="primary"
                            className={SELECT_USER_IN_CLASSROOM_CLASS}
                          />
                        </TableCell>
                        <TableCell>{username}</TableCell>
                        {headCells
                          // remove first element and last element: username and operations
                          .slice(1, headCells.length - 1)
                          // display all other data depending on headcells
                          .map(({ id }) => (
                            <TableCell key={id} align="right">
                              {row[id]}
                            </TableCell>
                          ))}
                        {this.renderUserOperations(row)}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        {this.renderDenseSwitch()}
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchDeleteUsersInClassroom: deleteUsersInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentsTable);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
