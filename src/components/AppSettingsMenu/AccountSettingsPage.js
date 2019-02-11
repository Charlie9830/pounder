import React from 'react';

import { Grid, TextField, Button,  Typography, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import {
    logInUserAsync, logOutUserAsync, registerNewUserAsync,
    sendPasswordResetEmailAsync, setIsInRegisterMode
} from 'handball-libs/libs/pounder-redux/action-creators';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const PAGE_STATES = {
    loggedIn: "loggedIn",
    loggedOut: "loggedOut",
    loggingIn: "loggingIn",
    newAccount: "newAccount",
}



class AccountSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // Class Storage.
        this.lastEnteredEmail = "";

        // Refs.
        this.emailInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
        this.displayNameInputRef = React.createRef();

        // Method Bindings.
        this.handleLogInButtonClick = this.handleLogInButtonClick.bind(this);
        this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
        this.handleRegisterActionButtonClick = this.handleRegisterActionButtonClick.bind(this);
        this.getActionsJSX = this.getActionsJSX.bind(this);
        this.handlePasswordResetButtonClick = this.handlePasswordResetButtonClick.bind(this);
        this.handleSignInActionButtonClick = this.handleSignInActionButtonClick.bind(this);
        this.getFormJSX = this.getFormJSX.bind(this);
        this.getTitleJSX = this.getTitleJSX.bind(this);
        this.getBoiledDownPageState = this.getBoiledDownPageState.bind(this);
        this.handlePasswordInputKeyUp = this.handlePasswordInputKeyUp.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isInRegisterMode !== this.props.isInRegisterMode) {
            if (this.props.isInRegisterMode && this.refs.emailInput !== undefined) {
                this.refs.emailInput.focus();
            }
        }
    }
    

    render() {
        let boiledDownPageState = this.getBoiledDownPageState();

        return (
            <Grid container 
            direction="column"
            justify="space-around"
            alignItems="center">

            <Grid item>
                    <AccountCircleIcon color="primary" style={{width: `96px`, height: `96px`, marginTop: `32px`}}/>
            </Grid>

            <Grid item>
                { this.getTitleJSX(boiledDownPageState) }
            </Grid>

            <Grid item>
                { this.getFormJSX(boiledDownPageState) }
            </Grid>
            
            <Grid item style={{marginTop: `48px`}}>
                { this.getActionsJSX(boiledDownPageState) }
            </Grid>
                
            </Grid>
            
        ) 
    }

    getBoiledDownPageState() {
        if (this.props.isLoggingIn === true) {
            return PAGE_STATES.loggingIn
        }

        if (this.props.isLoggedIn === false && this.props.isInRegisterMode === true) {
            return PAGE_STATES.newAccount;
        }

        if (this.props.isLoggedIn === true && this.props.isInRegisterMode === false) {
            return PAGE_STATES.loggedIn;
        }

        if (this.props.isLoggedIn === false && this.props.isInRegisterMode === false) {
            return PAGE_STATES.loggedOut;
        }
    }

    getTitleJSX(boiledDownPageState) {
        let text = "";

        switch(boiledDownPageState) {
            case PAGE_STATES.loggingIn:
            text = "Logging In";
            break;

            case PAGE_STATES.loggedIn:
            text = "Logged in";
            break;

            case PAGE_STATES.loggedOut:
            text = "Logged out";
            break;

            case PAGE_STATES.newAccount:
            text = "Create new account";
            break;

            default:
            text = "Unknown"
            break;
        }

        let textStyle = {
            marginTop: `16px`,
            marginBottom: '16px',
        }

        return (
            <Grid container
            direction="column"
            justify="center"
            alignItems="center">
                <Typography color="textSecondary" style={textStyle}>
                    {text}
                </Typography>
            </Grid>
        )
    }

    getFormJSX(boiledDownPageState) {
        let contentsJSX = null;

        switch(boiledDownPageState) {
            // Logging In.
            case PAGE_STATES.loggingIn:
            contentsJSX = (
                <React.Fragment>
                    <CircularProgress/>
                </React.Fragment>
            )
            break;

            case PAGE_STATES.loggedOut:
            // Logged Out
            let emailDefaultValue = this.lastEnteredEmail === "" ? this.props.userEmail : this.lastEnteredEmail;

            contentsJSX = (
                <React.Fragment>
                    <Grid container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center">
                        <TextField 
                        key="email"
                        type="email"
                        defaultValue={emailDefaultValue}
                        label="Email"
                        inputRef={this.emailInputRef}
                        onKeyUp={(e) => { if (e.key === "Enter") { this.passwordInputRef.current.focus() }}}/>

                        <TextField
                        key="password"
                        type="password"
                        label="Password"
                        inputRef={this.passwordInputRef}
                        onKeyUp={this.handlePasswordInputKeyUp} />
                    </Grid>
    
                    <Grid item style={{ marginTop: '48px' }}>
                        <Button variant="contained" onClick={this.handleLogInButtonClick}>
                            Log In
                        </Button>
                    </Grid>
                </React.Fragment>
            )
            break;

            case PAGE_STATES.newAccount:
            // Creating New Account.
            contentsJSX = (
                <React.Fragment>
                    <Grid container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center">
                        <TextField
                        key="displayName"
                        label="Display Name"
                        inputRef={this.displayNameInputRef}
                        onKeyUp={(e) => { if (e.key === "Enter") { this.emailInputRef.current.focus() }}}/>

                        <TextField
                        key="email"
                        type="email"
                        defaultValue={this.props.userEmail}
                        label="Email"
                        inputRef={this.emailInputRef}
                        onKeyUp={(e) => { if (e.key === "Enter") { this.passwordInputRef.current.focus() }}}/>

                        <TextField
                        key="password"
                        type="password"
                        label="Password"
                        inputRef={this.passwordInputRef} 
                        onKeyUp={(e) => { if (e.key === "Enter") { this.handleRegisterButtonClick() }}}/>
                    </Grid>
    
                    <Grid item style={{ marginTop: '48px' }}>
                        <Button variant="contained" onClick={this.handleRegisterButtonClick}>
                            Create Account
                        </Button>
                    </Grid>
                </React.Fragment>
            )
            break;

            case PAGE_STATES.loggedIn:
            // Logged In
            let buttonStyle = {
                marginTop: '16px',
                marginBottom: '16px'
            }

            contentsJSX = (
                <React.Fragment>
                    <Grid container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center">
                        <Typography color="textPrimary"> {this.props.displayName} </Typography>
                        <Typography color="textSecondary"> {this.props.userEmail} </Typography>
                    </Grid>

                    <Button style={buttonStyle} variant="contained" onClick={() => {this.props.dispatch(logOutUserAsync())}}>
                        Log Out
                    </Button>
                </React.Fragment>
            )
            break;

            default:
            break;
        }

        return (
            <Grid container
                direction="column"
                justify="space-around"
                alignItems="center">
                {contentsJSX}
            </Grid>
        )
    }

    handlePasswordInputKeyUp(e) {
        if (e.key === "Enter") {
            this.handleLogInButtonClick();
        }
    }

    getActionsJSX(boiledDownPageState) {
        var jsxContents = null;

        if (boiledDownPageState === PAGE_STATES.loggedOut) {
            // Logged Out.
            jsxContents =  (
                <React.Fragment>
                    <Typography>
                        New to Handball?
                    </Typography>
                    <Button variant="text" color="secondary" onClick={this.handleRegisterActionButtonClick}>
                        Register here
                    </Button>
                </React.Fragment>
            )
        }

        if (boiledDownPageState === PAGE_STATES.newAccount) {
            // Registering.
            jsxContents = (
                <React.Fragment>
                    <Typography>
                        Already have an account?
                    </Typography>
                    <Button variant="text" color="secondary" onClick={this.handleSignInActionButtonClick}>
                        Sign In
                    </Button>
                </React.Fragment>
            )
        }

        if (boiledDownPageState === PAGE_STATES.loggedIn) {
            jsxContents = (
                <React.Fragment>
                    <Button variant="text" color="secondary">
                        Change Password
                    </Button>
                </React.Fragment>
            )
        }

        return (
            <Grid container
            direction="row"
            justify="flex-start"
            alignItems="center">
                {jsxContents}
            </Grid>
        )
    }

    handlePasswordResetButtonClick() {
        this.props.dispatch(sendPasswordResetEmailAsync());
    }

    handleRegisterButtonClick() {
        var email = this.emailInputRef.current.value;
        var password = this.passwordInputRef.current.value;
        var displayName = this.displayNameInputRef.current.value;

        this.props.dispatch(registerNewUserAsync(email, password, displayName));
    }

    handleRegisterActionButtonClick() {
        this.props.dispatch(setIsInRegisterMode(true));
    }

    handleSignInActionButtonClick() {
        this.props.dispatch(setIsInRegisterMode(false));
    }

    handleLogInButtonClick() {
        var email = this.emailInputRef.current.value;
        var password = this.passwordInputRef.current.value;
        
        this.lastEnteredEmail = email;

        this.props.dispatch(logInUserAsync(email, password));
    }
}

const mapStateToProps = state => {
    return {
        authStatusMessage: state.authStatusMessage,
        isLoggingIn: state.isLoggingIn,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        displayName: state.displayName,
        isInRegisterMode: state.isInRegisterMode,
    }
}

let VisibleAccountSettingsPage = connect(mapStateToProps)(AccountSettingsPage);
export default VisibleAccountSettingsPage;