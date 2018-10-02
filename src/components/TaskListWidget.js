import React from 'react';
import DropTargetTaskArea from '../components/TaskArea';
import DraggableTask from '../components/Task';
import ListToolbar from '../components/ListToolbar';
import '../assets/css/TaskListWidget.css';
import { TaskMetadataStore } from 'handball-libs/libs/pounder-stores';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getUserUid } from 'handball-libs/libs/pounder-firebase';


class TaskListWidget extends React.Component {
    constructor(props){
        super(props);

        // Class Storage.
        this.arrowKeyTracking = [];
        this.selectedTaskIndex = -1;

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
        this.handleTaskInfoClose = this.handleTaskInfoClose.bind(this);
        this.handleTaskInfoOpen = this.handleTaskInfoOpen.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
        this.handleSettingsMenuClose = this.handleSettingsMenuClose.bind(this);
        this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
        this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
        this.arrowSelectTask = this.arrowSelectTask.bind(this);
        this.taskSortIsCompletedHelper = this.taskSortIsCompletedHelper.bind(this);
        this.taskSortPriorityHelper = this.taskSortPriorityHelper.bind(this);
        this.taskSortAssigneeHelper = this.taskSortAssigneeHelper.bind(this);
        this.taskSortDueDateHelper = this.taskSortDueDateHelper.bind(this);
        this.handleTaskDragDrop = this.handleTaskDragDrop.bind(this);
        this.handleTaskNoteChange = this.handleTaskNoteChange.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handlePaginateTaskCommentsRequest = this.handlePaginateTaskCommentsRequest.bind(this);
        
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
        var builtTasks = [];
        this.arrowKeyTracking = [];
        this.selectedTaskIndex = -1;

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

                // Render Element.
                var isTaskSelected = item.uid === this.props.selectedTaskId;
                var isTaskInputOpen = item.uid === this.props.openTaskInputId;
                var isTaskMoving = item.uid === this.props.movingTaskId;
                var isCalendarOpen = item.uid === this.props.openCalendarId;
                var isTaskInfoOpen = item.uid === this.props.openTaskInfoId;
                var renderBottomBorder = array.length !== 1 && index !== array.length - 1;
                var metadata = item.metadata === undefined ? Object.assign({}, new TaskMetadataStore("", "", "", "", "")) 
                : item.metadata; 
                var assignedTo = item.assignedTo === undefined ? -1 : item.assignedTo;

                var hasUnseenComments = item.unseenTaskCommentMembers !== undefined &&
                 item.unseenTaskCommentMembers[getUserUid()] !== undefined;

                this.arrowKeyTracking[index] = item.uid;
                if (isTaskSelected === true) { this.selectedTaskIndex = index };

                return (
                    <CSSTransition key={item.uid} classNames="TaskContainer" timeout={500} mountOnEnter={true} unmountOnExit={true}>
                        <div>
                            <DraggableTask key={item.uid} taskId={item.uid} text={item.taskName} dueDate={item.dueDate}
                                isSelected={isTaskSelected} isInputOpen={isTaskInputOpen} isComplete={item.isComplete} isMoving={isTaskMoving}
                                handleClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick}
                                onKeyPress={this.handleKeyPress} onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}
                                onInputUnmounting={this.handleTaskInputUnmounting} onDueDateClick={this.handleDueDateClick}
                                isCalendarOpen={isCalendarOpen} onNewDateSubmit={this.handleNewDateSubmit} onTaskOpen={this.handleTaskInfoOpen}
                                isHighPriority={item.isHighPriority} onTaskInfoClose={this.handleTaskInfoClose}
                                onPriorityToggleClick={this.handleTaskPriorityToggleClick} renderBottomBorder={renderBottomBorder}
                                metadata={metadata} disableAnimations={this.props.disableAnimations} projectMembers={this.props.projectMembers}
                                onAssignToMember={this.handleAssignToMember} assignedTo={assignedTo}
                                onDragDrop={this.handleTaskDragDrop}
                                enableKioskMode={this.props.enableKioskMode}
                                onTaskNoteChange={this.handleTaskNoteChange}
                                note={item.note}
                                onNewComment={this.handleNewComment}
                                isGettingTaskComments={this.props.isGettingTaskComments} taskComments={this.props.taskComments}
                                isTaskInfoOpen={isTaskInfoOpen}
                                projectMembersLookup={this.props.projectMembersLookup}
                                hasUnseenComments={hasUnseenComments}
                                onPaginateTaskCommentsRequest={this.handlePaginateTaskCommentsRequest}
                                isAllTaskCommentsFetched={this.props.isAllTaskCommentsFetched} />
                        </div>
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
                 isFocused={this.props.isFocused} onSettingsMenuClose={this.handleSettingsMenuClose}
                 onRenewNowButtonClick={this.handleRenewNowButtonClick}/>
                <DropTargetTaskArea taskListWidgetId={this.props.taskListWidgetId}>
                    <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                        {builtTasks}
                    </TransitionGroup>
                </DropTargetTaskArea>
            </div>
        )
    }

    handlePaginateTaskCommentsRequest(taskId) {
        this.props.onPaginateTaskCommentsRequest(taskId);
    }

    handleNewComment(taskId, value, currentMetadata) {
        this.props.onNewComment(taskId, value, currentMetadata);
    }

    handleTaskNoteChange(newValue, oldValue, taskId, currentMetadata) {
        this.props.onTaskNoteChange(newValue, oldValue, taskId, currentMetadata);
    }

    handleTaskDragDrop(taskId, targetTaskListWidgetId) {
        this.props.onTaskDragDrop(taskId, targetTaskListWidgetId);
    }

    handleDocumentKeyDown(e) {
        if (this.props.isFocused && this.props.openTaskInputId === -1) {
            if (e.key === "ArrowDown") {
                e.preventDefault();

                if (this.selectedTaskIndex === -1) {
                    // No Task currently selected. Force select first task.
                    var nextTaskId = this.arrowKeyTracking[0];
                    if (nextTaskId !== undefined) {
                        this.arrowSelectTask(nextTaskId);
                    }
                }

                else if (this.selectedTaskIndex !== -1 && this.selectedTaskIndex !== this.arrowKeyTracking.length - 1) {
                    // Task already selected. Select next task.
                    var nextTaskId = this.arrowKeyTracking[this.selectedTaskIndex + 1];
                    this.arrowSelectTask(nextTaskId);
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                
                if (this.selectedTaskIndex === -1) {
                    // No task currently selected. Force select last Task.
                    var nextTaskId = this.arrowKeyTracking[this.arrowKeyTracking.length - 1];
                    if (nextTaskId !== undefined) {
                        this.arrowSelectTask(nextTaskId);
                    }
                }

                else if (this.selectedTaskIndex !== -1 && this.selectedTaskIndex !== 0) {
                    // Task already selected. Select previous Task.
                    var previousTaskId = this.arrowKeyTracking[this.selectedTaskIndex - 1];
                    this.arrowSelectTask(previousTaskId);
                }
            }
        }
    }

    arrowSelectTask(taskId) {
        this.props.onTaskClick(taskId, this.props.taskListWidgetId);
    }

    handleRenewNowButtonClick() {
        this.props.onRenewNowButtonClick(this.props.taskListWidgetId);
    }

    handleSettingsMenuClose() {
        this.props.onSettingsMenuClose();
    }

    handleAssignToMember(newUserId, oldUserId, taskId) {
        this.props.onAssignToMember(newUserId, oldUserId, taskId);
    }

    handleTaskInfoOpen(taskId) {
        this.props.onTaskInfoOpen(this.props.taskListWidgetId, taskId);
    }

    handleTaskInfoClose() {
        this.props.onTaskInfoClose();
    }

    handleTaskPriorityToggleClick(taskId, newValue, oldValue, currentMetadata) {
        this.props.onTaskPriorityToggleClick(taskId, newValue, oldValue, currentMetadata);
    }

    handleSettingsButtonClick() {
        this.props.onTaskListSettingsButtonClick(this.props.taskListWidgetId);
    }

    handleTaskListSettingsChanged(newSettings, closeMenu) {
        this.props.onSettingsChanged(this.props.taskListWidgetId, newSettings, closeMenu);
    }

    handleDueDateClick(taskId) {
        this.props.onDueDateClick(this.props.taskListWidgetId, taskId);
    }

    handleTaskInputUnmounting(newValue, oldValue, taskId, currentMetadata) {
        // A TaskTextInput is Unmounting. Meaning that the Task has lost focus whilst text was still pending inside an open
        // input. Handle Data Changes.
        this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, newValue, oldValue, currentMetadata);
    }

    handleTaskTwoFingerTouch(taskId) {
        this.props.onTaskTwoFingerTouch(this.props.taskListWidgetId, taskId);
    }

    handleWidgetClick(e) {
        this.props.onWidgetClick(this.props.taskListWidgetId, this.props.isFocused);
    }

    handleTaskClick(taskId) {
        this.props.onTaskClick(taskId, this.props.taskListWidgetId);
    }

    handleKeyPress(e, taskId, newData, oldData, currentMetadata) {
        // Enter Key.
        if (e.key == "Enter") {
            // Handle Data Changes.
            this.props.onTaskSubmit(this.props.taskListWidgetId, taskId, newData, oldData, currentMetadata)
        }   
    }

    handleHeaderDoubleClick() {
        this.props.onHeaderDoubleClick(this.props.taskListWidgetId);
    }

    handleTaskListHeaderSubmit(newData) {
        this.props.onHeaderSubmit(this.props.taskListWidgetId, newData, this.props.taskListName);
    }

    handleTaskCheckBoxClick(e, taskId, newValue, oldValue, currentMetadata) {
        this.props.onTaskCheckBoxClick(e, this.props.taskListWidgetId, taskId, newValue, oldValue, currentMetadata);
    }

    handleRemoveButtonClick(e) {
        this.props.onRemoveButtonClick(this.props.taskListWidgetId);
    }

    taskSortAlphabeticalHelper(a,b) {
        var textA = a.taskName.toUpperCase();
        var textB = b.taskName.toUpperCase();

        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }

    taskSortIsCompletedHelper(a, b) {
        if (a.isComplete > b.isComplete) {
            return 1
        }

        if (a.isComplete < b.isComplete) {
            return -1
        }

        return this.taskSortDateAddedHelper(a,b);
    }

    taskSortPriorityHelper(a,b) {
        if (a.isHighPriority > b.isHighPriority) {
            return -1;
        }

        if (a.isHighPriority < b.isHighPriority) {
            return 1;
        }
        
        return this.taskSortDateAddedHelper(a,b);
    }

    taskSortDueDateHelper(a, b) {
        var dueDateA = a.dueDate.length === 0 ? Infinity : new Date(a.dueDate);
        var dueDateB = b.dueDate.length === 0 ? Infinity : new Date(b.dueDate);
        
        if (dueDateA > dueDateB) {
            return 1;
        }

        if (dueDateA < dueDateB) {
            return -1
        }

        return this.taskSortDateAddedHelper(a,b);
    }

    taskSortDateAddedHelper(a, b) {
        var dateAddedA = new Date(a.dateAdded);
        var dateAddedB = new Date(b.dateAdded);
        return dateAddedA - dateAddedB;
    }

    taskSortAssigneeHelper(a,b) {
        var aName = (a.assignedTo === undefined || a.assignedTo === -1 ? "aaa" : a.assignedTo).toUpperCase();
        var bName = (b.assignedTo === undefined || b.assignedTo === -1 ? "aaa" : b.assignedTo).toUpperCase();

        if (aName > bName) {
            return -1;
        }

        if (aName < bName) {
            return 1;
        }

        return this.taskSortDateAddedHelper(a,b);
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

        if (sortBy === "alphabetical") {
            return this.taskSortAlphabeticalHelper;
        }

        else {
            return this.taskSortDateAddedHelper;
        }
    } 

    handleNewDateSubmit(taskId, newDate, oldDate, currentMetadata) {
        this.props.onNewDateSubmit(this.props.taskListWidgetId, taskId, newDate, oldDate, currentMetadata);
    }

}

export default TaskListWidget;
