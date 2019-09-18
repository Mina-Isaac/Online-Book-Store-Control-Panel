import { FETCH_DATA, ADD_BOOK, REMOVE_BOOK, EDIT_BOOK, TOGGLE_ORDER, SET_ORDERBY, SET_PAGE, SET_ROWSPERPAGE, TOGGLE_LOADING, TOGGLE_LOGED_IN } from './actions';

export function bookReducer(books = [], action) {
  switch (action.type) {
    case FETCH_DATA:
      return action.books;
    case REMOVE_BOOK:
      return books.filter((book) => book.id !== action.id);
    case ADD_BOOK:
      return books.concat(action.book);
    case EDIT_BOOK:
      const i = books.findIndex((item) => item.id == action.id);
      const a = books.slice(0, i);
      const b = books.slice(i + 1);
      return a.concat(action.book, b)
    default:
      return books;
  }
};
const sortInitialState = { order: 'asc', orderBy: '', page: 0, rowsPerPage: 5, loading: false, isLogedIn: false }

export function tableReducer(sortConfig = sortInitialState, action) {
  switch (action.type) {
    case TOGGLE_LOGED_IN:
      return { ...sortConfig, isLogedIn: !sortConfig.isLogedIn };
    case TOGGLE_LOADING:
      return { ...sortConfig, loading: !sortConfig.loading }
    case TOGGLE_ORDER:
      return { ...sortConfig, order: sortConfig.order === 'asc' ? 'desc' : 'asc' };
    case SET_ORDERBY:
      return { ...sortConfig, orderBy: action.setOrder };
    case SET_PAGE:
      return { ...sortConfig, page: action.page };
    case SET_ROWSPERPAGE:
      return { ...sortConfig, rowsPerPage: action.num };
    default:
      return sortConfig;
  }
}
