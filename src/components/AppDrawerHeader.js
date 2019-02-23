import React from 'react';
import { Toolbar, Typography, Grid, IconButton, withTheme, Button } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';


import AddIcon from '@material-ui/icons/Add';
import VisibleSyncMenu from './SyncMenu';
import CollapseHorizontalButton from './CollapseHorizontalButton';

const AppDrawerHeader = (props) => {
    let { theme } = props;

    let grid = {
        width: '100%',
        display: 'grid',
        gridTemplateRows: '[Toolbar]auto [Account]auto [Buttons]auto [NewProjectButton]auto',
        background: theme.palette.primary.main,
        paddingLeft: props.isCollapsed ? '0px' : '8px',
    }

    let buttonsContainer = {
        width: '100%',
        gridRow: 'Buttons',
        flexWrap: 'noWrap',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '8px',
        paddingBottom: '8px',
    }

    let collapseButton = (
        <CollapseHorizontalButton
            isCollapsed={props.isCollapsed}
            onClick={props.onCollapseButtonClick} />
    )

    let syncMenu = (
        <VisibleSyncMenu/>
    )

    if (props.isCollapsed) {
        return (
            <div
                style={grid}>
                <div style={{ gridRow: 'Toolbar' }}>
                    {collapseButton}
                </div>

                <div style={{ gridrow: 'Buttons' }}>
                    {syncMenu}
                </div>

                <div style={{ gridRow: 'NewProjectButton'}}>
                    <IconButton
                    color="secondary"
                    onClick={props.onAddProjectButtonClick}>
                        <AddIcon/>
                    </IconButton>
                </div>
            </div>
        )
    }

    return (
        <div 
        style={grid}>
            <div style={{ gridRow: 'Toolbar' }}>
                <Toolbar
                disableGutters={true}>
                    <Typography
                        variant="h6"> Handball </Typography>
                    <Grid container
                        direction="row-reverse"
                        justify="flex-start"
                        alignItems="center">
                            {collapseButton}
                    </Grid>
                </Toolbar>
            </div>

            <div style={{gridRow: 'Account'}}>
                <Typography variant="caption"> {props.displayName} </Typography>
            </div>

            <div style={buttonsContainer}>
                <IconButton onClick={props.onSettingsButtonClick}>
                    <SettingsIcon
                        fontSize="small" />
                </IconButton>

                {syncMenu}
 
            </div>
            
            <div style={{gridRow: 'NewProjectButton', paddingBottom: '8px' }}>
                <Button
                variant="outlined"
                color="secondary"
                onClick={props.onAddProjectButtonClick}>
                    <AddIcon/>
                    Create Project
                </Button>
            </div>

        </div>
    );
};

export default withTheme()(AppDrawerHeader);