import React from 'react';
import { Typography } from '@material-ui/core';

const TaskText = (props) => {
    return (
        <Typography> {props.text} </Typography>
    );
};

export default TaskText;