import React from 'react';
import { Typography } from '@material-ui/core';

const DueDateChit = (props) => {
    if (props.count === 0) {
        return null;
    }

    let circleStyle = {
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        margin: '0px 2px',
        background: props.color,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }

    let countStyle = {
        lineHeight: '24px'
    }

    return (
        <div style={circleStyle}>
            <Typography style={countStyle}> {props.count} </Typography>
        </div>
    ) 
}

export default DueDateChit;