import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import MessageBox from '../MessageBox';

import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import '../../assets/css/ToolBarButton.css';

class DatabaseSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isPurgeDatabaseMessageBoxOpen: false,
            isRestoreDatabaseConfirmBoxOpen: false,
            isRestoringMessageBoxOpen: false,
            isRestoreDatabaseStatusMessageBoxOpen: false,
            restoringMessage: "Backing up current Data",
        }
        
        // Method Bindings.
        this.getDatabaseInfoPaneJSX = this.getDatabaseInfoPaneJSX.bind(this);
        this.handleGetInfoButtonClick = this.handleGetInfoButtonClick.bind(this);
        this.getPurgeButtonJSX = this.getPurgeButtonJSX.bind(this);
        this.handlePurgeCompletedTasksButtonClick = this.handlePurgeCompletedTasksButtonClick.bind(this);
        this.handlePurgeDatabaseMessageBoxClosing = this.handlePurgeDatabaseMessageBoxClosing.bind(this);
        this.handleRestoreDatabaseConfirmBoxClosing = this.handleRestoreDatabaseConfirmBoxClosing.bind(this);
        this.handleRestoreDatabaseButtonClick = this.handleRestoreDatabaseButtonClick.bind(this);
        this.getRestoreButtonJSX = this.getRestoreButtonJSX.bind(this);
        this.handleRestoreDatabaseCompleteDialogClosing = this.handleRestoreDatabaseCompleteDialogClosing.bind(this);
    }

    render() {
        var databaseInfoPaneJSX = this.getDatabaseInfoPaneJSX()
        var purgeButtonJSX = this.getPurgeButtonJSX();
        var restoreButtonJSX = this.getRestoreButtonJSX();

        return (
            <div className="AppSettingsVerticalFlexContainer">
                {/* Database Info */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <label className="AppSettingsItemLabel"> Database Info </label>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        {databaseInfoPaneJSX}
                    </span>
                </div>

                {/* Purge Database of completed items */}
                <div className="AppSettingsVerticalFlexItem">
                    <div className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Purge Database of completed tasks </div>
                    </div>
                    <span className="AppSettingsHorizontalFlexItem">
                        {purgeButtonJSX}
                    </span>
                </div>

                {/* Restore Database from Disk */}
                <div className="AppSettingsVerticalFlexItem">
                    <div className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Restore Database from Local backup </div>
                    </div>
                    <span className="AppSettingsHorizontalFlexItem">
                        {restoreButtonJSX}
                    </span>
                </div>

                { /* Purge Database Message Box */ }
                <MessageBox isOpen={this.state.isPurgeDatabaseMessageBoxOpen} message="Are you sure?" 
                onDialogClosing={this.handlePurgeDatabaseMessageBoxClosing}/>

                { /* Restore from Interactive Backup Message Box */ }
                <MessageBox isOpen={this.state.isRestoreDatabaseConfirmBoxOpen} message="Are you sure?" 
                onDialogClosing={this.handleRestoreDatabaseConfirmBoxClosing}/>

                { /* Restore Database Complete Dialog */}
                <MessageBox isOpen={this.props.isRestoreDatabaseCompleteDialogOpen}
                 message={this.props.restoreDatabaseStatusMessage} okOnly={true}
                 onDialogClosing={this.handleRestoreDatabaseCompleteDialogClosing}/>
            </div>
        )
    }

    handleRestoreDatabaseCompleteDialogClosing() {
        this.props.onRestoreDatabaseCompleteDialogClosing();
    }

    getRestoreButtonJSX() {
        if (this.props.isDatabaseRestoring) {
            return (
                <div>
                    <div className="DatabaseWorkingSpinner" />
                </div>
            )
        }

        else {
            return (
                <div className="ToolBarButtonContainer" onClick={this.handleRestoreDatabaseButtonClick}>
                    <label className="ToolBarButton"> Restore </label>
                </div>
            )
        }
    }

    handleRestoreDatabaseButtonClick() {
        this.setState({
            isRestoreDatabaseConfirmBoxOpen: true
        })
    }

    handleRestoreDatabaseConfirmBoxClosing(userChoice) {
        if (userChoice === "ok") {
            this.setState({
                isRestoreDatabaseConfirmBoxOpen: false
            })

            this.props.onRequestDatabaseRestore();
        }

        if (userChoice === "cancel") {
            this.setState({
                isRestoreDatabaseConfirmBoxOpen: false
            })
        }

    } 

    handlePurgeDatabaseMessageBoxClosing(userChoice) {
        if (userChoice === "ok") {
            this.setState({
                isPurgeDatabaseMessageBoxOpen: false,
            })
    
            this.props.onPurgeCompletedTasksButtonClick();
        }

        if (userChoice === "cancel") {
            this.setState({
                isPurgeDatabaseMessageBoxOpen: false,
            })
        }
    }

    handlePurgeCompletedTasksButtonClick() {
        // Defer to Message Box for Confirmation.
        this.setState({
            isPurgeDatabaseMessageBoxOpen: true,
        })
    }

    getPurgeButtonJSX() {
        if (this.props.isDatabasePurging) {
            return (
                <div className="DatabaseWorkingSpinner" />
            )

        }

        else {
            return (
                <div className="ToolBarButtonContainer" onClick={this.handlePurgeCompletedTasksButtonClick}>
                    <label className="ToolBarButton"> Purge </label>
                </div>
            )
        }
    }

    getDatabaseInfoPaneJSX() {
        if (this.props.databaseInfo === "") {
            return (
                <div className="ToolBarButtonContainer" onClick={this.handleGetInfoButtonClick}>
                    <label className="ToolBarButton"> Get Info </label>
                </div>
            )
        }

        else {
            return (
                <div>
                    <textarea className="DatabaseSettingsPageInfoPane" type='text' value={this.props.databaseInfo} 
                        readOnly="true" />
                    <div className="ToolBarButtonContainer" onClick={this.handleGetInfoButtonClick}>
                        <label className="ToolBarButton"> Refresh </label>
                    </div>
                </div>
            )
        }
    }

    handleGetInfoButtonClick(e) {
        this.props.onGetDatabaseInfoClick();
    }
}

export default DatabaseSettingsPage;