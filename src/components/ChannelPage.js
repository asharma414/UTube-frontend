import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {Jumbotron, Button, Container} from 'react-bootstrap'
import { Card, Dimmer, Loader } from 'semantic-ui-react'
import VideoCard from './VideoCard'
const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'


class ChannelPage extends Component {

    state = {
        subCount: null,
        channelId: false
    }

    componentDidMount() {
        this.setState({channelId: this.props.match.params.id})
        this.getChannelVids()
        this.getSubCount()
    }

    getSubCount = () => {
        fetch( url + `/users/${this.props.match.params.id}`)
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
                        <Container>
                        <Jumbotron style={{ background: 'white', color: 'black' }}>
                            <h1>Welcome to {username}'s Channel!</h1>
                            {this.props.currentUser.id && this.props.currentUser.id !== parseInt(this.state.channelId) ? this.props.subscribed(user_id) ?
                                <Button onClick={async () => {await this.props.unsubscribe(user_id); this.setState({subCount: this.state.subCount-1})}}>Subscribed</Button>
                                :
                                <Button variant='danger' onClick={async () => {await this.props.subscribe(user_id); this.setState({subCount: this.state.subCount+1})}}>Subscribe</Button>
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
                <div>No Results Found</div>
            )
        }
    }
}

export default withRouter(ChannelPage)
