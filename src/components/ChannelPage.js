import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {Jumbotron, Button} from 'react-bootstrap'
import { Card, Dimmer, Loader } from 'semantic-ui-react'
import VideoCard from './VideoCard'


class ChannelPage extends Component {

    state = {
        subCount: null
    }

    componentDidMount() {
        this.getChannelVids()
        this.getSubCount()
    }

    getSubCount = () => {
        fetch(`http://localhost:3000/users/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(subCount => this.setState({subCount: subCount}))

    }

    getChannelVids = () => {
        this.props.channelFeed(this.props.match.params.id)
    }

    render() {
        const username = ((this.props.results[0] || {}).user || {}).username;
        const user_id  = (this.props.results[0] || {}).user_id
        if (this.props.loading) {
            return (
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
            )
        } else if (this.props.results.length > 0) {
                return (
                    <div>
                        <Jumbotron style={{ background: 'white', color: 'black' }}>
                            <h1>Welcome to {username}'s Channel!</h1>
                            {this.props.subscribed(user_id) ?
                                <Button onClick={() => this.props.unsubscribe(user_id)}>Subscribed</Button>
                                :
                                <Button variant='danger' onClick={() => this.props.subscribe(user_id)}>Subscribe</Button>}
                            <span>   {this.state.subCount} subscribers</span>
                        </Jumbotron>
                        <Card.Group>
                            {this.props.results.map(result =>
                                <VideoCard result={result} />
                            )}
                        </Card.Group>
                    </div>
                )   
        } else {
            return (
                <div>No Results Found</div>
            )
        }
    }
}

export default withRouter(ChannelPage)
