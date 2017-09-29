import React from 'react';
import '../assets/css/LockScreen.css'
import PinCodeKeypad from './PinCodeKeypad';


class LockScreen extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            currentValue: "",
            pinCodeDisplayed: false
        }

        // Class Storage.
        this.pinCode = "2709";
        this.pinCodeTimeout = -1;

        // Method Bindings.
        this.validatePinCode = this.validatePinCode.bind(this);
        this.handleKeypadButtonPress = this.handleKeypadButtonPress.bind(this);
        this.getLogoOrPincode = this.getLogoOrPincode.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
    }

    componentWillUnmount() {
        if (this.pinCodeTimeout != -1) {
            clearTimeout(this.pinCodeTimeout);
        }
    }

    render() {
        var contentsJSX = this.getLogoOrPincode();

        return (
            <div className="LockScreenContainer">
                <div className="LockScreenOuter">
                    <div className="LockScreenInner">
                        <div className="LockScreenCentered">  
                            {contentsJSX}     
                        </div>
                    </div>
                </div>
                <div className="LockScreenBackupMessageContainer">
                    <label className="LockScreenBackupMessage">
                        {this.props.backupMessage}
                    </label>
                    <img className="LockScreenQuitButton" src="QuitIcon.svg" onClick={this.handleQuitButtonClick}/> 
                </div>
            </div>
        )
    }

    getLogoOrPincode() {
        if (this.state.pinCodeDisplayed) {
            // Convert current Entered pincode to Dots.
            var passwordDots = this.state.currentValue.split("").map(item => {
                return "●";
            }).join("");

            return (
                <div>
                    <label className="PinCodeDots">{passwordDots}</label>
                    <div className="PinCodeKeypad">
                        <PinCodeKeypad onKeypadButtonPress={this.handleKeypadButtonPress} />
                    </div>
                </div>
            )
        }

        else {
            return (
                <img className="LockScreenIcon" src="NewLockScreenIcon.svg" onClick={this.handleLogoClick} />
            )
        }
    }

    handleQuitButtonClick() {
        this.props.onQuitButtonClick();
    }

    handleLogoClick() {
        this.setState({ pinCodeDisplayed: true });

        // Set a Timeout to set screen back to Logo if no User interaction is detected.
        this.pinCodeTimeout = setTimeout(() => {
            this.setState({ pinCodeDisplayed: false });
        }, 10000);
    }

    handleKeypadButtonPress(number) {
        var newValue = this.state.currentValue + number;

        if (newValue.length >= 4) {
            this.validatePinCode(newValue);
        }

        else {
            this.setState({currentValue: newValue});
        }
    }

    validatePinCode(value) {
        if (value === this.pinCode) {
            // Access Granted.
            this.props.onAccessGranted();
        }

        // Clear Input.
        this.setState({currentValue: ""});
    }
}

export default LockScreen;