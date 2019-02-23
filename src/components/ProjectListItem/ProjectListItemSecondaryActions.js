import React from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share'; 

const ProjectListItemSecondaryActions = (props) => {
    return (
        <React.Fragment>
            <IconButton
                onClick={() => { props.onShareButtonClick() }}>
                <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton
                onClick={() => { props.onDeleteButtonClick() }}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
};

export default ProjectListItemSecondaryActions;