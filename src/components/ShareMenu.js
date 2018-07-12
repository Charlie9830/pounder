import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Button from './Button';
import MenuSubtitle from './MenuSubtitle';
import Spinner from './Spinner';
import CenteringContainer from '../containers/CenteringContainer';
import '../assets/css/ShareMenu.css';
import { inviteUserToProjectAsync, kickUserFromProjectAsync, updateMemberRoleAsync, setMessageBox, setIsShareMenuOpen,
removeRemoteProjectAsync, migrateProjectBackToLocalAsync } from 'pounder-redux/action-creators';
import { MessageBoxTypes } from 'pounder-redux';
import { getUserUid } from 'pounder-firebase';

class ShareMenu extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.emailInputRef = React.createRef();
        this.roleSelectRef = React.createRef();

        // Method Bindings.
        this.getProjectName = this.getProjectName.bind(this);
        this.getMembersJSX = this.getMembersJSX.bind(this);
        this.getRoleButtonJSX = this.getRoleButtonJSX.bind(this);
        this.getKickButtonJSX = this.getKickButtonJSX.bind(this);
        this.handleRoleButtonClick = this.handleRoleButtonClick.bind(this);
        this.handleKickButtonClick = this.handleKickButtonClick.bind(this);
        this.handleInviteButtonClick = this.handleInviteButtonClick.bind(this);
        this.getFilteredMembers = this.getFilteredMembers.bind(this);
        this.isCurrentUserAnOwner = this.isCurrentUserAnOwner.bind(this);
        this.handleLeaveButtonClick = this.handleLeaveButtonClick.bind(this);
        this.getInviteButtonJSX = this.getInviteButtonJSX.bind(this);
        this.handleDoneButtonClick = this.handleDoneButtonClick.bind(this);
        this.handleDoneButtonClick = this.handleDoneButtonClick.bind(this);
        this.isUserAlreadyAMember = this.isUserAlreadyAMember.bind(this);
        this.handleMakePersonalButtonClick = this.handleMakePersonalButtonClick.bind(this);
        this.handleEmailInputKeyPress = this.handleEmailInputKeyPress.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
        this.getIsMemberUpdating = this.getIsMemberUpdating.bind(this);
    }

    render() {
        var filteredMembers = this.getFilteredMembers();
        var membersJSX = this.getMembersJSX(filteredMembers);
        var waitingOverlay = this.getWaitingOverlay();
        var isLeaveButtonEnabled = this.props.isSelectedProjectRemote;
        var isMakePersonalButtonEnabled = this.props.isSelectedProjectRemote && this.isCurrentUserAnOwner(filteredMembers);

        return (
            <div className="ShareMenu">
                {waitingOverlay}

                <div className="ShareMenuVerticalFlexContainer">
                    {/* Invite  */}
                    <MenuSubtitle text="Invite" showDivider={false}/>
                    <div className="ShareMenuInviteContainer">
                        <div className="EmailRoleContainer">
                            <input className="InviteEmail" type='email' placeholder="Email" ref={this.emailInputRef} 
                            onKeyPress={this.handleEmailInputKeyPress}/>
                            <select className="InviteRoleSelect" defaultValue='member' ref={this.roleSelectRef}>
                                <option value='owner'> Owner </option>
                                <option value='member'> Member </option>
                            </select>
                        </div>
                        <div className="InviteButtonContainer">
                            <Button text="Invite" onClick={this.handleInviteButtonClick} />
                        </div>
                    </div>

                    {/* Project Actions  */} 
                    <MenuSubtitle text="Actions"/>
                    <div className="ShareMenuActionsContainer">

                        {/* Leave */}
                        <div className="ActionItemContainer">
                            <div className="ActionLabel"> Leave Project </div>
                            <Button text='Leave' size='small' onClick={this.handleLeaveButtonClick} 
                            isEnabled={isLeaveButtonEnabled} />
                        </div>

                        {/* Divider  */} 
                        <div className="ActionItemDivider"/>

                        {/* Make Personal  */} 
                        <div className="ActionItemContainer">
                            <div className="ActionLabel"> Make Personal </div>
                            <Button text='Go' size='small' onClick={this.handleMakePersonalButtonClick}
                            isEnabled={isMakePersonalButtonEnabled}/>
                        </div>

                        {/* Divider  */} 
                        <div className="ActionItemDivider"/>

                        {/* Delete  */} 
                        <div className="ActionItemContainer">
                            <div className="ActionLabel"> Delete Project </div>
                            <Button text='Go' size='small' onClick={this.handleDeleteButtonClick}
                            isEnabled={isMakePersonalButtonEnabled}/>
                        </div>
                    </div>
     

                    {/* Members List  */}
                    <MenuSubtitle text="Project Contributors" />
                    <div className="MembersListContainer">
                        <div className="MembersListContentContainer">
                            {membersJSX}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="ShareMenuFooter">
                        <Button text="Done" onClick={this.handleDoneButtonClick}/>
                    </div>
                </div>
            </div>
        )
    }

    getMembersJSX(filteredMembers) {
        var membersJSX = [];
        
        if (this.props.selectedProjectId !== -1) {
            var isCurrentUserOwner = this.isCurrentUserAnOwner(filteredMembers);

            membersJSX = filteredMembers.map((item, index) => {
                var isUpdating = this.getIsMemberUpdating(item.userId, this.props.selectedProjectId);

                return (
                    <CSSTransition key={item.userId} classNames="ProjectMemberContainer" timeout={250} >
                        <div>
                            <div key={index} className="ProjectMember" data-isupdating={isUpdating}>
                                <div className="ProjectMemberGrid">
                                    {/* DisplayName and Email  */}
                                    <div className="ProjectMemberNameAndEmailContainer">
                                        <div className="ProjectMemberDisplayName">
                                            {item.displayName}
                                        </div>
                                        <div className="ProjectMemberEmail">
                                            {item.email}
                                        </div>
                                    </div>

                                    {/* Role  */}
                                    <div className="ProjectMemberRole">
                                        {this.toTitleCase(item.role)}
                                    </div>

                                    {/* Buttons  */}
                                    <div className="ProjectMemberButtonsContainer" data-isenabled={isCurrentUserOwner}>
                                        {this.getRoleButtonJSX(item)}
                                        {this.getKickButtonJSX(item)}
                                    </div>

                                    {/* Status  */}
                                    <div className="ProjectMemberStatus" data-status={item.status}>
                                        {this.toTitleCase(item.status)}
                                    </div>

                                    {/* Half Bleed Divider */}
                                    <div className="ProjectMemberDivider" />
                                </div>
                            </div>
                        </div>

                    </CSSTransition>
                )
            })

            if (filteredMembers.length === 0) {
                return (
                    <div>
                        <CenteringContainer>
                            <div className="NoMembersMessage">
                                No project contributors
                            </div>
                        </CenteringContainer>
                    </div>
                )
            }
    
            else {
                var disableAnimations = this.props.generalConfig.disableAnimations === undefined ?
                 false : this.props.generalConfig.disableAnimations;

                return (
                    <TransitionGroup enter={!disableAnimations} exit={!disableAnimations}>
                        {membersJSX}
                    </TransitionGroup>
                )
            }
        }
    }

    getIsMemberUpdating(userId, projectId) {
        return this.props.updatingUserIds.some(item => {
            return item.userId === userId && item.projectId === projectId;
        })
    }

    handleEmailInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleInviteButtonClick();
        }
    }

    handleMakePersonalButtonClick() {
        var message  = "This will kick all users from the Project and return it to being Personal only. " +
        "Are you sure you want to continue?";
        this.props.dispatch(setMessageBox(true, message, MessageBoxTypes.STANDARD, null,
        result => {
            if (result === 'ok') {
                this.props.dispatch(migrateProjectBackToLocalAsync(this.props.selectedProjectId, this.getProjectName()));
            }

            this.props.dispatch(setMessageBox(false));
        } ))
    }

    handleDeleteButtonClick() {
        var message  = "Deleting this project will remove it from all other contributors accounts as well. Are you sure you want to continue?"
        this.props.dispatch(setMessageBox(true, message, MessageBoxTypes.STANDARD, null,
        result => {
            if (result === 'ok') {
                this.props.dispatch(removeRemoteProjectAsync(this.props.selectedProjectId));
            }

            this.props.dispatch(setMessageBox(false));
        } ))
    }

    handleDoneButtonClick() {
        this.props.dispatch(setIsShareMenuOpen(false));
    }

    getInviteButtonJSX() {
        if (this.props.isInvitingUser) {
            return (
                <Spinner size="big"/>
            )
        }

        else {
            return (
                <Button text="Invite" onClick={this.handleInviteButtonClick} />
            )
        }
        
    }

    getWaitingOverlay() {
        if (this.props.isShareMenuWaiting) {
            return (
                <div className="ShareMenuOverlay">
                    <CenteringContainer>
                        <div className="ShareMenuOverlayContentContainer">
                            <Spinner size="medium"/>
                            <div className="ShareMenuMessage">
                                {this.props.shareMenuMessage}
                            </div>
                            <div className="ShareMenuSubMessage">
                                {this.props.shareMenuSubMessage}
                            </div>
                        </div>
                    </CenteringContainer>
                </div>
            )
        }
    }

    handleLeaveButtonClick() {
        var filteredMembers = this.getFilteredMembers();
        if (filteredMembers.length === 1) {
            // User is last Member.
            var message = "You are the sole contributor to this project, if you leave the project, it will be deleted from the database. " +
            "Are you sure you want to leave?";
            this.props.dispatch(setMessageBox(true, message, MessageBoxTypes.STANDARD, null, result => {
                this.props.dispatch(setMessageBox(false));
                if (result === "ok") {
                    this.props.dispatch(removeRemoteProjectAsync(this.props.selectedProjectId));
                }
            }))
        }
        
        else if (filteredMembers.length > 1 && this.isCurrentUserTheOnlyOwner(filteredMembers)) {
            // User is the only Owner.
            this.props.dispatch(setMessageBox(true, 'You must promote another user to Owner before you can leave the project.',
                MessageBoxTypes.OK_ONLY, null, result => {
                    this.props.dispatch(setMessageBox(false))
                }
            ))
        }

        else {
            this.props.dispatch(setMessageBox(true, 'Are you sure you want to Leave?', MessageBoxTypes.STANDARD, null,
        result => {
            if (result === "ok") {
                this.props.dispatch(kickUserFromProjectAsync(this.props.selectedProjectId, getUserUid()));
                this.props.dispatch(setIsShareMenuOpen(false));
            }

            this.props.dispatch(setMessageBox(false));
        }))
            
        }
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

    getFilteredMembers() {
        var filteredMembers = [];
        filteredMembers =  this.props.members.filter(item => {
            return item.project === this.props.selectedProjectId;
        })

        return filteredMembers;
    }

    handleInviteButtonClick() {
        var email = this.emailInputRef.current.value;

        if (email === this.props.userEmail) {
            this.props.dispatch(setMessageBox(true, "You can't invite yourself to your own project.", MessageBoxTypes.OK_ONLY,
        null, () => {this.props.dispatch(setMessageBox(false))}));
        }

        if (this.isUserAlreadyAMember(email)) {
            this.props.dispatch(setMessageBox(true, "User is already a contributor.", MessageBoxTypes.OK_ONLY,
        null, () => {this.props.dispatch(setMessageBox(false))}));
        }

        else {
            this.props.dispatch(inviteUserToProjectAsync(this.getProjectName(),
            email,
            this.props.userEmail,
            this.props.displayName,
            this.props.selectedProjectId,
            this.roleSelectRef.current.value));
        }
    }

    isUserAlreadyAMember(email) {
        var index = this.getFilteredMembers().findIndex(item => {
            return item.email === email;
        })

        return index !== -1;
    }

    handleRoleButtonClick(action, userId, filteredMembers) {
        if (action === 'promote') {
            this.props.dispatch(updateMemberRoleAsync(userId, this.props.selectedProjectId, 'owner'));
        }

        if (action === 'demote') {
            // Ensure the user can't Demote themselves before first delegating another Member to be an Owner.
            if (this.isCurrentUserTheOnlyOwner(this.getFilteredMembers())) {
               this.props.dispatch(setMessageBox(true, "You must delegate another member to be an owner before you can demote yourself.", MessageBoxTypes.OK_ONLY,
            null, () => { this.props.dispatch(setMessageBox(false)) }));
            }

            else {
                this.props.dispatch(updateMemberRoleAsync(userId, this.props.selectedProjectId, 'member'));
            }
            
        }
    }

    handleKickButtonClick(displayName, userId) {
        this.props.dispatch(kickUserFromProjectAsync(this.props.selectedProjectId, userId));
    }

    getRoleButtonJSX(member) {
        if (member.role === 'member') {
            return (
                <Button text="Promote" size="small" onClick={() => { this.handleRoleButtonClick('promote', member.userId) }} />
            )
        }

        else {
            return (
                <Button text="Demote" size="small" onClick={() => { this.handleRoleButtonClick('demote', member.userId) }} />
            )
        }
    }

    getKickButtonJSX(member) {
        var isCurrentUser = member.userId === getUserUid();
        var text = this.parseStatusIntoKickButtonText(member.status);
        return (
            <Button text={text} size="small" isEnabled={!isCurrentUser}
             onClick={() => { this.handleKickButtonClick(member.displayName, member.userId) }} />
        )
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
        if (this.props.selectedProjectId !== -1) {
            var selectedProject = this.props.projects.find(item => {
                return item.uid === this.props.selectedProjectId
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
        shareMenuMessage: state.shareMenuMessage,
        shareMenuSubMessage: state.shareMenuSubMessage,
        isShareMenuWaiting: state.isShareMenuWaiting,
        selectedProjectId: state.selectedProjectId,
        isSelectedProjectRemote: state.isSelectedProjectRemote,
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