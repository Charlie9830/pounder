import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import MessageBox from '../MessageBox';
import Button from '../Button';
import { setMessageBox } from 'pounder-redux/action-creators';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import '../../assets/css/ToolBarButton.css';

class DatabaseSettingsPage extends React.Component {
    constructor(props) {
        super(props);
        
        // Method Bindings.
        this.getDatabaseInfoPaneJSX = this.getDatabaseInfoPaneJSX.bind(this);
        this.handleGetInfoButtonClick = this.handleGetInfoButtonClick.bind(this);
        this.getPurgeButtonJSX = this.getPurgeButtonJSX.bind(this);
        this.handlePurgeCompletedTasksButtonClick = this.handlePurgeCompletedTasksButtonClick.bind(this);
        this.handleRestoreDatabaseButtonClick = this.handleRestoreDatabaseButtonClick.bind(this);
        this.getRestoreButtonJSX = this.getRestoreButtonJSX.bind(this);
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
            </div>
        )
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
                <Button text="Restore" onClick={this.handleRestoreDatabaseButtonClick}/>
            )
        }
    }

    handleRestoreDatabaseButtonClick() {
        this.props.onRestoreDatabaseButtonClick();
    }

    handlePurgeCompletedTasksButtonClick() {
        this.props.onPurgeCompletedTasksButtonClick();
    }

    getPurgeButtonJSX() {
        if (this.props.isDatabasePurging) {
            return (
                <div className="DatabaseWorkingSpinner" />
            )

        }

        else {
            return (
                <Button text="Purge" onClick={this.handlePurgeCompletedTasksButtonClick}/>
            )
        }
    }

    getDatabaseInfoPaneJSX() {
        if (this.props.databaseInfo === "") {
            return (
                <Button text="Get Info" onClick={this.handleGetInfoButtonClick}/>
            )
        }

        else {
            return (
                <div>
                    <textarea className="DatabaseSettingsPageInfoPane" type='text' value={this.props.databaseInfo} 
                        readOnly="true" />
                    <Button text="Refresh" onClick={this.handleGetInfoButtonClick}/>
                </div>
            )
        }
    }

    handleGetInfoButtonClick(e) {
        this.props.onGetDatabaseInfoClick();
    }
}

export default DatabaseSettingsPage;