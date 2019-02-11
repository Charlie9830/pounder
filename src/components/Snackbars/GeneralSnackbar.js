import React from 'react';
import { Snackbar, Typography, SnackbarContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SnackbarActionButton from './SnackbarActionButton';

let styles = theme => {
    let baseStyle = {
        margin: '8px',
    }
    return {
        information: {
            ...baseStyle,
            backgroundColor: theme.palette.primary.dark,
        },

        error: {
            ...baseStyle,
            backgroundColor: theme.palette.error.dark,
        }
    }
}

const GeneralSnackbar = (props) => {
    let { classes } = props;

    return (
        <Snackbar
            open={props.isOpen}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
            <SnackbarContent
                className={classes[props.type]}
                message={<Typography> {props.text} </Typography>}
                action={
                    <SnackbarActionButton
                        text={props.actionButtonText}
                        onClick={props.onAction}
                    />} />
        </Snackbar>
    );
};

export default withStyles(styles)(GeneralSnackbar);