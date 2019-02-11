import React, { Component } from 'react';
import { Typography, TextField } from '@material-ui/core';

class EditableTextInput extends Component {
    constructor(props) {
        super(props);

        // Refs.
        this.textInputRef = React.createRef();
            
        // State.
        this.state = {
            isInputOpen: false,
        }

        // Method Bindings.
        this.handleInputAccept = this.handleInputAccept.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        let isInputOpen = this.props.isInputOpen === undefined ? this.state.isInputOpen : this.props.isInputOpen;
        let variant = this.props.typographyVariant === undefined ? 'body1' : this.props.typographyVariant;

        if (isInputOpen === true) {
            return (
                <TextField
                style={{width: '100%', lineHeight: '1.5'}}
                multiline
                autoFocus
                inputRef={this.textInputRef}
                defaultValue={this.props.defaultValue}
                onKeyDown={(e) => { if (e.key === "Enter") { this.handleInputAccept() }}}
                onBlur={this.handleInputAccept}/>
            );
        }

        else {
            return (
                    <Typography
                    variant={variant}
                    onClick={this.handleClick}>
                        { this.props.defaultValue }
                    </Typography>
            );
        }
    }

    handleClick() {
        if (this.props.isInputOpen === undefined) {
            // Uncontrolled mode.
            this.setState({ isInputOpen: true });
        }
    }

    handleInputAccept() {
        let value = this.textInputRef.current.value;

        if (this.props.isOpen === undefined) {
            // Uncontrolled mode.
            this.setState({ isInputOpen: false});
        }

        this.props.onChange(value);
    }
}

export default EditableTextInput;