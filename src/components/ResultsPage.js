import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Image, Icon, Container } from 'semantic-ui-react'


class ResultsPage extends Component {

    //turn seconds to formatted duration
    fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }


    render() {
        return (
            <div>
                <Card.Group>
                    {this.props.results.map(result =>
                        <Card style={{color: 'black'}}>
                            <div className='thumbnail'>
                                <img style={{width: '100%', height: '100%'}} src={result.thumbnail.url} wrapped ui={false} onClick={() => this.props.history.push(`/videos/${result.id}`)} />
                                <div className='duration'>{this.fmtMSS(result.duration.toFixed(0))}</div>
                            </div>
                            <Card.Content onClick={() => this.props.history.push(`/videos/${result.id}`)}>
                                <Card.Header>{result.title}</Card.Header>
                                <Card.Description>
                                   {result.description.substring(0, 25)}
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                
                        <a>{result.user.username}</a>
                            </Card.Content>
                        </Card>
                    )}
                </Card.Group>
            </div>
        )
    }
}

export default withRouter(ResultsPage)
