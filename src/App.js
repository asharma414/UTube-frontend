import React from 'react';
import ShowPage from './components/ShowPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TopNav from './components/TopNav'
import Uploader from './components/Uploader'
import Page404 from './components/404Page'
import ResultsPage from './components/ResultsPage'
import ChannelPage from './components/ChannelPage'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap'
import './App.css';

class App extends React.Component {


  state = {
    currentUser: null,
    currentFeed: null,
    videos: [],
    loading: false,
    genres: []
  }

  componentDidMount() {
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
    this.setState({loading: true})
    fetch('http://localhost:3000/videos')
    .then(res => res.json())
    .then(data => this.setState({videos: data, loading: false}))
  }

  fetchGenres = () => {
    fetch('http://localhost:3000/genres')
      .then(res => res.json())
      .then(genres => this.setState({ genres: genres }))
  }

  viewedFeed = () => {
    if (this.state.currentUser) {
      this.setState({loading: true})
      fetch("http://localhost:3000/feed/viewed", {
        method: "GET",
        headers: {
          "Authentication": localStorage.getItem("jwt")
        }
      })
      .then(res => res.json())
      .then(videos => this.setState({loading: false, videos: videos}))
    }
  }

  subscriptionFeed = () => {
    if (this.state.currentUser) {
      this.setState({loading: true})
      fetch("http://localhost:3000/feed/subscriptions", {
        method: "GET",
        headers: {
          "Authentication": localStorage.getItem("jwt")
        }
      })
      .then(res => res.json())
      .then(videos => this.setState({videos: videos, loading: false}))
    }
  }

  searchResults = (e, term) => {
    e.preventDefault()
    this.setState({loading: true})
    fetch(`http://localhost:3000/videos?query=${term}`)
    .then(res => res.json())
    .then(videos => this.setState({videos: videos, loading: false}))
  }

  channelFeed = id => {
    this.setState({loading: true})
    fetch(`http://localhost:3000/feed/${id}`, {
      method: 'GET',
      headers: {
        "Authentication": localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then(videos => this.setState({loading: false, videos: videos}))
  }

  likedFeed = () => {
    if (this.state.currentUser) {
      this.setState({loading: true})
      fetch("http://localhost:3000/feed/liked", {
        method: "GET",
        headers: {
          "Authentication": localStorage.getItem("jwt")
        }
      })
        .then(res => res.json())
        .then(videos => this.setState({ videos: videos, loading: false }))
    }
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

  logoutUser = async () => {
    localStorage.removeItem('jwt')
    await this.setState({ currentUser: null })
    window.location.reload(true)
  }

  loginUser = (username, password) => {
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.message)
        } else {
          localStorage.setItem('jwt', data.token)
          this.updateUser(data.user_data)
          window.location.reload(true)
        }
      })
  };

  updateUser = (user) => {
    this.setState({ currentUser: user })
  }

  render() {
  return (
    <div className='main'>
      <Router>
    <Row>
    <TopNav 
    searchSubmit={this.searchResults} 
    currentUser={this.state.currentUser} 
    updateUser={this.updateUser} 
    loginUser={this.loginUser} 
    logoutUser={this.logoutUser}
    subscriptionFeed={this.subscriptionFeed} 
    viewedFeed={this.viewedFeed} 
    likedFeed={this.likedFeed} />
    </Row>
    <div style={{marginTop: '55px', marginLeft: '50px'}}>
      <Switch>
        <Route exact path='/' render={() => <ResultsPage loading={this.state.loading} results={this.state.videos} channelFeed={this.channelFeed} fetchVideos={this.fetchVideos} />} />
        <Route exact path='/videos/:id' render={() => <ShowPage currentUser={this.state.currentUser} subscribe={this.subscribe} subscribed={this.subscribed} unsubscribe={this.unsubscribe} />} />
        <Route exact path='/upload' render={() => <Uploader currentUser={this.state.currentUser} genres={this.state.genres} />} />
        <Route exact path='/channels/:id' render={() => <ChannelPage loading={this.state.loading} results={this.state.videos} channelFeed={this.channelFeed} subscribe={this.subscribe} subscribed={this.subscribed} unsubscribe={this.unsubscribe} />} />
        <Route render={() => <Page404 />} />
      </Switch>
    </div>
      </Router>
    </div>
  );
  }
}

export default App;
