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
        width: '100%',
        height: '100%',
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
    constructor(props) {
        super(props);
        
        // Method Bindings.
        this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    }
    


    componentDidMount(){
        if (this.props.isFocused) {
            document.addEventListener('keydown', this.handleDocumentKeyDown);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isFocused !== this.props.isFocused) {
            if (this.props.isFocused) {
                document.addEventListener('keydown', this.handleDocumentKeyDown);
            }

            else {
                document.removeEventListener('keydown', this.handleDocumentKeyDown);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

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

                    <div style={{ gridRow: 'Tasks', overflowY: 'auto' }}>
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

    handleDocumentKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            this.props.onArrowKeyDown('down');
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
           this.props.onArrowKeyDown('up');
        }
    }
}

let getFocusedBackgroundColor = (startingColor) => {
    let color = colorString.get(startingColor);

    return Color.rgb(color.value).lighten(0.35).hex();
}

export default withStyles(styles)(TaskList);