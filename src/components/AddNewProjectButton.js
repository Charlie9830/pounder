import React from 'react';
import { Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

const AddProjectTaskButton = (props) => {
    return (
        <Button
            variant="text"
            color="secondary"
            onClick={props.onClick}
            disabled={props.disabled}>
            <AddIcon />
            Create Project
        </Button>
    );
};

export default AddProjectTaskButton;