import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter }  from 'react-router-dom'

class SideNav extends Component {

render() {
    return (
        <Navbar variant='dark' bg='dark'>
            <Nav>
                <ul>
                    <Nav.Link onClick={() => {this.props.history.push('/'); this.props.subscriptionFeed()}}>Subscriptions</Nav.Link>
                    <Nav.Link onClick={() => { this.props.history.push('/'); this.props.likedFeed() }}>Liked</Nav.Link>
                </ul>
            </Nav>
        </Navbar>
    );
}
}

export default withRouter(SideNav)