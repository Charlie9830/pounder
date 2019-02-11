import React from 'react';
import { Button, CircularProgress, Typography } from '@material-ui/core';

let containerStyle = {
    width: '100%',
    minHeight: '48px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    justifyItems: 'center'
}

const ShowMoreButton = (props) => {
    if (props.isLoadingMore) {
        return (
            <div style={containerStyle}>
                <CircularProgress/>
            </div>
            
        )
    }

    if (props.hasMoreComments) {
        return (
            <div style={containerStyle}>
                <Button variant="text" onClick={props.onClick}> Show more </Button>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <Typography
                variant="caption"
                color="textSecondary">
                No more comments
               </Typography>
        </div>
    )
};

export default ShowMoreButton;