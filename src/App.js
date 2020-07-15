import React from 'react';
import ShowPage from './components/ShowPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TopNav from './components/TopNav'
import SideNav from './components/SideNav'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col} from 'react-bootstrap'
import './App.css';

function App() {
  
  return (
    <div className='main'>
    <Row>
      <Col>
    <TopNav />
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
        <Route exact path='/videos/:id' render={() => <ShowPage />} />
      </Switch>
    </Router>
      </Col>
    </Row>
    </div>
  );
}

export default App;
