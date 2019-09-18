import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
firebase.initializeApp({
  apiKey: 'Your Firebase API key goes here',
  projectId: 'Firebase project ID goes here',
  authDomain: "Authintication domain goes here",
});

export const db = firebase.firestore()
export const auth = firebase.auth()
export const FETCH_DATA = 'EFTCH_DATA'
export const ADD_BOOK = 'ADD_BOOK'
export const REMOVE_BOOK = 'REMOVE_BOOK'
export const EDIT_BOOK = 'EDIT_BOOK'
export const TOGGLE_ORDER = 'TOGGLE_ORDER'
export const SET_ORDERBY = 'SET_ORDERBY'
export const SET_PAGE = 'SET_PAGE'
export const SET_ROWSPERPAGE = 'SET_ROWSPERPAGE'
export const TOGGLE_LOADING = 'TOGGLE_LOADING'
export const TOGGLE_LOGED_IN = 'TOGGLE_LOGED_IN'
const addBook = (book) => ({ type: ADD_BOOK, book })
export const editBook = (id, book) => ({ type: EDIT_BOOK, id, book, })
const getAllBooks = (books) => ({ type: FETCH_DATA, books })
export const removeBook = (id) => ({ type: REMOVE_BOOK, id })
export const toggleOrder = () => ({ type: TOGGLE_ORDER })
export const setOrderBy = (orderBy) => ({ type: SET_ORDERBY, setOrder: orderBy })
export const setPage = (page) => ({ type: SET_PAGE, page })
export const setRowsPerPage = (num) => ({ type: SET_ROWSPERPAGE, num })
const toggleLoading = () => ({ type: TOGGLE_LOADING })
export const toggleSignIn = () => ({ type: TOGGLE_LOGED_IN })


export function getAllBooksAsync() {

  return (dispatch) => {
    dispatch(toggleLoading());
    const temp = [];
    db.collection("Book").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
    }).then(() => {
      dispatch(getAllBooks(temp));
      dispatch(toggleLoading());
    })
  }
}
export function addBookAsync(book) {
  return (dispatch) => {
    db.collection("Book").add(book)
      .then(function (docRef) {
        dispatch(addBook({ ...book, id: docRef.id }));
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
}
