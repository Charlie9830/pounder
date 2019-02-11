import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import MemberStatusIcon from './MemberStatusIcon';
import KickUserButton from './KickUserButton';
import ChangeRankButton from './ChangeRankButton';

const MemberListItem = (props) => {
    let changeRankButton = (
        <ChangeRankButton
                    disabled={props.isUpdating}
                    canBeDemoted={props.canBeDemoted}
                    canPromote={props.role === "member"}
                    onPromote={props.onPromote}
                    onDemote={props.onDemote} />
    )

    let kickUserButton = (
        <KickUserButton
        disabled={props.isUpdating}
        canKick={props.canBeKicked}
        onClick={props.onKick} />
    )

    return (
        <ListItem disabled={props.isUpdating}>
            <ListItemIcon>
                <MemberStatusIcon status={props.status} />
            </ListItemIcon>

            <ListItemText primary={props.displayName} secondary={props.email} />

            <ListItemSecondaryAction>
                {props.allowElevatedPrivileges && kickUserButton}
                {props.allowElevatedPrivileges && changeRankButton}
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default MemberListItem;