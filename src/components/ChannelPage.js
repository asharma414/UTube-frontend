import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {Jumbotron, Button, Container} from 'react-bootstrap'
import { Card, Dimmer, Loader } from 'semantic-ui-react'
import VideoCard from './VideoCard'
const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'


class ChannelPage extends Component {

    state = {
        subCount: null,
        username: null,
        userId: null
        
    }

    componentDidMount() {
        this.getChannelVids()
        this.getSubCount()
    }

    getSubCount = () => {
        fetch( url + `/users/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(user => this.setState({subCount: user.subscriber_count, username: user.username, userId: user.id}))
    }

    getChannelVids = () => {
        this.props.channelFeed(this.props.match.params.id)
    }

    render() {
        if (this.props.loading) {
            return (
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
            )
        } else if (this.props.results.length > 0) {
                return (
                    <div>
                        <Container>
                        <Jumbotron style={{ background: 'white', color: 'black' }}>
                            <h1>Welcome to {this.state.username}'s Channel!</h1>
                            {this.props.currentUser && this.props.currentUser.id !== parseInt(this.props.match.params.id) ? this.props.subscribed(this.state.userId) ?
                                <Button onClick={async () => {await this.props.unsubscribe(this.state.userId); this.setState({subCount: this.state.subCount-1})}}>Subscribed</Button>
                                :
                                <Button variant='danger' onClick={async () => {await this.props.subscribe(this.state.userId); this.setState({subCount: this.state.subCount+1})}}>Subscribe</Button>
                                :
                                null}
                            <span>   {this.state.subCount} subscribers</span>
                        </Jumbotron>
                        </Container>
                        <Card.Group>
                            {this.props.results.map(result =>
                                <VideoCard result={result} />
                            )}
                        </Card.Group>
                    </div>
                )   
        } else {
            return (
                <Container>
                <Jumbotron style={{ background: 'white', color: 'black' }}>
                    <h1>Welcome to {this.state.username}'s Channel!</h1>
                    {this.props.currentUser && this.props.currentUser.id !== parseInt(this.props.match.params.id) ? this.props.subscribed(this.state.userId) ?
                        <Button onClick={async () => {await this.props.unsubscribe(this.state.userId); this.setState({subCount: this.state.subCount-1})}}>Subscribed</Button>
                        :
                        <Button variant='danger' onClick={async () => {await this.props.subscribe(this.state.userId); this.setState({subCount: this.state.subCount+1})}}>Subscribe</Button>
                        :
                        null}
                    <span>   {this.state.subCount} subscribers</span>
                </Jumbotron>
                </Container>
            )
        }
    }
}

export default withRouter(ChannelPage)
