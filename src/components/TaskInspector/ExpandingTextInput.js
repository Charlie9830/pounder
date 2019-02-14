import React, { Component } from 'react';
import { Typography, TextField } from '@material-ui/core';
import Expander from '../Expander';

let textFieldStyle = {
    width: '100%',
    maxHeight: '100%',
    padding: '8px',
    overflowY: 'scroll'
}

class ExpandingTextInput extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.inputRef = React.createRef();

        // State.
        this.state = {
            isOpen: false,
        }

        // Method Bindings.
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    render() {
        // Controlled or Uncontrolled Mode.
        let isExpanded = this.props.isOpen === undefined ? this.state.isOpen : this.props.isOpen

        let hasValue = this.props.value !== undefined && this.props.value.trim() !== "";
        let closedValue = hasValue ?  this.props.value : this.props.placeholder || "";
        let typographyColor = hasValue ? "textPrimary" : "textSecondary";
        
        let closedComponent = (
                <Typography
                    style={{ width: '100%', minHeight: '1em' }}
                    color={typographyColor}
                    onClick={() => { this.setState({ isOpen: true }) }}>
                    {closedValue}
                </Typography>
        )

        let openComponent = (
            <TextField
                variant="outlined"
                inputRef={this.inputRef}
                autoFocus
                style={textFieldStyle}
                multiline
                defaultValue={this.props.value}
                onBlur={this.handleInputBlur} />
        )

        return (
            <React.Fragment>    
                <Expander
                    open={isExpanded}
                    onClose={this.handleInputBlur}
                    openComponent={openComponent}
                    closedComponent={closedComponent}/>
            </React.Fragment>
        );
    }

    handleInputBlur() {
        this.props.onChange(this.inputRef.current.value);

        if (this.props.isExpanded === undefined) {
            // Uncontrolled Mode.
            this.setState({ isOpen: false });
        }
        
    }
}

export default ExpandingTextInput;