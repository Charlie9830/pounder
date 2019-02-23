import React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { IconButton } from '@material-ui/core';


const CollapseHorizontalButton = (props) => {
    if (props.isCollapsed) {
        return (
            <IconButton
            onClick={props.onClick}>
                <ChevronRightIcon/>
            </IconButton>
        );
    }

    else {
        return (
            <IconButton
            onClick={props.onClick}>
                <ChevronLeftIcon/>
            </IconButton>
            );
    }

};

export default CollapseHorizontalButton;