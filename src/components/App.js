import React from 'react';
import Project from './Project';
import TextInputDialog from './dialogs/TextInputDialog';
import TaskInspector from './TaskInspector/TaskInspector';
import MouseTrap from 'mousetrap';
import { remote } from 'electron';
require('later/later.js');

import '../assets/css/App.css';

import { connect } from 'react-redux';
import {
    updateTaskCompleteAsync, setIsAppDrawerOpen, attachAuthListenerAsync, setFocusedTaskListId,
    addNewTaskAsync, addNewTaskListAsync, openTaskInspector, updateTaskNameWithDialogAsync,
    openShareMenu, updateProjectNameAsync, setShowCompletedTasksAsync, setShowOnlySelfTasks,
    moveTaskViaDialogAsync, updateTaskListSettingsAsync, setOpenTaskListSettingsMenuId, moveTaskAsync,
    updateTaskListNameAsync, removeTaskListAsync, openChecklistSettings, manuallyRenewChecklistAsync,
    getLocalMuiThemes, getGeneralConfigAsync, moveTaskListToProjectAsync, openTask, closeTaskInspectorAsync,
    removeProjectAsync, removeTaskAsync, updateProjectLayoutAsync, addNewProjectAsync, setAppSettingsMenuPage,
    selectTask, updateProjectLayoutTypeAsync, removeSelectedTaskAsync, undoLastActionAsync,
} from 'handball-libs/libs/pounder-redux/action-creators';

import { Drawer, CssBaseline, withTheme, Button, Typography } from '@material-ui/core';
import VisibleAppDrawer from './AppDrawer';
import VisibleAppSettingsMenu from './AppSettingsMenu/AppSettingsMenu';
import VisibleShareMenu from './ShareMenu/ShareMenu';
import InformationDialog from './dialogs/InformationDialog';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import GeneralSnackbar from './Snackbars/GeneralSnackbar';
import VisibleChecklistSettingsMenu from './ChecklistSettingsMenu.js/ChecklistSettingsMenu';
import ItemSelectDialog from './dialogs/ItemSelectDialog';
import QuickItemSelectDialog from './dialogs/QuickItemSelectDialog';
import VisibleOnboarder from './Onboarder/Onboarder';
import VisibleInductionSplash from './Induction/InductionSplash';
import VisibleStatusBar from './StatusBar';
import AddNewTaskListButton from './AddNewTaskListButton';
import UndoSnackbar from './Snackbars/UndoSnackbar';

const KEYBOARD_COMBOS = {
    MOD_N: 'mod+n',
    MOD_SHIFT_N: 'mod+shift+n',
    SHIFT_ESC: 'shift+esc',
    MOD_SHIFT_I: 'mod+shift+i',
    MOD_F: 'mod+f',
};

let appGrid = {
    display: 'grid',
    height: '100%',
    width: '100%',
    gridTemplateRows: '[StatusBar]auto [Content]1fr',
    gridTemplateColumns: '[AppDrawer]240px [Project]1fr',
    gridTemplateAreas: `' AppDrawer StatusBar '
                        ' AppDrawer Project '`
}

class App extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleTaskCheckboxChange = this.handleTaskCheckboxChange.bind(this);
        this.handleTaskListClick = this.handleTaskListClick.bind(this);
        this.handleAddNewTaskButtonClick = this.handleAddNewTaskButtonClick.bind(this);
        this.handleAddNewTaskListButtonClick = this.handleAddNewTaskListButtonClick.bind(this);
        this.handleShareMenuButtonClick = this.handleShareMenuButtonClick.bind(this);
        this.handleRenameProjectButtonClick = this.handleRenameProjectButtonClick.bind(this);
        this.handleCompletedTasksButtonClick = this.handleCompletedTasksButtonClick.bind(this);
        this.handleShowOnlySelfTasksButtonClick = this.handleShowOnlySelfTasksButtonClick.bind(this);
        this.handleTaskPress = this.handleTaskPress.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
        this.handleTaskListSettingsMenuOpen = this.handleTaskListSettingsMenuOpen.bind(this);
        this.handleTaskListSettingsMenuClose = this.handleTaskListSettingsMenuClose.bind(this);
        this.handleRenameTaskListButtonClick = this.handleRenameTaskListButtonClick.bind(this);
        this.handleDeleteTaskListButtonClick = this.handleDeleteTaskListButtonClick.bind(this);
        this.handleChecklistSettingsButtonClick = this.handleChecklistSettingsButtonClick.bind(this);
        this.handleRenewChecklistButtonClick = this.handleRenewChecklistButtonClick.bind(this);
        this.handleMoveTaskListButtonClick = this.handleMoveTaskListButtonClick.bind(this);
        this.handleDeleteProjectButtonClick = this.handleDeleteProjectButtonClick.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
        this.getProjectOverlayComponent = this.getProjectOverlayComponent.bind(this);
        this.handleLogInButtonClick = this.handleLogInButtonClick.bind(this);
        this.bindMouseTrap = this.bindMouseTrap.bind(this);
        this.unBindMouseTrap = this.unBindMouseTrap.bind(this);
        this.performOvernightJobs = this.performOvernightJobs.bind(this);
        this.registerLaterJobs = this.registerLaterJobs.bind(this);
        this.handleEscapeKeyPress = this.handleEscapeKeyPress.bind(this);
        this.handleDeleteKeyPress = this.handleDeleteKeyPress.bind(this);
        this.handleTaskOpenKeyPress = this.handleTaskOpenKeyPress.bind(this);
        this.handleFocusedTaskListChange = this.handleFocusedTaskListChange.bind(this);
        this.handleTaskClick = this.handleTaskClick.bind(this);
        this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
        this.isAppLocked = this.isAppLocked.bind(this);
        this.handleArrowSelectTask = this.handleArrowSelectTask.bind(this);
        this.handleDeleteTaskButtonClick = this.handleDeleteTaskButtonClick.bind(this);
        this.handleTaskDragDrop = this.handleTaskDragDrop.bind(this);
        this.handleProjectLayoutTypeChange = this.handleProjectLayoutTypeChange.bind(this);
        this.handleUndoButtonClick = this.handleUndoButtonClick.bind(this);
        this.handleTaskDoubleClick = this.handleTaskDoubleClick.bind(this);
    }

    componentDidMount() {
        // Mousetrap.
        this.bindMouseTrap();

        // Attach an Authentication state listener. Will pull down database when Logged in.
        this.props.dispatch(attachAuthListenerAsync());

        // Get General Config
        this.props.dispatch(getGeneralConfigAsync());

        // Get Mui Themes.
        this.props.dispatch(getLocalMuiThemes());

        // Register Jobs for Later.
        this.registerLaterJobs();
    }

    componentDidUpdate(prevProps, prevState) {
        // If Locking or Unlocking. Set Mousetrap Bindings.
        if (prevProps.isLockScreenDisplayed !== this.props.isLockScreenDisplayed) {
            if (this.props.isLockScreenDisplayed === true) {
                this.unBindMouseTrap();
            }

            else {
                this.bindMouseTrap();
            }
        }
    }

    componentWillUnmount() {
        // Mousetrap
        this.unBindMouseTrap();
    }

    render() {
        let rglDragEnabled = this.props.openTaskInspectorId === -1;
        let projectOverlayComponent = this.getProjectOverlayComponent();
        let undoButtonText = this.props.lastUndoAction === null ? '' : this.props.lastUndoAction.friendlyText;
        
        return (
            <React.Fragment>
                <CssBaseline />
                <div style={appGrid}>
                    <div style={{ gridArea: 'StatusBar' }}>
                        <VisibleStatusBar />
                    </div>

                    <div style={{ gridArea: 'AppDrawer' }}>

                            <VisibleAppDrawer />
                    </div>

                    <div style={{ gridArea: 'Project', placeSelf: 'stretch' }}>
                        <Project
                            projectId={this.props.selectedProjectId}
                            projectName={this.getProjectName(this.props.projects, this.props.selectedProjectId)}
                            tasks={this.props.filteredTasks}
                            taskLists={this.props.filteredTaskLists}
                            focusedTaskListId={this.props.focusedTaskListId}
                            selectedTaskId={this.props.selectedTask.taskId}
                            onFocusedTaskListChange={this.handleFocusedTaskListChange}
                            onTaskCheckboxChange={this.handleTaskCheckboxChange}
                            onTaskListClick={this.handleTaskListClick}
                            onTaskPress={this.handleTaskPress}
                            onAddNewTaskButtonClick={this.handleAddNewTaskButtonClick}
                            onAddNewTaskListButtonClick={this.handleAddNewTaskListButtonClick}
                            onShareMenuButtonClick={this.handleShareMenuButtonClick}
                            isASnackbarOpen={this.props.isASnackbarOpen}
                            onRenameProjectButtonClick={this.handleRenameProjectButtonClick}
                            onCompletedTasksButtonClick={this.handleCompletedTasksButtonClick}
                            showCompletedTasks={this.props.showCompletedTasks}
                            memberLookup={this.props.memberLookup}
                            onShowOnlySelfTasksButtonClick={this.handleShowOnlySelfTasksButtonClick}
                            showOnlySelfTasks={this.props.showOnlySelfTasks}
                            movingTaskId={this.props.movingTaskId}
                            onTaskListSettingsChanged={this.handleTaskListSettingsChanged}
                            openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId}
                            onTaskListSettingsMenuOpen={this.handleTaskListSettingsMenuOpen}
                            onTaskListSettingsMenuClose={this.handleTaskListSettingsMenuClose}
                            onRenameTaskListButtonClick={this.handleRenameTaskListButtonClick}
                            onDeleteTaskListButtonClick={this.handleDeleteTaskListButtonClick}
                            onChecklistSettingsButtonClick={this.handleChecklistSettingsButtonClick}
                            onRenewChecklistButtonClick={this.handleRenewChecklistButtonClick}
                            onMoveTaskListButtonClick={this.handleMoveTaskListButtonClick}
                            onDeleteProjectButtonClick={this.handleDeleteProjectButtonClick}
                            enableStates={this.props.enableStates}
                            projectLayout={this.props.selectedProjectLayout}
                            projectLayoutType={this.props.projectLayoutType}
                            rglDragEnabled={rglDragEnabled}
                            onLayoutChange={this.handleLayoutChange}
                            projectOverlayComponent={projectOverlayComponent}
                            onTaskClick={this.handleTaskClick}
                            onTaskDoubleClick={this.handleTaskDoubleClick}
                            onArrowSelectTask={this.handleArrowSelectTask}
                            onDeleteTaskButtonClick={this.handleDeleteTaskButtonClick}
                            onTaskDragDrop={this.handleTaskDragDrop}
                            projectLayoutType={this.props.selectedProjectLayoutType}
                            showProjectLayoutTypeSelector={this.props.isSelectedProjectRemote}
                            onProjectLayoutTypeChange={this.handleProjectLayoutTypeChange}
                            onUndoButtonClick={this.handleUndoButtonClick}
                            canUndo={this.props.canUndo}
                            undoButtonText={undoButtonText}
                        />
                    </div>

                </div>
                <Drawer
                    open={this.props.openShareMenuId !== -1}
                    anchor="top">
                    <VisibleShareMenu />
                </Drawer>

                <Drawer
                    PaperProps={{
                            style: {
                                width: '360px'
                            }
                        }
                    }
                    open={this.props.openTaskInspectorId !== -1 && this.props.openTaskInspectorEntity !== null}
                    onBackdropClick={() => { this.props.dispatch(closeTaskInspectorAsync())}}
                    anchor="right">
                    <TaskInspector />
                </Drawer>

                <Drawer open={this.props.isAppSettingsOpen} anchor="top">
                    <VisibleAppSettingsMenu />
                </Drawer>

                <Drawer open={this.props.openChecklistSettingsId !== -1} anchor="right">
                    <VisibleChecklistSettingsMenu />
                </Drawer>



                <Drawer anchor="top" open={this.props.isOnboarding}>
                    <VisibleOnboarder />
                </Drawer>

                <TextInputDialog
                    isOpen={this.props.textInputDialog.isOpen}
                    title={this.props.textInputDialog.title}
                    text={this.props.textInputDialog.text}
                    label={this.props.textInputDialog.label}
                    onCancel={this.props.textInputDialog.onCancel}
                    onOkay={this.props.textInputDialog.onOkay}
                />

                <InformationDialog
                    isOpen={this.props.informationDialog.isOpen}
                    title={this.props.informationDialog.title}
                    text={this.props.informationDialog.text}
                    onOkay={this.props.informationDialog.onOkay}
                />

                <ConfirmationDialog
                    isOpen={this.props.confirmationDialog.isOpen}
                    title={this.props.confirmationDialog.title}
                    text={this.props.confirmationDialog.text}
                    affirmativeButtonText={this.props.confirmationDialog.affirmativeButtonText}
                    negativeButtonText={this.props.confirmationDialog.negativeButtonText}
                    onAffirmative={this.props.confirmationDialog.onAffirmative}
                    onNegative={this.props.confirmationDialog.onNegative}
                />

                <ItemSelectDialog
                    isOpen={this.props.itemSelectDialog.isOpen}
                    title={this.props.itemSelectDialog.title}
                    text={this.props.itemSelectDialog.text}
                    items={this.props.itemSelectDialog.items}
                    affirmativeButtonText={this.props.itemSelectDialog.affirmativeButtonText}
                    negativeButtonText={this.props.itemSelectDialog.negativeButtonText}
                    onAffirmative={this.props.itemSelectDialog.onAffirmative}
                    onNegative={this.props.itemSelectDialog.onNegative} />

                <QuickItemSelectDialog
                    isOpen={this.props.quickItemSelectDialog.isOpen}
                    title={this.props.quickItemSelectDialog.title}
                    text={this.props.quickItemSelectDialog.text}
                    items={this.props.quickItemSelectDialog.items}
                    negativeButtonText={this.props.quickItemSelectDialog.negativeButtonText}
                    onSelect={this.props.quickItemSelectDialog.onSelect}
                    onNegative={this.props.quickItemSelectDialog.onNegative} />

                <VisibleInductionSplash />

                <GeneralSnackbar
                    isOpen={this.props.generalSnackbar.isOpen}
                    type={this.props.generalSnackbar.type}
                    text={this.props.generalSnackbar.text}
                    actionButtonText={this.props.generalSnackbar.actionOptions.actionButtonText}
                    onAction={this.props.generalSnackbar.actionOptions.onAction}
                />

                <UndoSnackbar
                    isOpen={this.props.undoSnackbar.isOpen}
                    text={this.props.undoSnackbar.text}
                    onUndo={this.props.undoSnackbar.onUndo}/>
            </React.Fragment>
        )
    }

    handleUndoButtonClick() {
        this.props.dispatch(undoLastActionAsync())
    }

    handleProjectLayoutTypeChange(type) {
        this.props.dispatch(updateProjectLayoutTypeAsync(type));
    }

    handleTaskDragDrop(taskId, taskListId) {
        this.props.dispatch(moveTaskAsync(taskId, taskListId));
    }

    handleArrowSelectTask(taskListId, taskId) {
        this.props.dispatch(selectTask(taskListId, taskId));
    }

    handleTaskClick(area, taskId, taskListId) {
        switch(area) {
            case 'container':
                this.props.dispatch(selectTask(taskListId, taskId, false));
                return;
            
            case 'dueDate': 
                this.props.dispatch(openTaskInspector(taskId));
        }
    }
    
    handleTaskDoubleClick(area, taskId, taskListId) {
        switch (area) {
            case 'container':
                this.props.dispatch(openTaskInspector(taskId));
                return;
        }
    }

    handleFocusedTaskListChange(taskListId) {
        this.props.dispatch(setFocusedTaskListId(taskListId));
    }

    registerLaterJobs() {
        later.date.localTime();
        var overnightJobsSchedule = later.parse.text('at 02:05 every day');

        // Set First Run then set Subsequent Calls.
        later.setTimeout(this.performOvernightJobs, overnightJobsSchedule);
        later.setInterval(this.performOvernightJobs, overnightJobsSchedule);
    }

    performOvernightJobs() {
        this.props.dispatch(postSnackbarMessage("Performing overnight jobs", true, 'infomation'));
    
        // Update Due date Displays.
        this.props.dispatch(calculateProjectSelectorIndicators());
        this.forceUpdate(); // Forces recalculation of Task Due date displays.
    
        // Renew any checklists requiring renewal.
        this.renewChecklists();
      }

    bindMouseTrap() {
        MouseTrap.bind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
        MouseTrap.bind("del", this.handleDeleteKeyPress);
        MouseTrap.bind("enter", this.handleTaskOpenKeyPress);
        MouseTrap.bind("f2", this.handleTaskOpenKeyPress );
        MouseTrap.bind("esc", this.handleEscapeKeyPress);
      }
    
      unBindMouseTrap() {
        MouseTrap.unbind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
        MouseTrap.unbind("del", this.handleDeleteKeyPress);
        MouseTrap.unbind("enter", this.handleTaskOpenKeyPress);
        MouseTrap.unbind("f2", this.handleTaskOpenKeyPress);
        MouseTrap.unbind("esc", this.handleEscapeKeyPress);
      }

      handleKeyboardShortcut(mouseTrap, combo){
        // Mod + n
        if (combo === KEYBOARD_COMBOS.MOD_N) {
          this.props.dispatch(addNewTaskAsync());
        }
    
        // Ctrl + Shift + N
        if (combo === KEYBOARD_COMBOS.MOD_SHIFT_N) {
          // Add a new TaskList.
          this.props.dispatch(addNewTaskListAsync());
        }
    
        // Shift + Escape
        if (combo === KEYBOARD_COMBOS.SHIFT_ESC) {
          // this.lockApp();
        }
    
        // Ctrl + Shift + I
        if (combo === KEYBOARD_COMBOS.MOD_SHIFT_I) {
            // Open Dev Tools.
            remote.getCurrentWindow().openDevTools();
        }
    
        // Ctrl + F
        if (combo === KEYBOARD_COMBOS.MOD_F) {
            // this.setFullscreenFlag(false);
        }
      }

    isAppLocked() {
        return this.props.isLockScreenDisplayed;
    }

    handleDeleteKeyPress(mouseTrap) {
        if (this.isAppLocked()) { return }

        this.props.dispatch(removeSelectedTaskAsync());
    }

    handleTaskOpenKeyPress(e) {
        if (this.isAppLocked()) { return }

        if (this.props.selectedTask.taskId !== -1 && this.props.selectedTask.isInputOpen === false) {
            e.preventDefault();
            let task = this.props.filteredTasks.find( item => {
                return item.uid === this.props.selectedTask.taskId;
            })

            if (task !== undefined) {
                this.props.dispatch(updateTaskNameWithDialogAsync(task.uid, task.name, task.metadata));
            }
            
        }
    }

    handleEscapeKeyPress(mousetrap) {
        if (this.props.openTaskInspectorId !== -1) {
            this.props.dispatch(closeTaskInspectorAsync());
        }
    }

    getProjectOverlayComponent() {
        let stateMachine = () => {
            if (this.props.isLoggedIn === false) {
                return 'logged-out';
            } 
        
            if (this.props.selectedProjectId === -1) {
                return 'no-project-selected';
            }
        
            if (this.props.projects.length === 0) {
                return 'no-projects';
            }
        
            if (this.props.filteredTaskLists.length === 0) {
                return 'no-task-lists';
            }
        
            return 'no-overlay';
        }

        

        let machinedState = stateMachine();
    
        if (machinedState === 'no-overlay') {
            return null;
        }
    
        let container = {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }

        return (
            <div
            style={container}>
    
            { machinedState === 'logged-out' && <Button variant="outlined" onClick={this.handleLogInButtonClick}> Log in </Button> }
            { machinedState === 'no-project-selected' && <Typography> Select a project to start </Typography> }
            { machinedState === 'no-projects' && <Button variant="outlined" onClick={() => { this.props.dispatch(addNewProjectAsync)}}> Create Project </Button> }
            { machinedState === 'no-task-lists' && <AddNewTaskListButton onClick={() => { this.props.dispatch(addNewTaskListAsync())}}/>}
            </div>
        );
    };

    handleLogInButtonClick() {
        this.props.dispatch(setAppSettingsMenuPage('account'));
        this.props.dispatch(setIsAppSettingsOpen(true));
    }
    
    handleLayoutChange(layouts, oldLayouts, projectId) {
        this.props.dispatch(updateProjectLayoutAsync(layouts, oldLayouts, projectId));
    }


    handleDeleteProjectButtonClick(projectId) {
        this.props.dispatch(removeProjectAsync(projectId));
    }

    handleMoveTaskListButtonClick(taskListId, projectId) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
        this.props.dispatch(moveTaskListToProjectAsync(taskListId, projectId))
    }

    handleRenewChecklistButtonClick(taskListId) {
        this.props.dispatch(manuallyRenewChecklistAsync(taskListId));
    }

    handleChecklistSettingsButtonClick(taskListId, existingChecklistSettings) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
        this.props.dispatch(openChecklistSettings(taskListId, existingChecklistSettings));
    }

    handleDeleteTaskListButtonClick(taskListId) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
        this.props.dispatch(removeTaskListAsync(taskListId));
    }

    handleRenameTaskListButtonClick(taskListId, currentValue) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
        this.props.dispatch(updateTaskListNameAsync(taskListId, currentValue))
    }

    handleTaskListSettingsMenuClose() {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
    }

    handleTaskListSettingsMenuOpen(taskListId) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(taskListId));
    }

    handleTaskListSettingsChanged(taskListId, newValue) {
        this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
        this.props.dispatch(updateTaskListSettingsAsync(taskListId, newValue));
    }

    handleShowOnlySelfTasksButtonClick(existingValue) {
        this.props.dispatch(setShowOnlySelfTasks(!existingValue));
    }

    handleCompletedTasksButtonClick(existingValue) {
        this.props.dispatch(setShowCompletedTasksAsync(!existingValue));
    }

    handleRenameProjectButtonClick(selectedProjectId) {
        this.props.dispatch(updateProjectNameAsync(selectedProjectId))
    }

    handleShareMenuButtonClick(projectId) {
        this.props.dispatch(openShareMenu(projectId));
    }


    handleAddNewTaskListButtonClick() {
        this.props.dispatch(addNewTaskListAsync());
    }

    handleAddNewTaskButtonClick(taskListId) {
        if (typeof taskListId !== "string") {
            // No taskListId Provided. (Could accidentely be an event object coming through) Request coming from a FAB.
            this.props.dispatch(addNewTaskAsync());
        }

        else {
            // taskListId provided. Request coming from "No Tasks in List, Hint Button".
            this.props.dispatch(setFocusedTaskListId(taskListId));
            this.props.dispatch(addNewTaskAsync());
        }

    }

    handleTaskPress(taskId, taskListId, currentValue, currentMetadata) {
        this.props.dispatch(setFocusedTaskListId(taskListId));
        this.props.dispatch(openTaskInspector(taskId));
    }

    handleTaskListClick(taskListId) {
        this.props.dispatch(setFocusedTaskListId(taskListId));
    }

    getProjectName(projects, projectId) {
        if (projectId === -1 || projects === undefined) {
            return "";
        }

        let selectedProject = projects.find(item => {
            return item.uid === projectId;
        })

        if (selectedProject) {
            return selectedProject.projectName;
        }

        else {
            return "";
        }
    }

    handleDeleteTaskButtonClick(taskId) {
        this.props.dispatch(removeTaskAsync(taskId));
    }

    handleTaskCheckboxChange(taskId, newValue, oldValue, currentMetadata) {
        this.props.dispatch(updateTaskCompleteAsync(taskId, newValue, oldValue, currentMetadata));
    }
}

const mapStateToProps = state => {
    return {
        selectedTask: state.selectedTask,
        filteredTasks: state.filteredTasks,
        filteredTaskLists: state.filteredTaskLists,
        projects: state.projects,
        selectedProjectId: state.selectedProjectId,
        isAppDrawerOpen: state.isAppDrawerOpen,
        isAppSettingsOpen: state.isAppSettingsOpen,
        textInputDialog: state.textInputDialog,
        isLoggedIn: state.isLoggedIn,
        focusedTaskListId: state.focusedTaskListId,
        openTaskInspectorId: state.openTaskInspectorId,
        openTaskInspectorEntity: state.openTaskInspectorEntity,
        openShareMenuId: state.openShareMenuId,
        informationDialog: state.informationDialog,
        confirmationDialog: state.confirmationDialog,
        isASnackbarOpen: state.isASnackbarOpen,
        generalSnackbar: state.generalSnackbar,
        showCompletedTasks: state.showCompletedTasks,
        memberLookup: state.memberLookup,
        showOnlySelfTasks: state.showOnlySelfTasks,
        movingTaskId: state.movingTaskId,
        isATaskMoving: state.isATaskMoving,
        openTaskListSettingsMenuId: state.openTaskListSettingsMenuId,
        openChecklistSettingsId: state.openChecklistSettingsId,
        itemSelectDialog: state.itemSelectDialog,
        quickItemSelectDialog: state.quickItemSelectDialog,
        enableStates: state.enableStates,
        isOnboarding: state.isOnboarding,
        selectedProjectLayout: state.selectedProjectLayout,
        selectedProjectLayoutType: state.selectedProjectLayoutType,
        isSelectedProjectRemote: state.isSelectedProjectRemote,
        undoSnackbar: state.undoSnackbar,
        lastUndoAction: state.lastUndoAction,
        canUndo: state.canUndo,
    }
}

let VisibleApp = connect(mapStateToProps)(App);
export default withTheme()(VisibleApp);