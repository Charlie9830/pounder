import React, { Component } from 'react';
import { ListItem, Typography } from '@material-ui/core';
import UnreadIndicator from './UnreadIndicator';

let gridStyle = {
    width: '100%',
    height: 'fit-content',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: 'auto 1fr 1fr',
    gridTemplateAreas: `' UnreadIndicator DisplayName  .    Timestamp '
                        ' UnreadIndicator Text        Text  Text     '`
}

let unreadIndicatorContainer = {
    gridArea: 'UnreadIndicator',
    placeSelf: 'stretch stretch',
}

let displayNameContainer = {
    gridArea: 'DisplayName',
    placeSelf: 'center flex-start '
}

let timestampContainer = {
    gridArea: 'Timestamp',
    placeSelf: 'center flex-end'
}

let textContainer = {
    gridArea: 'Text',
    placeSelf: 'center flex-start'
}

class Comment extends Component {
    render() {
        let timeAgo = this.props.isSynced || this.props.disableSyncStatus === true ? this.props.timeAgo : "Not Synced";

        return (
            <ListItem>
                <div style={gridStyle}>
                    <div
                    style={unreadIndicatorContainer}>
                        <UnreadIndicator show={this.props.isUnread}/>
                    </div>

                    <div 
                    style={displayNameContainer}>
                        <Typography color="textSecondary"> { this.props.displayName } </Typography>
                    </div>

                    <div 
                    style={timestampContainer}>
                        <Typography color="textSecondary" variant="caption"> { timeAgo } </Typography>
                    </div>

                    <div 
                    style={textContainer}>
                        <Typography color="textPrimary"> { this.props.text } </Typography>
                    </div>
                </div>
            </ListItem>
        );
    }
}

export default Comment;