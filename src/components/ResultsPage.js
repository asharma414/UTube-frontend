import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Dimmer, Loader } from 'semantic-ui-react'
import VideoCard from './VideoCard'


class ResultsPage extends Component {

    componentDidMount() {
        this.defaultFeed()
    }

    defaultFeed = () => {
        this.props.fetchVideos()
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
                    <Card.Group>
                        {this.props.results.map(result =>
                            <VideoCard result={result} />
                        )}
                    </Card.Group>
                )
        } else {
            return (
                <div>No Results Found</div>
            )
        }
}
}
export default withRouter(ResultsPage)
