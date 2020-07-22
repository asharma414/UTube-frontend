import React, { Component } from 'react'
import { Form, Button, ProgressBar } from 'react-bootstrap'
import ActiveStorageProvider from 'react-activestorage-provider'
import axios from 'axios'


export default class Uploader extends Component {

    state = {
        clip: null,
        clipName: '',
        title: '',
        description: '',
        thumbnail: null,
        thumbnailName: '',
        private: false,
        uploadPercentage: 0
    }

    onChange = e => {
        if (e.target.id === 'clip' || e.target.id === 'thumbnail') {
            this.setState({[e.target.id]: e.target.files[0], [e.target.id + 'Name']: e.target.files[0].name})
        } else if (e.target.id === 'private') {
            this.setState({[e.target.id]: !this.state.private})
        } else {
            this.setState({[e.target.id]: e.target.value})
        }
    }

    onSubmit = async e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('video[title]', this.state.title)
        formData.append('video[description]', this.state.description)
        formData.append('video[user_id]', this.props.currentUser.id)
        formData.append('video[public]', this.state.private)
        formData.append('video[clip]', this.state.clip)
        formData.append('video[thumbnail]', this.state.thumbnail)
        const res = await axios.post('http://localhost:3000/videos', formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                this.setState({uploadPercentage: parseInt(Math.round(progressEvent.loaded * 100) / progressEvent.total)})
            }
        })
        this.setState({clip: null, clipName: '', title: '', description: '', thumbnail: null, thumbnailName: null, private: false, uploadPercentage: 0})
        alert('Your video has been uploaded!')
    }

    render() {
        return (

            <div className='container'>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={this.state.title} onChange={this.onChange} type='text' />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control value={this.state.description} onChange={this.onChange} as="textarea" rows="3" />
                    </Form.Group>
                    <Form.Group controlId='clip'>
                        <Form.Label>Choose Video</Form.Label>
                        <Form.Control type='file' onChange={this.onChange} />
                    </Form.Group>
                    <Form.Group controlId='thumbnail'>
                        <Form.Label>Choose Thumbnail</Form.Label>
                        <Form.Control type='file' onChange={this.onChange} />
                    </Form.Group>
                    <Form.Group controlId="private">
                        <Form.Check checked={this.state.private} onChange={this.onChange} type="checkbox" label="Private" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Upload</Button>
                </Form>
                <br />
                <ProgressBar animated now={this.state.uploadPercentage} />
            </div>
        )
    }
}



//          <ActiveStorageProvider
            //     endpoint={{
            //         path: '/videos',
            //         model: 'Video',
            //         attribute: 'clip',
            //         method: 'PUT',
            //     }}
            //     onSubmit={video => this.setState({ video: video })}
            //     render={({ handleUpload, uploads, ready }) => (
            //         <div>
            //             <input
            //                 type="file"
            //                 disabled={!ready}
            //                 onChange={e => handleUpload(e.currentTarget.files)}
            //             />

            //             {uploads.map(upload => {
            //                 switch (upload.state) {
            //                     case 'waiting':
            //                         return <p key={upload.id}>Waiting to upload {upload.file.name}</p>
            //                     case 'uploading':
            //                         return (
            //                             <p key={upload.id}>
            //                                 Uploading {upload.file.name}: {upload.progress}%
            //                             </p>
            //                         )
            //                     case 'error':
            //                         return (
            //                             <p key={upload.id}>
            //                                 Error uploading {upload.file.name}: {upload.error}
            //                             </p>
            //                         )
            //                     case 'finished':
            //                         return (
            //                             <p key={upload.id}>Finished uploading {upload.file.name}</p>
            //                         )
            //                 }
            //             })}
            //         </div>
            //     )}
            // />