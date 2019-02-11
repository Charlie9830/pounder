import React, { Component } from 'react';
import ExpandingTextInput from './ExpandingTextInput';
import { ListItem, ListItemIcon } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

class ExpandingNoteInputListItem extends Component {
    constructor(props) {
        super(props);
        
        // State.
        this.state = {
            isInputOpen: false,
        }

        // Method Bindings.
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    render() {
        return (
            <ListItem onClick={() => { this.setState({ isInputOpen: true }) }}>
                <ListItemIcon>
                    <EditIcon />
                </ListItemIcon>
                <ExpandingTextInput
                    isOpen={this.state.isInputOpen}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={this.handleInputChange} />

            </ListItem>
        );
    }

    handleInputChange(newValue) {
        this.setState({ isInputOpen: false });
        this.props.onChange(newValue);
    }
}

export default ExpandingNoteInputListItem;