import React from 'react';
import TaskText from './TaskText';
import DueDate from './DueDate';
import TaskCheckBox from './TaskCheckBox';
import TaskInfo from './TaskInfo';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'hammerjs';
import '../assets/css/Task.css';
import '../assets/css/TaskCheckBox.css'
import { DragSource } from 'react-dnd';
import NewCommentsIcon from '../assets/icons/NewCommentsIcon.svg';
import HasNotesIcon from '../assets/icons/HasNotesIcon.svg';


class Task extends React.Component {
    constructor(props){
        super(props);

        // Refs.
        this.taskContainerRef = null;

        this.setTaskContainerRef = element => {
            this.taskContainerRef = element;
        }

        // Hammer.
        this.hammer = null;

        // Method Bindings.
        this.forwardOnTaskClick = this.forwardOnTaskClick.bind(this);
        this.forwardKeyPress = this.forwardKeyPress.bind(this);
        this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
        this.handleTaskTouchStart = this.handleTaskTouchStart.bind(this);
        this.handleInputUnmounting = this.handleInputUnmounting.bind(this);
        this.handleDueDateClick = this.handleDueDateClick.bind(this);
        this.getTaskAssigneeJSX = this.getTaskAssigneeJSX.bind(this);
        this.handleTaskAssigneeClick = this.handleTaskAssigneeClick.bind(this);
        this.getTaskIndicatorPanelJSX = this.getTaskIndicatorPanelJSX.bind(this);
        this.getUnreadCommentsIndicatorJSX = this.getUnreadCommentsIndicatorJSX.bind(this);
        this.handleTaskNoteIndicatorClick = this.handleTaskNoteIndicatorClick.bind(this);

    }

    componentDidMount() {
        if (this.props.enableKioskMode) {
            var hammer = new Hammer(this.taskContainerRef, { domEvents: false });
            hammer.on('press', event => {
                if (event.pointerType !== "mouse") {
                    if (this.props.isTaskInfo === false && this.props.isInputOpen === false) {
                        // Open Task Inspector
                        this.props.onTaskInspectorOpen(this.props.taskId);
                    }
                }  
            })
        }
    }

    componentWillUnmount() {
        if (this.props.enableKioskMode) {
            Hammer.off(this.taskContainerRef, 'press');
        }
    }

    render() {
        var taskIndicatorPanelJSX = this.getTaskIndicatorPanelJSX();

        return this.props.connectDragSource(
                <div ref={this.setTaskContainerRef} className="TaskContainer" data-isselected={this.props.isSelected} data-ismoving={this.props.isMoving}>
                    <div className="Task" data-ishighpriority={this.props.isHighPriority} data-iscomplete={this.props.isComplete}>
                        <div className={"TaskCheckBox"} >
                            <TaskCheckBox isChecked={this.props.isComplete} onCheckBoxClick={this.handleCheckBoxClick}
                            disableAnimations={this.props.disableAnimations} />
                        </div>
                        <div className="TaskClickContainer" onClick={this.forwardOnTaskClick} onTouchStart={this.handleTaskTouchStart}>
                            <div className="TaskTextContainer">
                                <TaskText text={this.props.text} isInputOpen={this.props.isInputOpen} isComplete={this.props.isComplete}
                                    onKeyPress={this.forwardKeyPress} onInputUnmounting={this.handleInputUnmounting}
                                />
                            </div>
                        </div>
                        <div className="DueDateContainer">
                            <DueDate dueDate={this.props.dueDate} onClick={this.handleDueDateClick} isComplete={this.props.isComplete}
                                isCalendarOpen={this.props.isCalendarOpen}
                                />
                        </div>
                    
                </div>
                    {taskIndicatorPanelJSX}
                    {this.getBottomBorderJSX(this.props)}
                </div>
        )
    }


    getTaskAssigneeJSX() {
        if (this.props.assignedToDisplayName !== "") {
            return (
                <div className="TaskAssignee" onClick={this.handleTaskAssigneeClick}>
                    <div className="TaskAssigneeDisplayName"> {this.props.assignedToDisplayName} </div>
                </div>
            )
        }
    }

    getTaskIndicatorPanelJSX() {
        var taskAssigneeJSX = this.getTaskAssigneeJSX();
        var unreadCommentsIndicatorJSX = this.getUnreadCommentsIndicatorJSX();
        var noteIndicatorJSX = this.getNoteIndicatorJSX();

        return (
            <div className="TaskIndicatorPanelContainer" data-ishighpriority={this.props.isHighPriority}
                onClick={this.forwardOnTaskClick} onTouchStart={this.handleTaskTouchStart}>
                {taskAssigneeJSX}
                {unreadCommentsIndicatorJSX}
                {noteIndicatorJSX}
            </div>
        )
    }

    getUnreadCommentsIndicatorJSX() {
        if (this.props.hasUnseenComments === true) {
            return (
                <img className="UnreadTaskCommentsIndicator" src={NewCommentsIcon} onClick={this.handleUnreadCommentsIndicatorClick}/>
            )
        }
    }

    getNoteIndicatorJSX() {
        if (this.props.note !== undefined && this.props.note.length > 0) {
            return (
                <img className="TaskNoteIndicator" src={HasNotesIcon} onClick={this.handleTaskNoteIndicatorClick}/>
            )
        }
    }

    handleTaskNoteIndicatorClick(e) {
        this.props.onTaskInspectorOpen(this.props.taskId);
    }

    handleUnreadCommentsIndicatorClick(e) {
        this.props.onTaskInspectorOpen(this.props.taskId);
    }

    handleTaskAssigneeClick(e) {
        this.props.onTaskInspectorOpen(this.props.taskId);
    }

    getBottomBorderJSX(props) {
        if (props.renderBottomBorder) {
            return (
                <div className="TaskBottomBorder"/>
            )
        }
    }

    handleDueDateClick() {
        this.props.onTaskInspectorOpen(this.props.taskId);
    } 

    handleInputUnmounting(data) {
        this.props.onInputUnmounting(data, this.props.text, this.props.taskId, this.props.metadata);
    }
    
    handleTaskTouchStart(touchEvent) {
        if (touchEvent.touches.length === 2) {
            this.props.onTaskTwoFingerTouch(this.props.taskId);
        }
    }

    forwardOnTaskClick(e) {
        this.props.handleClick(this.props.taskId);
    }

    forwardKeyPress(e, newData) {
        this.props.onKeyPress(e, this.props.taskId, newData, this.props.text, this.props.metadata);
    }

    handleCheckBoxClick(e, incomingValue) {
        this.props.onTaskCheckBoxClick(e, this.props.taskId, incomingValue, this.props.isComplete, this.props.metadata);
    }
}

let type = 'task';

let spec = {
    canDrag: (props, monitor) => {
        return props.isInputOpen === false;
    },

    beginDrag: (props, monitor, component) => {
        return {
            taskId: props.taskId,
        }
    },

    endDrag: (props, monitor, component) => {
        if (monitor.didDrop()) {
            props.onDragDrop(props.taskId, monitor.getDropResult().targetTaskListWidgetId);
        }
    }
}

let collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

let DraggableTask = DragSource(type, spec, collect)(Task);
export default DraggableTask;
