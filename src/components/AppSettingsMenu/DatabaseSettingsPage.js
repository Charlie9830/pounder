import React from 'react';
import MenuSubtitle from '../MenuSubtitle';
import DatabaseRestore from './DatabaseRestore';
import MessageBox from '../MessageBox';
import Button from '../Button';
import CenteringContainer from '../../containers/CenteringContainer';
import Spinner from '../Spinner';
import { setMessageBox } from 'pounder-redux/action-creators';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import '../../assets/css/ToolBarButton.css';

class DatabaseSettingsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Only render settings if Logged in.
        if (this.props.isLoggedIn) {
            return (
                <div className="AppSettingsVerticalFlexContainer">
                    {/* Restore Database from Disk */}
                    <MenuSubtitle text="Restore projects from Backup" showDivider={false}/>
                    <div className="AppSettingsVerticalFlexItem">
                        <DatabaseRestore onSelectFileClick={() => {this.props.onSelectFileClick()}}
                        backupData={this.props.backupData} isReadingBackupFile={this.props.isReadingBackupFile}
                        onRestoreButtonClick={this.handleRestoreDatabaseButtonClick}/>
                    </div>
                </div>
            )
        }

        else {
            return (
                <CenteringContainer>
                    <MenuSubtitle text="Cannot access Database settings when Logged off."/>
                </CenteringContainer>
            )
        }

    }
}

export default DatabaseSettingsPage;