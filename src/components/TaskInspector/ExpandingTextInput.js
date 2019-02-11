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
        this.anchorRef = React.createRef();

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
        
        return (
            <React.Fragment>
                <div ref={this.anchorRef}>
                    <Typography
                        style={{ width: '100%', minHeight: '1em' }}
                        color={typographyColor}
                        onClick={() => { this.setState({ isOpen: true }) }}>
                        {closedValue}
                    </Typography>
                </div>
                    
                <Expander
                    anchorEl={this.anchorRef.current}
                    open={isExpanded}
                    onClose={this.handleInputBlur}>
                    <TextField
                        variant="outlined"
                        inputRef={this.inputRef}
                        autoFocus
                        style={textFieldStyle}
                        multiline
                        defaultValue={this.props.value}
                        onBlur={this.handleInputBlur} />
                </Expander>
               
                    
                
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