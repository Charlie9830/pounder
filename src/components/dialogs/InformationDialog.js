import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const InformationDialog = (props) => {
    return (
        <Dialog open={props.isOpen}>
            <DialogTitle> {props.title} </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={props.onOkay}> Okay </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InformationDialog;