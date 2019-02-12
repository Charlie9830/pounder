import React, { Component } from 'react';
import TaskListToolbar from './TaskListToolbar';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import Color from 'color';
import colorString from 'color-string';
import TransitionList from './TransitionList/TransitionList';
import ResizeBottomRightIcon from '../icons/ResizeBottomRightIcon';

let containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '[Toolbar]auto [Tasks]1fr',
}


const styles = theme => {
    
    let basePaperStyle = {
        width: `calc(100% - ${theme.spacing.unit}px)`,
        height: '100%',
        marginLeft: `${theme.spacing.unit / 2}px`,
        marginRight: `${theme.spacing.unit / 2}px`,
        marginTop: `${theme.spacing.unit / 2}px`,
    }

    return {
        unFocused: {
            ...basePaperStyle,
            background: theme.palette.background.paper,
        },

        focused: {
            ...basePaperStyle,
            background: getFocusedBackgroundColor(theme.palette.background.paper),
        }
    }
}

class TaskList extends Component {
    render() {
        let { classes } = this.props;
        let paperClassName = this.props.isFocused ? classes['focused'] : classes['unFocused'];

        return (
            <Paper 
            className={paperClassName}
            onClick={this.props.onClick}>
                <div
                id={this.props.scrollTargetId} 
                style={containerStyle}>
                    <div style={{ gridRow: 'Toolbar' }}>
                        <TaskListToolbar
                        onSettingsMenuOpen={this.props.onSettingsMenuOpen}
                        onSettingsMenuClose={this.props.onSettingsMenuClose}
                        name={this.props.name}
                        isFocused={this.props.isFocused}
                        taskListSettings={this.props.taskListSettings}
                        onTaskListSettingsChanged={this.props.onTaskListSettingsChanged} 
                        isSettingsMenuOpen={this.props.isSettingsMenuOpen}
                        onRenameButtonClick={this.props.onRenameTaskListButtonClick}
                        onDeleteButtonClick={this.props.onDeleteButtonClick}
                        onChecklistSettingsButtonClick={this.props.onChecklistSettingsButtonClick}
                        onMoveTaskListButtonClick={this.props.onMoveTaskListButtonClick}/>
                    </div>

                    <div style={{ gridRow: 'Tasks', overflowY: 'scroll' }}>
                        <TransitionList>
                            { this.props.children }
                        </TransitionList>
                        
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '4px'
                    }}>
                        <ResizeBottomRightIcon
                        color="disabled"/>
                    </div>

                </div>
            </Paper>
        );
    }
}

let getFocusedBackgroundColor = (startingColor) => {
    let color = colorString.get(startingColor);

    return Color.rgb(color.value).lighten(0.35).hex();
}

export default withStyles(styles)(TaskList);