import React from 'react';
import Sidebar from 'react-sidebar';
import GeneralSettingsPage from './GeneralSettingsPage';
import DatabaseSettingsPage from './DatabaseSettingsPage';
import AccountSettingsPage from './AccountSettingsPage';
import AppSettingsSidebar from './AppSettingsSidebar';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';
import '../../assets/css/ToolBarButton.css';
import electron from 'electron';
import { connect } from 'react-redux';
import { setAppSettingsMenuPage, getDatabaseInfoAsync, purgeCompleteTasksAsync, setFavouriteProjectIdAsync,
        setRestoreDatabaseStatusMessage, setIsDatabaseRestoringFlag, setCSSConfigAsync,
        setIsRestoreDatabaseCompleteDialogOpen, setGeneralConfigAsync, setIsAppSettingsOpen} from 'pounder-redux/action-creators';
import { validateFileAsync, restoreFirebaseAsync } from '../../utilities/FileHandling';
import MessageBox from '../MessageBox';
import { getFirestore } from 'pounder-firebase';


let dialog = electron.remote.dialog;

class AppSettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getPageJSX = this.getPageJSX.bind(this);
        this.handleSidebarItemClick = this.handleSidebarItemClick.bind(this);
        this.handleGetDatabaseInfoClick = this.handleGetDatabaseInfoClick.bind(this);
        this.handlePurgeCompletedTasksButtonClick = this.handlePurgeCompletedTasksButtonClick.bind(this);
        this.handleRequestDatabaseRestore = this.handleRequestDatabaseRestore.bind(this);
        this.handleOpenDialogResult = this.handleOpenDialogResult.bind(this);
        this.handleRestoreDatabaseCompleteDialogClosing = this.handleRestoreDatabaseCompleteDialogClosing.bind(this);
        this.handleStartInFullscreenChange = this.handleStartInFullscreenChange.bind(this);
        this.handleStartLockedChange = this.handleStartLockedChange.bind(this);
        this.handleOkButtonClick = this.handleOkButtonClick.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleCSSPropertyChange = this.handleCSSPropertyChange.bind(this);
    }

    componentDidMount() {
    }

    render() {
        var contentsJSX = this.getPageJSX()

        return (
            <div className="AppSettingsContainer">
                <div className="AppSettingsOuter">
                    <div className="AppSettingsInner">
                        <div className="AppSettingsCentered">
                            <div className="AppSettingsMenuContainer">
                                <div className="AppSettingsMenuSidebarContentFlexContainer">
                                    {/* Sidebar */}
                                    <div className="AppSettingsMenuSidebarContainer">
                                        <AppSettingsSidebar menuPage={this.props.menuPage} onItemClick={this.handleSidebarItemClick} />
                                    </div>

                                    {/* Content */}
                                    <div className="AppSettingsMenuContentContainer">
                                        {contentsJSX}
                                    </div>
                                </div>
                                {/* Footer */}
                                <div className="AppSettingsMenuFooterContainer">
                                    <div className="AppSettingsMenuFooterFloatContainer">
                                        <div className="ToolBarButtonContainer" onClick={this.handleOkButtonClick}>
                                            <label className="ToolBarButton"> Ok </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleCSSPropertyChange(propertyName, value) {
        var newConfig = {...this.props.cssConfig};
        newConfig[propertyName] = value;

        this.props.dispatch(setCSSConfigAsync(newConfig));
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

    getPageJSX() {
        var menuPage = this.props.menuPage === "" ? "general" : this.props.menuPage;

        switch(menuPage) {
            case "general":
                return (
                    <GeneralSettingsPage projects={this.props.projects} generalConfig={this.props.generalConfig}
                    onStartInFullscreenChange={this.handleStartInFullscreenChange} onStartLockedChange={this.handleStartLockedChange}
                    onFavouriteProjectSelectChange={this.handleFavouriteProjectSelectChange} accountConfig={this.props.accountConfig}
                    cssConfig={this.props.cssConfig} onCSSPropertyChange={this.handleCSSPropertyChange}/>
                )
            break;

            case "account":
                return (
                    <AccountSettingsPage/>
                )
            break;

            case "database":
                return (
                    <DatabaseSettingsPage databaseInfo={this.props.databaseInfo} isDatabasePurging={this.props.isDatabasePurging} 
                        onGetDatabaseInfoClick={this.handleGetDatabaseInfoClick}
                        onPurgeCompletedTasksButtonClick={this.handlePurgeCompletedTasksButtonClick}
                        onRequestDatabaseRestore={this.handleRequestDatabaseRestore} isDatabaseRestoring={this.props.isDatabaseRestoring}
                        restoreDatabaseStatusMessage={this.props.restoreDatabaseStatusMessage}
                        isRestoreDatabaseCompleteDialogOpen={this.props.isRestoreDatabaseCompleteDialogOpen}
                        onRestoreDatabaseCompleteDialogClosing={this.handleRestoreDatabaseCompleteDialogClosing}
                        />
                )
            break;
        }
    }

    handleFavouriteProjectSelectChange(projectId) {
        this.props.dispatch(setFavouriteProjectIdAsync(projectId));
    }

    handleRestoreDatabaseCompleteDialogClosing() {
        this.props.dispatch(setIsRestoreDatabaseCompleteDialogOpen(false));
    }

    handleRequestDatabaseRestore() {
        dialog.showOpenDialog({
            filters: [ { name: 'Javascript Object Notation', extensions: ['json']}]
        }, this.handleOpenDialogResult)
    }

    handleOpenDialogResult(fileNames) {
        if (fileNames === undefined) {
            // User didn't select anything.
            return;
        }

        else {
            var fileName = fileNames[0];
            this.props.dispatch(setIsDatabaseRestoringFlag(true));

            restoreFirebaseAsync(getFirestore, fileName).then(() => {
                this.props.dispatch(setIsDatabaseRestoringFlag(false));
                this.props.dispatch(setRestoreDatabaseStatusMessage("Database restored"));
                this.props.dispatch(setIsRestoreDatabaseCompleteDialogOpen(true));
            }).catch(error => {
                // Database failed to Restore.
                this.props.dispatch(setIsDatabaseRestoringFlag(false));
                this.props.dispatch(setRestoreDatabaseStatusMessage("Database restore failed. Reason: " + error));
                this.props.dispatch(setIsRestoreDatabaseCompleteDialogOpen(true));
            })   
        }
    }

    handlePurgeCompletedTasksButtonClick() {
        this.props.dispatch(purgeCompleteTasksAsync());
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
        cssConfig: state.cssConfig
    }
}

let VisibleAppSettingsMenu = connect(mapStateToProps)(AppSettingsMenu);

export default VisibleAppSettingsMenu;