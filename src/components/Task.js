import React from 'react';
import TaskText from './TaskText';
import DueDate from './DueDate';
import TaskCheckBox from './TaskCheckBox';
import TaskMetadata from './TaskMetadata';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'hammerjs';
import '../assets/css/Task.css';
import '../assets/css/TaskCheckBox.css'


class Task extends React.Component {
    constructor(props){
        super(props);

        // Refs.
        this.taskContainerRef = React.createRef();

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
        this.getTaskOrMetadata = this.getTaskOrMetadata.bind(this);
        this.handleTaskMetadataCloseButtonClick = this.handleTaskMetadataCloseButtonClick.bind(this);
    }

    componentDidMount() {
        var hammer = new Hammer(this.taskContainerRef.current, { domEvents: true });
        hammer.on('press', event => {
                if (this.props.isMetadataOpen === false) {
                    // Open Metadata.
                    this.props.onMetadataOpen(this.props.taskId);
                }

                else {
                    // Close Metadata.
                    this.props.onTaskMetadataCloseButtonClick();
                }
        })
    }

    componentWillUnmount() {
        Hammer.off(this.taskContainerRef.current, 'swipe');
    }

    /* className="TaskContainer" */

    render() {
        var taskOrMetadata = this.getTaskOrMetadata();
        


        return (
            <div ref={this.taskContainerRef} className="TaskContainer" data-ismetadataopen={this.props.isMetadataOpen}>
                <div className="TaskTransitionArea">
                    <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                        {taskOrMetadata}
                    </TransitionGroup>
                    
                </div>
                {this.getBottomBorderJSX(this.props)}
            </div>
        )
    }

    getTaskOrMetadata() {
        if (this.props.isMetadataOpen !== true) {
            var currentClassName = "";
            if (this.props.isMoving) {
                currentClassName = "TaskMovingStyle"
            }
            else {
                currentClassName = this.props.isSelected ? 'TaskActiveStyle' : 'TaskInactiveStyle';
            }

            return (
                <CSSTransition classNames="TaskTransitionItem" timeout={250} mountOnEnter={true} unmountOnExit={true}
                 key="task">
                <div>
                    <div className={currentClassName} data-ishighpriority={this.props.isHighPriority} data-iscomplete={this.props.isComplete}>
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
                                onPriorityToggleClick={this.handlePriorityToggleClick} isHighPriority={this.props.isHighPriority} />
                        </div>
                    </div>
                </div>
                </CSSTransition>
            )
        }

        else {
            return (
                <CSSTransition classNames="MetadataTransitionItem" timeout={250} mountOnEnter={true} unmountOnExit={true}
                 key="metadata">
                    <div>
                        <TaskMetadata metadata={this.props.metadata} onCloseButtonClick={this.handleTaskMetadataCloseButtonClick}/>
                    </div>
                </CSSTransition>
            )
        }
    }

    handleTaskMetadataCloseButtonClick() {
        this.props.onTaskMetadataCloseButtonClick();
    }

    getBottomBorderJSX(props) {
        if (props.renderBottomBorder) {
            return (
                <div className="TaskBottomBorder"/>
            )
        }
    }
    handlePriorityToggleClick(newValue) {
        this.props.onPriorityToggleClick(this.props.taskId, newValue, this.props.metadata);
    }

    handleDueDateClick() {
        this.props.onDueDateClick(this.props.taskId);
    } 

    handleInputUnmounting(data) {
        this.props.onInputUnmounting(data, this.props.taskId, this.props.metadata);
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
        this.props.onKeyPress(e, this.props.taskId, newData, this.props.metadata);
    }

    handleCheckBoxClick(e, incomingValue) {
        this.props.onTaskCheckBoxClick(e, this.props.taskId, incomingValue, this.props.metadata);
    }

    handleNewDateSubmit(newDate) {
        this.props.onNewDateSubmit(this.props.taskId, newDate, this.props.metadata);
    }
}

export default Task;