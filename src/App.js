import React from 'react';
import ShowPage from './components/ShowPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TopNav from './components/TopNav'
import SideNav from './components/SideNav'
import Uploader from './components/Uploader'
import Page404 from './components/404Page'
import ResultsPage from './components/ResultsPage'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col} from 'react-bootstrap'
import './App.css';

class App extends React.Component {


  state = {
    currentUser: null,
    videos: [],
    genres: []
  }

  componentDidMount() {
    this.fetchVideos()
    this.fetchGenres()
    if (localStorage.getItem("jwt")) {
      fetch("http://localhost:3000/token", {
        method: "GET",
        headers: {
          "Authentication": localStorage.getItem("jwt")
        }
      })
        .then(res => res.json())
        .then(data => {
          this.updateUser(data)
        })
    }
    //check if there is token in localStorage
    //if so, make fetch call to find out logged in user
    //then this.setState of currentUser
  }

  fetchVideos = () => {
    fetch('http://localhost:3000/videos')
    .then(res => res.json())
    .then(data => this.setState({videos: data}))
  }

  fetchGenres = () => {
    fetch('http://localhost:3000/genres')
      .then(res => res.json())
      .then(genres => this.setState({ genres: genres }))
  }

  subscribe = (id) => {
    if (this.state.currentUser) {
      fetch('http://localhost:3000/subscriptions', {
        method: 'POST',
        headers: {
          "Authentication": localStorage.getItem("jwt"),
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({subscribee_id: id})
      })
      .then(res => res.json())
      .then(data => {
        let newSub = [...this.state.currentUser.subscribees, data]
        let currentUser = {...this.state.currentUser}
        currentUser.subscribees = newSub
        this.setState({currentUser: currentUser})
      })
   }
  }

  unsubscribe = (id) => {
    if (this.state.currentUser) {
      fetch(`http://localhost:3000/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          "Authentication": localStorage.getItem("jwt"),
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
      })
      .then(res => res.json())
      .then(data => {
        let filteredArr = [...this.state.currentUser.subscribees].filter(subscribee => subscribee.id !== data.subscribee_id)
        let currentUser = {...this.state.currentUser}
        currentUser.subscribees = filteredArr
        this.setState({currentUser: currentUser})
      })
    }
  }

  subscribed = (id) => {
    if (this.state.currentUser) {
      return this.state.currentUser.subscribees.find(subscribee => subscribee.id === id)
    }
  }

  logoutUser = () => {
    localStorage.removeItem('jwt')
    this.setState({ currentUser: null })
  }

  updateUser = (user) => {
    this.setState({ currentUser: user })
  }

  render() {
  return (
    <div className='main'>
    <Row>
      <Col>
    <TopNav currentUser={this.state.currentUser} updateUser={this.updateUser} logoutUser={this.logoutUser} />
      </Col>
    </Row>
    <Row>
      <Col lg={2} className='sidebar'>
      <SideNav />
      </Col>
      <Col>
    <Router>
      <br />
      <Switch>
        <Route exact path='/' render={() => <ResultsPage results={this.state.videos} />} />
        <Route exact path='/videos/:id' render={() => <ShowPage currentUser={this.state.currentUser} subscribe={this.subscribe} subscribed={this.subscribed} unsubscribe={this.unsubscribe} />} />
        <Route exact path='/upload' render={() => <Uploader currentUser={this.state.currentUser} genres={this.state.genres} />} />
        <Route render={() => <Page404 />} />
      </Switch>
    </Router>
      </Col>
    </Row>
    </div>
  );
  }
}

export default App;
