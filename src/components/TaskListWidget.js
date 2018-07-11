import React from 'react';
import TaskArea from '../components/TaskArea';
import Task from '../components/Task';
import ListToolbar from '../components/ListToolbar';
import '../assets/css/TaskListWidget.css';
import { TaskMetadataStore } from 'pounder-stores';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


class TaskListWidget extends React.Component {
    constructor(props){
        super(props);

        // Method Bindings.
        this.handleTaskClick = this.handleTaskClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
        this.handleHeaderDoubleClick = this.handleHeaderDoubleClick.bind(this);
        this.handleTaskListHeaderSubmit = this.handleTaskListHeaderSubmit.bind(this);
        this.handleTaskCheckBoxClick = this.handleTaskCheckBoxClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
        this.handleTaskInputUnmounting = this.handleTaskInputUnmounting.bind(this);
        this.handleDueDateClick = this.handleDueDateClick.bind(this);
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
        this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
        this.handleTaskPriorityToggleClick = this.handleTaskPriorityToggleClick.bind(this);
        this.handleTaskMetadataCloseButtonClick = this.handleTaskMetadataCloseButtonClick.bind(this);
        this.handleTaskMetadataOpen = this.handleTaskMetadataOpen.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
    }

    componentDidMount(){
        var _this = this;
    }

    render(){
        var builtTasks = [];

        if (this.props.tasks != undefined) {
            // Sort Tasks.
            var taskSorter = this.getTaskSorter(this.props)
            var sortedTasks = this.props.tasks.concat().sort(taskSorter);

            // Promote any new Tasks to begining of Array.
            var newTaskIndex = sortedTasks.findIndex(item => {
                return item.isNewTask === true;
            })

            if (newTaskIndex > 0) { // Catches -1 and 0 (no Promotion Required)
                sortedTasks.unshift(sortedTasks.splice(newTaskIndex, 1)[0]);
            }

            builtTasks = sortedTasks.map((item, index, array) => {
                // Bail out if Task isn't meant to be Visible.
                if (!this.props.settings.isCompleteTasksShown && item.isComplete) {
                    return;
                }

                // Render Element.
                var isTaskSelected = item.uid === this.props.selectedTaskId;
                var isTaskInputOpen = item.uid === this.props.openTaskInputId;
                var isTaskMoving = item.uid === this.props.movingTaskId;
                var isCalendarOpen = item.uid === this.props.openCalendarId;
                var isMetadataOpen = item.uid === this.props.openMetadataId;
                var renderBottomBorder = array.length !== 1 && index !== array.length - 1;
                var metadata = item.metadata === undefined ? Object.assign({}, new TaskMetadataStore("", "", "", "", "")) 
                : item.metadata; 
                var assignedTo = item.assignedTo === undefined ? -1 : item.assignedTo;

                return (
                    <CSSTransition key={item.uid} classNames="TaskContainer" timeout={500} mountOnEnter={true}>
                            <Task key={index} taskId={item.uid} text={item.taskName} dueDate={item.dueDate} isMetadataOpen={isMetadataOpen}
                                isSelected={isTaskSelected} isInputOpen={isTaskInputOpen} isComplete={item.isComplete} isMoving={isTaskMoving}
                                handleClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick}
                                onKeyPress={this.handleKeyPress} onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}
                                onInputUnmounting={this.handleTaskInputUnmounting} onDueDateClick={this.handleDueDateClick}
                                isCalendarOpen={isCalendarOpen} onNewDateSubmit={this.handleNewDateSubmit} onMetadataOpen={this.handleTaskMetadataOpen}
                                isHighPriority={item.isHighPriority} onTaskMetadataCloseButtonClick={this.handleTaskMetadataCloseButtonClick}
                                onPriorityToggleClick={this.handleTaskPriorityToggleClick} renderBottomBorder={renderBottomBorder}
                                metadata={metadata} disableAnimations={this.props.disableAnimations} projectMembers={this.props.projectMembers}
                                onAssignToMember={this.handleAssignToMember} assignedTo={assignedTo} />
                    </CSSTransition>
                )
            })
        }

        var style = this.props.isFocused ? "IsFocused" : "IsNotFocused";
        var isSettingsMenuOpen = this.props.openTaskListSettingsMenuId === this.props.taskListWidgetId;
        return (
            <div className={style} onClick={this.handleWidgetClick}>
                <ListToolbar headerText={this.props.taskListName} isHeaderOpen={this.props.isHeaderOpen}
                 onHeaderDoubleClick={this.handleHeaderDoubleClick} onHeaderSubmit={this.handleTaskListHeaderSubmit}
                 onRemoveButtonClick={this.handleRemoveButtonClick} isSettingsMenuOpen={isSettingsMenuOpen}
                 onTaskListSettingsChanged={this.handleTaskListSettingsChanged}
                 settings={this.props.settings} onSettingsButtonClick={this.handleSettingsButtonClick}
                 isFocused={this.props.isFocused}/>
                <TaskArea>
                    <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                        {builtTasks}
                    </TransitionGroup>
                </TaskArea>
            </div>
        )
    }

    handleAssignToMember(userId, taskId) {
        this.props.onAssignToMember(userId, taskId);
    }

    handleTaskMetadataOpen(taskId) {
        this.props.onTaskMetadataOpen(this.props.taskListWidgetId, taskId);
    }

    handleTaskMetadataCloseButtonClick() {
        this.props.onTaskMetadataCloseButtonClick();
    }

    handleTaskPriorityToggleClick(taskId, newValue, currentMetadata) {
        this.props.onTaskPriorityToggleClick(taskId, newValue, currentMetadata);
    }

    handleSettingsButtonClick() {
        this.props.onTaskListSettingsButtonClick(this.props.taskListWidgetId);
    }

    handleTaskListSettingsChanged(newSettings) {
        this.props.onSettingsChanged(this.props.taskListWidgetId, newSettings);
    }

    handleDueDateClick(taskId) {
        this.props.onDueDateClick(this.props.taskListWidgetId, taskId);
    }

    handleTaskInputUnmounting(data, taskId, currentMetadata) {
        // A TaskTextInput is Unmounting. Meaning that the Task has lost focus whilst text was still pending inside an open
        // input. Handle Data Changes.
        this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, data, currentMetadata);
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

    handleKeyPress(e, taskId, newData, currentMetadata) {
        // Enter Key.
        if (e.key == "Enter") {
            // Handle Data Changes.
            this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, newData, currentMetadata)
        }   
    }

    handleHeaderDoubleClick() {
        this.props.onHeaderDoubleClick(this.props.taskListWidgetId);
    }

    handleTaskListHeaderSubmit(newData) {
        this.props.onHeaderSubmit(this.props.taskListWidgetId, newData);
    }

    handleTaskCheckBoxClick(e, taskId, incomingValue, currentMetadata) {
        this.props.onTaskCheckBoxClick(e, this.props.taskListWidgetId, taskId, incomingValue, currentMetadata);
    }

    handleRemoveButtonClick(e) {
        this.props.onRemoveButtonClick(this.props.taskListWidgetId);
    }

    taskSortIsCompletedHelper(a, b) {
        return a.isComplete - b.isComplete;
    }

    taskSortPriorityHelper(a,b) {
        return b.isHighPriority - a.isHighPriority;
    }

    taskSortDueDateHelper(a, b) {
        var dueDateA = a.dueDate.length === 0 ? Infinity : new Date(a.dueDate);
        var dueDateB = b.dueDate.length === 0 ? Infinity : new Date(b.dueDate);
        return dueDateA - dueDateB;
    }

    taskSortDateAddedHelper(a, b) {
        var dateAddedA = new Date(a.dateAdded);
        var dateAddedB = new Date(b.dateAdded);
        return dateAddedA - dateAddedB;
    }

    taskSortAssigneeHelper(a,b) {
        var a = a.assignedTo === undefined || a.assignedTo === -1 ? "z".charCodeAt(0) : a.assignedTo.charCodeAt(0);
        var b = b.assignedTo === undefined || b.assignedTo === -1 ? "z".charCodeAt(0) : b.assignedTo.charCodeAt(0);

        return a - b;
        
    }

    getTaskSorter(props) {
        var sortBy = props.settings.sortBy;
        if (sortBy === "completed") {
            return this.taskSortIsCompletedHelper;
        }

        if (sortBy === "due date") {
            return this.taskSortDueDateHelper;
        }

        if (sortBy === "date added") {
            return this.taskSortDateAddedHelper;
        }

        if (sortBy === "priority") {
            return this.taskSortPriorityHelper;
        }

        if (sortBy === "assignee") {
            return this.taskSortAssigneeHelper;
        }
    } 

    handleNewDateSubmit(taskId, newDate, currentMetadata) {
        this.props.onNewDateSubmit(this.props.taskListWidgetId, taskId, newDate, currentMetadata);
    }

}

export default TaskListWidget;
