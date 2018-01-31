import React from 'react';
import '../assets/css/AccountScreen.css';

class AccountScreen extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        var buttonText = this.props.isUserLoggedIn ? "Log Out" : "Log In";

        return (
            <div className="AccountScreenContainer">
                <div className="AccountScreenOuter">
                    <div className="AccountScreenCloseButtonContainer" onClick={this.handleCloseButtonClick}>
                        <label className="AccountScreenCloseButton">X</label>
                    </div>
                    <div className="AccountScreenInner">
                        <div className="AccountScreenCentered">
                            <div className="AccountScreenLogoContainer">
                                <img className="AccountScreenLogo" src="AccountIconLoggedIn.svg"/>
                            </div>
                            <div className="EmailContainer">
                                <div>
                                    <label className="AccountScreenLabel"> Email </label>
                                </div>
                                <div>
                                    <input className="AccountScreenInput" ref="emailInput" type="text" onKeyPress={this.handleKeyPress} />
                                </div>
                            </div>
                            <div className="PasswordContainer">
                                <div>
                                    <label className="AccountScreenLabel"> Password </label>
                                </div>
                                <div>
                                    <input className="AccountScreenInput" ref="passwordInput" type="password" onKeyPress={this.handleKeyPress} />
                                </div>
                            </div>

                            <div>
                                <button className="AccountScreenLogInLogOutButton" onClick={this.handleButtonClick}> {buttonText} </button>
                            </div>
                            <div className="AccountScreenMessageContainer">
                                <textarea ref="messageArea" className="AccountScreenMessage" rows="5" cols="50"
                                 value={this.props.authMessage} readOnly="true"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        this.refs.messageArea.scrollTop = this.refs.messageArea.scrollHeight;
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            var email = this.refs.emailInput.value;
            var password = this.refs.passwordInput.value;

            this.props.onButtonClick(email, password);
            
        }
    }

    handleCloseButtonClick(e) {
        this.props.onCloseButtonClick();
    }

    handleButtonClick(e) {
        var email = this.refs.emailInput.value;
        var password = this.refs.passwordInput.value;

        this.props.onButtonClick(email, password);
    }
}

export default AccountScreen;