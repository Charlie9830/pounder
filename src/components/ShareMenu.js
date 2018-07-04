import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import MenuSubtitle from './MenuSubtitle';
import Spinner from './Spinner';
import CenteringContainer from '../containers/CenteringContainer';
import '../assets/css/ShareMenu.css';
import { inviteUserToProjectAsync, kickUserFromProjectAsync, updateMemberRoleAsync, setMessageBox, setIsShareMenuOpen } from 'pounder-redux/action-creators';
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
    }

    render() {
        var membersJSX = this.getMembersJSX();
        var inviteButtonJSX = this.getInviteButtonJSX();

        return (
            <div className="ShareMenu">
                <div className="ShareMenuVerticalFlexContainer">
                    {/* Invite  */}
                    <MenuSubtitle text="Invite" showDivider={false}/>
                    <div className="ShareMenuInviteContainer">
                        <div className="EmailRoleContainer">
                            <input className="InviteEmail" type='email' placeholder="Email" ref={this.emailInputRef} />
                            <select className="InviteRoleSelect" defaultValue='member' ref={this.roleSelectRef}>
                                <option value='owner'> Owner </option>
                                <option value='member'> Member </option>
                            </select>
                        </div>
                        <div className="InviteButtonContainer">
                            {inviteButtonJSX}
                        </div>
                        <div className="InviteUserMessage">
                            {this.props.inviteUserMessage}
                        </div>
                    </div>

                    {/* Leave Project  */} 
                    <MenuSubtitle text="Leave Project"/>
                    <div className="LeaveProjectContainer">
                        <Button text='Leave' size='small' onClick={this.handleLeaveButtonClick}/>
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

    getMembersJSX() {
        var membersJSX = [];
        
        if (this.props.selectedProjectId !== -1) {
            var filteredMembers = this.getFilteredMembers();
            var isCurrentUserOwner = this.isCurrentUserAnOwner(filteredMembers);

            var sortedMembers = filteredMembers.sort((a,b) => {
                if (a.role === 'owner' && b.role === 'member') {
                    return -1;
                }

                return 1;
            })

            membersJSX = sortedMembers.map((item, index) => {
                var isUpdating = item.userId === this.props.updatingUserId;

                return (
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
                )
            })

        }

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
            return (
                <div>
                    {membersJSX}
                </div>
            )
        }
    }

    handleDoneButtonClick() {
        this.props.dispatch(setIsShareMenuOpen(false));
    }

    getInviteButtonJSX() {
        if (this.props.isInvitingUser) {
            return (
                <Spinner size="medium"/>
            )
        }

        else {
            return (
                <Button text="Invite" onClick={this.handleInviteButtonClick} />
            )
        }
        
    }

    handleLeaveButtonClick() {
        var filteredMembers = this.getFilteredMembers();
        if (filteredMembers.length > 1 && this.isCurrentUserTheOnlyOwner(filteredMembers)) {
            this.props.dispatch(setMessageBox(true, 'You must promote another user to Owner before you can leave the project.',
        MessageBoxTypes.OK_ONLY, null, result => {this.props.dispatch(setMessageBox(false))}))
        }

        else {
            this.props.dispatch(kickUserFromProjectAsync(this.props.selectedProjectId, getUserUid()));
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
        inviteUserMessage: state.inviteUserMessage,
        isInvitingUser: state.isInvitingUser,
        selectedProjectId: state.selectedProjectId,
        projects: state.projects,
        members: state.members,
        userEmail: state.userEmail,
        displayName: state.displayName,
        updatingUserId: state.updatingUserId,
    }
}

let VisibleShareMenu = connect(mapStateToProps)(ShareMenu);
export default VisibleShareMenu;