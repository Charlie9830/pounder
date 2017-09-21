import React from 'react';
import '../assets/css/LockScreen.css'

class LockScreen extends React.Component {
    constructor(props) {
        super(props);

        // Class Storage.
        this.pinCode = "2709";

        // Method Bindings.
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        var containerClassName = this.props.isDisplayed ? "LockScreenContainer LockScreenDisplayed" : "LockScreenContainer";

        return (
            <div className={containerClassName}>
                <div className="LockScreenOuter">
                    <div className="LockScreenInner">
                        <div className="LockScreenCentered">
                            <img className="LockScreenIcon" src="NewLockScreenIcon.svg"/>
                            <input ref="input" className="LockScreenInput" type="password" onKeyPress={this.handleKeyPress}/>
                        </div>
                    </div>
                </div>
                <div className="LockScreenBackupMessageContainer">
                    <label className="LockScreenBackupMessage">
                        {this.props.backupMessage}
                    </label>
                </div>
            </div>
        )
    }

    handleKeyPress(e) {
        var value = this.refs.input.value;
        if (e.key === "Enter") {
            if (value === this.pinCode) {
                // Access Granted.
                this.props.onAccessGranted();
            }

            // Clear Input.
            this.refs.input.value = "";
        }
    }
}

export default LockScreen;