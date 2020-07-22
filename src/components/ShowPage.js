import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import ReactPlayer from 'react-player'

class ShowPage extends Component {

    state = {
        title: null,
        description: null,
        clip_url: null,
        thumbnail_url: null,
    }

    componentDidMount() {
        fetch(`http://localhost:3000/videos/${this.props.match.params.id}`)
            .then(res => res.json())
            .then(vid => this.setState({title: vid.title, description: vid.description, clip_url: vid.clip.url, thumbnail_url: vid.thumbnail.url, poster: vid.user.username, user_id: vid.user_id}))
    }

    render() {
        return (
            <ReactPlayer url={this.state.clip_url} controls={true} />
            
        )
    }
}

export default withRouter(ShowPage)