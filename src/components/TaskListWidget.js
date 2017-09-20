import React from 'react';
import TaskArea from '../components/TaskArea';
import Task from '../components/Task';
import ListToolbar from '../components/ListToolbar';
import '../assets/css/TaskListWidget.css';
import TaskListSettingsStore from '../stores/TaskListSettingsStore';


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
        this.handleTaskInputUnmounting = this.handleTaskInputUnmounting.bind(this);
        this.handleShowCompleteTasksChanged = this.handleShowCompleteTasksChanged.bind(this);
        this.handleDueDateClick = this.handleDueDateClick.bind(this);
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
    }
    

    render(){
        var builtTasks = [];
        if (this.props.tasks != undefined) {
            // Sort Tasks.
            var sortedTasks = this.props.tasks.concat().sort(this.taskSortHelper);

            builtTasks = sortedTasks.map((item, index) => {
                // Bail out if Task isn't meant to be Visible.
                if (!this.props.settings.isCompleteTasksShown && item.isComplete) {
                    return;
                }

                // Render Element.
                var isTaskSelected = item.uid === this.props.selectedTaskId;
                var isTaskInputOpen = item.uid === this.props.openTaskInputId;
                var isTaskMoving = item.uid === this.props.movingTaskId;
                var isCalendarOpen = item.uid === this.props.openCalendarId;

                return (
                    <Task key={index} taskId={item.uid} text={item.taskName} dueDate={item.dueDate}
                    isSelected={isTaskSelected} isInputOpen={isTaskInputOpen} isComplete={item.isComplete} isMoving={isTaskMoving}
                    handleClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick}
                    OnKeyPress={this.handleKeyPress} onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}
                    onInputUnmounting={this.handleTaskInputUnmounting} onDueDateClick={this.handleDueDateClick}
                    isCalendarOpen={isCalendarOpen} onNewDateSubmit={this.handleNewDateSubmit}/>
                )
            })
        }

        var style = this.props.isFocused ? "IsFocused" : "IsNotFocused";
        return (
            <div className={style} onClick={this.handleWidgetClick}>
                <ListToolbar headerText={this.props.taskListName} isHeaderOpen={this.props.isHeaderOpen}
                 onHeaderDoubleClick={this.handleHeaderDoubleClick} onHeaderSubmit={this.handleTaskListHeaderSubmit}
                 onRemoveButtonClick={this.handleRemoveButtonClick} 
                 onShowCompleteTasksChanged={this.handleShowCompleteTasksChanged}
                 isCompleteTasksShown={this.props.settings.isCompleteTasksShown}/>
                <TaskArea> {builtTasks} </TaskArea>
            </div>
        )
    }

    handleDueDateClick(taskId) {
        this.props.onDueDateClick(this.props.taskListWidgetId, taskId);
    }

    handleShowCompleteTasksChanged(newValue) {
        var newTaskListSettings = new TaskListSettingsStore(this.props.settings.isCompleteTasksShown);
        newTaskListSettings.isCompleteTasksShown = newValue;

        this.props.onSettingsChanged(this.props.taskListWidgetId, newTaskListSettings);
    }

    handleTaskInputUnmounting(data, taskId) {
        // A TaskTextInput is Unmounting. Meaning that the Task has lost focus whilst text was still pending inside an open
        // input. Handle Data Changes.
        this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, data);
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
        if (e.key == "Enter") {
            // Handle Data Changes.
            this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, newData)
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

    taskSortHelper(a, b) {
        return a.isComplete - b.isComplete;
    }

    handleNewDateSubmit(taskId, newDate) {
        this.props.onNewDateSubmit(this.props.taskListWidgetId, taskId, newDate);
    }

}

export default TaskListWidget;
