import React from 'react';
import { Snackbar, Typography, SnackbarContent, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SnackbarActionButton from './SnackbarActionButton';
import UpdateAvailableIcon from '../../icons/UpdateAvailableIcon';

let styles = theme => {
    let baseStyle = {
        margin: '8px',
    }
    return {
        root: {
            ...baseStyle,
            backgroundColor: theme.palette.primary.main,
        },
    }
}

const UpdateAvailableSnackbar = (props) => {
    let { classes } = props;

    return (
        <Snackbar
            open={props.isOpen}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <SnackbarContent
                className={classes['root']}
                message={
                    <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <UpdateAvailableIcon
                    color="secondary"/>
                    <Typography style={{paddingLeft: '16px'}}> A new update is ready to install </Typography>
                    </Grid>
                }
                action={
                    <SnackbarActionButton
                        text='Install'
                        onClick={props.onInstall}
                    />} />
        </Snackbar>
    );
};

export default withStyles(styles)(UpdateAvailableSnackbar);