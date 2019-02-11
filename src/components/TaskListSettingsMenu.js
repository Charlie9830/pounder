import React, { Component } from 'react';
import { Menu, IconButton, ListSubheader, MenuItem, Divider, ListItemIcon } from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

class TaskListSettingsMenu extends Component {
    constructor(props) {
        super(props);

        // Refs.
        this.anchorRef = React.createRef();

        // Method Bindings.
        this.handleSortingItemClick = this.handleSortingItemClick.bind(this);
    }

    render() {
        let { sortBy } = this.props.settings;

        return (
            <React.Fragment>
                <IconButton
                onClick={this.props.onOpen}
                buttonRef={this.anchorRef}>
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                open={this.props.isOpen}
                onBackdropClick={this.props.onClose}
                anchorEl={this.anchorRef.current}
                transformOrigin={{horizontal: 'left', vertical: 'top'}}>
                    <ListSubheader> Sorting </ListSubheader>
                    <Divider />
                    <MenuItem
                        selected={sortBy === 'completed'}
                        onClick={() => { this.handleSortingItemClick('completed') }}>
                        Completed
                    </MenuItem>
                    <MenuItem
                        selected={sortBy === 'priority'}
                        onClick={() => { this.handleSortingItemClick('priority') }}>
                        Priority
                     </MenuItem>
                    <MenuItem
                    selected={sortBy === 'due date'}
                        onClick={() => { this.handleSortingItemClick('due date') }}>
                        Due Date
                     </MenuItem>
                    <MenuItem
                    selected={sortBy === 'date added'}
                        onClick={() => { this.handleSortingItemClick('date added') }}>
                        Date Added
                     </MenuItem>
                    <MenuItem
                    selected={sortBy === 'assignee'}
                        onClick={() => { this.handleSortingItemClick('assignee') }}>
                        Assignee
                     </MenuItem>
                    <MenuItem
                    selected={sortBy === 'alphabetical'}
                        onClick={() => { this.handleSortingItemClick('alphabetical') }}>
                        Alphabetically
                    </MenuItem>

                    <Divider />
                    <MenuItem
                        onClick={this.props.onRenameButtonClick}>
                        Rename List
                      </MenuItem>
                    <MenuItem
                        onClick={this.props.onChecklistSettingsButtonClick}>
                        Checklist Settings
                     </MenuItem>

                    <MenuItem
                    onClick={this.props.onMoveTaskListButtonClick}>
                        <ListItemIcon>
                            <ArrowForwardIcon/>
                        </ListItemIcon>
                        Move to project
                    </MenuItem>

                    <Divider/>

                    <MenuItem
                        onClick={this.props.onDeleteButtonClick}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        Delete List
                    </MenuItem>
                </Menu>
            </React.Fragment>
        );
    }

    handleSortingItemClick(value) {
        let settings = {...this.props.settings};
        settings.sortBy = value;

        this.props.onSettingsChanged(settings);
    }
}

export default TaskListSettingsMenu;