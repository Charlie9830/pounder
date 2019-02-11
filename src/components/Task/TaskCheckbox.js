import React from 'react';
import { Checkbox } from '@material-ui/core';

const TaskCheckbox = (props) => {
    return (
        <Checkbox checked={props.checked} onChange={(e) => props.onChange(e.target.checked, props.checked)}/>
    );
};

export default TaskCheckbox;