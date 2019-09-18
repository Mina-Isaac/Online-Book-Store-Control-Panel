import { combineReducers } from 'redux';
import { bookReducer, tableReducer } from './reducers';
import { reducer as toastrReducer } from 'react-redux-toastr'


export default combineReducers({
  books: bookReducer,
  toastr: toastrReducer,
  sortConfig: tableReducer
})
