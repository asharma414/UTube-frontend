import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'

export default class SideNav extends Component {

render() {
    return (
        <Navbar variant='dark' bg='dark'>
            <Nav>
                <ul>
                    <Nav.Link onClick={this.props.subscriptionFeed}>Subscriptions</Nav.Link>
                    <Nav.Link>test</Nav.Link>
                </ul>
            </Nav>
        </Navbar>
    );
}
}
