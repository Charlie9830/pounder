import React from 'react';
import '../assets/css/LockScreen.css'
import Moment from 'moment';
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
            pinCodeDisplayed: false,
            lastBackupMessage: "",
        }

        // Class Storage.
        this.pinCodeTimeout = -1;
        this.updateLastBackupMessageInterval = -1;

        // Method Bindings.
        this.validatePinCode = this.validatePinCode.bind(this);
        this.handleKeypadButtonPress = this.handleKeypadButtonPress.bind(this);
        this.getLogoOrPincode = this.getLogoOrPincode.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
        this.updateLastBackupMessage = this.updateLastBackupMessage.bind(this);
    }

    componentDidMount() {
        this.updateLastBackupMessageInterval = setInterval( () => {
            if (this.props.lastBackupDate !== "") {
                this.updateLastBackupMessage();
            }
        }, 180 * 1000);

        this.updateLastBackupMessage();
    }

    componentWillUnmount() {
        if (this.pinCodeTimeout != -1) {
            clearTimeout(this.pinCodeTimeout);
        }

        if (this.updateLastBackupMessageInterval != -1) {
            clearTimeout(this.updateLastBackupMessageInterval);
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
                        {this.state.lastBackupMessage}
                    </label>
                    <img className="LockScreenQuitButton" src={QuitIcon} onClick={this.handleQuitButtonClick}/> 
                </div>
            </div>
        )
    }

    updateLastBackupMessage() {
        var moment = Moment(this.props.lastBackupDate);
        if (moment.isValid()) {
            var fromNow = moment.fromNow();
            var humanFriendlyTime = moment.format("dddd, MMMM Do YYYY, h:mm a");
            var message = `Last backup performed ${fromNow} at ${humanFriendlyTime}`;
    
            this.setState({ lastBackupMessage: message });
        }
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
                <img className="LockScreenIcon" 
                src={LockScreenIcon} onClick={this.handleLogoClick} />
            )
        }
    }

    handleQuitButtonClick() {
        this.props.onQuitButtonClick();
    }

    handleLogoClick() {
        if (this.props.generalConfig.pinCode === undefined || this.props.generalConfig.pinCode === "") {
            this.props.onAccessGranted();
        }

        else {
            this.setState({ pinCodeDisplayed: true });

            // Set a Timeout to set screen back to Logo if no User interaction is detected.
            this.pinCodeTimeout = setTimeout(() => {
                this.setState({ pinCodeDisplayed: false });
            }, 10 * 1000);
        }

    }

    handleKeypadButtonPress(number) {
        var newValue = this.state.currentValue + number;

        this.validatePinCode(newValue);

        if (newValue.length >= 4) {
            this.setState({currentValue: ""});
        }

        else {
            this.setState({currentValue: newValue});
        }
        
    }

    validatePinCode(value) {
        var pinCode = this.props.generalConfig.pinCode === undefined ? "" : this.props.generalConfig.pinCode;

        if (value === pinCode) {
            // Access Granted.
            this.props.onAccessGranted();
        }

        // Clear Input.
        this.setState({currentValue: ""});
    }
}

const mapStateToProps = state => {
    return {
        lastBackupDate: state.lastBackupDate,
        generalConfig: state.generalConfig,
    }
}

let VisibleLockScreen = connect(mapStateToProps)(LockScreen);

export default VisibleLockScreen;