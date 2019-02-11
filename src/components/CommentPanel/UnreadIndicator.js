import React from 'react';

import { withTheme } from '@material-ui/core';

const UnreadIndicator = (props) => {
    if (props.show === false) {
        return null;
    } 

    let { theme } = props;

    let style = {
        width: '8px',
        height: '100%',
        background: theme.palette.custom.unreadItem,
        marginRight: `${theme.spacing.unit}px`
    }

    return (
        <div style={style}/>
    );
};

export default withTheme()(UnreadIndicator);