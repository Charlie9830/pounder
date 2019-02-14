import React, { Component } from 'react';
import { ListItem, Typography } from '@material-ui/core';
import UnreadIndicator from './UnreadIndicator';
import withMouseOver from '../Hocs/withMouseOver';
import DeleteButton from './DeleteButton';

let gridStyle = {
    width: '100%',
    height: 'fit-content',
    minHeight: '48px',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: 'auto 1fr 1fr auto',
    gridTemplateAreas: `' UnreadIndicator DisplayName  .    Timestamp DeleteButton '
                        ' UnreadIndicator Text        Text  Text      DeleteButton '`
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

let deleteButtonContainer = {
    gridArea: 'DeleteButton',
    placeSelf: 'center flex-end'
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
                    
                    <div
                        style={deleteButtonContainer}>
                        {   
                            this.props.mouseOver &&
                            this.props.canDelete &&
                            <DeleteButton
                                onClick={this.props.onDeleteButtonClick} />
                        }
                        
                    </div>

                </div>
            </ListItem>
        );
    }
}

export default withMouseOver(Comment);