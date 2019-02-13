import React from 'react';
import { IconButton, Typography, withTheme } from '@material-ui/core';
import ChecklistIcon from '@material-ui/icons/PlaylistAddCheck';
import TaskListSettingsMenu from './TaskListSettingsMenu';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';


const TaskListToolbar = (props) => {
    let { theme } = props;

    let toolbarStyle = {
        display: 'grid',
        gridTemplateColumns: '[Menu]auto [Title]1fr [ChecklistIndicator]auto [DragHandle]auto',
        background: props.isFocused ? theme.palette.secondary.main : 'unset',
    }

    let checklistIndicator = (
        <IconButton onClick={props.onChecklistSettingsButtonClick}>
            <ChecklistIcon fontSize="small"/>
        </IconButton>
    )

    let isChecklist = props.taskListSettings.checklistSettings.isChecklist;

    return (
        <div 
        style={toolbarStyle}>
            <div 
            style={{ gridColumn: 'Menu', placeSelf: 'center' }}>
                <TaskListSettingsMenu
                onOpen={props.onSettingsMenuOpen}
                onClose={props.onSettingsMenuClose}
                isOpen={props.isSettingsMenuOpen}
                settings={props.taskListSettings}
                onRenameButtonClick={props.onRenameButtonClick}
                onSettingsChanged={props.onTaskListSettingsChanged}
                onDeleteButtonClick={props.onDeleteButtonClick}
                onChecklistSettingsButtonClick={props.onChecklistSettingsButtonClick}
                onMoveTaskListButtonClick={props.onMoveTaskListButtonClick} />
            </div>
        
            <div
            style={{gridColumn: 'Title', placeSelf: 'center', marginLeft: isChecklist ? '-4px' : '-24px' }}>
                <Typography variant="subtitle1"> {props.name} </Typography>
            </div>
            
            <div
            style={{gridColumn: 'ChecklistIndicator', placeSelf: 'center flex-end'}}>
                { isChecklist  && checklistIndicator }
            </div>

            <div
            style={{gridColumn: 'DragHandle', placeSelf: 'center flex-end'}}>
                <div className="rgl-drag-handle">
                    <DragIndicatorIcon
                        color="action" />
                </div>
            </div>

        </div>
            
         
        
    );
};

export default withTheme()(TaskListToolbar);