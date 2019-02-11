import React from 'react';
import { Modal, Grid, CircularProgress, Typography } from '@material-ui/core';

const WaitingOverlay = (props) => {
    let gridStyle = {
        width: '100%',
        height: '100%',
    }

    return (
        <Modal open={props.open} disableAutoFocus={true}>
            <Grid container style={gridStyle}
                direction="column"
                justify="center"
                alignItems="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>

                    <Grid item>
                        <Typography align="center" variant="h6"> {props.message} </Typography>
                    </Grid>

                    <Grid item style={{marginTop: '32px'}}>
                        <Typography align="center" variant="h6"> {props.subMessage} </Typography>
                    </Grid>
                    
            </Grid>
        </Modal>
    )
}

export default WaitingOverlay;