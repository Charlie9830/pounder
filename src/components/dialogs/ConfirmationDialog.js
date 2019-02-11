import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const ConfirmationDialog = (props) => {
    return (
        <Dialog open={props.isOpen}>
            <DialogTitle> {props.title} </DialogTitle>
            <DialogContent>
                <DialogContentText> {props.text} </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onNegative}> {props.negativeButtonText} </Button>
                <Button onClick={props.onAffirmative} color="secondary"> {props.affirmativeButtonText} </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;