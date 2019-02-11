import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, Grid, IconButton, CircularProgress } from '@material-ui/core';

import AcceptIcon from '@material-ui/icons/Check';
import DenyIcon from '@material-ui/icons/Close';

const InviteListItem = (props) => {
    let { projectName, sourceEmail, isUpdating, onAccept, onDeny }  = props;

    let acceptDenyButtons = (
        <React.Fragment>
            <IconButton>
                <AcceptIcon onClick={onAccept} />
            </IconButton>
            <IconButton>
                <DenyIcon onClick={onDeny} />
            </IconButton>
        </React.Fragment>
    )

    let secondaryActionContent = isUpdating ? <CircularProgress size={20} /> : acceptDenyButtons;

    return (
            <ListItem>
                <ListItemText primary={projectName} secondary={sourceEmail} />
                <ListItemSecondaryAction>
                    <Grid container
                        direction="row-reverse"
                        justify="flex-start"
                        alignItems="center">
                        {secondaryActionContent}
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
    );
};

export default InviteListItem;