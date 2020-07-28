import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

class VideoCard extends Component {

    //turn seconds to formatted duration
    fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }
    
    render() {
        const { result } = this.props
        return (
            <Card style={{ color: 'black', cursor: 'pointer' }}>
                <div className='thumbnail'>
                    <img alt='' style={{ width: '100%', height: '100%' }} src={result.thumbnail.url} wrapped ui={false} onClick={() => this.props.history.push(`/videos/${result.id}`)} />
                    <div className='duration'>{this.fmtMSS(result.duration.toFixed(0))}</div>
                </div>
                <Card.Content onClick={() => this.props.history.push(`/videos/${result.id}`)}>
                    <Card.Header>{result.title}</Card.Header>
                    <span>{result.view_count} views</span>
                    <Card.Description>
                        {result.description.substring(0, 25)}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Link to={`/channels/${result.user_id}`}>{result.user.username}</Link>
                </Card.Content>
            </Card>
        )
    }
}

export default withRouter(VideoCard)