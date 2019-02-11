import React from 'react';
import DueDateChit from './DueDateChit';
import UnseenCommentsChit from './UnseenCommentsChit';
import { ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, withTheme, Grid } from '@material-ui/core';

import FavouriteIcon from '@material-ui/icons/Favorite';


const ProjectListItem = (props) => {
    let { theme, name, isFavourite, indicators, isSelected, onClick } = props;
    return (
            <ListItem
                onClick={onClick}
                selected={isSelected}>
                {isFavourite && <ListItemIcon style={{ marginRight: '0px' }}><FavouriteIcon fontSize="small" color='disabled' /></ListItemIcon>}

                <ListItemText primary={name} />

                <ListItemSecondaryAction>
                    <Grid container
                        direction="row-reverse"
                        justify="flex-start"
                        alignItems="center">
                        {getDueDateChits(indicators, theme.palette.custom)}
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
    );
};

let getDueDateChits = (indicators, customColors) => {
    if (indicators === undefined) {
        return null;
    }

    let jsx = [];

    // Later
    if (indicators.later !== undefined || indicators.later !== 0) {
        jsx.push( <DueDateChit key="later" count={indicators.later} color={customColors.later}/> )
    }

    // Soon
    if (indicators.soon !== undefined || indicators.soon !== 0) {
        jsx.push( <DueDateChit key="soon" count={indicators.soon} color={customColors.soon}/> )
    }

    // Today
    if (indicators.today !== undefined || indicators.today !== 0) {
        jsx.push( <DueDateChit key="today" count={indicators.today} color={customColors.today}/> )
    }

    // Overdue
    if (indicators.overdue !== undefined || indicators.overdue !== 0) {
        jsx.push( <DueDateChit key="overdue" count={indicators.overdue} color={customColors.overdue}/> )
    }

    // Unseen Comments
    if (indicators.hasUnseenComments) {
        jsx.push( <UnseenCommentsChit key="unseen"/> )
    }

    return jsx;
}

export default withTheme()(ProjectListItem);