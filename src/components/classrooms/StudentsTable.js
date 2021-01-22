import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { Map } from 'immutable';
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
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableToolbar from './TableToolbar';
import {
  TABLE_ORDER,
  TABLE_HEAD_CELL_IDS,
  ROWS_PER_PAGE_OPTIONS,
  TABLE_ROW_HEIGHT,
} from '../../config/constants';
import { deleteUsersInClassroom } from '../../actions';
import EditUserInClassroomButton from './EditUserInClassroomButton';
import {
  CLASSROOM_TABLE_BODY_ID,
  DELETE_USER_IN_CLASSROOM_BUTTON_CLASS,
  SELECT_USER_IN_CLASSROOM_CLASS,
  STUDENT_ROW_ACTIONS_CLASS,
  STUDENT_ROW_RESOURCES_CLASS,
} from '../../config/selectors';
import {
  getUserResourcesForSpaceInClassroom,
  getUserActionsForSpaceInClassroom,
} from '../../utils/classroom';
import ActionIcon from './ActionIcon';
import ResourceIcon from './ResourceIcon';

const styles = (theme) => ({
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

const getComparator = (order, orderBy) =>
  order === TABLE_ORDER.DESC
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const createHeadCell = (id, label, numeric = false) => ({
  id,
  numeric,
  label,
});

const createRows = (classroom) =>
  classroom.get('users').map(({ id: userId, username }) => {
    // create map for a given user of its data for each space
    const spaceData = classroom.get('spaces').reduce((data, { id }) => {
      const resources = getUserResourcesForSpaceInClassroom(
        classroom,
        id,
        userId
      );
      const actions = getUserActionsForSpaceInClassroom(classroom, id, userId);
      return { ...data, [id]: { actions, resources } };
    }, {});

    return {
      id: userId,
      [TABLE_HEAD_CELL_IDS.USERNAME]: username,
      ...spaceData,
    };
  });

const buildHeadCells = (classroom, t) => {
  // create header cell for each space
  const spaceCells = classroom
    .get('spaces')
    // sort per name
    .sort(({ name: a }, { name: b }) => a - b)
    // create cell
    .map(({ id, name }) => createHeadCell(id, name));

  return [
    createHeadCell(TABLE_HEAD_CELL_IDS.USERNAME, t('Username')),
    ...spaceCells,
    createHeadCell(TABLE_HEAD_CELL_IDS.OPERATIONS, t('Operations')),
  ];
};

// inspired from material table
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/tables/EnhancedTable.js
class StudentsTable extends Component {
  static propTypes = {
    classroom: PropTypes.instanceOf(Map).isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      paper: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchDeleteUsersInClassroom: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  state = (() => {
    const { t, classroom } = this.props;

    // create head cells from spaces
    const headCells = buildHeadCells(classroom, t);

    // create table rows
    const rows = createRows(classroom);

    return {
      headCells,
      order: TABLE_ORDER.ASC,
      orderBy: TABLE_HEAD_CELL_IDS.USERNAME,
      selected: [],
      page: 0,
      rowsPerPage: 5,
      rows,
    };
  })();

  componentDidUpdate({ classroom: prevClassroom }) {
    const { classroom, t } = this.props;

    if (!classroom.equals(prevClassroom)) {
      // update head cells
      const headCells = buildHeadCells(t);

      // update rows
      const rows = createRows(classroom);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ rows, headCells });
    }
  }

  handleRequestSort = (event, property) => {
    const { orderBy, order } = this.state;
    const isAsc = orderBy === property && order === TABLE_ORDER.ASC;
    this.setState({
      order: isAsc ? TABLE_ORDER.DESC : TABLE_ORDER.ASC,
      orderBy: property,
    });
  };

  handleSelectAllClick = (event) => {
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
    const selectedIndex = selected.findIndex((thisRow) =>
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

  handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    this.setState({ page: 0, rowsPerPage });
  };

  handleDeleteUser = (row) => {
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

  renderDeleteUserButton = (row) => {
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

  renderUserOperations = (row) => {
    const { classroom } = this.props;
    return (
      <TableCell>
        {this.renderDeleteUserButton(row)}
        <EditUserInClassroomButton classroom={classroom} user={row} />
      </TableCell>
    );
  };

  findRowSelectedIndex = (row) => {
    const { selected } = this.state;
    return selected.findIndex((thisRow) => _.isEqual(row, thisRow));
  };

  renderRow = (row, isItemSelected) => {
    const { headCells } = this.state;

    const handleOnClick = (event) => {
      this.handleClick(event, row);
    };

    return (
      <>
        <TableCell padding="checkbox">
          <Checkbox
            className={SELECT_USER_IN_CLASSROOM_CLASS}
            checked={isItemSelected}
            color="primary"
            onClick={handleOnClick}
          />
        </TableCell>
        <TableCell>{row[TABLE_HEAD_CELL_IDS.USERNAME]}</TableCell>
        {headCells
          // remove first element and last element: username and operations
          .slice(1, headCells.length - 1)
          // display all other data depending on headcells
          .map(({ id }) => (
            <TableCell key={id} data-head-cell-id={id}>
              {row[id].actions.length > 0 && (
                <ActionIcon className={STUDENT_ROW_ACTIONS_CLASS} />
              )}
              {row[id].resources.length > 0 && (
                <ResourceIcon className={STUDENT_ROW_RESOURCES_CLASS} />
              )}
            </TableCell>
          ))}
        {this.renderUserOperations(row)}
      </>
    );
  };

  render() {
    const {
      selected,
      page,
      rowsPerPage,
      order,
      orderBy,
      rows,
      headCells,
    } = this.state;

    const { classes, classroom, t } = this.props;

    // compute indexes to display rows for a given current page
    const startingIndex = page * rowsPerPage;
    const endingIndex = startingIndex + rowsPerPage;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - startingIndex);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableToolbar selected={selected} classroom={classroom} />
          <TableContainer>
            <Table size="small">
              <TableHeader
                headCells={headCells}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody id={CLASSROOM_TABLE_BODY_ID}>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(startingIndex, endingIndex)
                  .map((row) => {
                    const username = row[TABLE_HEAD_CELL_IDS.USERNAME];

                    const isItemSelected =
                      this.findRowSelectedIndex(row) !== -1;

                    return (
                      <TableRow
                        data-name={username}
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        {this.renderRow(row, isItemSelected)}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: TABLE_ROW_HEIGHT * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={t('Rows per page')}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
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
