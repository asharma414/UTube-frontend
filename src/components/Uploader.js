import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component';

export default class Uploader extends Component {
    render() {
        var componentConfig = { postUrl: 'no-url' };
        var djsConfig = { autoProcessQueue: false }
        var eventHandlers = { addedfile: (file) => console.log(file) }
        return (
            <DropzoneComponent config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig} />
        )
    }
}
