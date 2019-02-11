import React from 'react';
import { connect } from 'react-redux';
import {
    inviteUserToProjectAsync, kickUserFromProjectAsync, updateMemberRoleAsync, closeShareMenu,
    removeRemoteProjectAsync, migrateProjectBackToLocalAsync, leaveRemoteProjectAsync
} from 'handball-libs/libs/pounder-redux/action-creators';
import { getUserUid } from 'handball-libs/libs/pounder-firebase';
import { GetProjectMembers } from 'handball-libs/libs/pounder-utilities';
import WaitingOverlay from './WaitingOverlay';


import {
    Toolbar, IconButton, ListSubheader, Paper, Divider, Typography
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import FullScreenView from '../../layout-components/FullScreenView';
import ActionButton from './ActionButton';
import MemberListItem from './MemberListItem';
import InviteControl from './InviteControl';
import TransitionList from '../TransitionList/TransitionList';
import ListItemTransition from '../TransitionList/ListItemTransition';


let simpleGrid = {
    display: 'grid',
    width: '100%',
    height: '100%',
    gridTemplateRows: '[Toolbar]56px [Icon]auto [Content]1fr',
}

let simpleContentContainer = {
    gridRow: 'Content',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}


let grid = {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '[Toolbar]56px [Invite]1fr [Members]3fr [Actions]auto'
}

let inviteContainer = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}

let actionsContainer = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
}

let paperStyle = {
    margin: '0px 8px 8px 8px',
    padding: '8px',
}


class ShareMenu extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.emailInputRef = React.createRef();

        // Method Bindings.
        this.getProjectName = this.getProjectName.bind(this);
        this.getMembersJSX = this.getMembersJSX.bind(this);
        this.isCurrentUserAnOwner = this.isCurrentUserAnOwner.bind(this);
        this.isUserAlreadyAMember = this.isUserAlreadyAMember.bind(this);
        this.getIsMemberUpdating = this.getIsMemberUpdating.bind(this);
        this.handleEmailInputKeyPress = this.handleEmailInputKeyPress.bind(this);
        this.handleInviteButtonClick = this.handleInviteButtonClick.bind(this);
        this.handleInviteButtonClick = this.handleInviteButtonClick.bind(this);
        this.handleDeleteProjectButtonClick = this.handleDeleteProjectButtonClick.bind(this);
        this.handleLeaveProjectButtonClick = this.handleLeaveProjectButtonClick.bind(this);
        this.handleMakePersonalButtonClick = this.handleMakePersonalButtonClick.bind(this);
        this.getMembersJSX = this.getMembersJSX.bind(this);
    }

    render() {
        let filteredMembers = GetProjectMembers(this.props.members, this.props.openShareMenuId);
        let toolbarJSX = (
            <Toolbar
                disableGutters={true}>
                <IconButton
                    onClick={() => { this.props.dispatch(closeShareMenu()) }}>
                    <ArrowBackIcon />
                </IconButton>
            </Toolbar>
        )

        let waitingOverlayJSX = (
            <WaitingOverlay open={this.props.isShareMenuWaiting} message={this.props.shareMenuMessage}
            subMessage={this.props.shareMenuSubMessage} />
        )

        // Inviting first User
        if (filteredMembers.length === 0 && this.props.isShareMenuWaiting === true) {
            return (
                <FullScreenView>
                    { toolbarJSX }
                    { waitingOverlayJSX }
                </FullScreenView>
            )
        }

        // New Users invited yet.
        if (filteredMembers.length === 0) {
            return (
                <FullScreenView>
                    <div style={simpleGrid}>
                        <div style={{ gridRow: 'Toolbar' }}>
                            {toolbarJSX}
                        </div>

                        <div style={simpleContentContainer}>
                            <Typography 
                            variant='subtitle1'
                            style={{marginBottom: '16px'}}
                            align='center'>
                                Add collaborators to your project and start Handballing jobs to eachother!
                            </Typography>
                            <Typography
                            style={{marginBottom: '24px'}}
                            align='center'
                            color="textSecondary">
                                Enter the email they used to sign up with below.
                            </Typography>
                            
                            <InviteControl
                            autoFocus={true}
                            onInvite={(email) => { this.props.dispatch(inviteUserToProjectAsync(email, this.props.openShareMenuId)) }} />

                        </div>
                    </div>
                </FullScreenView>
            )
        }

        // Existing members already.
        return (
            <FullScreenView>
                <div style={grid}>
                    <div style={{ gridRow: 'Toolbar' }}>
                        {toolbarJSX}
                    </div>

                    <div style={{ gridRow: 'Invite' }}>
                        <div style={inviteContainer}>

                            <InviteControl
                                onInvite={(email) => { this.props.dispatch(inviteUserToProjectAsync(email, this.props.openShareMenuId)) }} />

                        </div>
                    </div>

                    <Paper
                        style={{ ...paperStyle, gridRow: 'Members', overflowY: 'scroll' }}>
                        <TransitionList style={{ padding: '8px 0px 8px 0px' }}>
                            <ListItemTransition
                            key="ownersheader">
                                <ListSubheader disableSticky={true}> Owners </ListSubheader>
                            </ListItemTransition>
                            <ListItemTransition
                            key="ownersdivider">
                                <Divider />
                            </ListItemTransition>
                            
                            {this.getMembersJSX(filteredMembers, 'owner')}

                            <ListItemTransition
                            key="memebersheader">
                                <ListSubheader disableSticky={true}> Members </ListSubheader>
                            </ListItemTransition>
                            <ListItemTransition
                            key="membersdivider">
                                <Divider />
                            </ListItemTransition>
                            
                            {this.getMembersJSX(filteredMembers, 'member')}
                        </TransitionList>
                    </Paper>

                    <div style={{ gridRow: 'Actions' }}>
                        <Paper style={paperStyle}>
                            <div style={actionsContainer}>
                                <ActionButton
                                    onClick={() => { this.handleLeaveProjectButtonClick(filteredMembers) }}>
                                    Leave
                        </ActionButton>

                                <ActionButton
                                    disabled={!this.isCurrentUserAnOwner(filteredMembers)}
                                    onClick={() => { this.handleMakePersonalButtonClick(filteredMembers) }}>
                                    Make Personal
                        </ActionButton>

                                <ActionButton
                                    color="secondary"
                                    disabled={!this.isCurrentUserAnOwner(filteredMembers)}
                                    onClick={() => { this.handleDeleteProjectButtonClick(filteredMembers) }}>
                                    Delete
                        </ActionButton>
                            </div>
                        </Paper>
                    </div>
                </div>

                {waitingOverlayJSX}

            </FullScreenView>
        )
    }

    handleMakePersonalButtonClick(filteredMembers) {
        if (this.isCurrentUserAnOwner(filteredMembers)) {
            this.props.dispatch(migrateProjectBackToLocalAsync(this.props.openShareMenuId));
        }
    }

    handleLeaveProjectButtonClick(filteredMembers) {
        this.props.dispatch(leaveRemoteProjectAsync(this.props.openShareMenuId, getUserUid()));
    }

    handleDeleteProjectButtonClick(filteredMembers) {
        this.props.dispatch(removeRemoteProjectAsync(this.props.openShareMenuId, this.isCurrentUserAnOwner(filteredMembers)))
    }

    handleInviteButtonClick() {
        this.props.dispatch(inviteUserToProjectAsync(this.emailInputRef.current.value));
    }

    handleEmailInputKeyPress(e) {
        if (e.key === "Enter") {
            this.props.dispatch(inviteUserToProjectAsync(this.emailInputRef.current.value));
        }
    }

    getMembersJSX(filteredMembers, role) {
        var membersJSX = [];

        if (this.props.openShareMenuId !== -1) {
            var isCurrentUserOwner = this.isCurrentUserAnOwner(filteredMembers);

            var roledMembers = filteredMembers.filter(item => {
                return item.role === role;
            })

            membersJSX = roledMembers.map(item => {
                var isUpdating = this.getIsMemberUpdating(item.userId, this.props.openShareMenuId);

                return (
                    <ListItemTransition
                    key={item.userId}>
                        <MemberListItem
                            isUpdating={isUpdating}
                            status={item.status}
                            displayName={item.displayName}
                            email={item.email}
                            role={item.role}
                            allowElevatedPrivileges={isCurrentUserOwner}
                            canBeDemoted={!this.isCurrentUserTheOnlyOwner(filteredMembers)}
                            canBeKicked={isCurrentUserOwner && item.userId !== getUserUid()}
                            onKick={() => { this.props.dispatch(kickUserFromProjectAsync(this.props.openShareMenuId, item.userId)) }}
                            onPromote={() => { this.props.dispatch(updateMemberRoleAsync(item.userId, this.props.openShareMenuId, 'owner')) }}
                            onDemote={() => { this.props.dispatch(updateMemberRoleAsync(item.userId, this.props.openShareMenuId, 'member')) }}
                        />
                    </ListItemTransition>
                )
            })

            return membersJSX;
        }
    }

    getIsMemberUpdating(userId, projectId) {
        return this.props.updatingUserIds.some(item => {
            return item.userId === userId && item.projectId === projectId;
        })
    }

    isCurrentUserTheOnlyOwner(filteredMembers) {
        if (this.isCurrentUserAnOwner(filteredMembers)) {
            var ownersOnly = filteredMembers.filter(item => {
                return item.role === 'owner';
            })

            return ownersOnly.length === 1;
        }
    }

    isCurrentUserAnOwner(filteredMembers) {
        var currentUserUid = getUserUid();
        var member = filteredMembers.find(item => {
            return item.userId === currentUserUid;
        })

        if (member) {
            return member.role === 'owner';
        }

        else {
            return false;
        }
    }

    isUserAlreadyAMember(email) {
        var index = this.getFilteredMembers().findIndex(item => {
            return item.email === email;
        })

        return index !== -1;
    }

    parseStatusIntoKickButtonText(status) {
        switch (status) {
            case 'pending':
                return 'Revoke';

            case 'added':
                return 'Kick';

            case 'rejected invite':
                return 'Revoke';

            default:
                return '';
        }
    }

    getProjectName() {
        if (this.props.openShareMenuId !== -1) {
            var selectedProject = this.props.projects.find(item => {
                return item.uid === this.props.openShareMenuId
            })

            if (selectedProject !== undefined) {
                return selectedProject.projectName;
            }
        }
    }

    toTitleCase(str) {
        str = str.toLowerCase()
            .split(' ')
            .map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            });

        return str.join(' ');
    }
}

let mapStateToProps = state => {
    return {
        openShareMenuId: state.openShareMenuId,
        shareMenuMessage: state.shareMenuMessage,
        shareMenuSubMessage: state.shareMenuSubMessage,
        isShareMenuWaiting: state.isShareMenuWaiting,
        projects: state.projects,
        members: state.members,
        userEmail: state.userEmail,
        displayName: state.displayName,
        updatingUserIds: state.updatingUserIds,
        generalConfig: state.generalConfig,
    }
}

let VisibleShareMenu = connect(mapStateToProps)(ShareMenu);
export default VisibleShareMenu;