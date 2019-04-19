import React from 'react';
import { Button, Grow, Typography, withStyles } from '@material-ui/core';

import withMouseOver from './Hocs/withMouseOver';

let styles = theme => {
    let base = {
        flexShrink: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

    return {
        collapsed: {
            ...base,
            width: '64px',
            transition: theme.transitions.create('width'),
        },

        expanded: {
            ...base,
            width: '132px', // Using Percents here causes objects next door to Snap into the smaller footprint instead of Sliding.
            transition: theme.transitions.create('width'),
        },

        textCollapsed: {
            ...base,
            width: '0%',
            overflowX: 'hidden',
        },

        textExpanded: {
            ...base,
            width: '100%',
            overflowX: 'hidden',
        }
    }
}

const ExpandingButton = (props) => {
    let { classes } = props;

    return (
        <div
        className={classes[ props.mouseOver ? 'expanded' : 'collapsed']}>
            <Button
                color={props.color}
                onClick={props.onClick}>
                {props.iconComponent}
 
                <div
                className={classes[ props.mouseOver ? 'textExpanded' : 'textCollapsed']}>
                    <Typography
                        color={props.color}
                        noWrap={true}>
                        {props.text}
                    </Typography>
                </div>
            </Button>
        </div>
    );
};

export default withStyles(styles)(withMouseOver(ExpandingButton));