import React from 'react';
import { ListItem, Button } from '@material-ui/core';

const MemberListItem = (props) => {
    return (
        <ListItem
            onClick={props.onClick}
            selected={props.isSelected}>
            <Button variant="text"> {props.displayName} </Button>
        </ListItem>
    );
};

export default MemberListItem;