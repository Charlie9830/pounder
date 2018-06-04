import React from 'react';
import '../assets/css/StatusBar.css';
import LoadingIcon from '../assets/icons/LoadingIcon.svg'
import { connect } from 'react-redux';
import AccountIconLoggedIn from '../assets/icons/AccountIconLoggedIn.svg';
import AccountIconLoggedOut from '../assets/icons/AccountIconLoggedOut.svg';
import AccountIconLoggingIn from '../assets/icons/AccountIconLoggingIn.svg';
import {setIsAppSettingsOpen, setAppSettingsMenuPage } from 'pounder-redux/action-creators';

class StatusBar extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getAccountIconSrc = this.getAccountIconSrc.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);
    }

    render() {
        var accountIconSrc = this.getAccountIconSrc();

        return (
            <div className="StatusBarContainer">
                <div className="StatusBarFlexContainer">
                    <img className="StatusBarAccountIcon" src={accountIconSrc} onClick={this.handleIconClick} />
                    <div className="StatusBarDivider"/>
                    <label className="VersionNumber"> Version 1.3.0 </label>
                    <div className="StatusBarDivider"/>
                    <label className="PendingWrites" data-havependingwrites={this.props.projectsHavePendingWrites}> Pr </label>
                    <label className="PendingWrites" data-havependingwrites={this.props.projectLayoutsHavePendingWrites}> Pl </label>
                    <label className="PendingWrites" data-havependingwrites={this.props.taskListsHavePendingWrites}> Tl </label>
                    <label className="PendingWrites" data-havependingwrites={this.props.tasksHavePendingWrites}> Ta </label>
                </div>
            </div>
        )
    }

    handleIconClick() {
        this.props.dispatch(setIsAppSettingsOpen(true));
        this.props.dispatch(setAppSettingsMenuPage("account"));
    }

    getAccountIconSrc() {
        if (this.props.isLoggingIn) {
            return AccountIconLoggingIn;
        }

        if (this.props.isLoggedIn) {
            return AccountIconLoggedIn;
        }

        else {
            return AccountIconLoggedOut;
        }
    }
}

const mapStateToProps = state => {
    return {
        projectsHavePendingWrites: state.projectsHavePendingWrites,
        projectLayoutsHavePendingWrites: state.projectLayoutsHavePendingWrites,
        taskListsHavePendingWrites: state.taskListsHavePendingWrites,
        tasksHavePendingWrites: state.tasksHavePendingWrites,
        isLoggedIn: state.isLoggedIn,
        isLoggingIn: state.isLoggingIn,
    }
}

let VisibleStatusBar = connect(mapStateToProps)(StatusBar);

export default VisibleStatusBar;