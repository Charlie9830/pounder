import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import CenteringContainer from '../containers/CenteringContainer';
import Spinner from './Spinner';
import '../assets/css/ShareMenu.css';
import { inviteUserToProjectAsync } from 'pounder-redux/action-creators';

class ShareMenu extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.emailInputRef = React.createRef();

        // Method Bindings.
        this.getProjectName = this.getProjectName.bind(this);
        this.getButtonsJSX = this.getButtonsJSX.bind(this);
        this.handleInviteButtonClick = this.handleInviteButtonClick.bind(this);
        this.getText = this.getText.bind(this);
    }

    componentDidMount() {
        // Focus Email Input.
        this.emailInputRef.current.focus();
    }
    render() {
        var buttonsJSX = this.getButtonsJSX();
        var text = this.getText();
        var projectName = this.getProjectName();

        return (
            <div className="ShareMenu">
                <CenteringContainer>
                    <div className="ShareMenuVerticalFlexContainer">
                        {/* Text  */}
                        <div className="ShareMenuText">
                            {text}
                        </div>

                        {/* Divider  */}
                        <div className="ShareMenuDivider" />

                        {/* Email  */}
                        <div className="ShareMenuEmailLabel"> Email </div>
                        <input className="ShareMenuEmailInput" type="text" ref={this.emailInputRef} />

                        {/* Divider  */}
                        <div className="ShareMenuDivider" />

                        {/* Buttons */}
                        <div className="ShareMenuButtonContainer">
                            {buttonsJSX}
                        </div>
                        
                    </div>
                </CenteringContainer>
            </div>
        )
    }

    getText() {
        if (this.props.inviteUserMessage === "") {
            return `Enter an email address to invite users to ${this.getProjectName()}`
        }

        else {
            return this.props.inviteUserMessage;
        }
    }

    getButtonsJSX() {
        if (this.props.isInvitingUser) {
            return (
                <Spinner size="small" />
            )
        }

        else {
            return (
                <Button text="Invite" onClick={this.handleInviteButtonClick} />
            )
        }
    }

    handleInviteButtonClick() {
        var projectName = this.getProjectName();
        var targetEmail = this.emailInputRef.current.value.trim();
        var sourceEmail = this.props.userEmail;
        var sourceDisplayName = "DingusKhan";
        var projectId = this.props.selectedProjectId;
        var isRemote = false;

        this.props.dispatch(inviteUserToProjectAsync(projectName, targetEmail, sourceEmail, sourceDisplayName, projectId, isRemote))
    }

    getProjectName() {
        if (this.props.selectedProjectId !== -1 ) {
            var selectedProjectName = this.props.projects.find( item => {
                return item.uid === this.props.selectedProjectId
            }).projectName;

            return selectedProjectName;
        }
    }
}

let mapStateToProps = state => {
    return {
        inviteUserMessage: state.inviteUserMessage,
        isInvitingUser: state.isInvitingUser,
        selectedProjectId: state.selectedProjectId,
        projects: state.projects,
        userEmail: state.userEmail,
    }
}

let VisibleShareMenu = connect(mapStateToProps)(ShareMenu);
export default VisibleShareMenu;