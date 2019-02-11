import React from 'react';
import { withTheme } from '@material-ui/core';

const PriorityIndicator = (props) => {
    let { theme } = props;

    if (props.isHighPriority === false) {
        return null;
    }

    
    else {
        let priorityStyle = {
            width: '8px',
            height: '100%',
            background: theme.palette.custom.highPriority,
        }

        return (
            <div style={priorityStyle}/>
        )
    }
};

export default withTheme()(PriorityIndicator);