import React from 'react';
import { withTheme } from '@material-ui/core';

const Divider = (props) => {
    let { theme } = props;

    if (props.show === false || props.show === undefined) {
        return  null;
    }

    else {
        return (
            <div
            style={{
                height: '1px',
                width: '100%',
                background: theme.palette.divider,
            }}/>
        )
    }
};

export default withTheme()(Divider);