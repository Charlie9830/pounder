import '../assets/css/App.css';
import Path from 'path';
import React, { Component } from 'react';
import MouseTrap from 'mousetrap';
import Sidebar from './Sidebar';
import Project from './Project';
import StatusBar from './StatusBar';
import LockScreen from './LockScreen';
import TaskListStore from '../stores/TaskListStore';
import TaskStore from '../stores/TaskStore';
import ProjectLayoutStore from '../stores/ProjectLayoutStore';
import ProjectStore from '../stores/ProjectStore';
import TaskListSettingsStore from '../stores/TaskListSettingsStore';
import '../assets/css/TaskListWidget.css';
import '../assets/css/Sidebar.css';
import '../assets/css/Project.css';
import Moment from 'moment';
import ParseDueDate from '../utilities/ParseDueDate';
import { connect } from 'react-redux';
import { setFocusedTaskListId, selectTask, openTask, startTaskMove, getProjectsAsync, getTasksAsync,
unsubscribeProjectsAsync, unsubscribeProjectLayoutsAsync, unsubscribeTaskListsAsync, unsubscribeTasksAsync,
lockApp, setLastBackupMessage, setOpenTaskListSettingsMenuId, openCalendar, addNewTaskListAsync, addNewTaskAsync,
changeFocusedTaskList, moveTaskAsync, updateTaskListWidgetHeaderAsync, getTaskListsAsync, getProjectLayoutsAsync,
removeSelectedTaskAsync, updateTaskNameAsync, selectProject, updateProjectLayoutAsync, updateTaskCompleteAsync,
addNewProjectAsync, removeProjectAsync, updateProjectNameAsync, removeTaskListAsync, updateTaskListSettingsAsync,
updateTaskDueDateAsync, unlockApp } from '../action-creators/index';
import { getFirestore, TASKS, TASKLISTS, PROJECTS, PROJECTLAYOUTS } from '../firebase/index';

// Only Import if running in Electron.
var remote = null;
var fsJetpack = null;

if (process.versions['electron'] !== undefined) {
  remote = require('electron').remote;
  fsJetpack = require('fs-jetpack');
}

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
    this.isInElectron = remote !== null;
    
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
    this.backupFirebase = this.backupFirebase.bind(this);
    this.lockApp = this.lockApp.bind(this);
    this.handleDueDateClick = this.handleDueDateClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
    this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
    this.getLockScreen = this.getLockScreen.bind(this);
    this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
    this.getSelectedProjectTasks = this.getSelectedProjectTasks.bind(this);
    this.writeDatabaseToFile = this.writeDatabaseToFile.bind(this);
  }

  componentDidMount(){
    // MouseTrap.
    MouseTrap.bind(['mod+n', 'mod+shift+n', 'shift+esc', 'mod+shift+i', 'mod+f'], this.handleKeyboardShortcut);
    MouseTrap.bind("mod", this.handleCtrlKeyDown, 'keydown');
    MouseTrap.bind("mod", this.handleCtrlKeyUp, 'keyup');

    // TODO: Bring connection Status Monitoring over to Firestore.
    // Setup Connection Monitoring.
    // var connectionRef = Firebase.database().ref(".info/connected");
    // connectionRef.on("value", snap => {
    //   if (snap.val() === true) {
    //     this.setState({isConnectedToFirebase: true})
    //   }
    //   else {
    //     this.setState({isConnectedToFirebase: false})
    //   }
    // })

    // Get Projects (Also attaches a Value listener for future changes).
    this.props.dispatch(getProjectsAsync());

    // Get Tasks (Also attaches a Value listener for future changes).
    this.props.dispatch(getTasksAsync());

    // Electron only Config.
    if (this.isInElectron) {
      if (remote.process.env.NODE_ENV === 'production') {
        this.lockApp();
      }

      // TODO: Register an issue with Firebase about this.
      // Firebase closes it's Websocket if it's been Inactive for more then 45 Seconds, then struggles to re-establish
      // when inside Electron. This will 'ping' the firebase servers every 40 seconds.
      // setInterval(this.exerciseFirebase, 40000);
    }
  }
  
  componentWillUnmount(){
    MouseTrap.unBind(['ctrl+n', 'ctrl+shift+n', 'shift+esc', 'mod+shift+i', 'mod+f'], this.handleKeyboardShortcut);
    MouseTrap.unBind("mod", this.handleCtrlKeyDown);
    MouseTrap.unBind("mod", this.handleCtrlKeyUp);

    // Stop listening to the Database.
    this.props.dispatch(unsubscribeProjectsAsync());
    this.props.dispatch(unsubscribeTaskListsAsync());
    this.props.dispatch(unsubscribeTasksAsync());
    this.props.dispatch(unsubscribeProjectLayoutsAsync());
  }

  render() {
    var layouts = this.props.projectLayout.layouts;
    var lockScreenJSX = this.getLockScreen();
    var projects = this.props.projects == undefined ? [] : this.props.projects;
    var projectTasks = this.getSelectedProjectTasks();

    return (
      <div>
        {lockScreenJSX}

        <StatusBar isAwaitingFirebase={this.props.isAwaitingFirebase} isConnectedToFirebase={this.props.isConnectedToFirebase}
        errorMessage={this.props.currentErrorMessage}/>
        <div className="SidebarProjectFlexContainer">
          <div className="SidebarFlexItemContainer">
            <Sidebar className="Sidebar" projects={projects} selectedProjectId={this.props.selectedProjectId}
              onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
              onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}
              projectSelectorDueDateDisplays={this.props.projectSelectorDueDateDisplays} />
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
              />
          </div>
        </div>
      </div>
    );
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
    console.log("Due Date Click");
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

  handleTaskClick(element, projectId, taskListWidgetId) {
    // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
    var selectedTask = this.props.selectedTask;
    var openCalendarId = this.props.openCalendarId === element.props.taskId ? this.props.openCalendarId : -1; // Keep calendar Open if it already Open.

    if (this.isCtrlKeyDown) {
      this.props.dispatch(startTaskMove(element.props.taskId, taskListWidgetId));
    }

    else {
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
    if (this.props.focusedTaskListId !== -1 && confirm("Are you Sure?") === true) {
      this.removeTaskList(this.props.focusedTaskListId);
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


  handleKeyboardShortcut(mouseTrap){
    // Ctrl + n
    if (mouseTrap.ctrlKey && mouseTrap.key === "n")
      {
        this.addNewTask();
      }

    // Ctrl + Shift + N
    if (mouseTrap.ctrlKey && mouseTrap.shiftKey && mouseTrap.key === "N") {
      // Add a new TaskList.
      this.addNewTaskList();
    }

    // Shift + Escape
    if (mouseTrap.shiftKey && mouseTrap.key === "Escape") {
      this.lockApp();
    }

    // Ctrl + Shift + I
    if (mouseTrap.ctrlKey && mouseTrap.shiftKey && mouseTrap.key === "I") {
      if (this.isInElectron) {
        // Open Dev Tools.
        remote.getCurrentWindow().openDevTools();
      }
    }

    // Ctrl + F
    if (mouseTrap.ctrlKey && mouseTrap.key === "f") {
      if (this.isInElectron) {
        remote.getCurrentWindow().setFullScreen(false);
      }
    }
  }

  lockApp() {
    // Lock App.
    // this.setState({ IsLockScreenDisplayed: true });
    this.props.dispatch(lockApp());

    // Trigger Firebase Backup.
    this.backupFirebase();
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
    var outgoingProjectId = this.props.selectedProjectId;
    var incomingProjectId = projectSelectorId;

    if (outgoingProjectId !== -1) {
      // Old Listeners.
      this.props.dispatch(unsubscribeTaskListsAsync());
      this.props.dispatch(unsubscribeProjectLayoutsAsync());
    }

    if (incomingProjectId !== -1 ) {
      this.props.dispatch(getTaskListsAsync(projectSelectorId));
      this.props.dispatch(getProjectLayoutsAsync(projectSelectorId));
    }

    this.props.dispatch(selectProject(projectSelectorId));

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
    if (confirm("Are you sure?") === true) {
      this.props.dispatch(removeProjectAsync(projectId));
    }
  }

  handleProjectNameSubmit(projectSelectorId, newName) {
    this.props.dispatch(updateProjectNameAsync(projectSelectorId, newName));
  }

  handleTaskListWidgetRemoveButtonClick(projectId, taskListWidgetId) {
    if (confirm("Are you Sure?")) {
      this.removeTaskList(taskListWidgetId);
    }
  }

  removeTaskList(taskListWidgetId) {
    this.props.dispatch(removeTaskListAsync(taskListWidgetId));
  }

  postFirebaseError(error) {
    // console.error(error);
    // this.setState({
    //   isAwaitingFirebase: false,
    //   currentErrorMessage: "An error has occurred. Please consult Developer Diagnostics Log"});
  }

  handleTaskListSettingsChanged(projectId, taskListWidgetId, newTaskListSettings) {
    this.props.dispatch(updateTaskListSettingsAsync(taskListWidgetId, newTaskListSettings));
  }

  backupFirebase() {
    if (this.isInElectron) {
      var data = this.pullDownDatabase().then(data => {
        this.writeDatabaseToFile(data.toJSON());
      }).catch(error => {
        this.postFirebaseError(error);
      })
    }
  }

  overwriteFirebase(data) {
    var confirmMessage = "THIS WILL WIPE FIRESTORE!. Are you sure you want to proceed?";
    if (confirm(confirmMessage) === true) {
      this.nukeFirestore().then(() => {
        // Collect Data from File.
        // var data = this.readBackupFile();
        var { projects, projectLayouts, taskLists, tasks } = data;
        var batch = getFirestore().batch();

        // Projects.
        projects.forEach(project => {
          batch.set(getFirestore().collection(PROJECTS).doc(project.uid), project);
        })

        // Project Layouts.
        projectLayouts.forEach(projectLayout => {
          batch.set(getFirestore().collection(PROJECTLAYOUTS).doc(projectLayout.uid), projectLayout);
        })

        // Task Lists.
        taskLists.forEach(taskList => {
          batch.set(getFirestore().collection(TASKLISTS).doc(taskList.uid), taskList);
        })

        // Tasks
        tasks.forEach(task => {
          batch.set(getFirestore().collection(TASKS).doc(task.uid), task);
        })

        batch.commit().then(() => {
          console.log("Sucseffully Commited Batch");
        })
      })
    }
  }

  readBackupFile() {
    throw "Function not Implemented";
  }

  pullDownDatabase() {
    return new Promise((resolve, reject) => {
      // Pull Data down from Firestore.
      var requests = [];
      var projects = [];
      var projectLayouts = [];
      var taskLists = [];
      var tasks = [];

      // Projects.
      requests.push(getFirestore().collection(PROJECTS).get().then(snapshot => {
        snapshot.forEach(doc => {
          projects.push(doc.data());
        })
      }))

      // Project Layouts.
      requests.push(getFirestore().collection(PROJECTLAYOUTS).get().then(snapshot => {
        snapshot.forEach(doc => {
          projectLayouts.push(doc.data());
        })
      }))

      // TaskLists.
      requests.push(getFirestore().collection(TASKLISTS).get().then(snapshot => {
        snapshot.forEach(doc => {
          taskLists.push(doc.data());
        })
      }))

      // Tasks.
      requests.push(getFirestore().collection(TASKS).get().then(snapshot => {
        snapshot.forEach(doc => {
          tasks.push(doc.data());
        })
      }))

      Promise.all(requests).then(() => {
        // Combine Together.
        var combined = {
          projects: projects,
          projectLayouts: projectLayouts,
          taskLists: taskLists,
          tasks: tasks
        }

        resolve(combined);
      }).catch(error => {
        reject(error);
      })
    })
  }

  nukeFirestore() {
    return new Promise((resolve, reject) => {
      this.pullDownDatabase().then(data => {
        var { projects, projectLayouts, taskLists, tasks } = data;

        // Build a list of References.
        var refs = [];

        // Projects.
        projects.forEach(project => {
          refs.push(getFirestore().collection(PROJECTS).doc(project.uid));
        })

        // Project Layouts.
        projectLayouts.forEach(projectLayout => {
          refs.push(getFirestore().collection(PROJECTLAYOUTS).doc(projectLayout.uid));
        })

        // TaskLists.
        taskLists.forEach(taskList => {
          refs.push(getFirestore().collection(TASKLISTS).doc(taskList.uid));
        })

        // Tasks.
        tasks.forEach(task => {
          refs.push(getFirestore().collection(TASKS).doc(task.uid));
        })

        // Build Delete Batch.
        var batch = getFirestore().batch();
        refs.forEach(ref => {
          batch.delete(ref);
        })

        // Execute Batch.
        batch.commit().then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      })
    })
  }

  writeDatabaseToFile(json) {
    if (json.length > 0) {
      // Write to Backup File.
      // Intialize File Path and Name.
      var backupDirectory = Path.join(remote.app.getPath('documents'), "/Pounder", "/Backups");

      var currentDate = new Date();
      var normalizedDate = this.getNormalizedDate(currentDate);
      var filePath = Path.join(backupDirectory, "/", "backup " + normalizedDate + ".json");

      // Create File.
      fsJetpack.file(filePath, { mode: '700' });

      // Write to File.
      fsJetpack.writeAsync(filePath, json, { atomic: true }).then(() => {
        var message = "Last backup created at " +
          currentDate.getHours() + ":" +
          currentDate.getMinutes() + ":" +
          currentDate.getSeconds() + " in " +
          backupDirectory;
          
        this.props.dispatch(setLastBackupMessage(message));
      })
    }

    else {
      this.props.dispatch(setLastBackupMessage("Something went wrong while writing to backup."));
    }
  }

  getNormalizedDate(date) {
    var array = [];
    array.push(
      date.getFullYear(),
      (date.getMonth() + 1),
      date.getDate(),
      " ",
      date.getSeconds(),
      date.getMinutes(),
      date.getHours(),
    )

    var normalizedArray = array.map(n => {
      if (n === " ") {
        return n;
      }

      else {
        return n < 10 ? '0'+n : ''+n;
      }
    });

    return normalizedArray.join("");
  }

  handleNewDateSubmit(projectId, taskListWidgetId, taskId, newDate) {
    this.props.dispatch(updateTaskDueDateAsync(taskId, newDate));
  }

  getLockScreen() {
    if (this.props.isLockScreenDisplayed) {
      return (
        <LockScreen onAccessGranted={this.handleLockScreenAccessGranted}
          backupMessage={this.props.lastBackupMessage} onQuitButtonClick={this.handleQuitButtonClick} />
      )
    }
  }

  handleQuitButtonClick() {
    if (this.isInElectron) {
      // Close Application.
      remote.getCurrentWindow().close();
    }
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
    lastBackupMessage: state.lastBackupMessage,
    isLockScreenDisplayed: state.isLockScreenDisplayed,
    openTaskListSettingsMenuId: state.openTaskListSettingsMenuId,
  }
}

let VisibleApp = connect(mapStateToProps)(App);
export default VisibleApp;

