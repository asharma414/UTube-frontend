import React from 'react';
import ShowPage from './components/ShowPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TopNav from './components/TopNav'
import SideNav from './components/SideNav'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  
  return (
    <div>
      <SideNav />
      <TopNav />
    <Router>
      <Route exact path='/videos/:id' render={() => <ShowPage />} />
    </Router>
    </div>
  );
}

export default App;
