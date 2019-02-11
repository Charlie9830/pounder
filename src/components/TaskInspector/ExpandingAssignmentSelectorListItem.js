import React, { Component } from 'react';
import { ListItem, ListItemIcon } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import ExpandingAssignmentSelector from './ExpandingAssignmentSelector';

class ExpandingAssignmentSelectorListItem extends Component {
    constructor(props) {
        super(props);
        
        // State.
        this.state = {
            isInputOpen: false,
        }

        // Method Bindings.
        this.handleChange = this.handleChange.bind(this);
    }
    
    render() {
        return (
            <ListItem onClick={() => { this.setState({ isInputOpen: true }) }}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ExpandingAssignmentSelector
                isOpen={this.state.isInputOpen}
                placeholder="Assign to someone"
                value={this.props.value}
                members={this.props.members}
                onChange={this.handleChange}
                onClose={() => { this.setState({ isInputOpen: false })}}
                />

            </ListItem>
        );
    }

    handleChange(newValue) {
        this.setState({ isInputOpen: false });
        this.props.onChange(newValue);
    }
}

export default ExpandingAssignmentSelectorListItem;