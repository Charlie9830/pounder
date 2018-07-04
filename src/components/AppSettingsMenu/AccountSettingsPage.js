import React from 'react';
import CenteringContainer from '../../containers/CenteringContainer';
import Button from '../Button';
import Spinner from '../Spinner';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import AccountIconLoggedIn from '../../assets/icons/AccountIconLoggedIn.svg';
import AccountIconLoggedOut from '../../assets/icons/AccountIconLoggedOut.svg';

class AccountSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isInRegisterMode: false,
        }

        // Method Bindings.
        this.getButtonsJSX = this.getButtonsJSX.bind(this);
        this.handleLogInButtonClick = this.handleLogInButtonClick.bind(this);
        this.getInputsJSX = this.getInputsJSX.bind(this);
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.getDisplayNameInputJSX = this.getDisplayNameInputJSX.bind(this);
        this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
        this.handleRegisterLinkClick = this.handleRegisterLinkClick.bind(this);
    }

    componentDidMount() {
        // Component selectively renders, check if it has been rendered first.
        if (this.refs.emailInput !== undefined) {
            this.refs.emailInput.focus();
        }
    }

    render() {
        var buttonsJSX = this.getButtonsJSX();
        var inputsJSX = this.getInputsJSX()
        return (
            <CenteringContainer>
                {/* Logo and Status Message  */}
                <img className="AppSettingsAccountLogo" src={AccountIconLoggedIn} />
                <div className="AppSettingsAccountStatus"> {this.props.authStatusMessage} </div>

                {/* Email and Password Inputs  */}
                {inputsJSX}

                {/* LogInLogOut Button  */}
                <div className="AppSettingsAccountButtonsFlexContainer">
                    {buttonsJSX}
                </div>
            </CenteringContainer>
        )
    }

    getInputsJSX() {
        if (this.props.isLoggedIn === false) {
            var displayNameInputJSX = this.getDisplayNameInputJSX();
            return (
                <div>
                    {/* Email */}
                    <div className="AppSettingsAccountEmailContainer">
                        <div className="AppSettingsAccountItemLabel"> Email </div>
                        <input className="AppSettingsAccountInput" type="text" ref="emailInput" defaultValue={this.props.userEmail}
                        onKeyPress={this.handleInputKeyPress}/>
                    </div>

                    {/* Display Name (Only in Register Mode)  */} 
                    {displayNameInputJSX}

                    {/* Password  */} 
                    <div className="AppSettingsAccountPasswordContainer">
                        <div className="AppSettingsAccountItemLabel"> Password </div>
                        <input className="AppSettingsAccountInput" type="password" ref="passwordInput"
                        onKeyPress={this.handleInputKeyPress} />
                    </div>
                </div>
            )
        }

        else {
            return (
                <div>
                    <div className="AppSettingsAccountDisplayName"> {this.props.displayName} </div>
                    <div className="AppSettingsAccountEmailDisplay"> {this.props.userEmail} </div>
                </div>
            )
        }
    }

    getDisplayNameInputJSX() {
        if (this.state.isInRegisterMode) {
            return (
                <div className="AppSettingsAccountDisplayNameContainer">
                    <div className="AppSettingsAccountItemLabel"> Display Name </div>
                    <input className="AppSettingsAccountInput" type="text" ref="displayNameInput"
                        onKeyPress={this.handleInputKeyPress} />
                </div>
            )
        } 
    }

    handleInputKeyPress(e) {
        if (e.key === "Enter") {
            if (this.state.isInRegisterMode) {
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
                <Spinner size="medium"/>
            )
        }

        else {
            if (this.props.isLoggedIn) {
                return (
                    <Button text="Log Out" onClick={() => {this.props.onLogOutButtonClick()}}/>
                )
            }
    
            else {
                if (this.state.isInRegisterMode) {
                    return (
                        <Button text="Register" onClick={this.handleRegisterButtonClick}/>
                    )
                }

                else {
                    return (
                        <div>
                            <Button text="Log In" onClick={this.handleLogInButtonClick} />  
                            <div className="RegisterLink" onClick={this.handleRegisterLinkClick}> Register </div>
                        </div>                  
                    )
                }
            }
        }
    }

    handleRegisterButtonClick() {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;
        var displayName = this.refs.displayNameInput.value;

        this.props.onRegisterButtonClick(email, password, displayName);
    }

    handleRegisterLinkClick() {
        this.setState({ isInRegisterMode: true })
    }

    handleLogInButtonClick() {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;
        
        this.props.onLogInButtonClick(email, password);
    }
}

export default AccountSettingsPage;