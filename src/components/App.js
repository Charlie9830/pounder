import React from 'react';
import Project from './Project';
import TextInputDialog from './dialogs/TextInputDialog';
import TaskInspector from './TaskInspector/TaskInspector';

import '../assets/css/App.css';

import { connect } from 'react-redux';
import {
    updateTaskCompleteAsync, setIsAppDrawerOpen, attachAuthListenerAsync, setFocusedTaskListId,
    addNewTaskAsync, addNewTaskListAsync, openTaskInspector,
    openShareMenu, updateProjectNameAsync, setShowCompletedTasksAsync, setShowOnlySelfTasks,
    moveTaskViaDialogAsync, updateTaskListSettingsAsync, setOpenTaskListSettingsMenuId,
    updateTaskListNameAsync, removeTaskListAsync, openChecklistSettings, manuallyRenewChecklistAsync,
    getLocalMuiThemes, getGeneralConfigAsync, moveTaskListToProjectAsync,
    openJumpMenu, closeJumpMenu, removeProjectAsync, removeTaskAsync,
} from 'handball-libs/libs/pounder-redux/action-creators';

import { Drawer, CssBaseline, withTheme } from '@material-ui/core';
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

class App extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleTaskCheckboxChange = this.handleTaskCheckboxChange.bind(this);
        this.handleTaskActionClick = this.handleTaskActionClick.bind(this);
        this.handleProjectMenuButtonClick = this.handleProjectMenuButtonClick.bind(this);
        this.handleTaskListClick = this.handleTaskListClick.bind(this);
        this.handleTaskTextContainerTap = this.handleTaskTextContainerTap.bind(this);
        this.handleAddNewTaskButtonClick = this.handleAddNewTaskButtonClick.bind(this);
        this.handleAddNewTaskListButtonClick = this.handleAddNewTaskListButtonClick.bind(this);
        this.handleDueDateContainerTap = this.handleDueDateContainerTap.bind(this);
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
        this.handleJumpMenuOpen = this.handleJumpMenuOpen.bind(this);
        this.handleJumpMenuClose = this.handleJumpMenuClose.bind(this);
        this.handleDeleteProjectButtonClick = this.handleDeleteProjectButtonClick.bind(this);
        
    }

    componentDidMount() {
        // Attach an Authentication state listener. Will pull down database when Logged in.
        this.props.dispatch(attachAuthListenerAsync());

        // Get General Config
        this.props.dispatch(getGeneralConfigAsync());

        // Get Mui Themes.
        this.props.dispatch(getLocalMuiThemes());
    }

    render() {
        return (
                <React.Fragment>
                    <CssBaseline />

                    <Drawer
                        open={this.props.openShareMenuId !== -1}
                        anchor="left">
                        <VisibleShareMenu />
                    </Drawer>

                    <Drawer
                        open={this.props.openTaskInspectorId !== -1 && this.props.openTaskInspectorEntity !== null}
                        anchor="left">
                        <TaskInspector />
                    </Drawer>

                    <Drawer
                    open={this.props.isAppDrawerOpen}
                    anchor="left"
                    keepMounted={true}>
                        <VisibleAppDrawer />
                    </Drawer>

                    <Drawer open={this.props.isAppSettingsOpen} anchor="left">
                        <VisibleAppSettingsMenu />
                    </Drawer>

                    <Drawer open={this.props.openChecklistSettingsId !== -1} anchor="left">
                        <VisibleChecklistSettingsMenu />
                    </Drawer>

                    <Project
                        projectId={this.props.selectedProjectId}
                        projectName={this.getProjectName(this.props.projects, this.props.selectedProjectId)}
                        tasks={this.props.filteredTasks}
                        taskLists={this.props.filteredTaskLists}
                        focusedTaskListId={this.props.focusedTaskListId}
                        onTaskCheckboxChange={this.handleTaskCheckboxChange}
                        onTaskActionClick={this.handleTaskActionClick}
                        onMenuButtonClick={this.handleProjectMenuButtonClick}
                        onTaskListClick={this.handleTaskListClick}
                        onTaskTextContainerTap={this.handleTaskTextContainerTap}
                        onTaskPress={this.handleTaskPress}
                        onAddNewTaskButtonClick={this.handleAddNewTaskButtonClick}
                        onAddNewTaskListButtonClick={this.handleAddNewTaskListButtonClick}
                        onDueDateContainerTap={this.handleDueDateContainerTap}
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
                        onJumpMenuOpen={this.handleJumpMenuOpen}
                        onJumpMenuClose={this.handleJumpMenuClose}
                        isJumpMenuOpen={this.props.isJumpMenuOpen}
                        onDeleteProjectButtonClick={this.handleDeleteProjectButtonClick}
                        enableStates={this.props.enableStates}
                    />

                    <Drawer anchor="left" open={this.props.isOnboarding}>
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
                onNegative={this.props.quickItemSelectDialog.onNegative}/>

                <VisibleInductionSplash/>

                    <GeneralSnackbar
                        isOpen={this.props.generalSnackbar.isOpen}
                        type={this.props.generalSnackbar.type}
                        text={this.props.generalSnackbar.text}
                        actionButtonText={this.props.generalSnackbar.actionOptions.actionButtonText}
                        onAction={this.props.generalSnackbar.actionOptions.onAction}
                    />
                </React.Fragment>
        )
    }

    handleDeleteProjectButtonClick(projectId) {
        this.props.dispatch(removeProjectAsync(projectId));
    }

    handleJumpMenuOpen() {
        this.props.dispatch(openJumpMenu())
    }

    handleJumpMenuClose() {
        this.props.dispatch(closeJumpMenu());
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

    handleDueDateContainerTap(taskId) {
        this.props.dispatch(openTaskInspector(taskId));
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

    handleTaskTextContainerTap(taskId) {
        // Reserved. Whatever you put here has to be compatiable with the user wanting to focus the Task List.
        // for example opening the task Inspector or the Text Input Dialog would interfere with the user just
        // trying to focus the Task list.
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

        let selectedProject = projects.find( item => {
            return item.uid === projectId;
        })

        if (selectedProject) {
            return selectedProject.projectName;
        }

        else {
            return "";
        }
    }

    handleProjectMenuButtonClick() {
        this.props.dispatch(setIsAppDrawerOpen(true));
    }

    handleTaskActionClick(type, taskId, taskListId, projectId) {
        if (type === 'moveTask') {
            this.props.dispatch(moveTaskViaDialogAsync(taskId, taskListId, projectId));
        }

        if (type === 'deleteTask') {
            this.props.dispatch(removeTaskAsync(taskId));
        }
    }

    handleTaskCheckboxChange(taskId, newValue, oldValue, currentMetadata) {
        this.props.dispatch(updateTaskCompleteAsync(taskId, newValue, oldValue, currentMetadata));
    }
}

const mapStateToProps = state => {
    return {
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
        isJumpMenuOpen: state.isJumpMenuOpen,
        enableStates: state.enableStates,
        isOnboarding: state.isOnboarding,
    }
}

let VisibleApp = connect(mapStateToProps)(App);
export default withTheme()(VisibleApp);