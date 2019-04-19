import React, { Component } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, ListItemSecondaryAction, ListItemIcon, Typography, ListSubheader, Divider, CircularProgress } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';

let SyncMenuItem = (props) => {
    return (
        <MenuItem>
            <ListItemText primary={props.text} />
            <div style={{ width: '32px' }} />
            <ListItemIcon>
                {props.isSynced ? <DoneIcon /> : <CircularProgress size={20}/> }
            </ListItemIcon>

        </MenuItem>
    )
}

class SyncMenu extends Component {
    constructor(props) {
        super(props);

        // Refs.
        this.buttonRef = React.createRef();

        // State
        this.state = {
            isOpen: false,
        }
    }

    render() {
        // console.log(this.props.projectsHavePendingWrites);
        // console.log(this.props.projectLayoutsHavePendingWrites);
        // console.log(this.props.taskListsHavePendingWrites);
        // console.log(this.props.tasksHavePendingWrites);



        let everythingSynced = !this.props.projectsHavePendingWrites &&
            !this.props.projectLayoutsHavePendingWrites &&
            !this.props.taskListsHavePendingWrites &&
            !this.props.tasksHavePendingWrites

        let statusText = everythingSynced ? 'Everything is synced' : 'Syncing';

        return (
            <React.Fragment>
                <IconButton
                    buttonRef={this.buttonRef}
                    onClick={() => { this.setState({ isOpen: true }) }}>
                    <SyncIcon
                        fontSize="small"
                        color={everythingSynced === true ? 'action' : 'secondary'} />
                </IconButton>

                <Menu
                    anchorEl={this.buttonRef.current}
                    open={this.state.isOpen}
                    onClose={() => { this.setState({ isOpen: false }) }}>

                    <ListSubheader> {statusText} </ListSubheader>
                    <Divider />

                    <SyncMenuItem
                        text="Projects"
                        isSynced={!this.props.projectsHavePendingWrites}
                    />

                    <SyncMenuItem
                        text="Layout"
                        isSynced={!this.props.projectLayoutsHavePendingWrites}
                    />

                    <SyncMenuItem
                        text="Lists"
                        isSynced={!this.props.taskListsHavePendingWrites}
                    />

                    <SyncMenuItem
                        text="Tasks"
                        isSynced={!this.props.tasksHavePendingWrites}
                    />
                </Menu>
            </React.Fragment>
        );
    }
}

let mapStateToProps = state => {
    return {
        projectsHavePendingWrites: state.projectsHavePendingWrites,
        projectLayoutsHavePendingWrites: state.projectLayoutsHavePendingWrites,
        taskListsHavePendingWrites: state.taskListsHavePendingWrites,
        tasksHavePendingWrites: state.tasksHavePendingWrites,
    }
}

let VisibleSyncMenu = connect(mapStateToProps)(SyncMenu);

export default VisibleSyncMenu;