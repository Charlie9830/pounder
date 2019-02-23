import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectListItem from './ProjectListItem/ProjectListItem';
import InviteListItem from './InviteListItem';
import SwipeableListItem from './SwipeableListItem/SwipeableListItem';
import AddNewProjectButton from './AddNewProjectButton';

import { withTheme, ListSubheader, Divider, Fab, Zoom, Typography, Toolbar, IconButton, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    acceptProjectInviteAsync, denyProjectInviteAsync, addNewProjectAsync,
    setIsAppSettingsOpen, selectProject, openShareMenu, removeProjectAsync,
} from 'handball-libs/libs/pounder-redux/action-creators';

import TransitionList from './TransitionList/TransitionList';
import ListItemTransition from './TransitionList/ListItemTransition';
import SettingsIcon from '@material-ui/icons/Settings';
import AppDrawerHeader from './AppDrawerHeader';

let styles = theme => {
    return {
        appDrawer: {
            height: '100%',
            width: '100%',
            background: theme.palette.background.paper,
        }
    }
};

class AppDrawer extends Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.projectMapper = this.projectMapper.bind(this);
        this.getInvitesJSX = this.getInvitesJSX.bind(this);
        this.handleProjectActionClick = this.handleProjectActionClick.bind(this);
    }

    render() {
        let { classes } = this.props;

        return (
            <div className={classes['appDrawer']}>

                <AppDrawerHeader
                displayName={this.props.displayName}
                onSettingsButtonClick={() => {this.props.dispatch(setIsAppSettingsOpen(true))}}
                onAddProjectButtonClick={ () => {this.props.dispatch(addNewProjectAsync())}}
                />
                
                <TransitionList >
                    {/* Invites  */}
                    {this.getInvitesSubheading(this.props.invites.length > 0)}
                    {this.props.invites.length > 0 && this.getInvitesJSX()}

                    {/* Local Projects  */}
                    {this.getLocalProjectsSubheading(this.props.localProjects.length > 0)}
                    {this.props.localProjects.length > 0 && this.getLocalProjectsSubheading() && this.projectMapper(this.props.localProjects)}

                    {/* Remote Projects  */}
                    {this.getRemoteProjectsSubheading(this.props.remoteProjects.length > 0)}
                    {this.props.remoteProjects.length > 0 && this.getRemoteProjectsSubheading() && this.projectMapper(this.props.remoteProjects)}
                </TransitionList>
            </div>
        );
    }

    getInvitesSubheading(show) {
        if (show === false) {
            return null;
        }

        return [
            <ListItemTransition
                key="invites">
                <ListSubheader key="invites"> Invites </ListSubheader>,
            <Divider key="invitesdivider" />
            </ListItemTransition>
        ]
    }

    getLocalProjectsSubheading(show) {
        if (show === false) {
            return null;
        }

        return [
            <ListItemTransition
                key="localprojects">
                <ListSubheader key="localprojects"> Personal Projects </ListSubheader>,
            <Divider key="localprojectsdivider" />
            </ListItemTransition>
        ]
    }

    getRemoteProjectsSubheading(show) {
        if (show === false) {
            return null;
        }

        return [
            <ListItemTransition
                key="remoteprojects">
                <ListSubheader> Shared Projects </ListSubheader>,
            <Divider />
            </ListItemTransition>

        ]
    }

    getInvitesJSX() {
        let jsx = this.props.invites.map(item => {
            return (
                <ListItemTransition
                    key={item.projectId}>
                    <InviteListItem
                        sourceEmail={item.sourceEmail}
                        projectName={item.projectName}
                        onAccept={() => { this.props.dispatch(acceptProjectInviteAsync(item.projectId)) }}
                        onDeny={() => { this.props.dispatch(denyProjectInviteAsync(item.projectId)) }}
                        isUpdating={this.props.updatingInviteIds.includes(item.projectId)}
                    />
                </ListItemTransition>
            )
        })

        return jsx;
    }

    projectMapper(projects) {
        let favouriteProjectId = this.props.accountConfig.favouriteProjectId === undefined ? '-1' : this.props.accountConfig.favouriteProjectId;
        let jsx = projects.map(item => {
            let leftActions = [{ value: 'share', background: this.props.theme.palette.primary.main, icon: <ShareIcon /> }];
            let rightActions = [{ value: 'delete', background: this.props.theme.palette.error.dark, icon: <DeleteIcon /> }]

            return (
                <ListItemTransition
                    key={item.uid}>
                        <ProjectListItem
                            onClick={() => { this.props.dispatch(selectProject(item.uid)) }}
                            name={item.projectName}
                            isFavourite={favouriteProjectId === item.uid}
                            isSelected={this.props.selectedProjectId === item.uid}
                            indicators={this.props.projectSelectorIndicators[item.uid]}
                            onDeleteButtonClick={() => { this.props.dispatch(removeProjectAsync(item.uid)) }}
                        />
                </ListItemTransition>
            )
        })

        return jsx;
    }

    handleProjectActionClick(uid, action) {
        if (action === 'share') {
            this.props.dispatch(openShareMenu(uid));
        }

        if (action === 'delete') {
            this.props.dispatch(removeProjectAsync(uid));
        }
    }
}


let mapStateToProps = (state) => {
    return {
        localProjects: state.localProjects,
        remoteProjects: state.remoteProjects,
        invites: state.invites,
        projectSelectorIndicators: state.projectSelectorIndicators,
        generalConfig: state.generalConfig,
        accountConfig: state.accountConfig,
        selectedProjectId: state.selectedProjectId,
        updatingInviteIds: state.updatingInviteIds,
        isASnackbarOpen: state.isASnackbarOpen,
        enableStates: state.enableStates,
        displayName: state.displayName,
        userEmail: state.userEmail,
    }
}

let VisibleAppDrawer = connect(mapStateToProps)(withStyles(styles)(withTheme()(AppDrawer)));

export default VisibleAppDrawer;