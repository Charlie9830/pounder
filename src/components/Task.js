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
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
        this.handlePriorityToggleClick = this.handlePriorityToggleClick.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
        this.getTaskAssigneeJSX = this.getTaskAssigneeJSX.bind(this);
        this.getAssigneeDisplayName = this.getAssigneeDisplayName.bind(this);
        this.handleTaskAssigneeClick = this.handleTaskAssigneeClick.bind(this);
        this.getTaskInfoOverlayJSX = this.getTaskInfoOverlayJSX.bind(this);
        this.handleTaskNoteChange = this.handleTaskNoteChange.bind(this);
        this.handleTaskInfoOutsideChildBoundsClick = this.handleTaskInfoOutsideChildBoundsClick.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
    }

    componentDidMount() {
        if (this.props.enableKioskMode) {
            var hammer = new Hammer(this.taskContainerRef, { domEvents: false });
            hammer.on('press', event => {
                if (event.pointerType !== "mouse") {
                    if (this.props.isTaskInfo === false && this.props.isInputOpen === false) {
                        // Open Metadata.
                        this.props.onTaskInfoOpen(this.props.taskId);
                    }

                    else {
                        // Close Metadata.
                        this.props.onTaskInfoClose();
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
        var taskAssigneeJSX = this.getTaskAssigneeJSX();
        var taskInfoOverlayJSX = this.getTaskInfoOverlayJSX();

        return this.props.connectDragSource(
                <div ref={this.setTaskContainerRef} className="TaskContainer" data-isselected={this.props.isSelected} data-ismoving={this.props.isMoving}>
                    {taskInfoOverlayJSX}
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
                                isCalendarOpen={this.props.isCalendarOpen} onNewDateSubmit={this.handleNewDateSubmit}
                                projectMembers={this.props.projectMembers} onAssignToMember={this.handleAssignToMember}
                                onPriorityToggleClick={this.handlePriorityToggleClick} isHighPriority={this.props.isHighPriority}
                                assignedTo={this.props.assignedTo} />
                        </div>
                    {taskAssigneeJSX}
                </div>
                    {this.getBottomBorderJSX(this.props)}
                </div>
        )
    }

    getTaskAssigneeJSX() {
        if (this.props.assignedTo !== -1) {
            var displayName = this.getAssigneeDisplayName(this.props.assignedTo);

            return (
                <div className="TaskAssigneeContainer" data-ishighpriority={this.props.isHighPriority}
                    onClick={this.forwardOnTaskClick} onTouchStart={this.handleTaskTouchStart}>
                    <div className="TaskAssignee" onClick={this.handleTaskAssigneeClick}>
                        <div className="TaskAssigneeDisplayName"> {displayName} </div>
                    </div>
                </div>
            )
        }
    }

    getAssigneeDisplayName(userId) {
        var member = this.props.projectMembers.find(item => {
            return item.userId === userId;
        })

        if (member !== undefined) {
            return member.displayName;
        }
    }

    getTaskInfoOverlayJSX() {
        if (this.props.isTaskInfoOpen) {
            return (
                <OverlayMenuContainer onOutsideChildBoundsClick={this.handleTaskInfoOutsideChildBoundsClick}>
                    <TaskInfo projectMembersLookup={this.props.projectMembersLookup} onTaskNoteChange={this.handleTaskNoteChange} 
                        metadata={this.props.metadata} note={this.props.note} onNewComment={this.handleNewComment}
                        isGettingTaskComments={this.props.isGettingTaskComments} taskComments={this.props.taskComments}
                        projectMembers={this.props.projectMembers}/>
                </OverlayMenuContainer>
            )
        }
    }
    
    handleNewComment(value) {
        this.props.onNewComment(this.props.taskId, value, this.props.metadata);
    }

    handleTaskInfoOutsideChildBoundsClick() {
        this.props.onTaskInfoClose();
    }

    handleTaskNoteChange(newValue, oldValue) {
        this.props.onTaskNoteChange(newValue, oldValue, this.props.taskId, this.props.metadata);
    }

    handleTaskAssigneeClick(e) {
        e.stopPropagation();
        this.handleDueDateClick();
    }

    handleAssignToMember(userId) {
        this.props.onAssignToMember(userId, this.props.assignedTo, this.props.taskId);
    }

    getBottomBorderJSX(props) {
        if (props.renderBottomBorder) {
            return (
                <div className="TaskBottomBorder"/>
            )
        }
    }
    handlePriorityToggleClick(newValue) {
        this.props.onPriorityToggleClick(this.props.taskId, newValue, this.props.isHighPriority, this.props.metadata);
    }

    handleDueDateClick() {
        this.props.onDueDateClick(this.props.taskId);
    } 

    handleInputUnmounting(data) {
        this.props.onInputUnmounting(data, this.props.text, this.props.taskId, this.props.metadata);
    }
    
    handleTaskTouchStart(touchEvent) {
        console.log("Phew it will work");
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

    handleNewDateSubmit(newDate) {
        this.props.onNewDateSubmit(this.props.taskId, newDate, this.props.dueDate, this.props.metadata);
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
