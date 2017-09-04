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
            selectedTask: {taskListWidgetId: -1, taskId: -1, isInputOpen: false },
            isCtrlKeyDown: false,
            isATaskMoving: false,
            movingTaskId: -1,
            sourceTaskListId: -1
        }

        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
        this.handleWidgetHeaderDoubleClick = this.handleWidgetHeaderDoubleClick.bind(this);
        this.handleTaskListWidgetHeaderSubmit = this.handleTaskListWidgetHeaderSubmit.bind(this);
        this.handleTaskClick = this.handleTaskClick.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
        this.handleTaskCheckBoxClick = this.handleTaskCheckBoxClick.bind(this);
        this.handleTaskListWidgetRemoveButtonClick = this.handleTaskListWidgetRemoveButtonClick.bind(this);
        this.handleCtrlKeyDown = this.handleCtrlKeyDown.bind(this);
        this.handleCtrlKeyUp = this.handleCtrlKeyUp.bind(this);
        this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
        this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
        this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
        this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
        this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
    }
    
    componentDidMount() {
        MouseTrap.bind("ctrl", this.handleCtrlKeyDown, 'keydown');
        MouseTrap.bind("ctrl", this.handleCtrlKeyUp, 'keyup');
    }

    render(){
        // Build a list of TaskListWidgets to Render out here.
        var taskListWidgets = this.props.taskLists.map((item, index) => {
            // Widget Layer.
            var isFocused = this.props.focusedTaskListId === item.uid;
            var isHeaderOpen = this.state.openTaskListWidgetHeaderId === item.uid;           
            
            // Task Layer.
            var selectedTaskId = -1;
            var openTaskInputId = -1;
            if (this.state.selectedTask.taskListWidgetId === item.uid) {
                selectedTaskId = this.state.selectedTask.taskId;

                if (this.state.selectedTask.isInputOpen) {
                    openTaskInputId = selectedTaskId;
                }
            }

            var movingTaskId = item.uid === this.state.sourceTaskListId ? this.state.movingTaskId : -1;

            return (
                /* Items must be wrapped in a div for ReactGridLayout to use them properly. */
                <div key={item.uid}>
                    <TaskListWidget key={index} taskListWidgetId={item.uid} isFocused={isFocused} taskListName={item.taskListName}
                     tasks={item.tasks} isHeaderOpen={isHeaderOpen} selectedTaskId={selectedTaskId} openTaskInputId={openTaskInputId}
                     onTaskSubmit={this.handleTaskSubmit} onWidgetClick={this.handleWidgetClick} movingTaskId = {movingTaskId}
                     onRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
                     onHeaderDoubleClick={this.handleWidgetHeaderDoubleClick} onHeaderSubmit={this.handleTaskListWidgetHeaderSubmit}
                     onTaskClick={this.handleTaskClick} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} 
                     onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}/>   
                </div>
            )
        });

        return (
            <div className="ProjectContainer">
                <div className="ProjectToolBar">
                    <ProjectToolBar onAddTaskButtonClick={this.handleAddTaskButtonClick} onAddTaskListButtonClick={this.handleAddTaskListButtonClick}
                    onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}/>
                </div>
                <ReactGridLayout className="Project" layout={this.props.layouts} autoSize={false} draggableCancel=".nonDraggable"
                    onLayoutChange={this.handleLayoutChange} cols={12} rows={2} rowHeight={100} width={1600}>
                    {taskListWidgets}
                </ReactGridLayout>
            </div>
        )
    }

    handleTaskTwoFingerTouch(taskListWidgetId, taskId) {
        this.setState({
            isATaskMoving: true,
            movingTaskId: taskId,
            sourceTaskListId: taskListWidgetId,
        })
    }

    handleRemoveTaskListButtonClick() {
        this.props.onRemoveTaskListButtonClick(this.state.selectedTask.taskListWidgetId);
    }

    handleAddTaskListButtonClick() {
        this.props.onAddTaskListButtonClick();
    }

    handleAddTaskButtonClick() {
        this.props.onAddTaskButtonClick();
    }

    handleRemoveTaskButtonClick() {
        this.props.onRemoveTaskButtonClick(this.state.selectedTask.taskListWidgetId, this.state.selectedTask.taskId);
    }

    handleCtrlKeyDown(mouseTrap) {
        this.setState({isCtrlKeyDown: true});
    }

    handleCtrlKeyUp(mouseTrap) {
        this.setState({isCtrlKeyDown: false});
    }

    handleTaskSubmit(taskListWidgetId, taskId, newData) {
        // Close Task Input.
        this.setState({selectedTask: {taskListWidgetId: taskListWidgetId, taskId: taskId, isInputOpen: false }});

        this.props.onTaskChanged(taskListWidgetId, taskId, newData)
    }

    handleWidgetClick(taskListWidgetId, isFocused) {
        if (!isFocused) {
            // Intercept when a task Move is in progress.
            if (this.state.isATaskMoving) {
                var movingTaskId = this.state.movingTaskId;
                var destinationTaskListId = taskListWidgetId;

                this.props.onTaskMoved(this.props.projectId, movingTaskId, this.state.sourceTaskListId, destinationTaskListId);

                this.setState({
                    isATaskMoving: false,
                    movingTaskId: -1,
                    sourceTaskListId: -1,
                    selectedTask: {taskListWidgetId: destinationTaskListId,taskId: movingTaskId, isInputOpen: false} // Pre Select Task in Destination list
                })
            }

            this.props.onTaskListWidgetFocusChanged(taskListWidgetId);
        }
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
        // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
        var selectedTask = this.state.selectedTask;

        if (this.state.isCtrlKeyDown) {
            this.setState({
                isATaskMoving: true,
                movingTaskId: element.props.taskId,
                sourceTaskListId: taskListWidgetId
            })
        }

        else {
            if (selectedTask.taskListWidgetId === taskListWidgetId &&
                selectedTask.taskId === element.props.taskId) {
                // Task Already Selected. Exclusively open it's Text Input.
                this.setState({
                    selectedTask: { taskListWidgetId: taskListWidgetId, taskId: element.props.taskId, isInputOpen: true },
                    isATaskMoving: false,
                    movingTaskId: -1,
                    sourceTaskListId: -1
                })
            }

            else {
                // Otherwise just Select it.
                this.setState({
                    selectedTask: { taskListWidgetId: taskListWidgetId, taskId: element.props.taskId, isInputOpen: false },
                    isATaskMoving: false,
                    movingTaskId: -1,
                    sourceTaskListId: -1,
                })
            }
        }

        
    }

    handleLayoutChange(layouts) {
        this.props.onLayoutChange(layouts, this.props.projectId);
    }

    handleTaskCheckBoxClick(e, taskListWidgetId, taskId, incomingValue) {
        // Intercept and Select Task if it isn't already selected.
        if (this.state.selectedTask.taskId !== taskId || this.state.selectedTask.taskListWidgetId !== taskListWidgetId) {
            this.setState({selectedTask: {taskListWidgetId: taskListWidgetId, taskId: taskId, isInputOpen: false}});
        }

        this.props.onTaskCheckBoxClick(e, this.props.projectId, taskListWidgetId, taskId, incomingValue)
    }

    handleTaskListWidgetRemoveButtonClick(taskListWidgetId) {
        this.props.onTaskListWidgetRemoveButtonClick(this.props.projectId, taskListWidgetId);
    }

}

export default Project;