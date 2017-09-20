import React from 'react';
import '../assets/css/StatusBar.css';

class StatusBar extends React.Component {
    render() {
        var firebaseStatusClassName = this.props.isAwaitingFirebase ? "AwaitingFirebase" : "NotAwaitingFirebase";
        var connectionStatusClassName = this.props.isConnectedToFirebase ? "IsConnected" : "IsNotConnected";
        var errorMessage = this.props.errorMessage;

        return (
            <div className="StatusBarContainer">
                <img className={firebaseStatusClassName} src="LoadingIcon.svg"/>
                <div className={connectionStatusClassName}/>
                <label className="VersionNumber"> Version 1.1.2  </label>
                <label className={"ErrorMessage"}> {errorMessage} </label>
            </div>
        )
    }
}

export default StatusBar;