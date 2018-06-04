import React from 'react';
import '../assets/css/LockScreen.css'
import PinCodeKeypad from './PinCodeKeypad';
import CenteringContainer from '../containers/CenteringContainer';
import { connect } from 'react-redux';
import LockScreenIcon from '../assets/icons/NewLockScreenIcon.svg';
import QuitIcon from '../assets/icons/QuitIcon.svg';

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
                <CenteringContainer> 
                    {contentsJSX}     
                </CenteringContainer>   
                <div className="LockScreenBackupMessageContainer">
                    <label className="LockScreenBackupMessage">
                        {this.props.lastBackupMessage}
                    </label>
                    <img className="LockScreenQuitButton" src={QuitIcon} onClick={this.handleQuitButtonClick}/> 
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
                <img className="LockScreenIcon" src={LockScreenIcon} onClick={this.handleLogoClick} />
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

const mapStateToProps = state => {
    return {
        lastBackupMessage: state.lastBackupMessage
    }
}

let VisibleLockScreen = connect(mapStateToProps)(LockScreen);

export default VisibleLockScreen;