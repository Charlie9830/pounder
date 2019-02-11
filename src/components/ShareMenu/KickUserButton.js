import React from 'react';
import { IconButton } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/RemoveCircle';

const KickUserButton = (props) => {
    if (!props.canKick) {
        return null;
    }

    return (
        <IconButton 
        disabled={props.disabled}
        onClick={props.onClick}>
            <RemoveIcon fontSize="small" />
        </IconButton>
    )
};

export default KickUserButton;


// var kickUserButtonJSX = isCurrentUserOwner && item.userId !== getUserUid() ? <IconButton onClick={() => {this.handleKickButtonClick(item.displayName, item.userId)}}> <RemoveIcon fontSize="small"/> </IconButton> : null;