import '../assets/css/App.css';
import Path from 'path';
import React, { Component } from 'react';
import MouseTrap from 'mousetrap';
import Sidebar from './Sidebar';
import Project from './Project';
import VisibleStatusBar from './StatusBar';
import VisibleLockScreen from './LockScreen';
import AccountScreen from './AccountScreen';
import ShutdownScreen from './ShutdownScreen';
import VisibleAppSettingsMenu from './AppSettingsMenu/AppSettingsMenu';
import MessageBox from './MessageBox';
import '../assets/css/TaskListWidget.css';
import '../assets/css/Sidebar.css';
import '../assets/css/Project.css';
import Moment from 'moment';
import { connect } from 'react-redux';
import { MessageBoxTypes } from 'pounder-redux';
import { setFocusedTaskListId, selectTask, openTask, startTaskMove, getProjectsAsync, getTasksAsync,
unsubscribeProjectsAsync, unsubscribeProjectLayoutsAsync, unsubscribeTaskListsAsync, unsubscribeTasksAsync,
lockApp, setLastBackupMessage, setOpenTaskListSettingsMenuId, openCalendar, addNewTaskListAsync, addNewTaskAsync,
changeFocusedTaskList, moveTaskAsync, updateTaskListWidgetHeaderAsync, getTaskListsAsync, getProjectLayoutsAsync,
removeSelectedTaskAsync, updateTaskNameAsync, selectProjectAsync, updateProjectLayoutAsync, updateTaskCompleteAsync,
addNewProjectAsync, removeProjectAsync, updateProjectNameAsync, removeTaskListAsync, updateTaskListSettingsAsync,
updateTaskDueDateAsync, unlockApp, updateTaskPriority, setIsShuttingDownFlag, getGeneralConfigAsync, 
setIsAppSettingsOpen, getAccountConfigAsync, setIgnoreFullscreenTriggerFlag, getCSSConfigAsync,
setMessageBox } from 'pounder-redux/action-creators';
import { getFirestore, TASKS, TASKLISTS, PROJECTS, PROJECTLAYOUTS, } from 'pounder-firebase';
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

// Only Import if running in Electron.
// var electron = null;
// var remote = null;

// if (process.versions['electron'] !== undefined) {
//   remote = require('electron').remote;
//   electron = require('electron');
// }


class App extends React.Component {
  constructor(props) {
    super(props);

    // State.
    this.state = {
      isConnectedToFirebase: false,
      currentErrorMessage: "",
    };

    // Class Storage.
    this.isCtrlKeyDown = false;
    
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
    this.handleCtrlKeyDown = this.handleCtrlKeyDown.bind(this);
    this.handleCtrlKeyUp = this.handleCtrlKeyUp.bind(this);
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
    this.unsubscribeFromDatabase = this.unsubscribeFromDatabase.bind(this);
    this.subscribeToDatabase = this.subscribeToDatabase.bind(this);
    this.getShutdownScreenJSX = this.getShutdownScreenJSX.bind(this);
    this.initalizeConfig = this.initalizeConfig.bind(this);
    this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
    this.getAppSettingsMenuJSX = this.getAppSettingsMenuJSX.bind(this);
  }

  componentDidMount(){
    // MouseTrap.
    MouseTrap.bind(Object.values(KEYBOARD_COMBOS), this.handleKeyboardShortcut);
    MouseTrap.bind("mod", this.handleCtrlKeyDown, 'keydown');
    MouseTrap.bind("mod", this.handleCtrlKeyUp, 'keyup');
    MouseTrap.bind("del", this.handleDeleteKeyPress);

    // Read and Apply Config Values.
    this.initalizeConfig();

    // Pull down Data from Database, will also attach listeners for future changes.
    this.subscribeToDatabase();

    // Computer has resumed from sleep.
    electron.ipcRenderer.on('resume', () => {
      // Refresh Data.
      this.unsubscribeFromDatabase();
      this.subscribeToDatabase();
    })

    electron.ipcRenderer.on('window-closing', () => {
      this.props.dispatch(setIsShuttingDownFlag(true));

      // Backup Data to Disk.
      backupFirebaseAsync(getFirestore).then(() => {
        // Send Message back to Main Process once complete.
        electron.ipcRenderer.send('ready-to-close');
      }).catch(error => {
        this.postFirebaseError(error);
      })
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
    MouseTrap.unBind("mod", this.handleCtrlKeyDown);
    MouseTrap.unBind("mod", this.handleCtrlKeyUp);
    MouseTrap.unbind("del", this.handleDeleteKeyPress);

    this.unsubscribeFromDatabase();
  }

  render() {
    var layouts = this.props.projectLayout.layouts;
    var lockScreenJSX = this.getLockScreen();
    var shutdownScreenJSX = this.getShutdownScreenJSX();
    var appSettingsMenuJSX = this.getAppSettingsMenuJSX();
    var projects = this.props.projects == undefined ? [] : this.props.projects;
    var projectTasks = this.getSelectedProjectTasks();

    return (
      <div>
        <MessageBox config={this.props.messageBox}/>
        {lockScreenJSX}
        {shutdownScreenJSX}

        {appSettingsMenuJSX}
        <VisibleStatusBar/>
        <div className="SidebarProjectFlexContainer">
          <div className="SidebarFlexItemContainer">
            <Sidebar className="Sidebar" projects={projects} selectedProjectId={this.props.selectedProjectId}
              onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
              onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}
              projectSelectorDueDateDisplays={this.props.projectSelectorDueDateDisplays}
              favouriteProjectId={this.props.accountConfig.favouriteProjectId}
            />
          </div>
          <div className="ProjectFlexItemContainer">
            <Project className="Project" taskLists={this.props.taskLists} tasks={this.props.tasks} selectedTask={this.props.selectedTask}
              movingTaskId={this.props.movingTaskId} focusedTaskListId={this.props.focusedTaskListId}
              projectId={this.props.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
              onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
              onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
              layouts={layouts} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
              onAddTaskButtonClick={this.handleAddTaskButtonClick} onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick}
              onAddTaskListButtonClick={this.handleAddTaskListButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
              onTaskListSettingsChanged={this.handleTaskListSettingsChanged} onTaskClick={this.handleTaskClick}
              movingTaskId={this.props.movingTaskId} sourceTaskListId={this.props.sourceTaskListId}
              onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} onDueDateClick={this.handleDueDateClick}
              openCalendarId={this.props.openCalendarId} onNewDateSubmit={this.handleNewDateSubmit}
              onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick}
              openTaskListSettingsMenuId={this.props.openTaskListSettingsMenuId} onLockButtonClick={this.handleLockButtonClick}
              onTaskPriorityToggleClick={this.handleTaskPriorityToggleClick} onAppSettingsButtonClick={this.handleAppSettingsButtonClick}
            />
          </div>
        </div>
      </div>
    );
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

  initalizeConfig() {
    this.props.dispatch(getGeneralConfigAsync());
    this.props.dispatch(getCSSConfigAsync());
  }

  subscribeToDatabase() {
        // Get Projects (Also attaches a Value listener for future changes).
        this.props.dispatch(getProjectsAsync());

        // Get Task Lists (Also Attaches a value listener for future changes).
        this.props.dispatch(getTaskListsAsync());  
         
        // Get Tasks (Also attaches a Value listener for future changes).
        this.props.dispatch(getTasksAsync());

        // Get Account Config (Also attaches a Value listener for future changes).
        this.props.dispatch(getAccountConfigAsync());
    
  }

  unsubscribeFromDatabase() {
    // Stop listening to the Database.
    this.props.dispatch(unsubscribeProjectsAsync());
    this.props.dispatch(unsubscribeTaskListsAsync());
    this.props.dispatch(unsubscribeTasksAsync());
    this.props.dispatch(unsubscribeProjectLayoutsAsync());
    this.props.dispatch(unsubscribeAccountConfigAsync());
  }

  handleTaskPriorityToggleClick(taskId, newValue) {
    this.props.dispatch(updateTaskPriority(taskId, newValue));
  }

  getSelectedProjectTasks() {
    if (this.props.selectedProjectId === -1) {
      return [];
    }

    // TODO: Firebase is return a query ordered by projectID, therefore this could bail out once it's found
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

  exerciseFirebase() {
    // Pull down some blank data from Firebase to keep the Websocket Open.
    // var ref = Firebase.database().ref("websocketTimeoutFix").once('value', () => {});
  }

  handleLockScreenAccessGranted() {
    this.props.dispatch(unlockApp());
  }

  handleCtrlKeyDown(mouseTrap) {
    this.isCtrlKeyDown = true;
  }

  handleCtrlKeyUp(mouseTrap) {
    this.isCtrlKeyDown = false;
  }

  handleDeleteKeyPress(mouseTrap) {
    this.props.dispatch(removeSelectedTaskAsync());
  }

  handleTaskClick(element, projectId, taskListWidgetId) {
    // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
    var selectedTask = this.props.selectedTask;
    var openCalendarId = this.props.openCalendarId === element.props.taskId ? this.props.openCalendarId : -1; // Keep calendar Open if it already Open.

      if (this.isCtrlKeyDown) {
        this.props.dispatch(startTaskMove(element.props.taskId, taskListWidgetId));
      }

      // If a task is already moving, it's completion will be handled by the Task List Focus change. Letting the selecition handling runs
      // causes problems.
      else if (this.props.isATaskMoving === false) {
        if (selectedTask.taskListWidgetId === taskListWidgetId &&
          selectedTask.taskId === element.props.taskId) {
          // Task Already Selected. Exclusively open it's Text Input.
          this.props.dispatch(openTask(taskListWidgetId, element.props.taskId));
        }

        else {
          // Otherwise just Select it.
          this.props.dispatch(selectTask(taskListWidgetId, element.props.taskId));
        }
      }
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

  handleTaskChanged(projectId, taskListWidgetId, taskId, newData) {
    this.props.dispatch(updateTaskNameAsync(taskListWidgetId, taskId, newData));
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
    this.isCtrlKeyDown = false;
  }

  setFullscreenFlag(isFullscreen) {
    remote.getCurrentWindow().setFullScreen(isFullscreen);
  }

  lockApp() {
    // Lock App.
    this.props.dispatch(lockApp());

    // Trigger Firebase Backup.
    this.props.dispatch(setLastBackupMessage("Writing to File..."));

    backupFirebaseAsync(getFirestore).then(message => {
      this.props.dispatch(setLastBackupMessage(message));
    }).catch(error => {
      this.postFirebaseError(error);
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
    this.props.dispatch(selectProjectAsync(projectSelectorId));
  }

  handleLayoutChange(layouts, projectId) {
    this.props.dispatch(updateProjectLayoutAsync(layouts, projectId));
  }
  
  handleTaskCheckBoxClick(e, projectId, taskListWidgetId, taskId, incomingValue) {
    this.props.dispatch(updateTaskCompleteAsync(taskListWidgetId, taskId, incomingValue));
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

  handleNewDateSubmit(projectId, taskListWidgetId, taskId, newDate) {
    this.props.dispatch(updateTaskDueDateAsync(taskId, newDate));
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
    projectLayout: state.projectLayout,
    focusedTaskListId: state.focusedTaskListId,
    selectedTask: state.selectedTask,
    selectedProjectId: state.selectedProjectId,
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
  }
}

let VisibleApp = connect(mapStateToProps)(App);
export default VisibleApp;

