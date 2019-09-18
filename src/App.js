import React, { useEffect } from 'react';
import './App.css';
import Home from './home/Home';
import Edit from './edit/Edit';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BookIcon from '@material-ui/icons/Book';
import Container from '@material-ui/core/Container';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootreducer from './store/rootreducer';
import ReduxToastr from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { getAllBooksAsync, toggleSignIn, auth } from './store/actions'
import Button from '@material-ui/core/Button';
import SignIn from './Signin';
import { connect } from "react-redux";


export const store = createStore(rootreducer, applyMiddleware(thunk));

function App(props) {
  useEffect(() => { auth.onAuthStateChanged((user) => {
    if (user) {
      props.dispatch(toggleSignIn());props.dispatch(getAllBooksAsync())
    }
  }) }, []);
  return (
    
    <BrowserRouter>
      <AppBar position="relative">
        <Toolbar>
          <Link to={'/'}>
            <BookIcon />
          </Link>
          <Typography variant="h6" color="inherit" noWrap>
            <Link to={'/'}>Tanweryen Delivery books</Link>
          </Typography>
          {props.loged && <Button onClick={() => { auth.signOut().then(() => props.dispatch(toggleSignIn())) }} style={{ color: 'white', marginLeft: 'auto' }}> Sign Out</Button >}
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          <ReduxToastr
            timeOut={2500}
            newestOnTop={true}
            //preventDuplicates
            position="top-right"
            transitionIn="fadeIn"
            transitionOut='bounceOut'
            progressBar
            closeOnToastrClick />
          {props.loged && <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/edit/:id" component={Edit} />
          </Switch> || <SignIn />}
        </Container>
      </main>
    </BrowserRouter>
  );
}

const mapState = (state) => ({ loged: state.sortConfig.isLogedIn })
const PP = connect(mapState)(App)
function Appp() {
  return <Provider store={store}>
    <PP />
  </Provider>
}
export default Appp;


