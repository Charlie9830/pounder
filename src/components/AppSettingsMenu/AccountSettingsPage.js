import React from 'react';
import CenteringContainer from '../../containers/CenteringContainer';
import Button from '../Button';
import Spinner from '../Spinner';
import MenuSubtitle from '../MenuSubtitle';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import AccountIconLoggedIn from '../../assets/icons/AccountIconLoggedIn.svg';
import AccountIconLoggedOut from '../../assets/icons/AccountIconLoggedOut.svg';

class AccountSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getButtonsJSX = this.getButtonsJSX.bind(this);
        this.handleLogInButtonClick = this.handleLogInButtonClick.bind(this);
        this.getInputsJSX = this.getInputsJSX.bind(this);
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.getDisplayNameInputJSX = this.getDisplayNameInputJSX.bind(this);
        this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
        this.handleRegisterActionButtonClick = this.handleRegisterActionButtonClick.bind(this);
        this.getActionsJSX = this.getActionsJSX.bind(this);
        this.getPasswordResetActionJSX = this.getPasswordResetActionJSX.bind(this);
        this.getRegisterActionJSX = this.getRegisterActionJSX.bind(this);
        this.handlePasswordResetButtonClick = this.handlePasswordResetButtonClick.bind(this);
        this.getSignInActionJSX = this.getSignInActionJSX.bind(this);
        this.handleSignInActionButtonClick = this.handleSignInActionButtonClick.bind(this);
        this.getRegisterScreenJSX = this.getRegisterScreenJSX.bind(this);
        this.getLogInScreenJSX = this.getLogInScreenJSX.bind(this);
    }

    componentDidMount() {
        // Component selectively renders, check if it has been rendered first.
        if (this.refs.emailInput !== undefined) {
            this.refs.emailInput.focus();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isInRegisterMode !== this.props.isInRegisterMode) {
            if (this.props.isInRegisterMode && this.refs.emailInput !== undefined) {
                this.refs.emailInput.focus();
            }
        }
    }
    

    render() {
        var actionsJSX = this.getActionsJSX();
        var contentsJSX = [];
        if (this.props.isInRegisterMode !== true) {
            contentsJSX = this.getLogInScreenJSX();
        }

        else {
            contentsJSX = this.getRegisterScreenJSX();
        }

        return (
            <div className="AccountSettingsContainer">
                <div className="LogInContainer">
                    {/* Log In / Log out / Register  */}
                    <CenteringContainer>
                        {contentsJSX}
                    </CenteringContainer>

                    {/* Account Actions  */}
                    <div className="AccountSettingsActionsContainer">
                        <MenuSubtitle text="" />
                        {actionsJSX}
                    </div>
                </div>
            </div>
            
        )
    }

    getLogInScreenJSX() {
        var inputsJSX = this.getInputsJSX();
        var buttonsJSX = this.getButtonsJSX();

        return (
            <div className="AccountSettingsContentsContainer">
                {/* Logo and Status Message  */}
                <img className="AppSettingsAccountLogo" src={AccountIconLoggedIn} />
                <div className="AppSettingsAccountStatus"> {this.props.authStatusMessage} </div>

                {/* Email and Password Inputs  */}
                {inputsJSX}

                {/* LogInLogOut Button  */}
                <div className="AppSettingsAccountButtonsFlexContainer">
                    {buttonsJSX}
                </div>
            </div>
        )
    }

    getRegisterScreenJSX() {
        if (this.props.isLoggingIn === false) {
            return (
                <div className="AccountSettingsContentsContainer">
                    {/* Title */}
                    <div className="AccountSettingsRegisterTitle"> Let's get started </div>
                    <div className="AccountSettingsRegisterSubtitle"> Create Account  </div>
    
                    {/* Email */}
                    <div className="AppSettingsAccountEmailContainer">
                        <input className="AppSettingsAccountInput" type="text" ref="emailInput" defaultValue={this.props.userEmail}
                            onKeyPress={this.handleInputKeyPress} placeholder="Your email" />
                    </div>
    
                    {/* Display Name */}
                    <div className="AppSettingsAccountDisplayNameContainer">
                        <input className="AppSettingsAccountInput" type="text" ref="displayNameInput"
                            onKeyPress={this.handleInputKeyPress} placeholder="Display name" />
                    </div>
    
                    {/* Password  */}
                    <div className="AppSettingsAccountPasswordContainer">
                        <input className="AppSettingsAccountInput" type="password" ref="passwordInput"
                            onKeyPress={this.handleInputKeyPress} placeholder="Password" />
                    </div>
    
                    {/* Button */}
                    <div className="AppSettingsAccountButtonsFlexContainer">
                        <Button text="Sign Up" onClick={this.handleRegisterButtonClick}/>
                    </div>
                </div>
            )
        }

        else {
            return (
                <div className="AccountSettingsContentsContainer">
                    <CenteringContainer>
                        <Spinner  size="big"/>
                    </CenteringContainer>
                </div>
            )
        }
        
    }

    getRegisterActionJSX() {
        return (
            <div className="AccountSettingsActionContainer">
                <span className="AppSettingsItemLabel"> New to Handball? </span>
                <span className="AccountSettingsActionLink" onClick={this.handleRegisterActionButtonClick}> Register here. </span>
            </div>
        )
    }

    getSignInActionJSX() {
        return (
                <div className="AccountSettingsActionContainer">
                    <span className="AppSettingsItemLabel"> Have an account? </span>
                    <span className="AccountSettingsActionLink" onClick={this.handleSignInActionButtonClick}> Sign in. </span>
                </div>
        )
    }

    getPasswordResetActionJSX() {
        return (
                <div className="AccountSettingsActionContainer">
                    <div className="AppSettingsItemLabel"> Want to change your password? </div>
                    <span className="AccountSettingsActionLink" onClick={this.handlePasswordResetButtonClick}> Send a reset email </span>
                </div>
        )
    }

    getActionsJSX() {
        var registerActionJSX = this.getRegisterActionJSX();
        var signInActionJSX = this.getSignInActionJSX();
        var passwordResetActionJSX = this.getPasswordResetActionJSX();

        if (this.props.isInRegisterMode) {
            return (
                <React.Fragment>
                    {signInActionJSX}
                </React.Fragment>
            )
        }

        if (this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    {passwordResetActionJSX}
                </React.Fragment>
            )

        }

        else {
            return (
                <React.Fragment>
                    {registerActionJSX}
                </React.Fragment>
            )
        }
    }

    getInputsJSX() {
        if (this.props.isLoggedIn === false) {
            return (
                <div>
                    {/* Email */}
                    <div className="AppSettingsAccountEmailContainer">
                        <input className="AppSettingsAccountInput" type="text" ref="emailInput" defaultValue={this.props.userEmail}
                        onKeyPress={this.handleInputKeyPress} placeholder="Email"/>
                    </div>

                    {/* Password  */} 
                    <div className="AppSettingsAccountPasswordContainer">
                        <input className="AppSettingsAccountInput" type="password" ref="passwordInput"
                        onKeyPress={this.handleInputKeyPress} placeholder="Password" />
                    </div>
                </div>
            )
        }

        else {
            return (
                <React.Fragment>
                    <div className="AppSettingsAccountDisplayName"> {this.props.displayName} </div>
                    <div className="AppSettingsAccountEmailDisplay"> {this.props.userEmail} </div>
                </React.Fragment>
            )
        }
    }

    getDisplayNameInputJSX() {
        if (this.props.isInRegisterMode) {
            return (
                <div className="AppSettingsAccountDisplayNameContainer">
                    <div className="AppSettingsAccountItemLabel"> Display Name </div>
                    <input className="AppSettingsAccountInput" type="text" ref="displayNameInput"
                        onKeyPress={this.handleInputKeyPress} />
                </div>
            )
        }
    }

    handleDeleteAccountButtonClick() {
        this.props.onDeleteAccountButtonClick();
    }

    handlePasswordResetButtonClick() {
        this.props.onPasswordResetButtonClick();
    }

    handleInputKeyPress(e) {
        if (e.key === "Enter") {
            if (this.props.isInRegisterMode) {
                this.handleRegisterButtonClick();
            }

            else {
                this.handleLogInButtonClick();
            }
        }
    }

    getButtonsJSX() {
        if (this.props.isLoggingIn) {
            return (
                <Spinner size="medium" />
            )
        }

        if (this.props.isLoggedIn) {
            return (
                <Button text="Log Out" onClick={() => { this.props.onLogOutButtonClick() }} />
            )
        }

        if (this.props.isLoggedIn === false) {
            return (
                <Button text="Log In" onClick={this.handleLogInButtonClick}/>
            )
        }
    }

    handleRegisterButtonClick() {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;
        var displayName = this.refs.displayNameInput.value;

        this.props.onRegisterButtonClick(email, password, displayName);
    }

    handleRegisterActionButtonClick() {
        this.props.onRegisterModeChanged(true);
    }

    handleSignInActionButtonClick() {
        this.props.onRegisterModeChanged(false);
    }

    handleLogInButtonClick() {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;
        
        this.props.onLogInButtonClick(email, password);
    }
}

export default AccountSettingsPage;