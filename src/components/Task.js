import React from 'react';
import TaskText from './TaskText';
import DueDate from './DueDate';
import TaskCheckBox from './TaskCheckBox';
import '../assets/css/Task.css';
import '../assets/css/TaskCheckBox.css'


class Task extends React.Component {
    constructor(props){
        super(props);

        this.forwardOnTaskClick = this.forwardOnTaskClick.bind(this);
        this.forwardKeyPress = this.forwardKeyPress.bind(this);
        this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
        this.handleTaskTouchStart = this.handleTaskTouchStart.bind(this);
        this.handleInputUnmounting = this.handleInputUnmounting.bind(this);
        this.handleDueDateClick = this.handleDueDateClick.bind(this);
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    }

    render() {
        var currentClassName = "";
        if (this.props.isMoving) {
            currentClassName = "TaskMovingStyle"
        }
        else {
            currentClassName = this.props.isSelected ? 'TaskActiveStyle' : 'TaskInactiveStyle';
        }
        

        return (
            <div className="TaskContainer">
                <div className={currentClassName}>
                    <div className={"TaskCheckBox"} >
                        <TaskCheckBox isChecked={this.props.isComplete} onCheckBoxClick={this.handleCheckBoxClick} />
                    </div>
                    <div className="TaskClickContainer" onClick={this.forwardOnTaskClick} onTouchStart={this.handleTaskTouchStart}>
                        <div className="TaskTextContainer">
                            <TaskText text={this.props.text} isInputOpen={this.props.isInputOpen} isComplete={this.props.isComplete}
                                onKeyPress={this.forwardKeyPress} onInputUnmounting={this.handleInputUnmounting} />
                        </div>
                    </div>
                    <div className="DueDateContainer">
                        <DueDate dueDate={this.props.dueDate} onClick={this.handleDueDateClick} isComplete={this.props.isComplete}
                            isCalendarOpen={this.props.isCalendarOpen} onNewDateSubmit={this.handleNewDateSubmit} />
                    </div>
                </div>
            </div>
            
        )
    }

    handleDueDateClick() {
        this.props.onDueDateClick(this.props.taskId);
    } 

    handleInputUnmounting(data) {
        this.props.onInputUnmounting(data, this.props.taskId);
    }
    
    handleTaskTouchStart(touchEvent) {
        if (touchEvent.touches.length === 2) {
            this.props.onTaskTwoFingerTouch(this.props.taskId);
        }
    }

    forwardOnTaskClick(e) {
        this.props.handleClick(this);
    }

    forwardKeyPress(e, newData) {
        this.props.OnKeyPress(e, this.props.taskId, newData);
    }

    handleCheckBoxClick(e, incomingValue) {
        this.props.onTaskCheckBoxClick(e, this.props.taskId, incomingValue);
    }

    handleNewDateSubmit(newDate) {
        this.props.onNewDateSubmit(this.props.taskId, newDate);
    }
}

export default Task;