import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Row, Col, Button} from 'react-bootstrap'
import ReactPlayer from 'react-player'

class ShowPage extends Component {

    state = {
        title: null,
        description: null,
        poster: null,
        user_id: null,
        genre: null,
        clip_url: null,
        thumbnail_url: null
    }

    componentDidMount() {
        fetch(`http://localhost:3000/videos/${this.props.match.params.id}`)
            .then(res => res.json())
            .then(vid => this.setState({title: vid.title, description: vid.description, clip_url: vid.clip.url, thumbnail_url: vid.thumbnail.url, poster: vid.user.username, subCount: vid.user.subscriber_count, user_id: vid.user_id, genre: vid.genre.name}))
    }

    render() {
        return (
            <>
            <ReactPlayer url={this.state.clip_url} controls={true} />
            <br />
            <h2>{this.state.title}</h2>
            <hr style={{border: '1px dotted white'}}/>
            <Row>
                <Col>
                    <a>{this.state.poster}</a>
                    <div>{this.state.subCount} Subscribers</div>
                </Col>
                <Col>
                    {this.props.subscribed(this.state.user_id) ? 
                    <Button onClick={() => this.props.unsubscribe(this.state.user_id)}>Subscribed</Button> 
                    : 
                    <Button onClick={() => this.props.subscribe(this.state.user_id)}>Subscribe</Button>}
                </Col>
            </Row>
            <br />
            <p>{this.state.description}</p>
            <br />
            <p>{this.state.genre}</p>
            </>
        )
    }
}

export default withRouter(ShowPage)