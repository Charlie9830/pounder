import React from 'react';
import { IconButton, Typography, withTheme, Tooltip } from '@material-ui/core';
import ChecklistIcon from '@material-ui/icons/PlaylistAddCheck';
import TaskListSettingsMenu from './TaskListSettingsMenu';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AddIcon from '@material-ui/icons/Add';
import withMouseOver from './Hocs/withMouseOver';

const AddTaskButton = (props) => {
    return (   
        <IconButton
            onClick={props.onClick}>
            <AddIcon
                color="action" />
        </IconButton>
    )
}

const TaskListToolbar = (props) => {
    let { theme } = props;

    let toolbarStyle = {
        display: 'grid',
        gridTemplateColumns: '[Menu]auto [AddTaskButton]auto [Title]1fr [ChecklistIndicator]auto [DragHandle]auto',
        background: props.isFocused ? theme.palette.secondary.main : 'unset',
    }

    let checklistIndicator = (
        <IconButton onClick={props.onChecklistSettingsButtonClick}>
            <ChecklistIcon fontSize="small"/>
        </IconButton>
    )

    let isChecklist = props.taskListSettings.checklistSettings.isChecklist;
    let titleMarginLeft = calculateTitleMarginLeft(isChecklist, props.mouseOver, theme.spacing.isDense);

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
            style={{gridColumn: 'AddTaskButton', placeSelf: 'center'}}>
                { props.mouseOver && <AddTaskButton onClick={() => { props.onAddTaskButtonClick()}}/> }
            </div>
        
            <div
            style={{gridColumn: 'Title', placeSelf: 'center', marginLeft: `${titleMarginLeft}px` }}>
                <Typography variant="subtitle1"> {props.name} </Typography>
            </div>
            
            <div
            style={{gridColumn: 'ChecklistIndicator', placeSelf: 'center flex-end'}}>
                { isChecklist  && checklistIndicator }
            </div>

            <div
            style={{gridColumn: 'DragHandle', placeSelf: 'center flex-end', cursor: 'move'}}>
                <div className="rgl-drag-handle">
                    <DragIndicatorIcon
                        color="action" />
                </div>
            </div>

        </div>
    );
};

const calculateTitleMarginLeft = (isChecklist, mouseOver, isDense) => {
    let titleMarginLeft = 0;
    if (isChecklist) {
        titleMarginLeft =- 4;
    }

    if (mouseOver) {
        if (isDense) {
            titleMarginLeft += -40;
        }
        
        else {
            titleMarginLeft += -48;
        }
    }

    return titleMarginLeft;
}

export default withTheme()(withMouseOver(TaskListToolbar));