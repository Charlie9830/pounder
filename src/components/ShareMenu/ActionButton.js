import React from 'react';
import { Button } from '@material-ui/core';

const ActionButton = (props) => {
    return (
        <Button
            { ...props }
            style={{ margin: '8px' }}
            onClick={props.onClick}
            variant='outlined'>
            {props.children}
        </Button>
    );
};

export default ActionButton;