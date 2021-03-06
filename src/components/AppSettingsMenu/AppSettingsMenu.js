import React from 'react';
import GeneralSettingsPage from './GeneralSettingsPage';
import VisibleAccountSettingsPage from './AccountSettingsPage';
import AboutPage from './AboutPage';
import { connect } from 'react-redux';
import {
    setAppSettingsMenuPage, setFavouriteProjectIdAsync, setGeneralConfigAsync,
    setIsAppSettingsOpen,
} from 'handball-libs/libs/pounder-redux/action-creators';

import { AppBar, IconButton, Typography, Toolbar, Tabs, Tab, Grid } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import FullScreenView from '../../layout-components/FullScreenView';
import ReleaseNotesPage from './ReleaseNotesPage';
import ShortcutsPage from './ShortcutsPage';

const issuesURL = "https://www.github.com/Charlie9830/Pounder/issues";

class AppSettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            openColorPickerIndex: -1,
        }

        // Refs
        this.menuContentContainerRef = React.createRef();

        // Method Bindings.
        this.getPageJSX = this.getPageJSX.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleSortProjectsBySelectorChange = this.handleSortProjectsBySelectorChange.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.openColorPickerIndex !== this.state.openColorPickerIndex) {
            if (this.state.openColorPickerIndex === -1) {
                // Color Picker is closing. Reset Scroll Postion.
                this.menuContentContainerRef.current.scrollTop = this.scrollPositionBuffer;
                this.scrollPositionBuffer = 0;
            }
        }
    }

    render() {
        var contentsJSX = this.getPageJSX()
        
        return (
            <FullScreenView>
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography variant="h6">
                            Settings
                            </Typography>
                        <Grid
                            container
                            direction="row-reverse"
                            justify="flex-start"
                            alignItems="center">
                            <IconButton
                                onClick={() => { this.props.dispatch(setIsAppSettingsOpen(false)) }}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Toolbar>
                    <Tabs
                        variant="fullWidth"
                        value={this.props.menuPage}
                        onChange={(e, newValue) => { this.props.dispatch(setAppSettingsMenuPage(newValue)) }}>
                        <Tab label="General" value="general" />
                        <Tab label="Account" value="account" />
                        <Tab label="About" value="about" />
                        <Tab label="Release Notes" value="release-notes"/>
                        <Tab label="Shortcuts" value="shortcuts"/>
                    </Tabs>
                </AppBar>

                {contentsJSX}
            </FullScreenView>  
        )
    }

    getPageJSX() {
        var menuPage = this.props.menuPage === "" ? "general" : this.props.menuPage;

        switch(menuPage) {
            case "general":
                return (
                    <GeneralSettingsPage 
                    projects={this.props.projects}
                    generalConfig={this.props.generalConfig}
                    onFavouriteProjectSelectChange={this.handleFavouriteProjectSelectChange}
                    accountConfig={this.props.accountConfig}
                    onSortProjectsBySelectorChange={this.handleSortProjectsBySelectorChange}
                    />
                )

            case "account":
                return (
                    <VisibleAccountSettingsPage/>
                )
            case "about":
            return (
                <AboutPage issuesURL={issuesURL}/>
            )

            case "release-notes":
                return (
                    <ReleaseNotesPage/>
                )

            case "shortcuts":
                return (
                    <ShortcutsPage/>
                )   

            default: 
                return (<div/>)
        }
    }

    handleSortProjectsBySelectorChange(newValue) {
        this.props.dispatch(setGeneralConfigAsync({...this.props.generalConfig, sortProjectsBy: newValue}))
    }

    handleIsFirstTimeBootChange(value) {
        var generalConfig = this.props.generalConfig;
        generalConfig.isFirstTimeBoot = false;
        this.props.dispatch(setGeneralConfigAsync(generalConfig));
    }

    handleDisableAnimationsChange(newValue) {
        this.props.dispatch(setGeneralConfigAsync({...this.props.generalConfig, disableAnimations: newValue}));
    }

    handleFavouriteProjectSelectChange(projectId) {
        this.props.dispatch(setFavouriteProjectIdAsync(projectId));
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projects,
        menuPage: state.appSettingsMenuPage,
        generalConfig: state.generalConfig,
        accountConfig: state.accountConfig,
        cssConfig: state.cssConfig,
        authStatusMessage: state.authStatusMessage,
        isLoggingIn: state.isLoggingIn,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        displayName: state.displayName,
        isInRegisterMode: state.isInRegisterMode,
    }
}

let VisibleAppSettingsMenu = connect(mapStateToProps)(AppSettingsMenu);

export default VisibleAppSettingsMenu;