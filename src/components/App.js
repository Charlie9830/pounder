import '../assets/css/App.css';
import React from 'react';
import MouseTrap from 'mousetrap';
import Hammer from 'hammerjs';
import Sidebar from './Sidebar';
import Project from './Project';
import VisibleStatusBar from './StatusBar';
import VisibleLockScreen from './LockScreen';
import ShutdownScreen from './ShutdownScreen';
import VisibleAppSettingsMenu from './AppSettingsMenu/AppSettingsMenu';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import MessageBox from './MessageBox';
import VisibleSnackbar from './Snackbar';
import VisibleShareMenu from './ShareMenu';
import VisibleUpdateSnackbar from './UpdateSnackbar';
import VisibleTaskInspector from './TaskInspector';
import '../assets/css/TaskListWidget.css';
import '../assets/css/Sidebar.css';
import '../assets/css/Project.css';
import { connect } from 'react-redux';
import { MessageBoxTypes } from 'handball-libs/libs/pounder-redux';
import { hot } from 'react-hot-loader';
require('later/later.js');
import { selectTask, openTask, startTaskMove,
lockApp, setLastBackupDate, setOpenTaskListSettingsMenuId, addNewTaskListAsync, addNewTaskAsync,
changeFocusedTaskList, moveTaskAsync, updateTaskListWidgetHeaderAsync, setIsSidebarOpen, acceptProjectInviteAsync,
removeSelectedTaskAsync, updateTaskNameAsync, selectProject, updateProjectLayoutAsync, updateTaskCompleteAsync,
addNewProjectAsync, removeProjectAsync, updateProjectNameAsync, removeTaskListAsync, updateTaskListSettingsAsync,
unlockApp, setIsShuttingDownFlag, getGeneralConfigAsync, setOpenProjectSelectorId,
setIsAppSettingsOpen, setIgnoreFullscreenTriggerFlag, getCSSConfigAsync, setIsShareMenuOpen, closeMetadata, setGeneralConfigAsync,
setMessageBox, attachAuthListenerAsync, denyProjectInviteAsync, postSnackbarMessage, setOpenTaskListWidgetHeaderId,
setShowCompletedTasksAsync, calculateProjectSelectorIndicators,
setAppSettingsMenuPage, setIsUpdateSnackbarOpen, cancelTaskMove,
setShowCompletedTasks, 
renewChecklistAsync, openTaskInfo, getTaskCommentsAsync,
closeTaskInfoAsync,
openTaskInspectorAsync,
updateProjectLayoutTypeAsync,
moveTaskListToProjectAsync
} from 'handball-libs/libs/pounder-redux/action-creators';
import { getFirestore, getUserUid } from 'handball-libs/libs/pounder-firebase';
import { backupFirebaseAsync } from '../utilities/FileHandling';
import { isChecklistDueForRenew } from 'handball-libs/libs/pounder-utilities';
import electron from 'electron';
import Moment from 'moment';
import Button from './Button';

const remote = electron.remote;
const KEYBOARD_COMBOS = {
  MOD_N: 'mod+n',
  MOD_SHIFT_N: 'mod+shift+n',
  SHIFT_ESC: 'shift+esc',
  MOD_SHIFT_I: 'mod+shift+i',
  MOD_F: 'mod+f',
  MOD_DEL: 'mod+del'
};


class App extends React.Component {
  constructor(props) {
    super(props);

    // State.
    this.state = {
      isConnectedToFirebase: false,
      currentErrorMessage: "",
    };

    // Class Storage.
    this.isShiftKeyDown = false;
    this.isModKeyDown = false;
    this.autoBackupInterval = -1;
    
    // Method Bindings.
    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
    this.handleTaskListWidgetFocusChange = this.handleTaskListWidgetFocusChange.bind(this);
    this.handleTaskListWidgetHeaderChanged = this.handleTaskListWidgetHeaderChanged.bind(this);
    this.handleProjectSelectorClick = this.handleProjectSelectorClick.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleTaskCheckBoxClick = this.handleTaskCheckBoxClick.bind(this);
    this.handleAddProjectClick = this.handleAddProjectClick.bind(this);
    this.handleRemoveProjectClick = this.handleRemoveProjectClick.bind(this);
    this.handleProjectNameSubmit = this.handleProjectNameSubmit.bind(this);
    this.handleTaskListWidgetRemoveButtonClick = this.handleTaskListWidgetRemoveButtonClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
    this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
    this.addNewTaskList = this.addNewTaskList.bind(this);
    this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
    this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
    this.handleTaskClick = this.handleTaskClick.bind(this);
    this.handleShiftKeyDown = this.handleShiftKeyDown.bind(this);
    this.handleShiftKeyUp = this.handleShiftKeyUp.bind(this);
    this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
    this.handleLockScreenAccessGranted = this.handleLockScreenAccessGranted.bind(this);
    this.lockApp = this.lockApp.bind(this);
    this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
    this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
    this.getLockScreen = this.getLockScreen.bind(this);
    this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
    this.getSelectedProjectTasks = this.getSelectedProjectTasks.bind(this);
    this.handleDeleteKeyPress = this.handleDeleteKeyPress.bind(this);
    this.getShutdownScreenJSX = this.getShutdownScreenJSX.bind(this);
    this.initalizeLocalConfig = this.initalizeLocalConfig.bind(this);
    this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
    this.getAppSettingsMenuJSX = this.getAppSettingsMenuJSX.bind(this);
    this.handleRequestIsSidebarOpenChange = this.handleRequestIsSidebarOpenChange.bind(this);
    this.getShareMenuJSX = this.getShareMenuJSX.bind(this);
    this.handleShareMenuButtonClick = this.handleShareMenuButtonClick.bind(this);
    this.handleAcceptInviteButtonClick = this.handleAcceptInviteButtonClick.bind(this);
    this.handleDenyInviteButtonClick = this.handleDenyInviteButtonClick.bind(this);
    this.handleModKeyDown = this.handleModKeyDown.bind(this);
    this.handleModKeyUp = this.handleModKeyUp.bind(this);
    this.handleTaskInfoClose = this.handleTaskInfoClose.bind(this);
    this.handleTaskInfoOpen = this.handleTaskInfoOpen.bind(this);
    this.autoBackupIntervalCallback = this.autoBackupIntervalCallback.bind(this);
    this.handleTaskListWidgetHeaderDoubleClick = this.handleTaskListWidgetHeaderDoubleClick.bind(this);
    this.handleProjectSelectorInputDoubleClick = this.handleProjectSelectorInputDoubleClick.bind(this);
    this.handleSettingsMenuClose = this.handleSettingsMenuClose.bind(this);
    this.handleKeyboardShortcutsButtonClick = this.handleKeyboardShortcutsButtonClick.bind(this);
    this.handleShowCompletedTasksChanged = this.handleShowCompletedTasksChanged.bind(this);
    this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
    this.performOvernightJobs = this.performOvernightJobs.bind(this);
    this.renewChecklists = this.renewChecklists.bind(this);
    this.handleTaskOpenKeyPress = this.handleTaskOpenKeyPress.bind(this);
    this.handleEscapeKeyPress = this.handleEscapeKeyPress.bind(this);
    this.handleTaskDragDrop = this.handleTaskDragDrop.bind(this);
    this.bindMouseTrap = this.bindMouseTrap.bind(this);
    this.unBindMouseTrap = this.unBindMouseTrap.bind(this);
    this.isAppLocked = this.isAppLocked.bind(this);
    this.dispatchOpenTaskInfo = this.dispatchOpenTaskInfo.bind(this);
    this.getTaskInspectorJSX = this.getTaskInspectorJSX.bind(this);
    this.handleTaskInspectorOpen = this.handleTaskInspectorOpen.bind(this);
    this.handleLayoutSelectorChange = this.handleLayoutSelectorChange.bind(this);
    this.handleMoveTaskListToProject = this.handleMoveTaskListToProject.bind(this);
  }

  componentDidMount() { 
    // MouseTrap.
    this.bindMouseTrap();


    // Read and Apply Config Values.
    this.initalizeLocalConfig();

    // Attaches an Authentication State listener. Will Pull down database when Logged in.
    this.props.dispatch(attachAuthListenerAsync());

    // Computer has resumed from sleep.
    electron.ipcRenderer.on('resume', () => {
      // Refresh Data.
      // Code here removed because it messes with Auth.. Firebase will re check server it just takes about 15 seconds.
    })

    electron.ipcRenderer.on('update-downloaded', () => {
      this.props.dispatch(setIsUpdateSnackbarOpen(true));
    })

    electron.ipcRenderer.on('update-error', (event, error) => {
      this.props.dispatch(postSnackbarMessage("An error has occured with the Update.", false, 'error'));
    })

    electron.ipcRenderer.on('window-closing', () => {
      this.props.dispatch(setIsShuttingDownFlag(true));

      // Backup Data to Disk.
      backupFirebaseAsync(getFirestore, this.props.remoteProjectIds).then(() => {
        // Send Message back to Main Process once complete.
        electron.ipcRenderer.send('ready-to-close');
      }).catch(error => {
        let message = "Can't perform independent Database backup when logged off.";
        this.props.dispatch(setMessageBox(true, message, MessageBoxTypes.OK_ONLY, null, result => {
          electron.ipcRenderer.send('ready-to-close');
        }));
      })
    })

    // Hammer.
    var hammer = new Hammer(document.getElementById('root'), { domEvents: true });
    hammer.on('swipe', event => {
      if (event.pointerType === "touch") {
        if (event.velocityX < 0) {
          // Swipe Left.
          if (this.props.isSidebarOpen) {
            this.props.dispatch(setIsSidebarOpen(false));
          }
        }
  
        else if (event.velocityX > 0) {
          if (this.props.isSidebarOpen === false) {
            // Swipe Right
            this.props.dispatch(setIsSidebarOpen(true));
          }
        }
      }
    })

    // Register Jobs for Later.
    later.date.localTime();
    var overnightJobsSchedule = later.parse.text('at 02:05 every day');

    // Set First Run then set Subsequent Calls.
    later.setTimeout(this.performOvernightJobs, overnightJobsSchedule);
    later.setInterval(this.performOvernightJobs, overnightJobsSchedule);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Determine if Fullscreen mode should be triggered.
    if (this.props.ignoreFullscreenTrigger === false && this.props.isDexieConfigLoadComplete &&
      this.props.generalConfig.startInFullscreen) {
      this.setFullscreenFlag(true);
      // This code will be called on every update, set an ignore flag for subsequent
      // updates.
      this.props.dispatch(setIgnoreFullscreenTriggerFlag(true));
    }

    // Apply CSS Variables.
    if (JSON.stringify(prevProps.cssConfig) !== JSON.stringify(this.props.cssConfig)) {
      // Enumerate and Apply CSS Values.
      for (var property in this.props.cssConfig) {
        let value = this.props.cssConfig[property];
        if (value !== "") {
          document.getElementsByTagName("body")[0].style.setProperty(property, value);
        }
      }
    }

    // Set Auto Backup Interval.
    if (prevProps.generalConfig.autoBackupInterval !== this.props.generalConfig.autoBackupInterval) {
      if (this.props.generalConfig.autoBackupInterval !== undefined) {
        // Clear interval if needed.
        if (this.autoBackupInterval !== -1) {
          clearInterval(this.autoBackupInterval);
        }

        // Dexie returns everything as a string. Parse into into a Number here.
        var newMinutes = Number.parseInt(this.props.generalConfig.autoBackupInterval, 10);

        // Set the new interval.
        if (newMinutes !== 0 && Number.isNaN(newMinutes) !== true) {
          this.autoBackupInterval = setInterval(this.autoBackupIntervalCallback, newMinutes * 60000)
        }
      }
    }

    // Set Font Sizes.
    if (prevProps.generalConfig.useLargeFonts !== this.props.generalConfig.useLargeFonts) {
      if (this.props.generalConfig.useLargeFonts) {
        // Set Font sizes larger than default.
        document.getElementsByTagName("body")[0].style.setProperty('--task-font-size', '13pt');
        document.getElementsByTagName("body")[0].style.setProperty('--task-assignee-font-size', '12pt');
        document.getElementsByTagName("body")[0].style.setProperty('--task-list-header-font-size', '14pt');
        document.getElementsByTagName("body")[0].style.setProperty('--project-selector-font-size', '14pt');
      }

      else {
        // Fall back to CSS Stylesheet.
        document.getElementsByTagName("body")[0].style.removeProperty('--task-font-size');
        document.getElementsByTagName("body")[0].style.removeProperty('--task-assignee-font-size');
        document.getElementsByTagName("body")[0].style.removeProperty('--task-list-header-font-size');
        document.getElementsByTagName("body")[0].style.removeProperty('--project-selector-font-size');
      }
    }

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

  componentWillUnmount(){
    this.unBindMouseTrap();
    this.unsubscribeFromDatabase();
  }

  render() {
    var lockScreenJSX = this.getLockScreen();
    var shutdownScreenJSX = this.getShutdownScreenJSX();
    var appSettingsMenuJSX = this.getAppSettingsMenuJSX();
    var shareMenuJSX = this.getShareMenuJSX();
    var projects = this.props.projects == undefined ? [] : this.props.projects;
    var projectTasks = this.getSelectedProjectTasks();
    var rglDragEnabled = this.props.openTaskInspectorId === -1;
    var taskInspectorJSX = this.getTaskInspectorJSX();

    return (
      <div>

      {/* Debug Button
        <div style={{position: 'absolute', right: '0px', top: '0px', zIndex: '69', background: 'black'}}>
          <Button text="Debug" onClick={() => {this.performOvernightJobs()}} />
        </div>
      */} 

        <VisibleUpdateSnackbar/>
        <VisibleSnackbar/>
        <MessageBox config={this.props.messageBox}/>
        {lockScreenJSX}
        {shutdownScreenJSX}
        {shareMenuJSX}
        {appSettingsMenuJSX}
        {taskInspectorJSX}
      
        <div className="AppGrid">
          <div className="StatusBarAppGridItem">
            <VisibleStatusBar/>
          </div>
          <div className="SidebarAppGridItem">
            <Sidebar className="Sidebar" projects={projects} selectedProjectId={this.props.selectedProjectId} 
              disableAnimations={this.props.generalConfig.disableAnimations}
              onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
              onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}
              projectSelectorIndicators={this.props.projectSelectorIndicators} invites={this.props.invites}
              favouriteProjectId={this.props.accountConfig.favouriteProjectId} isOpen={this.props.isSidebarOpen}
              onRequestIsSidebarOpenChange={this.handleRequestIsSidebarOpenChange} isSelectedProjectRemote={this.props.isSelectedProjectRemote}
              onAcceptInviteButtonClick={this.handleAcceptInviteButtonClick} onDenyInviteButtonClick={this.handleDenyInviteButtonClick}
              onShareMenuButtonClick={this.handleShareMenuButtonClick} updatingInviteIds={this.props.updatingInviteIds}
              onProjectSelectorInputDoubleClick={this.handleProjectSelectorInputDoubleClick} 
              openProjectSelectorId={this.props.openProjectSelectorId} isLoggedIn={this.props.isLoggedIn}
            />
          </div>
          <div className="ProjectAppGridItem">
            <Project className="Project" taskLists={this.props.taskLists} tasks={this.props.tasks} selectedTask={this.props.selectedTask}
              movingTaskId={this.props.movingTaskId} focusedTaskListId={this.props.focusedTaskListId}
              projectId={this.props.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
              onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
              onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
              projectLayout={this.props.selectedProjectLayout} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
              onAddTaskButtonClick={this.handleAddTaskButtonClick} onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick}
              onAddTaskListButtonClick={this.handleAddTaskListButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
              onTaskListSettingsChanged={this.handleTaskListSettingsChanged} onTaskClick={this.handleTaskClick}
              movingTaskId={this.props.movingTaskId} sourceTaskListId={this.props.sourceTaskListId}
              onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch}
              onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick} isLoggedIn={this.props.isLoggedIn}
              openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId} onLockButtonClick={this.handleLockButtonClick}
              onAppSettingsButtonClick={this.handleAppSettingsButtonClick}
              disableAnimations={this.props.generalConfig.disableAnimations} hideLockButton={this.props.generalConfig.hideLockButton}
              openTaskListWidgetHeaderId={this.props.openTaskListWidgetHeaderId} onSettingsMenuClose={this.handleSettingsMenuClose}
              onTaskListWidgetHeaderDoubleClick={this.handleTaskListWidgetHeaderDoubleClick}
              onKeyboardShortcutsButtonClick={this.handleKeyboardShortcutsButtonClick}
              onShowCompletedTasksChanged={this.handleShowCompletedTasksChanged} showCompletedTasks={this.props.showCompletedTasks}
              onRenewNowButtonClick={this.handleRenewNowButtonClick}
              onTaskDragDrop={this.handleTaskDragDrop}
              enableKioskMode={this.props.generalConfig.enableKioskMode}
              onTaskInspectorOpen={this.handleTaskInspectorOpen}
              memberLookup={this.props.memberLookup}
              rglDragEnabled={rglDragEnabled}
              onLayoutSelectorChange={this.handleLayoutSelectorChange}
              projectLayoutType={this.props.selectedProjectLayoutType}
              showProjectLayoutTypeSelector={this.props.isSelectedProjectRemote}
              projects={this.props.projects}
              onMoveTaskListToProject={this.handleMoveTaskListToProject}
              />
          </div>
        </div>
      </div>
    );
  }

  handleMoveTaskListToProject(sourceProjectId, targetProjectId, taskListWidgetId) {
    if (targetProjectId !== "-1") {
      var projectName = this.props.projects.find(item => {
        return item.uid === targetProjectId;
      }).projectName;

      this.props.dispatch(setMessageBox(true, `Are you sure you want to move this list to ${projectName}`,
        MessageBoxTypes.STANDARD, null, result => {
          this.props.dispatch(setMessageBox(false));

          if (result === "ok") {
            this.props.dispatch(moveTaskListToProjectAsync(sourceProjectId, targetProjectId, taskListWidgetId));
          }
        }))
    }
  }

  handleLayoutSelectorChange(newValue) {
    this.props.dispatch(updateProjectLayoutTypeAsync(newValue));
  }

  handleTaskInspectorOpen(taskId) {
    this.props.dispatch(openTaskInspectorAsync(taskId));
  }

  getTaskInspectorJSX() {
    if (this.props.openTaskInspectorId !== -1) {
      return (
        <VisibleTaskInspector/>
      )
    }
  }

  handleTaskDragDrop(taskId, targetTaskListWidgetId) {
    this.props.dispatch(moveTaskAsync(targetTaskListWidgetId, taskId));
  }

  handleEscapeKeyPress(mousetrap) {
    if (this.props.isATaskMoving === true) {
      this.props.dispatch(cancelTaskMove());
    }
  }

  handleTaskOpenKeyPress(e) {
    if (this.isAppLocked()) { return }

    if (this.props.selectedTask.taskId !== -1 && this.props.selectedTask.isInputOpen === false) {
      e.preventDefault();
      this.props.dispatch(openTask(this.props.selectedTask.taskListWidgetId, this.props.selectedTask.taskId));
    }
  }

  performOvernightJobs() {
    this.props.dispatch(postSnackbarMessage("Performing overnight jobs", true, 'infomation'));

    // Update Due date Displays.
    this.props.dispatch(calculateProjectSelectorIndicators());
    this.forceUpdate(); // Forces recalculation of Task Due date displays.

    // Renew any checklists requiring renewal.
    this.renewChecklists();
  }

  renewChecklists() {
    var checklists = this.props.taskLists.filter(item => {
      return item.settings.checklistSettings.isChecklist === true;
    })

    checklists.forEach(item => {
      if (isChecklistDueForRenew(item.settings.checklistSettings)) {
        this.props.dispatch(renewChecklistAsync(item, this.isTasklistRemote(item.project), item.project, false))
      }
    })
  }

  isTasklistRemote(projectId) {
    return this.props.remoteProjectIds.some(item => {
      return item === projectId;
    })
  }

  handleRenewNowButtonClick(taskListWidgetId) {
    this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
    
    var taskList = this.props.taskLists.find(item => {
      return item.uid === taskListWidgetId
    })

    if (taskList !== undefined) {
      this.props.dispatch(renewChecklistAsync(taskList, this.props.isSelectedProjectRemote, this.props.selectedProjectId, true));
    }
  }

  handleShowCompletedTasksChanged(value) {
    this.props.dispatch(setShowCompletedTasksAsync(value));
  }

  handleKeyboardShortcutsButtonClick() {
    this.props.dispatch(setAppSettingsMenuPage('keyboard-shortcuts'));
    this.props.dispatch(setIsAppSettingsOpen(true));
  }

  handleSettingsMenuClose() {
    this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
  }

  handleProjectSelectorInputDoubleClick(projectSelectorId) {
    this.props.dispatch(setOpenProjectSelectorId(projectSelectorId));
  }

  handleTaskListWidgetHeaderDoubleClick(taskListWidgetId) {
    this.props.dispatch(setOpenTaskListWidgetHeaderId(taskListWidgetId));
  }

  autoBackupIntervalCallback() {
    // Trigger Firebase Backup.
    backupFirebaseAsync(getFirestore, this.props.remoteProjectIds).then(isoDateSaved => {
      this.props.dispatch(setLastBackupDate(isoDateSaved));
    }).catch(error => {
      let message = "Can't backup whilst Logged out: " + error.code + " " + error.message;
      this.props.dispatch(postSnackbarMessage(message, true));
    })
  }

  handleTaskInfoOpen(taskListWidgetId, taskId) {
    this.dispatchOpenTaskInfo(taskId);
  }

  handleTaskInfoClose() {
    this.props.dispatch(closeTaskInfoAsync());
  }

  handleDenyInviteButtonClick(projectId) {
    this.props.dispatch(denyProjectInviteAsync(projectId));
  }

  handleAcceptInviteButtonClick(projectId) {
    this.props.dispatch(acceptProjectInviteAsync(projectId));
  }

  handleShareMenuButtonClick() {
    this.props.dispatch(setIsShareMenuOpen(true));
  }

  getShareMenuJSX() {
    if (this.props.isShareMenuOpen) {
      return (
        <OverlayMenuContainer onOutsideChildBoundsClick={() => {this.props.dispatch(setIsShareMenuOpen(false))}}>
          <VisibleShareMenu />
        </OverlayMenuContainer>
      )
    }
  }

  handleRequestIsSidebarOpenChange(newValue) {
    this.props.dispatch(setIsSidebarOpen(newValue));
  }

  getAppSettingsMenuJSX() {
    if (this.props.isAppSettingsOpen) {
      return (
        <VisibleAppSettingsMenu/>
      )
    }
  }

  handleAppSettingsButtonClick() {
    this.props.dispatch(setIsAppSettingsOpen(!this.props.isAppSettingsOpen));
  }

  getShutdownScreenJSX() {
    if (this.props.isShuttingDown) {
      return (
        <ShutdownScreen/>
      )
    }
  }

  dispatchOpenTaskInfo(taskId) {
    this.props.dispatch(openTaskInfo(taskId));

    if (this.props.isSelectedProjectRemote) {
      this.props.dispatch(getTaskCommentsAsync(taskId));
    }
  }

  initalizeLocalConfig() {
    this.props.dispatch(getGeneralConfigAsync());
    this.props.dispatch(getCSSConfigAsync());
  }

  getSelectedProjectTasks() {
    if (this.props.selectedProjectId === -1) {
      return [];
    }

    // TODO: Firebase is returning a query ordered by projectID, therefore this could bail out once it's found
    // the first matching Task and iterated onto a non matching task for a performance gain.
    else {
      var returnList = [];
      this.props.tasks.forEach(item => {
        if (item.project === this.props.selectedProjectId) {
          returnList.push(item);
        }
      })
    }
  }

  handleLockButtonClick() {
    this.lockApp();
  }

  handleTaskListSettingsButtonClick(projectId, taskListWidgetId) {
    this.props.dispatch(setOpenTaskListSettingsMenuId(taskListWidgetId));
  }

  handleLockScreenAccessGranted() {
    this.props.dispatch(unlockApp());
  }

  handleShiftKeyDown(mouseTrap) {
    this.isShiftKeyDown = true;
  }

  handleShiftKeyUp(mouseTrap) {
    this.isShiftKeyDown = false;
  }

  handleModKeyDown(mouseTrap) {
    this.isModKeyDown = true;
  }

  handleModKeyUp(moustrap) {
    this.isModKeyDown = false;
  }

  handleDeleteKeyPress(mouseTrap) {
    if (this.isAppLocked()) { return }

    this.props.dispatch(removeSelectedTaskAsync());
  }

  handleTaskClick(taskId, projectId, taskListWidgetId) {
    // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
    var selectedTask = this.props.selectedTask;

      if (this.isShiftKeyDown) {
        this.props.dispatch(startTaskMove(taskId, taskListWidgetId));
      }

      // If a task is already moving, it's completion will be handled by the Task List Focus change. Letting the selecition handling runs
      // causes problems.
      else if (this.props.isATaskMoving === false) {
        if (selectedTask.taskListWidgetId === taskListWidgetId &&
          selectedTask.taskId === taskId && this.isModKeyDown !== true) { // If task is already selected and the Mod Key isn't down.

            // Task Already Selected. Exclusively open it's Text Input.
            this.props.dispatch(openTask(taskListWidgetId, taskId));          
        }

        else {
          // Otherwise just Select it.
          this.props.dispatch(selectTask(taskListWidgetId, taskId));

          // And open TaskInfo if a Mod key is down.
          if (this.isModKeyDown === true) {
            this.dispatchOpenTaskInfo(taskId);
          }
        }
      }

      // Force Mod Key Up.
      this.isModKeyDown = false;
  }

  handleTaskTwoFingerTouch(taskListWidgetId, taskId) {
    this.props.dispatch(startTaskMove(taskId, taskListWidgetId));
  }

  handleRemoveTaskListButtonClick() {
    if (this.props.focusedTaskListId !== -1) {
      this.props.dispatch(setMessageBox(true, "Are you sure you want to delete this Task List?", MessageBoxTypes.STANDARD, null,
        (result) => {
          if (result === "ok") {
            this.removeTaskList(this.props.focusedTaskListId);
          }
          this.props.dispatch(setMessageBox({}));
        }));
    }
  }

  handleAddTaskListButtonClick() {
    this.addNewTaskList();
  }

  handleAddTaskButtonClick() {
    // TODO: Make sure this won't crash out if nothing is Selected.
    this.addNewTask();
  }

  handleRemoveTaskButtonClick() {
    this.props.dispatch(removeSelectedTaskAsync());
  }

  handleTaskChanged(projectId, taskListWidgetId, taskId, newValue, oldValue, currentMetadata) {
    if (this.isAppLocked()) { return }

    this.props.dispatch(updateTaskNameAsync(taskListWidgetId, taskId, newValue, oldValue, currentMetadata));
  }

  handleKeyDown(e) {
  }


  handleKeyboardShortcut(mouseTrap, combo){
    // Ctrl + n
    if (combo === KEYBOARD_COMBOS.MOD_N) {
      this.addNewTask();
    }

    // Ctrl + Shift + N
    if (combo === KEYBOARD_COMBOS.MOD_SHIFT_N) {
      // Add a new TaskList.
      this.addNewTaskList();
    }

    // Shift + Escape
    if (combo === KEYBOARD_COMBOS.SHIFT_ESC) {
      this.lockApp();
    }

    // Ctrl + Shift + I
    if (combo === KEYBOARD_COMBOS.MOD_SHIFT_I) {
        // Open Dev Tools.
        remote.getCurrentWindow().openDevTools();
    }

    // Ctrl + F
    if (combo === KEYBOARD_COMBOS.MOD_F) {
        this.setFullscreenFlag(false);
    }

    if (combo === KEYBOARD_COMBOS.MOD_DEL) {
      if (this.isAppLocked() !== true && this.props.focusedTaskListId !== -1) {
        this.props.dispatch(setMessageBox(true, "Are you sure you want to delete this Task List?", MessageBoxTypes.STANDARD, null,
          (result) => {
            if (result === "ok") {
              this.removeTaskList(this.props.focusedTaskListId);
            }
            this.props.dispatch(setMessageBox({}));
          }));
      }
    }

    // Force Control Key up.
    this.isModKeyDown = false;
  }

  setFullscreenFlag(isFullscreen) {
    remote.getCurrentWindow().setFullScreen(isFullscreen);
  }

  lockApp() {
    // Lock App.
    this.props.dispatch(lockApp());

    // Trigger Firebase Backup.
    backupFirebaseAsync(getFirestore, this.props.remoteProjectIds).then(isoDateSaved => {
      this.props.dispatch(setLastBackupDate(isoDateSaved));
    }).catch(error => {
      let message = "Can't backup whilst Logged out: " + error.code + " " + error.message; 
      this.props.dispatch(postSnackbarMessage(message, true));
    })
  }

  addNewTaskList() {
    if (this.isAppLocked()) { return }

    this.props.dispatch(addNewTaskListAsync());
  }

  addNewTask() {
    if (this.isAppLocked()) { return }

    this.props.dispatch(addNewTaskAsync());
  }

  makeNewLayoutEntry(taskListId) {
    return {i: taskListId, x: 0, y: 0, w: 3, h: 5 };
  }

  handleTaskListWidgetFocusChange(taskListWidgetId, isFocused) {
    if (!isFocused) {
      if (this.props.isATaskMoving) {
        this.props.dispatch(moveTaskAsync(taskListWidgetId));
      }

      this.props.dispatch(changeFocusedTaskList(taskListWidgetId));
    }
  }

  handleTaskListWidgetHeaderChanged(taskListWidgetId, newData, oldData) {
    this.props.dispatch(updateTaskListWidgetHeaderAsync(taskListWidgetId, newData, oldData));
  }

  handleProjectSelectorClick(e, projectSelectorId) {
    this.props.dispatch(selectProject(projectSelectorId));
    this.props.dispatch(setShowCompletedTasksAsync(false));
  }

  handleLayoutChange(layouts, oldLayouts, projectId) {
    this.props.dispatch(updateProjectLayoutAsync(layouts, oldLayouts, projectId));
  }
  
  handleTaskCheckBoxClick(e, projectId, taskListWidgetId, taskId, newValue, oldValue, currentMetadata) {
    this.props.dispatch(updateTaskCompleteAsync(taskListWidgetId, taskId, newValue, oldValue, currentMetadata));
  }

  handleAddProjectClick() {
    this.props.dispatch(addNewProjectAsync());
  }

  handleRemoveProjectClick(projectId) {
    if (projectId !== -1) {
      this.props.dispatch(setMessageBox(true, "Are you sure you want to delete this Project?", MessageBoxTypes.STANDARD, null,
        (result) => {
          if (result === "ok") {
            this.props.dispatch(removeProjectAsync(projectId));
          }
          this.props.dispatch(setMessageBox({}));
        }));
    }
  }

  handleProjectNameSubmit(projectSelectorId, newName, oldName) {
    this.props.dispatch(updateProjectNameAsync(projectSelectorId, newName, oldName));
  }

  handleTaskListWidgetRemoveButtonClick(projectId, taskListWidgetId) {
    this.props.dispatch(setMessageBox(true, "Are you sure you want to delete this Task List?", MessageBoxTypes.STANDARD, null,
      (result) => {
        if (result === "ok") {
          this.removeTaskList(taskListWidgetId);
        }
        this.props.dispatch(setMessageBox({}));
      }));
  }

  removeTaskList(taskListWidgetId) {
    if (this.isAppLocked()) { return }

    this.props.dispatch(removeTaskListAsync(taskListWidgetId));
  }

  postFirebaseError(error) {
    console.error(error);
  }

  handleTaskListSettingsChanged(projectId, taskListWidgetId, newTaskListSettings, closeMenu) {
    if (closeMenu === true) {
      this.props.dispatch(setOpenTaskListSettingsMenuId(-1));
    }

    this.props.dispatch(updateTaskListSettingsAsync(taskListWidgetId, newTaskListSettings));
  }

  getLockScreen() {
    if (this.props.isLockScreenDisplayed) {
      return (
        <VisibleLockScreen onAccessGranted={this.handleLockScreenAccessGranted}
         onQuitButtonClick={this.handleQuitButtonClick} />
      )
    }
  }

  handleQuitButtonClick() {
      // Close Application.
      remote.getCurrentWindow().close();
  }

  bindMouseTrap() {
    MouseTrap.bind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
    MouseTrap.bind("shift", this.handleShiftKeyDown, 'keydown');
    MouseTrap.bind("shift", this.handleShiftKeyUp, 'keyup');
    MouseTrap.bind("mod", this.handleModKeyDown, 'keydown');
    MouseTrap.bind("mod", this.handleModKeyUp, 'keyup');
    MouseTrap.bind("del", this.handleDeleteKeyPress);
    MouseTrap.bind("enter", this.handleTaskOpenKeyPress);
    MouseTrap.bind("f2", this.handleTaskOpenKeyPress );
    MouseTrap.bind("esc", this.handleEscapeKeyPress);
  }

  unBindMouseTrap() {
    MouseTrap.unbind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
    MouseTrap.unbind("shift", this.handleShiftKeyDown);
    MouseTrap.unbind("shift", this.handleShiftKeyUp);
    MouseTrap.unbind("mod", this.handleModKeyDown);
    MouseTrap.unbind("mod", this.handleModKeyUp);
    MouseTrap.unbind("del", this.handleDeleteKeyPress);
    MouseTrap.unbind("enter", this.handleTaskOpenKeyPress);
    MouseTrap.unbind("f2", this.handleTaskOpenKeyPress);
    MouseTrap.unbind("esc", this.handleEscapeKeyPress);
  }

  isAppLocked() {
    return this.props.isLockScreenDisplayed;
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    taskLists: state.taskLists,
    tasks: state.tasks,
    projectLayoutsMap: state.projectLayoutsMap,
    focusedTaskListId: state.focusedTaskListId,
    openTaskListWidgetHeaderId: state.openTaskListWidgetHeaderId,
    selectedTask: state.selectedTask,
    selectedProjectId: state.selectedProjectId,
    openProjectSelectorId: state.openProjectSelectorId,
    isSelectedProjectRemote: state.isSelectedProjectRemote,
    isATaskMoving: state.isATaskMoving,
    movingTaskId: state.movingTaskId,
    sourceTaskListId: state.sourceTaskListId,
    openTaskListSettingsMenuId: state.openTaskListSettingsMenuId,
    projectSelectorIndicators: state.projectSelectorIndicators,
    isLockScreenDisplayed: state.isLockScreenDisplayed,
    openTaskListSettingsMenuId: state.openTaskListSettingsMenuId,
    isShuttingDown: state.isShuttingDown,
    isDexieConfigLoadComplete: state.isDexieConfigLoadComplete,
    generalConfig: state.generalConfig,
    isAppSettingsOpen: state.isAppSettingsOpen,
    accountConfig: state.accountConfig,
    ignoreFullscreenTrigger: state.ignoreFullscreenTrigger,
    cssConfig: state.cssConfig,
    messageBox: state.messageBox,
    isLoggedIn: state.isLoggedIn,
    isSidebarOpen: state.isSidebarOpen,
    isShareMenuOpen: state.isShareMenuOpen,
    invites: state.invites,
    updatingInviteIds: state.updatingInviteIds,
    members: state.members,
    memberLookup: state.memberLookup,
    remoteProjectIds: state.remoteProjectIds,
    showCompletedTasks: state.showCompletedTasks,
    openTaskInfoId: state.openTaskInfoId,
    isGettingTaskComments: state.isGettingTaskComments,
    taskComments: state.taskComments,
    isAllTaskCommentsFetched: state.isAllTaskCommentsFetched,
    openTaskInspectorId: state.openTaskInspectorId,
    selectedProjectLayout: state.selectedProjectLayout,
    selectedProjectLayoutType: state.selectedProjectLayoutType,
  }
}

let VisibleApp = connect(mapStateToProps)(App);
export default hot(module)(VisibleApp);