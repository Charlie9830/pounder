import React from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

let container = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
}

const TaskSecondaryActions = (props) => {
    return (
        <div style={container}>
            <IconButton
            onClick={props.onDeleteTaskButtonClick}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
};

export default TaskSecondaryActions;