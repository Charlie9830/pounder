import React from 'react';
import { Button, Grow, Typography } from '@material-ui/core';

import withMouseOver from './Hocs/withMouseOver';

const ExpandingButton = (props) => {
    return (
        <Button
            color={props.color}
            onClick={props.onClick}>
            { props.iconComponent }
            <Grow
            style={{transformOrigin: 'left center'}}
            in={props.mouseOver}
            mountOnEnter={true}
            unmountOnExit={true}>
                <Typography
                color={props.color}> { props.text } </Typography>
            </Grow>
        </Button>
    );
};

export default withMouseOver(ExpandingButton);