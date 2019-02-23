import React from 'react';
import { Button, Zoom, Typography } from '@material-ui/core';

import withMouseOver from './Hocs/withMouseOver';

const ExpandingButton = (props) => {
    return (
        <Button
            color={props.color}
            onClick={props.onClick}>
            { props.iconComponent }
            <Zoom
            in={props.mouseOver}
            mountOnEnter={true}
            unmountOnExit={true}>
                <Typography
                color={props.color}> { props.text } </Typography>
            </Zoom>
        </Button>
    );
};

export default withMouseOver(ExpandingButton);