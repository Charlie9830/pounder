import React from 'react';
import TaskListWidget from './TaskListWidget';
import MouseTrap from 'mousetrap';
import '../assets/css/Project.css';
var ReactGridLayout = require('react-grid-layout');
import '../assets/css/react-grid-layout/styles.css';
import '../assets/css/react-resizable/styles.css';
import TestComponent from './TestComponent';
import {Resizable, ResizableBox} from 'react-resizable';
import ProjectToolBar from './ProjectToolBar';


class Project extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            openTaskListWidgetHeaderId: -1,
            rglWidth: 1280
        }

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
    }
    
    componentDidMount() {
        MouseTrap.bind("mod", this.handleCtrlKeyDown, 'keydown');
        MouseTrap.bind("mod", this.handleCtrlKeyUp, 'keyup');

        // Hacky fix for DPI Scaling causing issues with the React Grid Layout width.
        // saves having to change to a Responsive Grid Layout with a Width Provider HOC.
        this.setState({rglWidth: this.refs.projectContainer.offsetWidth});
    }

    componentWillUnmount() {
        MouseTrap.unBind("mod", this.handleCtrlKeyDown);
        MouseTrap.unBind("mod", this.handleCtrlKeyUp);
    }

    render() {
        // Build a list of TaskListWidgets to Render out here.
        var taskListWidgets = this.props.taskLists.map((item, index) => {
            // Widget Layer.
            var isFocused = this.props.focusedTaskListId === item.uid;
            var isHeaderOpen = this.state.openTaskListWidgetHeaderId === item.uid;
            var taskListSettings = item.settings;    

            // Task Layer.
            var tasks = this.props.tasks.filter(task => {
                return task.taskList === item.uid;
            })

            var selectedTaskId = -1;
            var openTaskInputId = -1;
            if (this.props.selectedTask.taskListWidgetId === item.uid) {
                selectedTaskId = this.props.selectedTask.taskId;

                if (this.props.selectedTask.isInputOpen) {
                    openTaskInputId = selectedTaskId;
                }
            }

            var movingTaskId = item.uid === this.props.sourceTaskListId ? this.props.movingTaskId : -1;
            return (
                /* Items must be wrapped in a div for ReactGridLayout to use them properly. */

                <div key={item.uid}>
                    <TaskListWidget key={index} taskListWidgetId={item.uid} isFocused={isFocused} taskListName={item.taskListName}
                     tasks={tasks} isHeaderOpen={isHeaderOpen} selectedTaskId={selectedTaskId} openTaskInputId={openTaskInputId}
                     onTaskSubmit={this.handleTaskSubmit} onWidgetClick={this.handleWidgetClick} movingTaskId = {movingTaskId}
                     onRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
                     onHeaderDoubleClick={this.handleWidgetHeaderDoubleClick} onHeaderSubmit={this.handleTaskListWidgetHeaderSubmit}
                     onTaskClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} 
                     onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} settings={taskListSettings} 
                     onSettingsChanged={this.handleTaskListSettingsChanged} onDueDateClick={this.handleDueDateClick}
                     openCalendarId={this.props.openCalendarId} onNewDateSubmit={this.handleNewDateSubmit}
                     onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick}
                     openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId}
                     />   
                </div>
            )
        });

        var layouts = Array.isArray(this.props.layouts) ? this.props.layouts : [];

        return (
            <div className="ProjectContainer" ref="projectContainer">
                <div className="ProjectToolBar">
                    <ProjectToolBar onAddTaskButtonClick={this.handleAddTaskButtonClick} onAddTaskListButtonClick={this.handleAddTaskListButtonClick}
                    onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
                    onLockButtonClick={this.handleLockButtonClick}/>
                </div>
                <ReactGridLayout className="Project" layout={layouts} autoSize={false} draggableCancel=".nonDraggable"
                    cols={17} rows={8} rowHeight={100} width={this.state.rglWidth}
                    onDragStop={this.handleLayoutChange} onResizeStop={this.handleLayoutChange}>
                    {taskListWidgets}
                </ReactGridLayout>
            </div>
        )
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

    handleTaskSubmit(taskListWidgetId, taskId, newData) {
        this.props.onTaskChanged(this.props.projectId, taskListWidgetId, taskId, newData)
    }

    handleWidgetClick(taskListWidgetId, isFocused) {
        this.props.onTaskListWidgetFocusChanged(taskListWidgetId, isFocused);
    }

    handleWidgetHeaderDoubleClick(taskListWidgetId) {
        this.setState({openTaskListWidgetHeaderId: taskListWidgetId});
    }

    handleTaskListWidgetHeaderSubmit(taskListWidgetId, newData) {
        this.setState({openTaskListWidgetHeaderId: -1});
        // Raise it up to Parent.
        this.props.onTaskListWidgetHeaderChanged(taskListWidgetId, newData);
    }

    handleTaskClick(element, taskListWidgetId) {
        this.props.onTaskClick(element, this.props.projectId, taskListWidgetId);
    }

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts, this.props.projectId);
    }

    handleTaskCheckBoxClick(e, taskListWidgetId, taskId, incomingValue) {
        this.props.onTaskCheckBoxClick(e, this.props.projectId, taskListWidgetId, taskId, incomingValue)
    }

    handleTaskListWidgetRemoveButtonClick(taskListWidgetId) {
        this.props.onTaskListWidgetRemoveButtonClick(this.props.projectId, taskListWidgetId);
    }

    handleTaskListSettingsChanged(taskListWidgetId, newTaskListSettings) {
        this.props.onTaskListSettingsChanged(this.props.projectId, taskListWidgetId, newTaskListSettings);
    }

    handleNewDateSubmit(taskListWidgetId, taskId, newDate) {
        this.props.onNewDateSubmit(this.props.projectId, taskListWidgetId, taskId, newDate);
    }
}

export default Project;