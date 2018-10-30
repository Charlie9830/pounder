import React from 'react';
import TaskListWidget from './TaskListWidget';
import ProjectMessageDisplay from './ProjectMessageDisplay';
import TaskListWidgetGrid from './TaskListWidgetGrid';
import '../assets/css/Project.css';
import '../assets/css/react-grid-layout/styles.css';
import '../assets/css/react-resizable/styles.css';
import ProjectToolBar from './ProjectToolBar';
import Mousetrap from 'mousetrap';

class Project extends React.Component{
    constructor(props){
        super(props);

        this.layoutSyncRequired = false;
        this.layoutsToSync = null;

        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
        this.handleWidgetHeaderDoubleClick = this.handleWidgetHeaderDoubleClick.bind(this);
        this.handleTaskListWidgetHeaderSubmit = this.handleTaskListWidgetHeaderSubmit.bind(this);
        this.handleTaskClick = this.handleTaskClick.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
        this.handleTaskCheckBoxClick = this.handleTaskCheckBoxClick.bind(this);
        this.handleTaskListWidgetRemoveButtonClick = this.handleTaskListWidgetRemoveButtonClick.bind(this);
        this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
        this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
        this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
        this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
        this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
        this.handleDueDateClick = this.handleDueDateClick.bind(this);
        this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
        this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
        this.getProjectMessageDisplayJSX = this.getProjectMessageDisplayJSX.bind(this);
        this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
        this.handleSettingsMenuClose = this.handleSettingsMenuClose.bind(this);
        this.getToolbarButtonEnableStates = this.getToolbarButtonEnableStates.bind(this);
        this.handleKeyboardShortcutsButtonClick = this.handleKeyboardShortcutsButtonClick.bind(this);
        this.extractSelectedProjectLayouts = this.extractSelectedProjectLayouts.bind(this);
        this.handleShowCompletedTasksChanged = this.handleShowCompletedTasksChanged.bind(this);
        this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
        this.focusNextTaskList = this.focusNextTaskList.bind(this);
        this.focusPreviousTaskList = this.focusPreviousTaskList.bind(this);
        this.handleKeyCombo = this.handleKeyCombo.bind(this);
        this.getGridSortedTaskListIds = this.getGridSortedTaskListIds.bind(this);
        this.stepFocusedTaskListBackward = this.stepFocusedTaskListBackward.bind(this);
        this.handleTaskDragDrop = this.handleTaskDragDrop.bind(this);
    }

    componentDidMount() {
        Mousetrap.bind(['tab', 'shift+tab'], this.handleKeyCombo);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.layoutSyncRequired === true) {
            this.layoutSyncRequired = false;
            this.props.onLayoutChange([...this.layoutsToSync], this.extractSelectedProjectLayouts(), this.props.projectId, this.taskListIdsToFoul);
            this.taskListIdsToFoul = null;
            this.layoutsToSync = null;
        }
    }

    componentWillUnmount() {
        Mousetrap.unbind(['tab', 'shift+tab'], this.handleKeyCombo);
    }


    render() {
        // Build a list of TaskListWidgets to Render out here.
        // Filter out Task Lists from other Projects.
        var filteredTaskListWidgets = this.props.taskLists.filter(taskList => {
            return taskList.project === this.props.projectId;
        })

        var taskListWidgets = filteredTaskListWidgets.map((item, index) => {

            // Widget Layer.
            var isFocused = this.props.focusedTaskListId === item.uid;
            var isHeaderOpen = this.props.openTaskListWidgetHeaderId === item.uid;
            var taskListSettings = item.settings;    

            // Task Layer.
            var tasks = this.props.tasks.filter(task => {
                return task.taskList === item.uid;
            })

            var selectedTaskId = -1;
            var openTaskInputId = -1;
            var openMetadataId = -1;
            if (this.props.selectedTask.taskListWidgetId === item.uid) {
                selectedTaskId = this.props.selectedTask.taskId;

                if (this.props.selectedTask.isInputOpen) {
                    openTaskInputId = selectedTaskId;
                }

                if (this.props.selectedTask.isMetadataOpen) {
                    openMetadataId = selectedTaskId
                }
            }

            var movingTaskId = item.uid === this.props.sourceTaskListId ? this.props.movingTaskId : -1;
            return (
                /* Items must be wrapped in a div for ReactGridLayout to use them properly. */
                <div key={item.uid}>
                    <TaskListWidget key={index} taskListWidgetId={item.uid} isFocused={isFocused} taskListName={item.taskListName}
                     tasks={tasks} isHeaderOpen={isHeaderOpen} selectedTaskId={selectedTaskId} openTaskInputId={openTaskInputId}
                     onTaskSubmit={this.handleTaskSubmit} onWidgetClick={this.handleWidgetClick} movingTaskId={movingTaskId}
                     onRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick} openMetadataId={openMetadataId}
                     onHeaderDoubleClick={this.handleWidgetHeaderDoubleClick} onHeaderSubmit={this.handleTaskListWidgetHeaderSubmit}
                     onTaskClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} 
                     onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} settings={taskListSettings} 
                     onSettingsChanged={this.handleTaskListSettingsChanged} onDueDateClick={this.handleDueDateClick}
                     onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick}
                     openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId}
                     disableAnimations={this.props.disableAnimations}
                     onSettingsMenuClose={this.handleSettingsMenuClose}
                     onRenewNowButtonClick={this.handleRenewNowButtonClick}
                     onTaskDragDrop={this.handleTaskDragDrop}
                     enableKioskMode={this.props.enableKioskMode}
                     onTaskInspectorOpen={this.props.onTaskInspectorOpen}
                     memberLookup={this.props.memberLookup}
                     />   
                </div>
            )
        });


        var projectMessageDisplayJSX = this.getProjectMessageDisplayJSX(filteredTaskListWidgets.length);
        // Determine if getProjectMesssageDisplayJSX() has come back with null, if so we can show the Project.
        var rglClassName = "ProjectRGL" // projectMessageDisplayJSX == null ? "Project" : "ProjectHidden";
        var rglDragEnabled = this.props.openCalendarId === -1;

        // Extract correct Layouts array from ProjectLayouts wrapper.
        var selectedLayouts = this.extractSelectedProjectLayouts();

        // Fresh Ids are Ids of Task lists that have not yet had a corresponding Project Layout entity created for them.
        // This could mean they are newly created, or were previously created on Mobile (which doesn't support RGL).
        // The layouts collection needs to be coerced to include these Fresh items and render them at a sane size.
        // RGL will not trigger the layoutsChanged callback when new stuff is added, it will only trigger on human
        // interaction, Therefore we need to queue up our own layout change Update to the DB. We provide the new
        // layouts, as well as the ids of Task Lists that should no longer be marked as fresh. If we don't 'foul' these
        // tasklists, then a render loop will be caused that will continously call out to the Database.
        var freshIds = this.findFreshTaskListIds(filteredTaskListWidgets);
        freshIds.forEach(id => {
            var alreadyInCollection = selectedLayouts.some(item => {
                return item.i === id;
            })

            if (alreadyInCollection !== true) {
                selectedLayouts.push({i: id, x: 0, y: 0, w: 6, h: 4 });
            }
        })

        // Queue up the Database update for when this render is finished.
        if (freshIds.length > 0) {
            this.layoutSyncRequired = true;
            this.layoutsToSync = selectedLayouts;
            this.taskListIdsToFoul = freshIds;
        }
        
        var layouts = JSON.parse(JSON.stringify(selectedLayouts));

        var toolbarButtonEnableStates = this.getToolbarButtonEnableStates();

        return (
            <div className="ProjectGrid">
                <div className="ProjectToolBarGridItem">
                    <ProjectToolBar onAddTaskButtonClick={this.handleAddTaskButtonClick} onAddTaskListButtonClick={this.handleAddTaskListButtonClick}
                    onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
                    onLockButtonClick={this.handleLockButtonClick} onAppSettingsButtonClick={this.handleAppSettingsButtonClick}
                    hideLockButton={this.props.hideLockButton} buttonEnableStates={toolbarButtonEnableStates}
                    onKeyboardShortcutsButtonClick={this.handleKeyboardShortcutsButtonClick}
                    onShowCompletedTasksChanged={this.handleShowCompletedTasksChanged} showCompletedTasks={this.props.showCompletedTasks}
                    onLayoutSelectorChange={this.props.onLayoutSelectorChange} projectLayoutType={this.props.projectLayoutType}
                    showProjectLayoutTypeSelector={this.props.showProjectLayoutTypeSelector}/>
                </div>

                <div className="ProjectGridItem">
                    <div className="ProjectContent">
                    
                        {projectMessageDisplayJSX}

                        <TaskListWidgetGrid rglClassName={rglClassName} layout={layouts}
                            onLayoutChange={this.handleLayoutChange} rglDragEnabled={this.props.rglDragEnabled}>
                            {taskListWidgets}
                        </TaskListWidgetGrid>

                    </div>
                </div>
            </div>
        )
    }


    handleTaskDragDrop(taskId, targetTaskListWidgetId) {
        this.props.onTaskDragDrop(taskId, targetTaskListWidgetId);
    }

    handleKeyCombo(mousetrap) {
        mousetrap.preventDefault();
        // Tab.
        if (mousetrap.key === "Tab" && mousetrap.shiftKey === false) {
            this.focusNextTaskList();
        }

        // Shift + Tab.
        if (mousetrap.key === "Tab" && mousetrap.shiftKey === true) {
            this.focusPreviousTaskList();
        }
        
    }

    getGridSortedTaskListIds() {
        var sortedLayouts = this.extractSelectedProjectLayouts().sort(this.layoutGridSorter);

        var sortedTaskListIds = sortedLayouts.map(item => {
            return item.i;
        })

        return sortedTaskListIds;
    }

    focusNextTaskList() {
        var sortedTaskListIds = this.getGridSortedTaskListIds();

        if (sortedTaskListIds.length === 0) {
            return;
        }

        var currentFocusedTaskListIndex = sortedTaskListIds.findIndex(item => {
            return item === this.props.focusedTaskListId;
        })

        var filteredTaskListWidgets = this.props.taskLists.filter(item => {
            return item.project === this.props.projectId;
        })

        if (currentFocusedTaskListIndex === -1) {
            // No Tasklist in Focus. Force Focus to first Task List.
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[0], false);
        }

        else {
            if (currentFocusedTaskListIndex < filteredTaskListWidgets.length - 1) {
                // Step to next Tasklist.
                this.stepFocusedTaskListForward(currentFocusedTaskListIndex, sortedTaskListIds, 'step');
            }

            else {
                // Wrap around to First tasklist.
                this.stepFocusedTaskListForward(currentFocusedTaskListIndex, sortedTaskListIds, 'wrap');
            }
        }
    }

    focusPreviousTaskList() {
        var sortedTaskListIds = this.getGridSortedTaskListIds();

        if (sortedTaskListIds.length === 0) {
            return;
        }

        var currentFocusedTaskListIndex = sortedTaskListIds.findIndex(item => {
            return item === this.props.focusedTaskListId;
        })

        if (currentFocusedTaskListIndex === -1) {
            // No Tasklist in Focus. Force Focus to Last Task List.
            var lastTaskListId = sortedTaskListIds[sortedTaskListIds.length - 1];
            this.props.onTaskListWidgetFocusChanged(lastTaskListId, false);
        }

        else {
            if (currentFocusedTaskListIndex !== 0) {
                // Step to Previous Tasklist.
                this.stepFocusedTaskListBackward(currentFocusedTaskListIndex, sortedTaskListIds, 'step');
            }

            else {
                // Wrap around to First tasklist.
                this.stepFocusedTaskListBackward(currentFocusedTaskListIndex, sortedTaskListIds, 'wrap');
            }
        }
    }

    stepFocusedTaskListForward(currentFocusedTaskListIndex, sortedTaskListIds, type) {
        if (type === 'step') {
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex], false);
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex + 1], false);
        }

        if (type === 'wrap') {
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex, false]);
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[0]);
        }
    }

    stepFocusedTaskListBackward(currentFocusedTaskListIndex, sortedTaskListIds, type) {
        if (type === 'step') {
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex], false);
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex - 1], false);
        }

        if (type === 'wrap') {
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[currentFocusedTaskListIndex, false]);
            this.props.onTaskListWidgetFocusChanged(sortedTaskListIds[sortedTaskListIds.length - 1]);
        }
    }



    layoutGridSorter(a, b) {
        // Sort by Left to Right, Top to bottom.
        if (a.y > b.y) {
            return 1;
        }

        else if (a.y < b.y) {
            return -1;
        }

        if (a.x > b.x) {
            return 1;
        }

        else if (a.x < b.x) {
            return -1;
        }

        else {
            return 0;
        }
    }

    handleRenewNowButtonClick(taskListWidgetId) {
        this.props.onRenewNowButtonClick(taskListWidgetId);
    }

    handleShowCompletedTasksChanged(value) {
        this.props.onShowCompletedTasksChanged(value);
    }

    extractSelectedProjectLayouts() {
        // Extract correct Layouts array from ProjectLayouts wrapper.
        return this.props.projectLayout === undefined || this.props.projectLayout.layouts === undefined ?
         [] : [...this.props.projectLayout.layouts];
    }

    handleKeyboardShortcutsButtonClick() {
        this.props.onKeyboardShortcutsButtonClick();
    }

    getToolbarButtonEnableStates() {
        var overide = this.props.projectId !== -1;

        var isAddTaskButtonEnabled = overide && this.props.focusedTaskListId !== -1;
        var isRemoveTaskButtonEnabled = overide && this.props.selectedTask.taskId !== -1;
        var isAddTaskListButtonEnabled = overide;
        var isRemoveTaskListButtonEnabled = overide && this.props.focusedTaskListId !== -1;
        var isShowCompletedTasksButtonEnabled = overide;

        return {
            isAddTaskButtonEnabled: isAddTaskButtonEnabled,
            isRemoveTaskButtonEnabled: isRemoveTaskButtonEnabled,
            isAddTaskListButtonEnabled: isAddTaskListButtonEnabled,
            isRemoveTaskListButtonEnabled: isRemoveTaskListButtonEnabled,
            isShowCompletedTasksButtonEnabled: isShowCompletedTasksButtonEnabled,
        }
    }

    handleSettingsMenuClose() {
        this.props.onSettingsMenuClose();
    }

    findFreshTaskListIds(filteredTaskListWidgets) {
        var freshIds = [];
        filteredTaskListWidgets.forEach(item => {
            if (item.isFresh !== undefined && item.isFresh === true) {
                freshIds.push(item.uid);
            }
        })

        return freshIds;
    }

    handleAppSettingsButtonClick() {
        this.props.onAppSettingsButtonClick();
    }

    getProjectMessageDisplayJSX(taskListWidgetCount) {
        if (this.props.isLoggedIn === false) {
            return (
                <ProjectMessageDisplay message="You are logged out"/>
            )
        }

        // No Project Selected.
        if (this.props.projectId === -1) {
            return (
                <ProjectMessageDisplay message="No project selected"/>
            )
        }

        // No Tasklists created.
        if (taskListWidgetCount === 0 || taskListWidgetCount == null) {
            return (
                <ProjectMessageDisplay message="No Task Lists created"/>
            )
        }
    }

    handleLockButtonClick() {
        this.props.onLockButtonClick();
    }

    handleTaskListSettingsButtonClick(taskListWidgetId) {
        this.props.onTaskListSettingsButtonClick(this.props.projectId, taskListWidgetId);
    }

    handleDueDateClick(taskListWidgetId, taskId) {
        this.props.onDueDateClick(this.props.projectId, taskListWidgetId, taskId);
    }

    handleTaskTwoFingerTouch(taskListWidgetId, taskId) {
        this.props.onTaskTwoFingerTouch(taskListWidgetId, taskId);
    }

    handleRemoveTaskListButtonClick() {
        this.props.onRemoveTaskListButtonClick();
    }

    handleAddTaskListButtonClick() {
        this.props.onAddTaskListButtonClick();
    }

    handleAddTaskButtonClick() {
        this.props.onAddTaskButtonClick();
    }

    handleRemoveTaskButtonClick() {
        this.props.onRemoveTaskButtonClick();
    }

    handleTaskSubmit(taskListWidgetId, taskId, newValue, oldValue, currentMetadata) {
        this.props.onTaskChanged(this.props.projectId, taskListWidgetId, taskId, newValue, oldValue, currentMetadata)
    }

    handleWidgetClick(taskListWidgetId, isFocused) {
        this.props.onTaskListWidgetFocusChanged(taskListWidgetId, isFocused);
    }

    handleWidgetHeaderDoubleClick(taskListWidgetId) {
        this.props.onTaskListWidgetHeaderDoubleClick(taskListWidgetId);
    }

    handleTaskListWidgetHeaderSubmit(taskListWidgetId, newData, oldValue) {
        // Raise it up to Parent.
        this.props.onTaskListWidgetHeaderChanged(taskListWidgetId, newData, oldValue);
    }

    handleTaskClick(taskId, taskListWidgetId) {
        this.props.onTaskClick(taskId, this.props.projectId, taskListWidgetId);
    }

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts, this.extractSelectedProjectLayouts(), this.props.projectId);
    }

    handleTaskCheckBoxClick(e, taskListWidgetId, taskId, newValue, oldValue, currentMetadata) {
        this.props.onTaskCheckBoxClick(e, this.props.projectId, taskListWidgetId, taskId, newValue, oldValue, currentMetadata)
    }

    handleTaskListWidgetRemoveButtonClick(taskListWidgetId) {
        this.props.onTaskListWidgetRemoveButtonClick(this.props.projectId, taskListWidgetId);
    }

    handleTaskListSettingsChanged(taskListWidgetId, newTaskListSettings, closeMenu) {
        this.props.onTaskListSettingsChanged(this.props.projectId, taskListWidgetId, newTaskListSettings, closeMenu);
    }
}

export default Project;