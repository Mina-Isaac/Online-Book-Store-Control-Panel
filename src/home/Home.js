import React from 'react';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { connect } from "react-redux";
import { removeBook, setOrderBy, toggleOrder, setPage, setRowsPerPage, db } from '../store/actions'
import { toastr } from 'react-redux-toastr';
import Spinner from './spinner'


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'available', numeric: true, disablePadding: false, label: 'Available' },
  { id: 'visible', numeric: false, disablePadding: false, label: 'Visible' },
  { id: 'authors', numeric: false, disablePadding: false, label: 'Authors' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));


 function EnhancedTable(props) {
  const classes = useStyles();
  let { loading, order, orderBy, page, rowsPerPage, books } = props;

  let clickTimer;
  function handleSingleClick() {
    if (clickTimer) { clearTimeout(clickTimer) };
    clickTimer = setTimeout(() => {
      toastr.error('Double click to remove', '', { progressBar: false, transitionIn: 'none', transitionOut: 'bounceOut' })
    }, 480);
  }

  function handleDoubleClick(row) {
    clearTimeout(clickTimer);
    db.collection("Book").doc(row.id).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
    props.removeBook(row.id);
    toastr.info(row.name, 'The book has been deleted')
  }

  function handleRequestSort(event, property) {
    props.toggleOrder();
    props.setOrderBy(property);
  }


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);


  const theTable = <Paper className={classes.paper}>
    <div className={classes.tableWrapper}>
      <Table
        className={classes.table}
        aria-labelledby="tableTitle"
      >
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          rowCount={books.length}
        />
        <TableBody>
          {stableSort(books, getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.name}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.available}</TableCell>
                  <TableCell >{row.visible ? <b style={{ color: 'green' }}> Yes</b> : <b style={{ color: 'red' }}> No</b>}</TableCell>
                  <TableCell >{row.authors}</TableCell>
                  <TableCell >{row.description.length > 115 ? row.description.slice(0, 112) + '...' : row.description}</TableCell>
                  <TableCell>
                    <Link to={'/edit/' + row.id}>
                      <Fab size="small" color="primary" variant="extended" aria-label="Edit">
                        <EditIcon fontSize="small" /> <span style={{ margin: '0 10px' }}>Edit</span>
                      </Fab></Link>
                    <div onClick={() => handleSingleClick()} onDoubleClick={() => {
                      handleDoubleClick(row)
                    }}><Fab size="small" color="secondary" variant="extended" aria-label="Delete">
                        <DeleteIcon fontSize="small" /> <span style={{ margin: '0 10px' }}>Delete</span>
                      </Fab></div>
                  </TableCell>
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 49 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={books.length}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        'aria-label': 'Previous Page',
      }}
      nextIconButtonProps={{
        'aria-label': 'Next Page',
      }}
      onChangePage={(e, newPage) => props.setPage(newPage)}
      onChangeRowsPerPage={(e) => props.setRowsPerPage(+e.target.value)}
    />
  </Paper>;
  return (
    <div className={classes.root}>
      <Link to={'/edit/0'}>
        <Fab size="small" color="primary" variant="extended" aria-label="Add">
          <AddIcon fontSize="small" /> <span style={{ margin: '0 10px' }}>Add New Book</span>
        </Fab></Link>
      <br /> <br />
      {loading && <Spinner/> || theTable}
    </div>
  );
}
const mapStateToProps = (state) => ({
  books: state.books,
  ...state.sortConfig
})
const mapDispatch = {
  removeBook,
  toggleOrder,
  setOrderBy,
  setPage,
  setRowsPerPage,
}
export default connect(mapStateToProps, mapDispatch)(EnhancedTable)
