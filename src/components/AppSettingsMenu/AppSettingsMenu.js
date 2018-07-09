import React from 'react';
import Sidebar from 'react-sidebar';
import Button from '../Button';
import GeneralSettingsPage from './GeneralSettingsPage';
import DatabaseSettingsPage from './DatabaseSettingsPage';
import AccountSettingsPage from './AccountSettingsPage';
import AppSettingsSidebar from './AppSettingsSidebar';
import CenteringContainer from '../../containers/CenteringContainer';
import OverlayMenuContainer from '../../containers/OverlayMenuContainer';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import '../../assets/css/ToolBarButton.css';
import electron from 'electron';
import Path from 'path';
import { connect } from 'react-redux';
import { setAppSettingsMenuPage, getDatabaseInfoAsync, purgeCompleteTasksAsync, setFavouriteProjectIdAsync,
        setRestoreDatabaseStatusMessage, setIsDatabaseRestoringFlag, setCSSConfigAsync, setMessageBox, 
        setIsRestoreDatabaseCompleteDialogOpen, setGeneralConfigAsync, setIsAppSettingsOpen, setAllColorsToDefaultAsync,
        logInUserAsync, logOutUserAsync, registerNewUserAsync, postSnackbarMessage, unsubscribeFromDatabaseAsync,
        subscribeToDatabaseAsync, selectProject } from 'pounder-redux/action-creators';
import { readBackupFileAsync, restoreProjectsAsync, BACKUP_VALIDATION_KEY, getCurrentBackupDirectory } from '../../utilities/FileHandling';
import { MessageBoxTypes } from 'pounder-redux';
import { getUserUid } from 'pounder-firebase';
import MessageBox from '../MessageBox';
import { getFirestore } from 'pounder-firebase';

import TestData from '../../testdata/data';
import Spinner from '../Spinner';

// backupData: {
//     "createdAt": "2018-07-07T11:31:04.385Z",
//     "userId": "hh8QeWiAQvhK5FC2eVPvGNXNKC53",
//     projects: [
//         { projectName: 'Evita', uid: '1', isRemote: false },
//         { projectName: 'Harry Potter', uid: '2', isRemote: false},
//         { projectName: 'Wizard of Oz', uid: '3', isRemote: false},
//         { projectName: 'Jersey Boys', uid: '4', isRemote: true},
//         { projectName: 'The Hobbit', uid: '5', isRemote: true},
//         { projectName: 'Wicked The Reckoning', uid: '6' , isRemote: true},
//         { projectName: 'The Two Towers', uid: '7' , isRemote: true},
//         { projectName: 'Die Hard', uid: '8' , isRemote: true},
//         { projectName: 'Die Hard with Vengence', uid: '9' , isRemote: true},
//         { projectName: 'Annie', uid: '10' , isRemote: true},
//         { projectName: 'War Horse', uid: '11' , isRemote: true},
//         { projectName: 'War Pig', uid: '12' , isRemote: true},
//         { projectName: 'Harry Plopper Pants', uid: '13' , isRemote: true},
//     ],
// }

let dialog = electron.remote.dialog;

class AppSettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            colorPicker: {
                index: -1,
                xOffset: 0,
                yOffset: 0,
            },
            backupData: null,
            isReadingBackupFile: false,
        }

        // Refs.
        this.contentContainerRef = React.createRef();

        // Method Bindings.
        this.getPageJSX = this.getPageJSX.bind(this);
        this.handleSidebarItemClick = this.handleSidebarItemClick.bind(this);
        this.handleGetDatabaseInfoClick = this.handleGetDatabaseInfoClick.bind(this);
        this.handlePurgeCompletedTasksButtonClick = this.handlePurgeCompletedTasksButtonClick.bind(this);
        this.handleOpenDialogResult = this.handleOpenDialogResult.bind(this);
        this.handleRestoreDatabaseCompleteDialogClosing = this.handleRestoreDatabaseCompleteDialogClosing.bind(this);
        this.handleStartInFullscreenChange = this.handleStartInFullscreenChange.bind(this);
        this.handleStartLockedChange = this.handleStartLockedChange.bind(this);
        this.handleOkButtonClick = this.handleOkButtonClick.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleCSSPropertyChange = this.handleCSSPropertyChange.bind(this);
        this.handlePurgeCompletedTasksButtonClick = this.handlePurgeCompletedTasksButtonClick.bind(this);
        this.handleRestoreDatabaseButtonClick = this.handleRestoreDatabaseButtonClick.bind(this);
        this.handleAppSettingsKeyDown = this.handleAppSettingsKeyDown.bind(this);
        this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
        this.handleAppSettingsMenuContainerClick = this.handleAppSettingsMenuContainerClick.bind(this);
        this.handleColorPickerCloseButtonClick = this.handleColorPickerCloseButtonClick.bind(this);
        this.handleDefaultAllColorsButtonClick = this.handleDefaultAllColorsButtonClick.bind(this);
        this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
        this.handleSelectFileClick = this.handleSelectFileClick.bind(this);
        this.getWaitingOnDatabaseOverlayJSX = this.getWaitingOnDatabaseOverlayJSX.bind(this);
    }

    render() {
        var contentsJSX = this.getPageJSX();
        var waitingOnDatabaseOverlayJSX = this.getWaitingOnDatabaseOverlayJSX();
        return (
            <OverlayMenuContainer onKeyDown={this.handleAppSettingsKeyDown}>
                    <div className="AppSettingsMenuContainer" onClick={this.handleAppSettingsMenuContainerClick}>
                        {waitingOnDatabaseOverlayJSX}
                        <div className="AppSettingsMenuSidebarContentFlexContainer">
                            {/* Sidebar */}
                            <div className="AppSettingsMenuSidebarContainer">
                                <AppSettingsSidebar menuPage={this.props.menuPage} onItemClick={this.handleSidebarItemClick} />
                            </div>

                            {/* Content */}
                            <div className="AppSettingsMenuContentContainer" ref={this.contentContainerRef}>
                                {contentsJSX}
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="AppSettingsMenuFooterContainer">
                            <div className="AppSettingsMenuFooterFloatContainer">
                                <Button text="Close" onClick={this.handleOkButtonClick} />
                            </div>
                        </div>
                    </div>
            </OverlayMenuContainer>
        )
    }

    getWaitingOnDatabaseOverlayJSX() {
        if (this.props.isDatabaseRestoring) {
            return (
                <div className="WaitingOnDatabaseOverlay">
                    <CenteringContainer>
                        <Spinner size="big"/>
                    </CenteringContainer>
                </div>
            )
        }
    }

    handleAppSettingsMenuContainerClick() {
        // Close Color Picker if it's open.
        if (this.state.colorPicker.index !== -1) {
            this.setState({
                colorPicker: {
                    index: -1,
                    xOffset: 0,
                    yOffset: 0,
                }
            })
        }
    }

    handleAppSettingsKeyDown(e) {
        if (e.key === "Escape") {
            this.props.dispatch(setIsAppSettingsOpen(false));
        }
    }

    handleCSSPropertyChange(propertyName, value) {
        var newConfig = {...this.props.cssConfig};
        newConfig[propertyName] = value;

        this.props.dispatch(setCSSConfigAsync(newConfig));
    }

    handleColorPickerCloseButtonClick() {
        // Close Color Picker.
        this.setState({
            colorPicker: {
                index: -1,
                xOffset: 0,
                yOffset: 0,
            }
        })
    }

    handleOkButtonClick() {
        this.props.dispatch(setIsAppSettingsOpen(false));
    }

    handleStartLockedChange(newValue) {
        this.props.dispatch(setGeneralConfigAsync({...this.props.generalConfig, startLocked: newValue}));
    }

    handleStartInFullscreenChange(newValue) {
        this.props.dispatch(setGeneralConfigAsync({...this.props.generalConfig, startInFullscreen: newValue}));
    }

    handleGetDatabaseInfoClick() {
        this.props.dispatch(getDatabaseInfoAsync());
    }

    handleRegisterButtonClick(email, password, displayName) {
        this.props.dispatch(registerNewUserAsync(email, password, displayName));
    }

    getPageJSX() {
        var menuPage = this.props.menuPage === "" ? "general" : this.props.menuPage;
        switch(menuPage) {
            case "general":
                return (
                    <GeneralSettingsPage projects={this.props.projects} generalConfig={this.props.generalConfig}
                    onStartInFullscreenChange={this.handleStartInFullscreenChange} onStartLockedChange={this.handleStartLockedChange}
                    onFavouriteProjectSelectChange={this.handleFavouriteProjectSelectChange} accountConfig={this.props.accountConfig}
                    cssConfig={this.props.cssConfig} onCSSPropertyChange={this.handleCSSPropertyChange} 
                    contentContainerRef={this.contentContainerRef} onColorPickerClick={this.handleColorPickerClick}
                    colorPicker={this.state.colorPicker} onColorPickerCloseButtonClick={this.handleColorPickerCloseButtonClick}
                    onDefaultAllColorsButtonClick={this.handleDefaultAllColorsButtonClick}/>
                )
            break;

            case "account":
                return (
                    <AccountSettingsPage authStatusMessage={this.props.authStatusMessage} isLoggingIn={this.props.isLoggingIn}
                    isLoggedIn={this.props.isLoggedIn} userEmail={this.props.userEmail}
                    onLogInButtonClick={(email, password) => {this.props.dispatch(logInUserAsync(email,password))}}
                    onLogOutButtonClick={() => {this.props.dispatch(logOutUserAsync())}}
                    onRegisterButtonClick={this.handleRegisterButtonClick} displayName={this.props.displayName}/>
                )
            break;

            case "database":
                return (
                    <DatabaseSettingsPage databaseInfo={this.props.databaseInfo} isDatabasePurging={this.props.isDatabasePurging} 
                        onGetDatabaseInfoClick={this.handleGetDatabaseInfoClick} onRestoreDatabaseButtonClick={this.handleRestoreDatabaseButtonClick}
                        onPurgeCompletedTasksButtonClick={this.handlePurgeCompletedTasksButtonClick} isLoggedIn={this.props.isLoggedIn}
                        onRequestDatabaseRestore={this.handleRequestDatabaseRestore} isDatabaseRestoring={this.props.isDatabaseRestoring}
                        restoreDatabaseStatusMessage={this.props.restoreDatabaseStatusMessage} onSelectFileClick={this.handleSelectFileClick}
                        isRestoreDatabaseCompleteDialogOpen={this.props.isRestoreDatabaseCompleteDialogOpen}
                        backupData={this.state.backupData} isReadingBackupFile={this.state.isReadingBackupFile}
                        />
                )
            break;
        }
    }

    handleDefaultAllColorsButtonClick() {
        this.props.dispatch(setMessageBox(true, "Are you Sure? A restart will be required to apply changes.", MessageBoxTypes.STANDARD,
            null, result => {
                if (result === "ok") {
                    this.props.dispatch(setMessageBox({}));
                    this.props.dispatch(setAllColorsToDefaultAsync());
                }

                else {
                    this.props.dispatch(setMessageBox({}));
                }
            }))
    }

    handleColorPickerClick(index, xOffset, yOffset) {
        this.setState({
            colorPicker: {
                index: index,
                xOffset: xOffset,
                yOffset: yOffset,
            }})
    }

    handleRestoreDatabaseButtonClick(localProjectIds, remoteProjectIds) {
        // Defer to Message Box for Confirmation.
        this.props.dispatch(setMessageBox(true, "Are you sure?", MessageBoxTypes.STANDARD, null,
            (result) => {
                if (result === "ok") {
                    this.props.dispatch(setIsDatabaseRestoringFlag(true));
                    

                    var currentLocalProjectIds = this.props.projects.map(project => {
                        if (project.isRemote === false) {
                            return project.uid;
                        }
                    })

                    // Unsubscribe after collecting currentLocalProjectIds.
                    this.props.dispatch(unsubscribeFromDatabaseAsync());
                    this.props.dispatch(selectProject(-1));
                    
                    restoreProjectsAsync(getFirestore, localProjectIds, remoteProjectIds,
                        this.state.backupData, currentLocalProjectIds).then(() => {
                            this.props.dispatch(setIsDatabaseRestoringFlag(false));
                            this.props.dispatch(subscribeToDatabaseAsync());
                        })
                }

                this.props.dispatch(setMessageBox({}));
            }))
    }

    handleSelectFileClick() {
        // Trigger Electron Dialog.
        var defaultPath = Path.join(getCurrentBackupDirectory(),"/");

        dialog.showOpenDialog({
            filters: [ { name: 'Javascript Object Notation', extensions: ['json']}],
            defaultpath: defaultPath,
        }, this.handleOpenDialogResult);
    }

    handleOpenDialogResult(fileNames) {
        if (fileNames === undefined) {
            // User didn't select anything.
            return;
        }

        else {
            this.setState({ isReadingBackupFile: true })

            var fileName = fileNames[0];

            readBackupFileAsync(fileName).then(data => {
                // Validate file by checking if the Validation key exists and is correct.
                if (data.validationKey === undefined || data.validationKey !== BACKUP_VALIDATION_KEY) {
                    var message = "File has missing or incorrect validation key, are you sure you selected the correct file?";
                    this.props.dispatch(postSnackbarMessage(message, false));
                    this.setState({ isReadingBackupFile: false });
                }

                // Check that the current User created this backup.
                else if (data.userId !== getUserUid()) {     
                    var message = "You cannot restore from another user's backup file.";               
                    this.props.dispatch(postSnackbarMessage(message, false));
                    this.setState({ isReadingBackupFile: false });
                }

                // All Good, pass the Data on.
                else {
                    this.setState({ 
                        backupData: data,
                        isReadingBackupFile: false 
                    });
                }

            }).catch(error => {
                var message = "Error while reading File. Code: " + error.code;
                this.dispatch(postSnackbarMessage(message, false));
                this.setState({ isReadingBackupFile: false });
            })
        }
    }

    handlePurgeCompletedTasksButtonClick() {
        // Defer to Message Box for Confirmation.
        this.props.dispatch(setMessageBox(true, "Are you sure?", MessageBoxTypes.STANDARD, null,
            (result) => {
                if (result === "ok") {
                    this.props.dispatch(purgeCompleteTasksAsync());
                }

                this.props.dispatch(setMessageBox({}));
            }))
    }

    handleFavouriteProjectSelectChange(projectId) {
        this.props.dispatch(setFavouriteProjectIdAsync(projectId));
    }

    handleRestoreDatabaseCompleteDialogClosing() {
        this.props.dispatch(setIsRestoreDatabaseCompleteDialogOpen(false));
    }

    

    handleSidebarItemClick(itemName) {
        this.props.dispatch(setAppSettingsMenuPage(itemName));
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projects,
        menuPage: state.appSettingsMenuPage,
        databaseInfo: state.databaseInfo,
        isDatabasePurging: state.isDatabasePurging,
        isDatabaseRestoring: state.isDatabaseRestoring,
        restoreDatabaseStatusMessage: state.restoreDatabaseStatusMessage,
        isRestoreDatabaseCompleteDialogOpen: state.isRestoreDatabaseCompleteDialogOpen,
        generalConfig: state.generalConfig,
        accountConfig: state.accountConfig,
        cssConfig: state.cssConfig,
        authStatusMessage: state.authStatusMessage,
        isLoggingIn: state.isLoggingIn,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        displayName: state.displayName,
    }
}

let VisibleAppSettingsMenu = connect(mapStateToProps)(AppSettingsMenu);

export default VisibleAppSettingsMenu;