import React from 'react';
import TaskArea from '../components/TaskArea';
import Task from '../components/Task';
import ListToolbar from '../components/ListToolbar';
import '../assets/css/TaskListWidget.css';


class TaskListWidget extends React.Component {
    constructor(props){
        super(props);

        this.handleTaskClick = this.handleTaskClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
        this.handleHeaderDoubleClick = this.handleHeaderDoubleClick.bind(this);
        this.handleTaskListHeaderSubmit = this.handleTaskListHeaderSubmit.bind(this);
        this.handleTaskCheckBoxClick = this.handleTaskCheckBoxClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
    }

    componentDidMount(){
        var _this = this;
    }
    

    render(){
        var builtTasks = [];
        if (this.props.tasks != undefined) {
            builtTasks = this.props.tasks.map((item, index) => {
                // Render element as selected or not selected.
                var isTaskSelected = item.uid === this.props.selectedTaskId;
                var isTaskInputOpen = item.uid === this.props.openTaskInputId;
                var isTaskMoving = item.uid === this.props.movingTaskId;

                return (
                    <Task key={index} taskId={item.uid} text={item.taskName} daysRemaining={item.daysRemaining}
                    isSelected={isTaskSelected} isInputOpen={isTaskInputOpen} isComplete={item.isComplete} isMoving={isTaskMoving}
                    handleClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick}
                    OnKeyPress={this.handleKeyPress} onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}/>
                )
            })
        }

        var style = this.props.isFocused ? "IsFocused" : "IsNotFocused";

        return (
            <div className={style} onClick={this.handleWidgetClick}>
                <ListToolbar headerText={this.props.taskListName} isHeaderOpen={this.props.isHeaderOpen}
                 onHeaderDoubleClick={this.handleHeaderDoubleClick} onHeaderSubmit={this.handleTaskListHeaderSubmit}
                 onRemoveButtonClick={this.handleRemoveButtonClick}/>
                <TaskArea> {builtTasks} </TaskArea>
            </div>
        )
    }

    handleTaskTwoFingerTouch(taskId) {
        this.props.onTaskTwoFingerTouch(this.props.taskListWidgetId, taskId);
    }

    handleWidgetClick(e) {
        this.props.onWidgetClick(this.props.taskListWidgetId, this.props.isFocused);
    }

    handleTaskClick(element) {
        this.props.onTaskClick(element, this.props.taskListWidgetId);
    }

    handleKeyPress(e, taskId, newData) {
        var _this = this;

        // Enter Key.
        if (e.key == "Enter"){
            // Handle Data Changes.
            this.props.onTaskSubmit(this.props.taskListWidgetId,taskId, newData)
            }   
    }

    handleHeaderDoubleClick() {
        this.props.onHeaderDoubleClick(this.props.taskListWidgetId);
    }

    handleTaskListHeaderSubmit(newData) {
        this.props.onHeaderSubmit(this.props.taskListWidgetId, newData);
    }

    handleTaskCheckBoxClick(e, taskId, incomingValue) {
        this.props.onTaskCheckBoxClick(e, this.props.taskListWidgetId, taskId, incomingValue);
    }

    handleRemoveButtonClick(e) {
        this.props.onRemoveButtonClick(this.props.taskListWidgetId);
    }
}

export default TaskListWidget;
