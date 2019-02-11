import React, { Component } from 'react';
import TaskListToolbar from './TaskListToolbar';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import Color from 'color';
import colorString from 'color-string';
import TransitionList from './TransitionList/TransitionList';

let containerStyle = {
    width: '100%',
    flexGrow: '1',
    display: 'grid',
    gridTemplateRows: '[Toolbar]auto [Tasks]1fr',
    overflowX: 'hidden',
}



const styles = theme => {
    
    let basePaperStyle = {
        width: `calc(100% - ${theme.spacing.unit * 2}px)`,
        marginLeft: `${theme.spacing.unit}px`,
        marginRight: `${theme.spacing.unit}px`,
        marginTop: `${theme.spacing.unit}px`,
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

                    <div style={{ gridRow: 'Tasks' }}>
                        <TransitionList>
                            { this.props.children }
                        </TransitionList>
                        
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