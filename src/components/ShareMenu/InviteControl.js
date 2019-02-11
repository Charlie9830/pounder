import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';

class InviteControl extends Component {
    constructor(props) {
        super(props);
        
        // State.
        this.state = {
            isValid: false,
        }

        // Refs.
        this.emailInputRef = React.createRef();

        // Method Bindings.
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    
    render() {
        return (
            <React.Fragment>
                <TextField
                    autoFocus={this.props.autoFocus}
                    placeholder="Email address"
                    inputRef={this.emailInputRef}
                    onKeyUp={this.handleKeyPress} />
                <Button
                    style={{ marginTop: '16px' }}
                    variant="contained"
                    onClick={() => { this.props.onInvite(this.emailInputRef.current.value)}}
                    disabled={!this.state.isValid}>
                    Invite
         </Button>
            </React.Fragment>
        )
    }

    handleKeyPress(e) {
        let value = e.target.value;

        if (e.key === "Enter") {
            if (this.isValid(value)) {
                this.props.onInvite(this.emailInputRef.current.value);
                return;
            }
        }

        this.setState({isValid: this.isValid(value)});
    }

    isValid(value) {
        if (value === undefined) {
            return false;
        }

        return value.trim() !== '';
    }
};

export default InviteControl;