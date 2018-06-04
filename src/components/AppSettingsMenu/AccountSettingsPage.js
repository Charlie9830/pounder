import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import CenteringContainer from '../../containers/CenteringContainer';
import Button from '../Button';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import AccountIconLoggedIn from '../../assets/icons/AccountIconLoggedIn.svg';
import AccountIconLoggedOut from '../../assets/icons/AccountIconLoggedOut.svg';

class AccountSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getButtonsJSX = this.getButtonsJSX.bind(this);
        this.handleLogInButtonClick = this.handleLogInButtonClick.bind(this);
    }

    render() {
        var buttonsJSX = this.getButtonsJSX();

        return (
            <div className="AppSettingsVerticalFlexContainer">
                <div className="AppSettingsVerticalFlexItem">
                    <CenteringContainer>
                        {/* Logo and Status Message  */} 
                        <img className="AppSettingsAccountLogo" src={AccountIconLoggedIn} />
                        <div className="AppSettingsAccountStatus"> {this.props.authStatusMessage} </div>

                        {/* Email */}
                        <div className="AppSettingsAccountEmailContainer">
                            <div className="AppSettingsItemLabel"> Email </div>
                            <input className="AppSettingsAccountInput" type="text" ref="emailInput" />
                        </div>

                        {/* Password */}
                        <div className="AppSettingsAccountPasswordContainer">
                            <div className="AppSettingsItemLabel"> Password </div>
                            <input className="AppSettingsAccountInput" type="password" ref="passwordInput" />
                        </div>

                        {/* LogInLogOut Button  */}
                        <div className="AppSettingsAccountButtonsFlexContainer">
                            {buttonsJSX}
                        </div>
                    </CenteringContainer>
                </div>
            </div>
        )
    }

    getButtonsJSX() {
        if (this.props.isLoggingIn) {
            return (
                <div className="DatabaseWorkingSpinner"/>
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