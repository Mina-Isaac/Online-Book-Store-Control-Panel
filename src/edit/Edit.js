import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from "react-redux";
import { addBookAsync, editBook, db } from '../store/actions'
import { toastr } from 'react-redux-toastr'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { store } from '../App'


export class Edit extends Component {

  constructor(props) {

    super(props);
    this.state = {

      name: '',
      available: 0,
      authors: '',
      description: '',
      visible: false,
    }
    this.sortedIds = []
  }

  //idGenerator() { return (Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)) }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = (e) => {
    const { id, ...book } = this.state
    e.preventDefault();
    if (this.props.match.params.id == 0) {
      this.props.addBook(this.state);

      toastr.success(this.state.name, 'A new book has been added successfully.');
      this.setState({ name: '', available: 0, authors: '', description: '', visible: false }); return;
    }
    db.collection('Book').doc(id).update(book);
    this.props.editBook(id, this.state);
    toastr.success(book.name, 'This book has beed edited successfully.')
  }


  componentDidMount() {
    if (this.props.match.params.id) { this.setState({ ...this.props.book }); this.sortedIds = store.getState().books.map((item) => item.id) }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) { this.setState({ ...this.props.book }) }
  }
  render() {
    const l = this.sortedIds.length;
    let i = this.sortedIds.findIndex((item) => item == this.props.match.params.id);
    const idGrabber = (which) => {
        return this.sortedIds[i + which]

    }

    return <div style={{ paddingTop: '30px' }}>
      <form noValidate>

        <TextField
          id="book-name"
          label="Name"
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="book-available"
          label="Available"
          type="number"
          value={this.state.available}
          onChange={e => this.setState({ available: parseInt(e.target.value) })}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="book-authors"
          label="Authors"
          value={this.state.authors}
          onChange={this.handleChange('authors')}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="book-description"
          label="Description"
          multiline
          value={this.state.description}
          onChange={this.handleChange('description')}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <FormControlLabel
          control={<Checkbox onChange={() => { this.setState({ visible: !this.state.visible }) }} checked={this.state.visible} />}
          label="Visible"
        /><br />
        <Button variant="contained" onClick={(e) => { this.handleSubmit(e); }} type='submit' color="primary">Submit</Button>
        {!(this.props.match.params.id == 0) && <div style={{ float: 'right', display: 'inline-block' }}>
          <Link className={i ? null : 'disabled-link'} style={{ marginRight: '30px' }} to={'/edit/' + idGrabber(-1)}><Button onClick={() => console.log('previous')} variant="outlined" disabled={!i}>Previous</Button></Link>
          <Link className={(i + 1 - l) ? null : 'disabled-link'} to={'/edit/' + idGrabber(1)}><Button variant="outlined" disabled={!(i + 1 - l)}>Next</Button></Link>
        </div>}


      </form>
    </div>
  }
}

const mapState = (state, ownProps) => {
  if (ownProps.match.params.id) {
    return {
      book: state.books.find((item) => item.id == ownProps.match.params.id),
    }
  }
}
const mapDispatch = {
  addBook: addBookAsync,
  editBook
}
export default connect(mapState, mapDispatch)(Edit)
