import React from 'react';
import { Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

const AddNewTaskListButton = (props) => {
    return (
        <Button variant="text" color="secondary" onClick={props.onClick}>
            <AddIcon /> Create List
        </Button>
    );
};

export default AddNewTaskListButton;