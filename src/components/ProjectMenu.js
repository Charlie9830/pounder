import React, { Component } from 'react';
import { IconButton, Menu, MenuItem, Typography, Switch, Divider, ListItemIcon } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MoreVert';

import DeleteIcon from '@material-ui/icons/Delete';

class ProjectMenu extends Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isOpen: false,
        }

        // Refs.
        this.anchorRef = React.createRef();

        // Method Bindings.
        this.handleMenuSelection = this.handleMenuSelection.bind(this);
        this.handleLayoutTypeChange = this.handleLayoutTypeChange.bind(this);
    }

    render() {
        let completedTasksText = this.props.showCompletedTasks ? 'Hide completed tasks' : 'Show completed tasks';

        let layoutTypeSelector = (
            <MenuItem>
                <Typography> Use my own Layout </Typography>
                <Switch checked={this.props.projectLayoutType === 'local'}
                    onChange={this.handleLayoutTypeChange} />
            </MenuItem>
        )

        let showOnlySelfTasksSelector = (
            <MenuItem
                disabled={!this.props.projectActionsEnabled}
                onClick={() => { this.handleMenuSelection('assignedTasks') }}>
                <Typography> Show only my tasks </Typography>
                <Switch checked={this.props.showOnlySelfTasks} />
            </MenuItem>
        )

        return (
            <React.Fragment>
                <IconButton
                    onClick={() => { this.setState({ isOpen: true }) }}
                    buttonRef={this.anchorRef}>
                    <MenuIcon />
                </IconButton>

                <Menu
                    open={this.state.isOpen}
                    anchorEl={this.anchorRef.current}
                    onClose={() => { this.setState({ isOpen: false }) }}>
                    <MenuItem
                        disabled={!this.props.canUndo}
                        onClick={() => { this.handleMenuSelection('undo') }}>
                        Undo {this.props.undoButtonText}
                    </MenuItem>


                    <MenuItem
                        disabled={!this.props.projectActionsEnabled}
                        onClick={() => { this.handleMenuSelection('share') }}>
                        Share
                     </MenuItem>

                    <MenuItem
                        disabled={!this.props.projectActionsEnabled}
                        onClick={() => { this.handleMenuSelection('completedTasks') }}>
                        {completedTasksText}
                    </MenuItem>

                    {this.props.allowShowOnlySelfTasks && showOnlySelfTasksSelector}                    

                    {this.props.showProjectLayoutTypeSelector && layoutTypeSelector}


                    <MenuItem
                        disabled={!this.props.projectActionsEnabled}
                        onClick={() => { this.handleMenuSelection('renameProject') }}>
                        Rename project
                     </MenuItem>

                    <Divider />

                    <MenuItem
                        disabled={!this.props.projectActionsEnabled}
                        onClick={() => { this.handleMenuSelection('deleteProject') }}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        Delete Project
                    </MenuItem>
                </Menu>
            </React.Fragment>
        );
    }

    handleLayoutTypeChange(e) {
        let value = e.target.checked;
        let type = value === true ? 'local' : 'global';
        this.props.onLayoutTypeChange(type);
    }

    handleMenuSelection(selection) {
        this.setState({ isOpen: false });

        if (selection === 'share') {
            this.props.onShareMenuButtonClick();
        }

        if (selection === 'assignedTasks') {
            this.props.onShowOnlySelfTasksButtonClick(this.props.showOnlySelfTasks);
        }

        if (selection === 'completedTasks') {
            this.props.onCompletedTasksButtonClick(this.props.showCompletedTasks);
        }

        if (selection === 'renameProject') {
            this.props.onRenameProjectButtonClick();
        }

        if (selection === 'deleteProject') {
            this.props.onDeleteProjectButtonClick();
        }

        if (selection === 'undo') {
            this.props.onUndoButtonClick();
        }
    }
}

export default ProjectMenu;
