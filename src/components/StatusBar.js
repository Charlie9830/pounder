import React from 'react';
import '../assets/css/StatusBar.css';

class StatusBar extends React.Component {
    render() {
        var firebaseStatusClassName = this.props.isAwaitingFirebase ? "AwaitingFirebase" : "NotAwaitingFirebase";
        var connectionStatusClassName = this.props.isConnectedToFirebase ? "IsConnected" : "IsNotConnected";
        
        return (
            <div className="StatusBarContainer">
                <img className={firebaseStatusClassName} src="LoadingIcon.svg"/>
                <div className={connectionStatusClassName}/>
            </div>
        )
    }
}

export default StatusBar;