import React from 'react';
import TaskListWidget from './TaskListWidget';
import ProjectMessageDisplay from './ProjectMessageDisplay';
import TaskListWidgetGrid from './TaskListWidgetGrid';
import '../assets/css/Project.css';
import '../assets/css/react-grid-layout/styles.css';
import '../assets/css/react-resizable/styles.css';
import ProjectToolBar from './ProjectToolBar';


class Project extends React.Component{
    constructor(props){
        super(props);

        this.layoutBuffer = [];
        this.isReLayoutPassNeeded = false;
        this.isInReLayoutPass = false;

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
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
        this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
        this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
        this.handleTaskPriorityToggleClick = this.handleTaskPriorityToggleClick.bind(this);
        this.getProjectMessageDisplayJSX = this.getProjectMessageDisplayJSX.bind(this);
        this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
        this.handleTaskMetadataCloseButtonClick = this.handleTaskMetadataCloseButtonClick.bind(this);
        this.handleTaskMetadataOpen = this.handleTaskMetadataOpen.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.isReLayoutPassNeeded) {
            this.props.onLayoutChange(this.layoutBuffer, this.props.projectId);
            this.isInReLayoutPass = true;
            this.forceUpdate();
        }
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
                     onTaskSubmit={this.handleTaskSubmit} onWidgetClick={this.handleWidgetClick} movingTaskId = {movingTaskId}
                     onRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick} openMetadataId={openMetadataId}
                     onHeaderDoubleClick={this.handleWidgetHeaderDoubleClick} onHeaderSubmit={this.handleTaskListWidgetHeaderSubmit}
                     onTaskClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} 
                     onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} settings={taskListSettings} 
                     onSettingsChanged={this.handleTaskListSettingsChanged} onDueDateClick={this.handleDueDateClick}
                     openCalendarId={this.props.openCalendarId} onNewDateSubmit={this.handleNewDateSubmit}
                     onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick}
                     openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId} projectMembers={this.props.projectMembers}
                     onTaskPriorityToggleClick={this.handleTaskPriorityToggleClick} onTaskMetadataOpen={this.handleTaskMetadataOpen}
                     onTaskMetadataCloseButtonClick={this.handleTaskMetadataCloseButtonClick} disableAnimations={this.props.disableAnimations}
                     onAssignToMember={this.handleAssignToMember}
                     />   
                </div>
            )
        });


        var projectMessageDisplayJSX = this.getProjectMessageDisplayJSX(filteredTaskListWidgets.length);
        // Determine if getProjectMesssageDisplayJSX() has come back with null, if so we can show the Project.
        var rglClassName = "ProjectRGL" // projectMessageDisplayJSX == null ? "Project" : "ProjectHidden";
        var rglDragEnabled = this.props.openCalendarId === -1;

         // Extract correct Layouts array from ProjectLayouts wrapper.
         var selectedProjectLayout = this.props.projectLayouts.find(item => {
            return item.uid === this.props.projectId;
        })

        var selectedLayouts = selectedProjectLayout === undefined ? [] : selectedProjectLayout.layouts;
        var newTaskListId = this.findNewTaskListId(selectedLayouts, filteredTaskListWidgets);
        if (newTaskListId !== undefined) {
            // Push a new non stubby Layout Item into the next Render Cycle.
            var layoutBuffer = [...selectedLayouts];
            layoutBuffer.push( {i: newTaskListId, x: 0, y: 0, w: 6, h: 4} );

            this.layoutBuffer = layoutBuffer;
            this.isReLayoutPassNeeded = true;

            console.warn("New Task List Detected. Re Render Required.");
        }

        if (this.isInReLayoutPass) {
            console.warn("Re Rendering");
            selectedLayouts = this.layoutBuffer;
            this.isReLayoutPassNeeded = false;
            this.isInReLayoutPass = false;
        }

        return (
            <div className="ProjectGrid">
                <div className="ProjectToolBarGridItem">
                    <ProjectToolBar onAddTaskButtonClick={this.handleAddTaskButtonClick} onAddTaskListButtonClick={this.handleAddTaskListButtonClick}
                    onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
                    onLockButtonClick={this.handleLockButtonClick} onAppSettingsButtonClick={this.handleAppSettingsButtonClick}
                    hideLockButton={this.props.hideLockButton}/>
                </div>

                <div className="ProjectGridItem">
                    <div className="ProjectContent">
                    
                        {projectMessageDisplayJSX}

                        <TaskListWidgetGrid rglClassName={rglClassName} layout={selectedLayouts}
                            onLayoutChange={this.handleLayoutChange} rglDragEnabled={rglDragEnabled}>
                            {taskListWidgets}
                        </TaskListWidgetGrid>


                    </div>
                </div>
            </div>
        )
    }

    findNewTaskListId(selectedLayouts, filteredTaskListWidgets) {
        // Compares the current TaskListIds with the current Layout array. Finds the index of a taskList that doesnt have a matching
        // entry in the layouts array.

        // Build an Associative array of the layout Ids.
        var layoutIds = {};
        selectedLayouts.forEach(item => {
            layoutIds[item.i] = item;
        })

        // Build an array of just taskListIds.
        var taskListIds = filteredTaskListWidgets.map(item => {
            return item.uid;
        })

        // Compare each taskListId until it doesn't match anything in LayoutIds.
        return taskListIds.find(id => {
            return layoutIds[id] === undefined;
        })
    }


    handleAssignToMember(userId, taskId) {
        this.props.onAssignToMember(userId, taskId);
    }

    handleTaskMetadataOpen(taskListWidgetId, taskId) {
        this.props.onTaskMetadataOpen(taskListWidgetId, taskId);
    }

    handleTaskMetadataCloseButtonClick() {
        this.props.onTaskMetadataCloseButtonClick();
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

    handleTaskPriorityToggleClick(taskId, newValue, currentMetadata) {
        this.props.onTaskPriorityToggleClick(taskId, newValue, currentMetadata);
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

    handleTaskSubmit(taskListWidgetId, taskId, newData, currentMetadata) {
        this.props.onTaskChanged(this.props.projectId, taskListWidgetId, taskId, newData, currentMetadata)
    }

    handleWidgetClick(taskListWidgetId, isFocused) {
        this.props.onTaskListWidgetFocusChanged(taskListWidgetId, isFocused);
    }

    handleWidgetHeaderDoubleClick(taskListWidgetId) {
        this.props.onTaskListWidgetHeaderDoubleClick(taskListWidgetId);
    }

    handleTaskListWidgetHeaderSubmit(taskListWidgetId, newData) {
        // Raise it up to Parent.
        this.props.onTaskListWidgetHeaderChanged(taskListWidgetId, newData);
    }

    handleTaskClick(element, taskListWidgetId) {
        this.props.onTaskClick(element, this.props.projectId, taskListWidgetId);
    }

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts, this.props.projectId);
    }

    handleTaskCheckBoxClick(e, taskListWidgetId, taskId, incomingValue, currentMetadata) {
        this.props.onTaskCheckBoxClick(e, this.props.projectId, taskListWidgetId, taskId, incomingValue, currentMetadata)
    }

    handleTaskListWidgetRemoveButtonClick(taskListWidgetId) {
        this.props.onTaskListWidgetRemoveButtonClick(this.props.projectId, taskListWidgetId);
    }

    handleTaskListSettingsChanged(taskListWidgetId, newTaskListSettings) {
        this.props.onTaskListSettingsChanged(this.props.projectId, taskListWidgetId, newTaskListSettings);
    }

    handleNewDateSubmit(taskListWidgetId, taskId, newDate, currentMetadata) {
        this.props.onNewDateSubmit(this.props.projectId, taskListWidgetId, taskId, newDate, currentMetadata);
    }
}

export default Project;