import React from 'react';

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { IconButton } from '@material-ui/core';

const PriorityToggle = (props) => {
    if (props.isHighPriority) {
        return (
            <IconButton onClick={() => { props.onToggle(false) }}>
                <StarIcon/>
            </IconButton>
            
        )
    }

    else {
        return (
            <IconButton onClick={() => { props.onToggle(true) }}>
                <StarBorderIcon />
            </IconButton>
        )
    }
};

export default PriorityToggle;