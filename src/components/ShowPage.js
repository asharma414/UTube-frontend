import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Row, Col, Button, Form} from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ReactPlayer from 'react-player'
import moment from 'moment';
import dompurify from 'dompurify';
const sanitizer = dompurify.sanitize;

class ShowPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subCount: null,
            createdAt: null,
            commentText: '',
            comments: [],
            viewCount: null,
            video_id: null,
            title: null,
            description: null,
            poster: null,
            user_id: null,
            genre: null,
            likeCount: null,
            like: null,
            dislikeCount: null,
            clip_url: null,
            thumbnail_url: null,
            played: false,
            viewed: false
        }
    }

    onChange = (e) => {
        this.setState({[e.target.id]: e.target.value})
    }

    like = () => {
        if (this.props.currentUser) {
            if (!this.state.like) {
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    "Authentication": localStorage.getItem("jwt"),
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    video_id: this.state.video_id,
                    dislike: false
                })
            }).then(res => res.json())
            .then(data =>this.setState({like: data, likeCount: this.state.likeCount + 1}))
        } else if (this.state.like.dislike === false) {
            fetch(`http://localhost:3000/likes/${this.state.like.id}`, {
                method: 'DELETE',
                headers: {
                    "Authentication": localStorage.getItem("jwt"),
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                }
            }).then(res => {
                if (res.ok === true) {
                    this.setState({ like: null, likeCount: this.state.likeCount - 1 })
                }
            })
        } else {
            fetch(`http://localhost:3000/likes/${this.state.like.id}`, {
                method: 'PATCH',
                headers: {
                    "Authentication": localStorage.getItem("jwt"),
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => res.json())
            .then(like => this.setState({like: like, likeCount: this.state.likeCount + 1, dislikeCount: this.state.dislikeCount - 1}))
        }
    }
    }

    onEnded = () => {
        this.setState({played: true})
    }

    onProgress = ({played}) => {
        if (!this.state.played) {
            if (played >= 0.5 && this.state.viewed === false) {
                if (this.props.currentUser) {
                    fetch('http://localhost:3000/views', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Accept: 'application/json'
                        },
                        body: JSON.stringify({
                            video_id: this.state.video_id,
                            user_id: this.props.currentUser.id
                        })
                    })
                    .then(res => res.json())
                    .then(this.setState({viewed: true}))
                } else {
                    fetch('http://localhost:3000/views', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Accept: 'application/json'
                        },
                        body: JSON.stringify({
                            video_id: this.state.video_id
                        })
                    })
                    .then(res => res.json())
                    .then(this.setState({viewed: true, viewCount: this.state.viewCount+1}))
                }
            }
        }
    }

    dislike = () => {
        if (this.props.currentUser) {
            if (!this.state.like) {
                fetch('http://localhost:3000/likes', {
                    method: 'POST',
                    headers: {
                        "Authentication": localStorage.getItem("jwt"),
                        'Content-type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        video_id: this.state.video_id,
                        dislike: true
                    })
                }).then(res => res.json())
                    .then(data => this.setState({ like: data, dislikeCount: this.state.dislikeCount + 1 }))
            } else if (this.state.like.dislike === true) {
                fetch(`http://localhost:3000/likes/${this.state.like.id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authentication": localStorage.getItem("jwt"),
                        'Content-type': 'application/json',
                        Accept: 'application/json'
                    }
                }).then(res => {
                    if (res.ok === true) {
                        this.setState({ like: null, dislikeCount: this.state.dislikeCount - 1 })
                    }
                })
            } else {
                fetch(`http://localhost:3000/likes/${this.state.like.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Authentication": localStorage.getItem("jwt"),
                        'Content-type': 'application/json',
                        Accept: 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(like => this.setState({ like: like, likeCount: this.state.likeCount - 1, dislikeCount: this.state.dislikeCount + 1 }))
            }
        }
    }

    commentSubmit = (e) => {
        e.preventDefault()
        if (this.props.currentUser) {
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                video_id: this.state.video_id,
                user_id: this.props.currentUser.id,
                content: this.state.commentText
            })
        })
        .then(res => res.json())
        .then(comment => this.setState({commentText: '', comments: [comment, ...this.state.comments]}))
    }
    }

    componentDidMount() {
        fetch(`http://localhost:3000/videos/${this.props.match.params.id}`)
            .then(res => res.json())
            .then(vid => {
                fetch(`http://localhost:3000/likes/${this.props.match.params.id}`, {
                    headers: {
                        "Authentication": localStorage.getItem("jwt"),
                        'Content-type': 'application/json',
                        Accept: 'application/json'
                    }
                })
                .then(res => res.json())
                    .then(data => {
                        this.setState({ createdAt: vid.created_at, viewCount: vid.view_count, comments: vid.comments, like: data, video_id: vid.id, title: vid.title, description: vid.description, clip_url: vid.clip.url, thumbnail_url: vid.thumbnail.url, poster: vid.user.username, subCount: vid.user.subscriber_count, user_id: vid.user_id, genre: vid.genre.name, likeCount: vid.like_count, dislikeCount: vid.dislike_count })
                })
            })
    }

    render() {
        return (
            <>
            <ReactPlayer onEnded={this.onEnded} onProgress={this.onProgress} url={this.state.clip_url} controls={true} />
            <br />
            <Row>
                <Col lg={7}>
                    <h2>{this.state.title}</h2>
                </Col>
            </Row>
            <br />
            <Row>
                <Col lg={6}>
                        {this.state.viewCount} views • {new Date(this.state.createdAt).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </Col>
                <Col lg={2}>
                        <Row>
                        <Col>
                        <Icon name='thumbs up outline' onClick={this.like} />
                        <span>{this.state.likeCount}</span>
                        </Col>
                        <Col>
                        <Icon name='thumbs down outline' onClick={this.dislike} />
                        <span>{this.state.dislikeCount}</span>
                         </Col>
                        </Row>
                        <div className="likes-bar">
                            <span style={{width: (this.state.likeCount / (this.state.likeCount + this.state.dislikeCount)*100) + '%'}} className="like-bar"></span>
                            <span style={{ width: (this.state.dislikeCount / (this.state.likeCount + this.state.dislikeCount) * 100) + '%'}} className="dislike-bar"></span>
                        </div>
                </Col>
            </Row>
            <hr style={{border: '1px dotted white'}}/>
            <Row>
                <Col>
                    <a>{this.state.poster}</a>
                    <div>{this.state.subCount} Subscribers</div>
                </Col>
                <Col>
                    {this.props.subscribed(this.state.user_id) ? 
                    <Button onClick={() => {this.props.unsubscribe(this.state.user_id); this.setState({subCount: this.state.subCount-1})}}>Subscribed</Button> 
                    : 
                    <Button onClick={() => {this.props.subscribe(this.state.user_id); this.setState({subCount: this.state.subCount+1})}}>Subscribe</Button>}
                </Col>
            </Row>
            <br />
            <p>{this.state.description}</p>
            <br />
            <p>{this.state.genre}</p>
            <hr style={{ border: '1px dotted white' }} />
            <div className='my-4 commentForm'>
                <Form onSubmit={this.commentSubmit}>
                    <Form.Group controlId='commentText'>
                        <Form.Label>New Comment</Form.Label>
                        <Form.Control as='textarea' value={this.state.commentText} onChange={this.onChange} placeholder="Enter comments"/>
                    </Form.Group>
                    <Button variant='secondary' type='submit'>Post Comment</Button>
                </Form>
            </div>
            {
                this.state.comments.map(comment =>
                    <div key={comment.id} className='mt-3 card-footer'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='row'>
                                    <div className='col-md-9'><strong>{comment.user}</strong></div>
                                    <div className='text-right col-md-3'>{moment(comment.created_at).fromNow()}</div>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: sanitizer(comment.content) }}></p>
                            </div>
                        </div>
                    </div>
                )
            }
            </>
        )
    }
}

export default withRouter(ShowPage)

