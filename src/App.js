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
    videos: []
  }

  componentDidMount() {
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
          this.fetchVideos()
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
        <Route exact path='/videos/:id' render={() => <ShowPage />} />
        <Route exact path='/upload' render={() => <Uploader currentUser={this.state.currentUser} />} />
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
