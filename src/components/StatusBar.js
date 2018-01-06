import React from 'react';
import '../assets/css/StatusBar.css';
import { connect } from 'react-redux';

class StatusBar extends React.Component {
    render() {
        var firebaseStatusClassName = this.props.isAwaitingFirebase ? "AwaitingFirebase" : "NotAwaitingFirebase";
        var connectionStatusClassName = this.props.isConnectedToFirebase ? "IsConnected" : "IsNotConnected";

        return (
            <div className="StatusBarContainer">
                <img className="NotAwaitingFirebase" src="LoadingIcon.svg"/>
                <label className="VersionNumber"> Version 1.2.1 </label>
                <label className="PendingWrites" data-havePendingWrites={this.props.projectsHavePendingWrites}> Pr </label>
                <label className="PendingWrites" data-havePendingWrites={this.props.projectLayoutsHavePendingWrites}> Pl </label>
                <label className="PendingWrites" data-havePendingWrites={this.props.taskListsHavePendingWrites}> Tl </label>
                <label className="PendingWrites" data-havePendingWrites={this.props.tasksHavePendingWrites}> Ta </label>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        projectsHavePendingWrites: state.projectsHavePendingWrites,
        projectLayoutsHavePendingWrites: state.projectLayoutsHavePendingWrites,
        taskListsHavePendingWrites: state.taskListsHavePendingWrites,
        tasksHavePendingWrites: state.tasksHavePendingWrites,
    }
}

let VisibleStatusBar = connect(mapStateToProps)(StatusBar);

export default VisibleStatusBar;