import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Grid, IconButton, withTheme } from '@material-ui/core';



const StatusBar = (props) => {
    let { theme } = props;

    return (
        <React.Fragment>
        </React.Fragment>
    );
};

let mapStateToProps = state => {
    return {

    }
}

let VisibleStatusBar = connect(mapStateToProps)(withTheme()(StatusBar));
export default VisibleStatusBar;