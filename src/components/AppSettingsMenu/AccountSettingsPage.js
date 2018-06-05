import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import CenteringContainer from '../../containers/CenteringContainer';
import Button from '../Button';
import Spinner from '../Spinner';
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
            return (
                <div>
                    {/* Email */}
                    <div className="AppSettingsAccountEmailContainer">
                        <div className="AppSettingsAccountItemLabel"> Email </div>
                        <input className="AppSettingsAccountInput" type="text" ref="emailInput" defaultValue={this.props.userEmail}
                        onKeyPress={this.handleInputKeyPress}/>
                    </div>

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
                <div className="AppSettingsAccountEmailDisplay">
                    {this.props.userEmail}
                </div>
            )
        }
    }

    handleInputKeyPress(e) {
        if (e.key === "Enter") {
            this.handleLogInButtonClick();
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
                return (
                        <Button text="Log In" onClick={this.handleLogInButtonClick} />                    
                )
            }
        }
    }

    handleLogInButtonClick() {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;
        
        this.props.onLogInButtonClick(email, password);
    }
}

export default AccountSettingsPage;