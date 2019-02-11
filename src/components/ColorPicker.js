import React from 'react';
import { IconButton } from '@material-ui/core';
import ColorChit from './AppSettingsMenu/ColorChit';

let nativeColorInputStyle = {
    visibility: 'hidden', // Dont use display: none. Doing so will stop the onChange event from firing.
    width: '0px',
    height: '0px',
}

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.nativeColorInputRef = React.createRef();
    }

    render() {
        return (
            <React.Fragment>
                <input ref={this.nativeColorInputRef} style={nativeColorInputStyle} type="color"
                    value={this.props.value} onChange={(e) => { this.props.onChange(e.target.value) }} />

                <IconButton
                    onClick={() => { this.nativeColorInputRef.current.click() }}>
                    <ColorChit
                    color={this.props.value}
                    />
                </IconButton>
            </React.Fragment>
        )
    }
}

export default ColorPicker;