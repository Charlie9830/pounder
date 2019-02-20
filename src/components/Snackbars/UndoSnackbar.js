import React from 'react';
import { Snackbar, Typography, SnackbarContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SnackbarActionButton from './SnackbarActionButton';

let styles = theme => {
    return {
        root: {
            background: theme.palette.secondary.main
        }
    }
    
}

const UndoSnackbar = (props) => {
    let { classes } = props;

    return (
        <Snackbar
            open={props.isOpen}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
            <SnackbarContent
                className={classes['root']}
                message={<Typography> {props.text} </Typography>}
                action={
                    <SnackbarActionButton
                        text="Undo"
                        onClick={props.onUndo}
                    />} />
        </Snackbar>
    );
};

export default withStyles(styles)(UndoSnackbar);