import React from 'react';
import { withTheme } from '@material-ui/core';

const ColorChit = (props) => {
    let { theme } = props;
    let chitStyle = {
        flexGrow: 0,
        flexShrink: 0,
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: props.color
    }

    let containerStyle = {
        flexGrow: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: props.isSelected ? '0px' : '8px',
        width: props.isSelected ? '24px' : '16px',
        height: props.isSelected ? '24px' : '16px',
        borderRadius: '50%',
        background: theme.palette.action.selected,
        transition: theme.transitions.create(['width', 'height', 'margin']),
    }

    return (
        <div
            style={containerStyle}>
            <div
                style={chitStyle}
                onClick={props.onClick} />
        </div>
    )
};

export default withTheme()(ColorChit);