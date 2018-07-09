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
import '../assets/css/TaskListWidget.css';
import '../assets/css/Sidebar.css';
import '../assets/css/Project.css';
import { connect } from 'react-redux';
import { MessageBoxTypes } from 'pounder-redux';
import { hot } from 'react-hot-loader';
import {selectTask, openTask, startTaskMove,
lockApp, setLastBackupDate, setOpenTaskListSettingsMenuId, openCalendar, addNewTaskListAsync, addNewTaskAsync,
changeFocusedTaskList, moveTaskAsync, updateTaskListWidgetHeaderAsync, setIsSidebarOpen, acceptProjectInviteAsync,
removeSelectedTaskAsync, updateTaskNameAsync, selectProject, updateProjectLayoutAsync, updateTaskCompleteAsync,
addNewProjectAsync, removeProjectAsync, updateProjectNameAsync, removeTaskListAsync, updateTaskListSettingsAsync,
updateTaskDueDateAsync, unlockApp, updateTaskPriority, setIsShuttingDownFlag, getGeneralConfigAsync,
setIsAppSettingsOpen, setIgnoreFullscreenTriggerFlag, getCSSConfigAsync, setIsShareMenuOpen, closeMetadata,
setMessageBox, attachAuthListenerAsync, denyProjectInviteAsync, postSnackbarMessage, } from 'pounder-redux/action-creators';
import { getFirestore } from 'pounder-firebase';
import { backupFirebaseAsync } from '../utilities/FileHandling';
import electron from 'electron';

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
    this.handleDueDateClick = this.handleDueDateClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
    this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
    this.getLockScreen = this.getLockScreen.bind(this);
    this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
    this.getSelectedProjectTasks = this.getSelectedProjectTasks.bind(this);
    this.handleTaskPriorityToggleClick = this.handleTaskPriorityToggleClick.bind(this);
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
    this.handleTaskMetadataCloseButtonClick = this.handleTaskMetadataCloseButtonClick.bind(this);
    this.handleTaskMetadataOpen = this.handleTaskMetadataOpen.bind(this);
  }

  componentDidMount(){
    // MouseTrap.
    MouseTrap.bind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
    MouseTrap.bind("shift", this.handleShiftKeyDown, 'keydown');
    MouseTrap.bind("shift", this.handleShiftKeyUp, 'keyup');
    MouseTrap.bind("mod", this.handleModKeyDown, 'keydown');
    MouseTrap.bind("mod", this.handleModKeyUp, 'keyup');
    MouseTrap.bind("del", this.handleDeleteKeyPress);


    // Read and Apply Config Values.
    this.initalizeLocalConfig();

    // Attaches an Authentication State listener. Will Pull down database when Logged in.
    this.props.dispatch(attachAuthListenerAsync());

    // Computer has resumed from sleep.
    electron.ipcRenderer.on('resume', () => {
      // Refresh Data.
      // Code here removed because it messes with Auth.. Firebase will re check server it just takes about 15 seconds.
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
          document.getElementById("root").style.setProperty(property, value);
        }
      }
    }
  }

  componentWillUnmount(){
    MouseTrap.unBind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
    MouseTrap.unBind("shift", this.handleShiftKeyDown);
    MouseTrap.unBind("shift", this.handleShiftKeyUp);
    MouseTrap.unbind("del", this.handleDeleteKeyPress);

    this.unsubscribeFromDatabase();
  }

  render() {
    var lockScreenJSX = this.getLockScreen();
    var shutdownScreenJSX = this.getShutdownScreenJSX();
    var appSettingsMenuJSX = this.getAppSettingsMenuJSX();
    var shareMenuJSX = this.getShareMenuJSX();
    var projects = this.props.projects == undefined ? [] : this.props.projects;
    var projectTasks = this.getSelectedProjectTasks();

    return (
      <div>
        <VisibleSnackbar/>
        <MessageBox config={this.props.messageBox}/>
        {lockScreenJSX}
        {shutdownScreenJSX}
        {shareMenuJSX}
        {appSettingsMenuJSX}
        
        <div className="AppGrid">
          <div className="StatusBarAppGridItem">
            <VisibleStatusBar/>
          </div>
          <div className="SidebarAppGridItem">
            <Sidebar className="Sidebar" projects={projects} selectedProjectId={this.props.selectedProjectId}
              onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
              onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}
              projectSelectorDueDateDisplays={this.props.projectSelectorDueDateDisplays} invites={this.props.invites}
              favouriteProjectId={this.props.accountConfig.favouriteProjectId} isOpen={this.props.isSidebarOpen}
              onRequestIsSidebarOpenChange={this.handleRequestIsSidebarOpenChange} isSelectedProjectRemote={this.props.isSelectedProjectRemote}
              onAcceptInviteButtonClick={this.handleAcceptInviteButtonClick} onDenyInviteButtonClick={this.handleDenyInviteButtonClick}
              onShareMenuButtonClick={this.handleShareMenuButtonClick} updatingInviteIds={this.props.updatingInviteIds}
            />
          </div>
          <div className="ProjectAppGridItem">
            <Project className="Project" taskLists={this.props.taskLists} tasks={this.props.tasks} selectedTask={this.props.selectedTask}
              movingTaskId={this.props.movingTaskId} focusedTaskListId={this.props.focusedTaskListId}
              projectId={this.props.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
              onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
              onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
              projectLayouts={this.props.projectLayouts} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
              onAddTaskButtonClick={this.handleAddTaskButtonClick} onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick}
              onAddTaskListButtonClick={this.handleAddTaskListButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
              onTaskListSettingsChanged={this.handleTaskListSettingsChanged} onTaskClick={this.handleTaskClick}
              movingTaskId={this.props.movingTaskId} sourceTaskListId={this.props.sourceTaskListId}
              onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} onDueDateClick={this.handleDueDateClick}
              openCalendarId={this.props.openCalendarId} onNewDateSubmit={this.handleNewDateSubmit}
              onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick} isLoggedIn={this.props.isLoggedIn}
              openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId} onLockButtonClick={this.handleLockButtonClick}
              onTaskPriorityToggleClick={this.handleTaskPriorityToggleClick} onAppSettingsButtonClick={this.handleAppSettingsButtonClick}
              onTaskMetadataCloseButtonClick={this.handleTaskMetadataCloseButtonClick} onTaskMetadataOpen={this.handleTaskMetadataOpen}
            />
          </div>
        </div>
      </div>
    );
  }

  handleTaskMetadataOpen(taskListWidgetId, taskId) {
    this.props.dispatch(selectTask(taskListWidgetId, taskId, true));
  }

  handleTaskMetadataCloseButtonClick() {
    this.props.dispatch(closeMetadata());
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

  initalizeLocalConfig() {
    this.props.dispatch(getGeneralConfigAsync());
    this.props.dispatch(getCSSConfigAsync());
  }

  handleTaskPriorityToggleClick(taskId, newValue, currentMetadata) {
    this.props.dispatch(updateTaskPriority(taskId, newValue, currentMetadata));
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

  handleDueDateClick(projectId, taskListWidgetId, taskId) {
    this.props.dispatch(openCalendar(taskListWidgetId, taskId));
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
    this.props.dispatch(removeSelectedTaskAsync());
  }

  handleTaskClick(element, projectId, taskListWidgetId) {
    // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
    var selectedTask = this.props.selectedTask;
    var openCalendarId = this.props.openCalendarId === element.props.taskId ? this.props.openCalendarId : -1; // Keep calendar Open if it already Open.

      if (this.isShiftKeyDown) {
        this.props.dispatch(startTaskMove(element.props.taskId, taskListWidgetId));
      }

      // If a task is already moving, it's completion will be handled by the Task List Focus change. Letting the selecition handling runs
      // causes problems.
      else if (this.props.isATaskMoving === false) {
        if (selectedTask.taskListWidgetId === taskListWidgetId &&
          selectedTask.taskId === element.props.taskId && this.isModKeyDown !== true) { // If task is already selected and the Mod Key isn't down.

            // Task Already Selected. Exclusively open it's Text Input.
            this.props.dispatch(openTask(taskListWidgetId, element.props.taskId));          
        }

        else {
          // Otherwise just Select it.
          this.props.dispatch(selectTask(taskListWidgetId, element.props.taskId, this.isModKeyDown));
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
      this.props.dispatch(setMessageBox(true, "Are you sure?", MessageBoxTypes.STANDARD, null,
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

  handleTaskChanged(projectId, taskListWidgetId, taskId, newData, currentMetadata) {
    this.props.dispatch(updateTaskNameAsync(taskListWidgetId, taskId, newData, currentMetadata));
  }

  handleKeyDown(e) {
  }


  handleKeyboardShortcut(mouseTrap, combo){
    // Ctrl + n
    if (combo === KEYBOARD_COMBOS.MOD_N)
      {
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
      if (this.props.focusedTaskListId !== -1 && confirm("Are you sure?") === true) {
        this.removeTaskList(this.props.focusedTaskListId);
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
    this.props.dispatch(addNewTaskListAsync());
  }

  addNewTask() {
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

  handleTaskListWidgetHeaderChanged(taskListWidgetId, newData) {
    this.props.dispatch(updateTaskListWidgetHeaderAsync(taskListWidgetId, newData));
  }

  handleProjectSelectorClick(e, projectSelectorId) {
    this.props.dispatch(selectProject(projectSelectorId));
  }

  handleLayoutChange(layouts, projectId) {
    this.props.dispatch(updateProjectLayoutAsync(layouts, projectId));
  }
  
  handleTaskCheckBoxClick(e, projectId, taskListWidgetId, taskId, incomingValue, currentMetadata) {
    this.props.dispatch(updateTaskCompleteAsync(taskListWidgetId, taskId, incomingValue, currentMetadata));
  }

  handleAddProjectClick() {
    this.props.dispatch(addNewProjectAsync());
  }

  handleRemoveProjectClick(projectId) {
    if (projectId !== -1) {
      this.props.dispatch(setMessageBox(true, "Are you sure?", MessageBoxTypes.STANDARD, null,
        (result) => {
          if (result === "ok") {
            this.props.dispatch(removeProjectAsync(projectId));
          }
          this.props.dispatch(setMessageBox({}));
        }));
    }
  }

  handleProjectNameSubmit(projectSelectorId, newName) {
    this.props.dispatch(updateProjectNameAsync(projectSelectorId, newName));
  }

  handleTaskListWidgetRemoveButtonClick(projectId, taskListWidgetId) {
    this.props.dispatch(setMessageBox(true, "Are you sure?", MessageBoxTypes.STANDARD, null,
      (result) => {
        if (result === "ok") {
          this.removeTaskList(taskListWidgetId);
        }
        this.props.dispatch(setMessageBox({}));
      }));
  }

  removeTaskList(taskListWidgetId) {
    this.props.dispatch(removeTaskListAsync(taskListWidgetId));
  }

  postFirebaseError(error) {
    console.error(error);
  }

  handleTaskListSettingsChanged(projectId, taskListWidgetId, newTaskListSettings) {
    this.props.dispatch(updateTaskListSettingsAsync(taskListWidgetId, newTaskListSettings));
  }

  handleNewDateSubmit(projectId, taskListWidgetId, taskId, newDate, currentMetadata) {
    this.props.dispatch(updateTaskDueDateAsync(taskId, newDate, currentMetadata));
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
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    taskLists: state.taskLists,
    tasks: state.tasks,
    projectLayouts: state.projectLayouts,
    focusedTaskListId: state.focusedTaskListId,
    selectedTask: state.selectedTask,
    selectedProjectId: state.selectedProjectId,
    isSelectedProjectRemote: state.isSelectedProjectRemote,
    isATaskMoving: state.isATaskMoving,
    movingTaskId: state.movingTaskId,
    sourceTaskListId: state.sourceTaskListId,
    openCalendarId: state.openCalendarId,
    openTaskListSettingsMenuId: state.openTaskListSettingsMenuId,
    projectSelectorDueDateDisplays: state.projectSelectorDueDateDisplays,
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
    remoteProjectIds: state.remoteProjectIds,
  }
}

let VisibleApp = connect(mapStateToProps)(App);
export default hot(module)(VisibleApp);

