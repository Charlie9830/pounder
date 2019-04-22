import React from 'react';
import TaskList from './TaskList';
import TaskBase from './Task/TaskBase';
import DueDate from './Task/DueDate';
import IndicatorPanel from './Task/IndicatorPanel';
import PriorityIndicator from './Task/PriorityIndicator';
import TaskCheckbox from './Task/TaskCheckbox';
import TaskText from './Task/TaskText';
import SwipeableListItem from './SwipeableListItem/SwipeableListItem';
import RenewChecklistButton from './RenewChecklistButton'
import MoveTaskIcon from '../icons/MoveTaskIcon';
import AddNewTaskButton from './AddNewTaskButton.js';
import ProjectMenu from './ProjectMenu';
import ListItemTransition from './TransitionList/ListItemTransition';
import Mousetrap from 'mousetrap';

import {
    GetDisplayNameFromLookup, TaskDueDateSorter, TaskCompletedSorter, TaskDateAddedSorter, TaskAssigneeSorter,
    TaskPrioritySorter, TaskAlphabeticalSorter
} from 'handball-libs/libs/pounder-utilities';
import { getUserUid } from 'handball-libs/libs/pounder-firebase';
import { TaskMetadataStore } from 'handball-libs/libs/pounder-stores';
import { ParseDueDate } from 'handball-libs/libs/pounder-utilities';

import { AppBar, Toolbar, Grow, withTheme, IconButton, Fab, Zoom, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import AddTaskListIcon from '@material-ui/icons/PlaylistAdd';
import RemoveTaskListIcon from '../icons/RemoveTaskListIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskListGrid from './TaskListGrid';
import ExpandingButton from './ExpandingButton';

let styles = theme => {
    return {
        projectGrid: {
            display: 'grid',
            width: '100%',
            height: '100%',
            gridTemplateRows: '[Toolbar]auto [Content]1fr'
        },

        toolbarContainer: {
            gridRow: 'Toolbar',
            placeSelf: 'stretch',
        },

        contentContainer: {
            gridRow: 'Content',
            placeSelf: 'stretch',
            overflowY: 'scroll',
            background: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }
    }
};

const projectRightButtonsContainer = {
    flexShrink: '1',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center'
}

const projectLeftButtonsContainer = {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '8px',
}

class Project extends React.Component {
    constructor(props) {
        super(props);

        // Class Storage.
        this.arrowKeyTrackingMap = {};

        // Method Bindings.
        this.getTaskListsJSX = this.getTaskListsJSX.bind(this);
        this.getTasksJSX = this.getTasksJSX.bind(this);
        this.extractSelectedProjectLayouts = this.extractSelectedProjectLayouts.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
        this.focusNextTaskList = this.focusNextTaskList.bind(this);
        this.focusPreviousTaskList = this.focusPreviousTaskList.bind(this);
        this.handleKeyCombo = this.handleKeyCombo.bind(this);
        this.getGridSortedTaskListIds = this.getGridSortedTaskListIds.bind(this);
        this.stepFocusedTaskListBackward = this.stepFocusedTaskListBackward.bind(this);
        this.handleArrowKeyDown = this.handleArrowKeyDown.bind(this);
    }

    componentDidMount() {
        Mousetrap.bind(['tab', 'shift+tab'], this.handleKeyCombo);
    }

    componentWillUnmount() {
        Mousetrap.unbind(['tab', 'shift+tab'], this.handleKeyCombo);
    }

    render() {
        let { classes } = this.props;

        // Extract correct Layouts array from ProjectLayouts wrapper.
        var selectedLayouts = this.extractSelectedProjectLayouts();
        var layouts = JSON.parse(JSON.stringify(selectedLayouts)); // Hacky way to get RGL to update it's Layout more reliably.

        let contents = null;

        if (this.props.projectOverlayComponent === null) {
            contents = (
                <TaskListGrid
                    layout={layouts}
                    onLayoutChange={this.handleLayoutChange}
                    rglDragEnabled={this.props.rglDragEnabled}>
                    {this.getTaskListsJSX(layouts)}
                </TaskListGrid>
            )
        }

        else {
            contents = this.props.projectOverlayComponent;
        }

        return (
            <React.Fragment>
                <div
                    className={classes['projectGrid']}>
                    <div
                        className={classes['toolbarContainer']}>
                        <Toolbar
                            disableGutters={true}>
                            <Grow
                            style={{transformOrigin: 'left center'}}
                            in={this.props.showProjectName}
                            mountOnEnter={true}
                            unmountOnExit={true}>
                                {this.props.projectNameComponent}
                            </Grow>

                            <div style={projectLeftButtonsContainer}>
                                <Zoom
                                    unmountOnExit={true}
                                    mountOnEnter={true}
                                    in={this.props.enableStates.newTaskFab}>
                                    <ExpandingButton
                                        color="default"
                                        iconComponent={<AddIcon/>}
                                        text="Create Task"
                                        onClick={() => { this.props.onAddNewTaskButtonClick() }} />
                                </Zoom>

                                <div style={{ width: '16px' }} />

                                <Zoom
                                    unmountOnExit={true}
                                    mountOnEnter={true}
                                    in={this.props.enableStates.newTaskListFab}>
                                    <ExpandingButton
                                        iconComponent={<AddTaskListIcon/>}
                                        color="secondary"
                                        text="Create List"
                                        onClick={() => { this.props.onAddNewTaskListButtonClick() }} />
                                </Zoom>
                            </div>

                            <div style={projectRightButtonsContainer}>
                                <ProjectMenu
                                    onShareMenuButtonClick={() => { this.props.onShareMenuButtonClick(this.props.projectId) }}
                                    onRenameProjectButtonClick={() => { this.props.onRenameProjectButtonClick(this.props.projectId, this.props.projectName) }}
                                    onCompletedTasksButtonClick={this.props.onCompletedTasksButtonClick}
                                    showCompletedTasks={this.props.showCompletedTasks}
                                    onShowOnlySelfTasksButtonClick={this.props.onShowOnlySelfTasksButtonClick}
                                    showOnlySelfTasks={this.props.showOnlySelfTasks}
                                    onDeleteProjectButtonClick={() => { this.props.onDeleteProjectButtonClick(this.props.projectId) }}
                                    projectLayoutType={this.props.projectLayoutType}
                                    showProjectLayoutTypeSelector={this.props.showProjectLayoutTypeSelector}
                                    onLayoutTypeChange={this.props.onProjectLayoutTypeChange}
                                    onUndoButtonClick={this.props.onUndoButtonClick}
                                    canUndo={this.props.canUndo}
                                    undoButtonText={this.props.undoButtonText}
                                    projectActionsEnabled={this.props.enableStates.projectMenu}
                                    allowShowOnlySelfTasks={this.props.allowShowOnlySelfTasks} />
                            </div>
                        </Toolbar>
                        <Divider />
                    </div>

                    <div
                        className={classes['contentContainer']}>
                        {contents}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getTaskListsJSX(layouts) {
        // Turn layouts array into a Lookup by taskListId to avoid an O[^n] operation when building the Task List Widgets.
        var layoutsMap = {};
        layouts.forEach(layout => {
            layoutsMap[layout.i] = layout;
        })

        let taskListsJSX = this.props.taskLists.map(item => {
            // Widget Layer.
            let isFocused = this.props.focusedTaskListId === item.uid;
            let isSettingsMenuOpen = this.props.openTaskListSettingsMenuId === item.uid;

            // We give the Layouts to RGL via the 'data-grid' property as well as using the 'layouts' prop.
            // using Data-grid means that New Task Lists will render at a sane size initally, but only using data-grid means
            // that updates to the Layout once established won't cause RGL to render. This is because RGL only looks at it's
            // children's keys to decide if it should recalculate the layout when children change.
            // Therefore we also provide provide the layouts via the RGL 'layouts' prop further down. This covers us for
            // layout mutations.
            var layoutEntry = {
                x: layoutsMap[item.uid] === undefined ? 0 : layoutsMap[item.uid].x,
                y: layoutsMap[item.uid] === undefined ? 0 : layoutsMap[item.uid].y,
                w: layoutsMap[item.uid] === undefined ? 6 : layoutsMap[item.uid].w,
                h: layoutsMap[item.uid] === undefined ? 4 : layoutsMap[item.uid].h,
            }

            return (
                /* TaskLists must be wrapped in a div for RGL to work properly */
                <div
                    key={item.uid}
                    data-grid={layoutEntry}>
                    <TaskList
                        taskListId={item.uid}
                        scrollTargetId={item.uid}
                        name={item.taskListName}
                        isFocused={isFocused}
                        onClick={() => { this.props.onTaskListClick(item.uid) }}
                        onTaskListSettingsChanged={(newValue) => { this.props.onTaskListSettingsChanged(item.uid, newValue) }}
                        onArrowKeyDown={(key) => { this.handleArrowKeyDown(item.uid, key) }}
                        taskListSettings={item.settings}
                        isSettingsMenuOpen={isSettingsMenuOpen}
                        onSettingsMenuOpen={() => { this.props.onTaskListSettingsMenuOpen(item.uid) }}
                        onSettingsMenuClose={this.props.onTaskListSettingsMenuClose}
                        onRenameTaskListButtonClick={() => { this.props.onRenameTaskListButtonClick(item.uid, item.taskListName) }}
                        onDeleteButtonClick={() => { this.props.onDeleteTaskListButtonClick(item.uid) }}
                        onChecklistSettingsButtonClick={() => { this.props.onChecklistSettingsButtonClick(item.uid, item.settings.checklistSettings) }}
                        onMoveTaskListButtonClick={() => { this.props.onMoveTaskListButtonClick(item.uid, item.project) }}
                        onAddTaskButtonClick={() => {this.props.onAddNewTaskButtonClick(item.uid)}}>
                        {this.getTasksJSX(item.uid, item.settings.sortBy, item.settings.checklistSettings.isChecklist)}
                    </TaskList>
                </div>
            )
        })

        return taskListsJSX;
    }

    handleArrowKeyDown(taskListId, key) {
        let currentArrowKeyTracking = this.arrowKeyTrackingMap[taskListId];

        let selectedTaskIndex = currentArrowKeyTracking.findIndex(item => {
            return item.uid === this.props.selectedTaskId
        })

        if (key === "down") {
            if (selectedTaskIndex === -1) {
                // No Task currently selected. Force select first task.
                var nextTask = currentArrowKeyTracking[0];
                if (nextTask !== undefined) {
                    this.props.onArrowSelectTask(taskListId, nextTask.uid);
                }
            }

            else if (selectedTaskIndex !== -1 && selectedTaskIndex !== currentArrowKeyTracking - 1) {
                // Task already selected. Select next task.
                var nextTask = currentArrowKeyTracking[selectedTaskIndex + 1];
                if (nextTask !== undefined) {
                    this.props.onArrowSelectTask(taskListId, nextTask.uid);
                }
            }
        }

        if (key === "up") {
            if (selectedTaskIndex === -1) {
                // No task currently selected. Force select last Task.
                var nextTask = currentArrowKeyTracking[currentArrowKeyTracking.length - 1];
                if (nextTask !== undefined) {
                    this.props.onArrowSelectTask(taskListId, nextTask.uid);
                }
            }

            else if (selectedTaskIndex !== -1 && selectedTaskIndex !== 0) {
                // Task already selected. Select previous Task.
                var previousTask = currentArrowKeyTracking[selectedTaskIndex - 1];
                if (previousTask !== undefined) {
                    this.props.onArrowSelectTask(taskListId, previousTask.uid);
                }
            }
        }
    }

    getTasksJSX(taskListId, sortBy, isChecklist) {
        if (this.props.tasks !== undefined) {
            let filteredTasks = this.props.tasks.filter(item => {
                return item.taskList === taskListId;
            })


            if (filteredTasks.length === 0) {
                if (isChecklist && this.props.showOnlySelfTasks === false) {
                    return (
                        <ListItemTransition
                            key="renewchecklistbutton">
                            <RenewChecklistButton
                                disabled={this.props.movingTaskId !== -1}
                                onClick={() => { this.props.onRenewChecklistButtonClick(taskListId) }} />
                        </ListItemTransition>
                    )
                }

                else {
                    return (
                        <ListItemTransition
                            key="addtaskbutton">
                            <AddNewTaskButton
                                disabled={this.props.movingTaskId !== -1}
                                onClick={() => { this.props.onAddNewTaskButtonClick(taskListId) }} />
                        </ListItemTransition>
                    )
                }
            }

            // Sort.
            let sortedTasks = [...filteredTasks].sort(this.getTaskSorter(sortBy));

            // Add to arrowKeyTrackingMap.
            this.arrowKeyTrackingMap[taskListId] = sortedTasks;

            let builtTasks = sortedTasks.map((item, index, array) => {
                // Render Element.
                let isTaskSelected = item.uid === this.props.selectedTaskId;
                let isTaskMoving = item.uid === this.props.movingTaskId;
                let hasUnseenComments = item.unseenTaskCommentMembers !== undefined &&
                    item.unseenTaskCommentMembers[getUserUid()] !== undefined;

                let metadata = item.metadata === undefined ? { ...new TaskMetadataStore("", "", "", "", "") }
                    : item.metadata;

                let assignedToDisplayName = GetDisplayNameFromLookup(item.assignedTo, this.props.memberLookup);

                let showDivider = index !== array.length - 1 && array.length > 1;

                let priorityIndicator = <PriorityIndicator
                    isHighPriority={item.isHighPriority}
                />

                let checkbox = <TaskCheckbox
                    checked={item.isComplete}
                    onChange={(newValue, oldValue) => { this.props.onTaskCheckboxChange(item.uid, newValue, oldValue, metadata) }}
                />

                let taskText = <TaskText
                    text={item.taskName}
                />

                let dueDate = <DueDate
                    {...this.getDueDateProps(item.isComplete, item.dueDate, this.props.theme)} />

                let indicatorPanel = <IndicatorPanel
                    hasUnseenComments={hasUnseenComments}
                    hasNote={item.note !== undefined && item.note.length > 0}
                    assignedTo={item.assignedTo}
                    assignedToDisplayName={assignedToDisplayName}
                />

                return (
                    <ListItemTransition
                        key={item.uid}>
                        <TaskBase
                            taskId={item.uid}
                            onClick={(area) => { this.props.onTaskClick(area, item.uid, item.taskList) }}
                            onDoubleClick={(area) => { this.props.onTaskDoubleClick(area, item.uid, item.taskList)}}
                            onDueDateContainerClick={() => { this.props.onTaskDueDateContainerClick(item.uid) }}
                            isSelected={isTaskSelected}
                            isMoving={isTaskMoving}
                            priorityIndicator={priorityIndicator}
                            checkbox={checkbox}
                            taskText={taskText}
                            dueDate={dueDate}
                            indicatorPanel={indicatorPanel}
                            onTextContainerTap={() => { this.props.onTaskTextContainerTap(item.uid) }}
                            onPress={() => { this.props.onTaskPress(item.uid, item.taskList, item.taskName, item.metadata) }}
                            onDueDateContainerTap={() => { this.props.onDueDateContainerTap(item.uid) }}
                            showDivider={showDivider}
                            onDeleteTaskButtonClick={() => { this.props.onDeleteTaskButtonClick(item.uid) }}
                            onDragDrop={this.props.onTaskDragDrop}
                        />
                    </ListItemTransition>

                )
            })

            return builtTasks;
        }
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
            this.props.onFocusedTaskListChange(sortedTaskListIds[0]);
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
            this.props.onFocusedTaskListChange(sortedTaskListIds[currentFocusedTaskListIndex + 1], false);
        }

        if (type === 'wrap') {
            this.props.onFocusedTaskListChange(sortedTaskListIds[0]);
        }
    }

    stepFocusedTaskListBackward(currentFocusedTaskListIndex, sortedTaskListIds, type) {
        if (type === 'step') {
            this.props.onFocusedTaskListChange(sortedTaskListIds[currentFocusedTaskListIndex - 1], false);
        }

        if (type === 'wrap') {
            this.props.onFocusedTaskListChange(sortedTaskListIds[sortedTaskListIds.length - 1]);
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

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts, this.extractSelectedProjectLayouts(), this.props.projectId);
    }

    extractSelectedProjectLayouts() {
        // Extract correct Layouts array from ProjectLayouts wrapper.
        return this.props.projectLayout === undefined || this.props.projectLayout.layouts === undefined ?
            [] : [...this.props.projectLayout.layouts];
    }

    getTaskSorter(sortBy) {
        switch (sortBy) {
            case 'completed':
                return TaskCompletedSorter;

            case 'due date':
                return TaskDueDateSorter;

            case 'date added':
                return TaskDateAddedSorter;

            case 'priority':
                return TaskPrioritySorter;

            case 'assignee':
                return TaskAssigneeSorter;

            case 'alphabetical':
                return TaskAlphabeticalSorter;

            default:
                return TaskPrioritySorter;
        }
    }

    getDueDateProps(isComplete, dueDate, theme) {
        let result = ParseDueDate(isComplete, dueDate);

        if (result.type === 'unset') {
            return {
                type: 'unset'
            }
        }

        if (result.type === 'complete') {
            return {
                type: 'complete'
            }
        }

        return {
            color: theme.palette.custom[result.type], // Extract color from Theme
            text: result.text,
        }
    }
}

export default (withTheme()(withStyles(styles)(Project)));