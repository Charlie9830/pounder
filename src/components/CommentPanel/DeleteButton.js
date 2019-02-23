import React from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteButton = (props) => {
    return (
        <IconButton
        onClick={props.onClick}>
            <DeleteIcon fontSize="small"/>
        </IconButton>
    );
};

export default DeleteButton;