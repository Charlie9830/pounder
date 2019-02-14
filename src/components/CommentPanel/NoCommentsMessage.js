import React from 'react';
import { Typography } from '@material-ui/core';

let container = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
}

const NoCommentsMessage = () => {
    return (
        <div
        style={container}>
            <Typography color="textSecondary"> No comments </Typography>
        </div>
    );
};

export default NoCommentsMessage;