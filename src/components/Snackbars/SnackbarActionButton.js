import React from 'react';
import { Button } from '@material-ui/core';

const SnackbarActionButton = (props) => {
    if (props.text === '') {
        return null;
    }

    return (
        <Button
            color={props.color}
            variant="text"
            onClick={props.onClick}>
            {props.text}
        </Button>
    );
};

export default SnackbarActionButton;