import React from 'react';
import CommentIcon from '@material-ui/icons/Comment';
import NotesIcon from '@material-ui/icons/Notes';
import Assignment from './Assignment';
import { withTheme } from '@material-ui/core';

let gridStyle = {
    display: 'grid',
    gridTemplateRows: '[Content]auto',
    gridTemplateColumns: '[UnreadComments]auto [Notes]auto [Assignment]1fr',
    gridTemplateAreas: 'UnreadComments Notes Assignment',
    paddingLeft: '4px',
}

const IndicatorPanel = (props) => {
    let { theme } = props;
    let commentIconJSX = props.hasUnseenComments === true ? <CommentIcon fontSize="small" color="action"/> : null;
    let notesIconJSX = props.hasNote === true ? <NotesIcon fontSize="small" color="disabled"/> : null;
    let assignedToJSX = props.assignedTo !== -1 ? <Assignment displayName={props.assignedToDisplayName} /> : null;

    return (
        <div style={gridStyle}>
            {/* Unread Comments  */} 
            <div style={{gridArea: 'UnreadComments', paddingLeft: `${theme.spacing.unit}px`}}>
                { commentIconJSX }
            </div>

            {/* Notes  */} 
            <div style={{gridArea: 'Notes', paddingLeft: `${theme.spacing.unit}px`}}>
                { notesIconJSX }
            </div>

            {/* Assignment  */} 
            <div style={{gridArea: 'Assignment', placeSelf: 'center flex-end', paddingRight: `${theme.spacing.unit}px`}}>
                { assignedToJSX }
            </div>
            
        </div>
    );
};

export default withTheme()(IndicatorPanel);