import '../assets/css/App.css';
import Path from 'path';
import React, { Component } from 'react';
import MouseTrap from 'mousetrap';
import Sidebar from './Sidebar';
import Project from './Project';
import StatusBar from './StatusBar';
import LockScreen from './LockScreen';
import '../assets/css/TaskListWidget.css'
import '../assets/css/Sidebar.css'
import '../assets/css/Project.css'
import Firebase from 'firebase';
import TaskListStore from '../stores/TaskListStore';
import TaskStore from '../stores/TaskStore';
import ProjectLayoutStore from '../stores/ProjectLayoutStore';
import ProjectStore from '../stores/ProjectStore';
import TaskListSettingsStore from '../stores/TaskListSettingsStore';
import Moment from 'moment';
import ParseDueDate from '../utilities/ParseDueDate';

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
      projects: [], // Stores all Projects from the DB.
      taskLists: [], // Currently only stores TaskLists from the Selected Project.
      tasks: [], // Stores all Tasks from the DB.
      projectLayout: new ProjectLayoutStore({}, -1, -1),
      focusedTaskListId: -1,
      selectedProjectId: -1,
      selectedTask: {taskListWidgetId: -1, taskId: -1, isInputOpen: false},
      isATaskMoving: false,
      movingTaskId: -1,
      sourceTaskListId: -1,
      isAwaitingFirebase: false,
      isConnectedToFirebase: false,
      currentErrorMessage: "",
      IsLockScreenDisplayed: false,
      lastBackupMessage: "",
      openCalendarId: -1,
      openTaskListSettingsMenuId: -1,
      projectSelectorDueDateDisplays: {},
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
    this.trimLayouts = this.trimLayouts.bind(this);
    this.compareLayouts = this.compareLayouts.bind(this);
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
    this.onIncomingTaskLists = this.onIncomingTaskLists.bind(this);
    this.onIncomingTasks = this.onIncomingTasks.bind(this);
    this.onIncomingLayouts = this.onIncomingLayouts.bind(this);
    this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
    this.handleTaskClick = this.handleTaskClick.bind(this);
    this.handleCtrlKeyDown = this.handleCtrlKeyDown.bind(this);
    this.handleCtrlKeyUp = this.handleCtrlKeyUp.bind(this);
    this.moveTask = this.moveTask.bind(this);
    this.handleTaskTwoFingerTouch = this.handleTaskTwoFingerTouch.bind(this);
    this.handleLockScreenAccessGranted = this.handleLockScreenAccessGranted.bind(this);
    this.backupFirebase = this.backupFirebase.bind(this);
    this.migrateDBtoV2 = this.migrateDBtoV2.bind(this);
    this.lockApp = this.lockApp.bind(this);
    this.handleDueDateClick = this.handleDueDateClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    this.handleTaskListSettingsButtonClick = this.handleTaskListSettingsButtonClick.bind(this);
    this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
    this.getLockScreen = this.getLockScreen.bind(this);
    this.handleQuitButtonClick = this.handleQuitButtonClick.bind(this);
    this.getSelectedProjectTasks = this.getSelectedProjectTasks.bind(this);
    this.getProjectSelectorDueDateDisplays = this.getProjectSelectorDueDateDisplays.bind(this);
  }

  componentDidMount(){
    // Production DB
    // Initialize Firebase
    // var config = {
    //   apiKey: "AIzaSyC73TEUhmgaV2h4Ml3hF4VAYnm9oUCapFM",
    //   authDomain: "pounder-production.firebaseapp.com",
    //   databaseURL: "https://pounder-production.firebaseio.com",
    //   projectId: "pounder-production",
    //   storageBucket: "",
    //   messagingSenderId: "759706234917"
    // };
    // Firebase.initializeApp(config);

    // Testing DB.
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyBjzZE8FZ0lBvUIj52R_10eHm70aKsT0Hw",
    authDomain: "halo-todo.firebaseapp.com",
    databaseURL: "https://halo-todo.firebaseio.com",
    projectId: "halo-todo",
    storageBucket: "halo-todo.appspot.com",
    messagingSenderId: "801359392837"
    };
    Firebase.initializeApp(config);

    //this.migrateDBtoV3();

    // MouseTrap.
    MouseTrap.bind(['mod+n', 'mod+shift+n', 'shift+esc', 'mod+shift+i', 'mod+f'], this.handleKeyboardShortcut);
    MouseTrap.bind("mod", this.handleCtrlKeyDown, 'keydown');
    MouseTrap.bind("mod", this.handleCtrlKeyUp, 'keyup');

    // TODO: Refactor Firebase ref() strings into Consts declared at the top of the document.
    // Collect Data from Firebase.
    // Setup Connection Monitoring.
    var connectionRef = Firebase.database().ref(".info/connected");
    connectionRef.on("value", snap => {
      if (snap.val() === true) {
        this.setState({isConnectedToFirebase: true})
      }
      else {
        this.setState({isConnectedToFirebase: false})
      }
    })

    // Get Projects and Attach Value Listener
    this.setState({ isAwaitingFirebase: true });
    Firebase.database().ref('projects/').on('value', snapshot => {
      var projects = snapshot.val() == null ? [] : Object.values(snapshot.val());
      this.setState({
        projects: projects,
        isAwaitingFirebase: false
      });
    })

    // Get Tasks and Attach value Listener.
    this.setState({ isAwaitingFirebase: true});
    Firebase.database().ref('tasks/').orderByChild('project').on('value', this.onIncomingTasks);

    // Electron only Config.
    if (this.isInElectron) {
      if (remote.process.env.NODE_ENV === 'production') {
        this.lockApp();
      }

      // TODO: Register an issue with Firebase about this.
      // Firebase closes it's Websocket if it's been Inactive for more then 45 Seconds, then struggles to re-establish
      // when inside Electron. This will 'ping' the firebase servers very 40 seconds.
      setInterval(this.exerciseFirebase, 40000);
      
    }
  }
  
  componentWillUnmount(){
    MouseTrap.unBind(['ctrl+n', 'ctrl+shift+n', 'shift+esc', 'mod+shift+i', 'mod+f'], this.handleKeyboardShortcut);
    MouseTrap.unBind("mod", this.handleCtrlKeyDown);
    MouseTrap.unBind("mod", this.handleCtrlKeyUp);

    // Firebase.
    Firebase.database().ref('projects').off('value');
    Firebase.database().ref('taskLists').off('value');
    Firebase.database().ref('tasks').off('value');

    if (this.state.selectedProjectId !== -1) {
      Firebase.database().ref('projectLayouts/' + this.state.selectedProjectId).off('value');
    }
  }

  render() {
    var layouts = this.state.projectLayout.layouts;
    var lockScreenJSX = this.getLockScreen();
    var projectTasks = this.getSelectedProjectTasks();

    return (
      <div>
        {lockScreenJSX}

        <StatusBar isAwaitingFirebase={this.state.isAwaitingFirebase} isConnectedToFirebase={this.state.isConnectedToFirebase}
        errorMessage={this.state.currentErrorMessage}/>
        <div className="SidebarProjectFlexContainer">
          <div className="SidebarFlexItemContainer">
            <Sidebar className="Sidebar" projects={this.state.projects} selectedProjectId={this.state.selectedProjectId}
              onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
              onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}
              projectSelectorDueDateDisplays={this.state.projectSelectorDueDateDisplays} />
          </div>
          <div className="ProjectFlexItemContainer">
            <Project className="Project" taskLists={this.state.taskLists} tasks={this.state.tasks} selectedTask={this.state.selectedTask}
              movingTaskId={this.state.movingTaskId} focusedTaskListId={this.state.focusedTaskListId}
              projectId={this.state.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
              onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
              onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
              layouts={layouts} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
              onAddTaskButtonClick={this.handleAddTaskButtonClick} onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick}
              onAddTaskListButtonClick={this.handleAddTaskListButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}
              onTaskListSettingsChanged={this.handleTaskListSettingsChanged} onTaskClick={this.handleTaskClick}
              movingTaskId={this.state.movingTaskId} sourceTaskListId={this.state.sourceTaskListId}
              onTaskTwoFingerTouch={this.handleTaskTwoFingerTouch} onDueDateClick={this.handleDueDateClick}
              openCalendarId={this.state.openCalendarId} onNewDateSubmit={this.handleNewDateSubmit}
              onTaskListSettingsButtonClick={this.handleTaskListSettingsButtonClick}
              openTaskListSettingsMenuId={this.state.openTaskListSettingsMenuId} onLockButtonClick={this.handleLockButtonClick}
              />
          </div>
        </div>
      </div>
    );
  }

  getProjectSelectorDueDateDisplays(tasks) {
    var returnList = {};

    tasks.forEach(item => {
      if (item.dueDate !== "" && item.isComplete !== true) {
        if (returnList[item.project] == undefined) {
          returnList[item.project] = {greens: 0, yellows: 0, reds: 0};
        }

        var {className} = ParseDueDate(item.isComplete, item.dueDate);
        switch (className) {
          case "DueDate Later":
            returnList[item.project].greens += 1;
            break;
          
          case "DueDate Soon":
            returnList[item.project].yellows += 1;
            break;

          case "DueDate Overdue":
            returnList[item.project].reds += 1;

          default:
            break;
        }
      }
    })

    return returnList;
  }

  getSelectedProjectTasks() {
    if (this.state.selectedProjectId === -1) {
      return [];
    }

    // TODO: Firebase is return a query ordered by projectID, therefore this could bail out once it's found
    // the first matching Task and iterated onto a non matching task for a performance gain.
    else {
      var returnList = [];
      this.state.tasks.forEach(item => {
        if (item.project === this.state.selectedProjectId) {
          returnList.push(item);
        }
      })
    }
  }

  handleLockButtonClick() {
    this.lockApp();
  }

  handleTaskListSettingsButtonClick(projectId, taskListWidgetId) {
    this.setState({openTaskListSettingsMenuId: taskListWidgetId});
  }

  handleDueDateClick(projectId, taskListWidgetId, taskId) {
      this.setState({
        selectedTask: { taskListWidgetId: taskListWidgetId, taskId: taskId, isInputOpen: false },
        openCalendarId: taskId
      })
  }

  exerciseFirebase() {
    // Pull down some blank data from Firebase to keep the Websocket Open.
    var ref = Firebase.database().ref("websocketTimeoutFix").once('value', () => {});
  }

  handleLockScreenAccessGranted() {
    this.setState({IsLockScreenDisplayed: false});
  }

  handleCtrlKeyDown(mouseTrap) {
    this.isCtrlKeyDown = true;
  }

  handleCtrlKeyUp(mouseTrap) {
    this.isCtrlKeyDown = false;
  }

  handleTaskClick(element, projectId, taskListWidgetId) {
    var logTaskIndex = this.state.tasks.findIndex(item => {
      return item.uid === element.props.taskId;
    })

    // TODO: Do you need to provide the entire Element as a parameter? Why not just the taskID?
    var selectedTask = this.state.selectedTask;
    var openCalendarId = this.state.openCalendarId === element.props.taskId ? this.state.openCalendarId : -1; // Keep calendar Open if it already Open.

    if (this.isCtrlKeyDown) {
      this.setState({
        isATaskMoving: true,
        movingTaskId: element.props.taskId,
        sourceTaskListId: taskListWidgetId,
        openCalendarId: openCalendarId,
        openTaskListSettingsMenuId: -1,
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
          sourceTaskListId: -1,
          openCalendarId: -1,
          openTaskListSettingsMenuId: -1
        })
      }

      else {
        // Otherwise just Select it.
        this.setState({
          selectedTask: { taskListWidgetId: taskListWidgetId, taskId: element.props.taskId, isInputOpen: false },
          isATaskMoving: false,
          movingTaskId: -1,
          sourceTaskListId: -1,
          openCalendarId: openCalendarId,
          openTaskListSettingsMenuId: -1
        })
      }
    }
  }

  handleTaskTwoFingerTouch(taskListWidgetId, taskId) {
    this.setState({
      focusedTaskListId: taskListWidgetId,
      selectedTask: {taskListWidgetId: taskListWidgetId, taskId: taskId, isInputOpen: false},
      isATaskMoving: true,
      movingTaskId: taskId,
      sourceTaskListId: taskListWidgetId,
    })
  }

  handleRemoveTaskListButtonClick() {
    if (this.state.focusedTaskListId !== -1 && confirm("Are you Sure?") === true) {
      this.removeTaskList(this.state.focusedTaskListId);
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
    // TODO: Make this not crash out if nothing is selected.
    var taskId = this.state.selectedTask.taskId;
    if (taskId !== -1) {
      // Update Firebase.
      this.setState({ isAwaitingFirebase: true });
      var updates = {};
      updates["tasks/" + taskId] = null;

      // Execute Updates (Deletes).
      Firebase.database().ref().update(updates).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })
    }
  }

  moveTask(taskId, sourceTaskListId, destinationTaskListId) {
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});
    var updates = {};
    updates["tasks/" + taskId + "/taskList/"] = destinationTaskListId;
    Firebase.database().ref().update(updates).then( () => {
      this.setState({
         isAwaitingFirebase: false,
         isATaskMoving: false,
         sourceTaskListId: -1,
         movingTaskId: -1,
         selectedTask: {taskListWidgetId: destinationTaskListId, taskId: taskId, isInputOpen: false } // Pre Select Task
      });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleTaskChanged(projectId, taskListWidgetId, taskId, newData) {
    // Update Firebase.
    this.setState({
      isAwaitingFirebase: true,
      selectedTask: {taskListWidgetId: taskListWidgetId, taskId: taskId, isInputOpen: false}
     }); // Close Task Input.
    
    var updates = {};
    updates['/tasks/' + taskId + "/taskName/"] = newData;
    updates['/tasks/' + taskId + '/isNewTask/'] = false; // Reset new Task Property.

    Firebase.database().ref().update(updates).then( () => {
      this.setState({
        isAwaitingFirebase: false,
      });
    }).catch(error => {
      this.postFirebaseError(error);
    })
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
    this.setState({ IsLockScreenDisplayed: true });

    // Trigger Firebase Backup.
    this.backupFirebase();
  }

  addNewTaskList() {
    // Add to Firebase.
    this.setState({ isAwaitingFirebase: true });
    var newTaskListKey = Firebase.database().ref('taskLists/').push().key;

    var newTaskList = new TaskListStore(
      "New Task List",
      this.state.selectedProjectId,
      newTaskListKey,
      newTaskListKey,
      new TaskListSettingsStore(true, "completed")
    )

    Firebase.database().ref('taskLists/' + newTaskListKey).set(newTaskList).then(result => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  addNewTask() {
    // Add a new Task.
    // Find the TaskList that currently has Focus retrieve it's Index in state.taskLists array.
    // TODO: I don't think you need to get the TargetIndex any more.
    var targetIndex = -1;
    var targetTaskList = this.state.taskLists.find((item, index) => {
      if (this.state.focusedTaskListId === item.uid) {
        targetIndex = index;
        return true;
      }

      else {
        return false;
      }
    })

    if (targetTaskList !== undefined) {
      // Update Firebase.
      this.setState({ isAwaitingFirebase: true });
      var newTaskKey = Firebase.database().ref('tasks/').push().key;

      var newTask = new TaskStore(
        "",
        "",
        false,
        this.state.selectedProjectId,
        targetTaskList.uid,
        newTaskKey,
        new Moment().toISOString(),
        true
      )

      Firebase.database().ref('tasks/' + newTaskKey).set(newTask).then(() => {
        this.setState({
          isAwaitingFirebase: false,
          selectedTask: { taskListWidgetId: this.state.focusedTaskListId, taskId: newTaskKey, isInputOpen: true }
        });
      }).catch(error => {
        this.postFirebaseError(error);
      })
    }
  }

  makeNewLayoutEntry(taskListId) {
    return {i: taskListId, x: 0, y: 0, w: 3, h: 5 };
  }

  handleTaskListWidgetFocusChange(taskListWidgetId, isFocused) {
    if (!isFocused) {
      if (this.state.isATaskMoving) {
        var movingTaskId = this.state.movingTaskId;
        var destinationTaskListId = taskListWidgetId;

        this.moveTask(movingTaskId, this.state.sourceTaskListId, destinationTaskListId);
      }

      this.setState({
        focusedTaskListId: taskListWidgetId,
        openCalendarId: -1,
        openTaskListSettingsMenuId: -1});
    }
  }

  handleTaskListWidgetHeaderChanged(taskListWidgetId, newData) {
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});

    var updates = {};
    updates['/taskLists/' + taskListWidgetId + '/taskListName'] = newData;

    Firebase.database().ref().update(updates).then( () => {
      this.setState({isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleProjectSelectorClick(e, projectSelectorId) {
    this.setState({isAwaitingFirebase: true});

    var taskListsRef = Firebase.database().ref('taskLists');
    var tasksRef = Firebase.database().ref('tasks');
    var projectLayoutsRef = Firebase.database().ref('projectLayouts');
    
    // Disconnect Old Listeners and Connect new Listeners (Firebase will Call Callbacks for intial Values).
    var outgoingProjectId = this.state.selectedProjectId;
    if (outgoingProjectId !== -1) {
      // Old Listeners.
      taskListsRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
      // tasksRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
      projectLayoutsRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
    }

    if (projectSelectorId !== -1) {
      // New Listeners.
      taskListsRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingTaskLists);
      // tasksRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingTasks);
      projectLayoutsRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingLayouts)
    }

    this.setState({ 
      selectedProjectId: projectSelectorId,
      openCalendarId: -1,
      selectedTask: {taskListWidgetId: -1, taskId: -1, isInputOpen: false},
      isATaskMoving: false,
      movingTaskId: -1,
      sourceTaskListId: -1,
      focusedTaskListId: -1,
      openTaskListSettingsMenuId: -1 })
  }

  onIncomingTaskLists(snapshot) {
    // // TODO: What happens if a Change comes in for a Project that isn't the Selected One? Bad Stuff probably.
    this.setState({isAwaitingFirebase: true});
    var taskLists = [];
    taskLists = snapshot.val() == null ? [] : Object.values(snapshot.val());
    this.setState({
      isAwaitingFirebase: false,
      taskLists: taskLists
    })
  }

  onIncomingTasks(snapshot) {
    this.setState({isAwaitingFirebase: true});
    var tasks = [];
    tasks = snapshot.val() == null ? [] : Object.values(snapshot.val());
    this.setState({
      isAwaitingFirebase: false,
      tasks: tasks,
      projectSelectorDueDateDisplays: this.getProjectSelectorDueDateDisplays(tasks)
    })
  }

  onIncomingLayouts(snapshot) {
    this.setState({isAwaitingFirebase: true});
    var projectLayouts = []
    projectLayouts = snapshot.val() == null ? [new ProjectLayoutStore({}, -1, -1)] : Object.values(snapshot.val());

    this.setState({
      isAwaitingFirebase: false,
      projectLayout: projectLayouts[0]
    })
  }

  handleLayoutChange(layouts, projectId) {
    var newTrimmedLayouts = this.trimLayouts(layouts);
    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });
    var updates = {};
    updates['/projectLayouts/' + projectId + '/layouts/'] = newTrimmedLayouts;

    Firebase.database().ref().update(updates).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  trimLayouts(layouts) {
  var trimmedLayouts = layouts.map(item => {
    return {
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }
  })

  return trimmedLayouts
  }

  compareLayouts(a,b) {
    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0; i < a.length; i++) {
      if (!this.compareLayoutHelper(a[i], b[i])) {
        return false;
      }

      return true;
    }

  }

  compareLayoutHelper(a,b) {
  //       i:              x:             y:             w:             h:           
    if (a.i === b.i  && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h) {
        return true;
      } 
      return false;
    }
  
  handleTaskCheckBoxClick(e, projectId, taskListWidgetId, taskId, incomingValue) {
    // Todo: You call setState three times here. Could be less.
    if (this.state.selectedTask.taskId !== taskId || this.state.selectedTask.taskListWidgetId !== taskListWidgetId) {
      this.setState({ selectedTask: { taskListWidgetId: taskListWidgetId, taskId: taskId } });
    }

    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });

    var updates = {};
    updates['/tasks/' + taskId + "/isComplete/"] = incomingValue;
    updates['/tasks/' + taskId + '/isNewTask/'] = false;

    Firebase.database().ref().update(updates).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleAddProjectClick() {
    var newProjectName = "New Project";

    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });
    var newProjectKey = Firebase.database().ref('projects/').push().key;
    var updates = {};

    // Project.
    var newProject = new ProjectStore(newProjectName, newProjectKey);
    updates['projects/' + newProjectKey] = newProject;

    // Layout.
    var newProjectLayout = new ProjectLayoutStore({}, newProjectKey, newProjectKey);
    updates['projectLayouts/' + newProjectKey] = newProjectLayout;

    // Execute Additions.
    Firebase.database().ref().update(updates).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleRemoveProjectClick(projectId) {
    if (confirm("Are you sure?") === true) {
      // Update Firebase.
      this.setState({ isAwaitingFirebase: true });

      // Get a List of Task List Id's and Task Id's. It's Okay to collect these from State as associated taskLists and tasks have already
      // been loaded in via the handleProjectSelectorClick method. No point in querying Firebase again for this data.
      var taskListIds = this.state.taskLists.map(item => {
        if (item.project === projectId) {
          return item.uid;
        }
      })

      // TODO: Refactor the following Code, you are doing the same thing Here as well as within the Task List Widget Removal Code.
      // could be refactored into something like collectTaskId's.
      var taskIds = this.state.tasks.map(item => {
        if (item.project === projectId) {
          return item.uid;
        }
      })

      // Build Updates (Deletes).
      var updates = {};

      taskIds.forEach(id => {
        updates["/tasks/" + id] = null;
      })

      taskListIds.forEach(id => {
        updates["/taskLists/" + id] = null;
      })

      var projectLayoutId = this.state.projectLayout.uid;
      updates["/projectLayouts/" + projectLayoutId] = null;

      updates["/projects/" + projectId] = null;

      // Execute Updates (Deletes).
      Firebase.database().ref().update(updates).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })
    }
  }

  handleProjectNameSubmit(projectSelectorId, newName) {
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});

    var updates = {};
    updates['projects/' + projectSelectorId + "/projectName"] = newName;

    Firebase.database().ref().update(updates).then( () => {
      this.setState({isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleTaskListWidgetRemoveButtonClick(projectId, taskListWidgetId) {
    if (confirm("Are you Sure?")) {
      this.removeTaskList(taskListWidgetId);
    }
  }

  removeTaskList(taskListWidgetId) {
    // Update Firebase.
      this.setState({ isAwaitingFirebase: true });

      // Collect related TaskIds.
      var taskIds = this.state.tasks.map(item => {
        if (item.taskList === taskListWidgetId) {
          return item.uid;
        }
      })

      var updates = {};
      updates["taskLists/" + taskListWidgetId] = null;

      taskIds.forEach(id => {
        updates["tasks/" + id] = null
      })

      // Execute Updates (Deletes).
      Firebase.database().ref().update(updates).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })
  }

  postFirebaseError(error) {
    console.error(error);
    this.setState({
      isAwaitingFirebase: false,
      currentErrorMessage: "An error has occurred. Please consult Developer Diagnostics Log"});
  }

  handleTaskListSettingsChanged(projectId, taskListWidgetId, newTaskListSettings) {
    // Update Firebase.
    var updates = {};
    updates['taskLists/' + taskListWidgetId + '/settings/'] = newTaskListSettings;

    this.setState({ 
      isAwaitingFirebase: true,
      openTaskListSettingsMenuId: -1 });
    Firebase.database().ref().update(updates).then(() => {
      this.setState({
        isAwaitingFirebase: false,
      });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  backupFirebase() {
    if (this.isInElectron) {
      // Pull Data down from Firebase.
      this.setState({isAwaitingFirebase: true});
      Firebase.database().ref().once('value').then(snapshot => {
        if (snapshot.exists()) {
          // Write to Backup File.
          // Intialize File Path and Name.
          var backupDirectory = Path.join(remote.app.getPath('documents'), "/Pounder", "/Backups");

          var currentDate = new Date();
          var normalizedDate = this.getNormalizedDate(currentDate);
          var filePath = Path.join(backupDirectory, "/", "backup " + normalizedDate + ".json");

          // Create File.
          fsJetpack.file(filePath, { mode: '700' });

          // Write to File.
          fsJetpack.writeAsync(filePath, snapshot.val(), { atomic: true }).then(() => {
            var message = "Last backup created at " +
              currentDate.getHours() + ":" +
              currentDate.getMinutes() + ":" +
              currentDate.getSeconds() + " in " +
              backupDirectory;
            this.setState({
              isAwaitingFirebase: false,
              lastBackupMessage: message
            });
          })
        }

        else {
          this.setState({
            lastBackupMessage: "Couldn't backup to File, no data was returned from Firebase.",
            isAwaitingFirebase: false
          });
        }
      })
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

  migrateDBtoV3() {
    var firebaseOperations = [];
    // Purge completed Tasks.
    firebaseOperations.push(Firebase.database().ref('tasks/').once('value').then(snapshot => {
      var tasks = Object.values(snapshot.val());
      var taskIdsToRemove = tasks.map(item => {
        if (item.isComplete) {
          return item.uid;
        }
      })

      console.log("Found " + taskIdsToRemove.length + " tasks to be Purged");

      var updates = {};
      taskIdsToRemove.forEach(id => {
        updates['tasks/' + id] = null;
      })

      // Execute Deletes.
      Firebase.database().ref().update(updates).then( () => {
        console.log("Tasks Purge Complete.")

        // Add Date Added, dueDate and isNewTask and Clear dueDate to Survivors of the Purge.
        Firebase.database().ref('/tasks').once('value').then( s => {
          var survingTasks = Object.values(s.val());
          var dateAddedUpdates = {};

          survingTasks.forEach(survivor => {
            dateAddedUpdates['tasks/' + survivor.uid + '/dateAdded/'] = new Moment().toISOString();
            dateAddedUpdates['tasks/' + survivor.uid + '/dueDate/'] = "";
            dateAddedUpdates['tasks/' + survivor.uid + '/isNewTask/'] = false;
          })

          // Execute Updates.
          Firebase.database().ref().update(dateAddedUpdates).then( () => {
            console.log("Date Added Scaffolded to Tasks");
          })
        })
      })
    }))

    // Scaffold sortBy into taskList Settings.
    firebaseOperations.push(Firebase.database().ref('taskLists/').once('value').then( snapshot => {
      var taskLists = Object.values(snapshot.val());
      var updates = {};

      taskLists.forEach(item => {
        updates['taskLists/' + item.uid + '/settings/' + 'sortBy/'] = "completed";
      })

      Firebase.database().ref().update(updates).then( () => {
        console.log("taskList.settings.sortBy scaffold complete");
      })
    }))

    Promise.all(firebaseOperations).then( () => {
      var versionUpdate = {};
      versionUpdate['/DbVersion/'] = 3;

      Firebase.database().ref().update(versionUpdate).then( () => {
        console.log("Migration Complete");
      })
    })
  }

  migrateDBtoV2() {
    Firebase.database().ref('projects/').orderByChild('uid').once('value').then(snapshot => {
      if (snapshot.exists()) {
        var projects = Object.values(snapshot.val());

        var projectIds = projects.map(item => {
          return item.uid;
        })

        var updates = {};
        projectIds.forEach(item => {
          updates['projects/' + item + '/layouts'] = null;

          var newProjectLayout = new ProjectLayoutStore({}, item, item);
          updates['projectLayouts/' + item] = newProjectLayout;
        })

        Firebase.database().ref().update(updates).then(() => {
          console.log("Updates Completed");
        })
      }

      else {
        console.log("Snaphot.exists() failed.");
      }
    })


    // Scaffold a 'project' id index into Tasks.
    Firebase.database().ref('tasks').orderByChild('taskList').once('value').then(snapshot => {
      if (snapshot.exists()) {
        var tasks = Object.values(snapshot.val());

        Firebase.database().ref('taskLists').orderByChild('project').once('value').then(taskListSnap => {
          if (taskListSnap.exists()) {
            var taskLists = Object.values(taskListSnap.val());
            console.log(taskLists);

            var updates = {};

            tasks.forEach(task => {
              var taskList = taskLists.find(element => {
                return task.taskList === element.uid;
              })
              if (taskList === undefined) {
                console.log("taskList is undefined");
              }
              else {
                updates['tasks/' + task.uid + '/project/'] = taskList.project;
              }
            })

            taskLists.forEach(item => {
              updates['taskLists/' + item.uid + '/settings/'] = new TaskListSettingsStore(true);
            })

            Firebase.database().ref().update(updates).then(() => {
              console.log("Task Updates Complete");
            })
          }
          else {
            console.log("Tasklists - snapshot.exists() failed");
          }
        })
      }

      else {
        console.log("Tasks - snapshot.exists() failed");
      }
    })

    // Update DbVersion.
    Firebase.database().ref('/DbVersion').set(2).then( () => {
      console.log("Db Version Update Complete");
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  handleNewDateSubmit(projectId, taskListWidgetId, taskId, newDate) {
    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });
    var updates = {};
    updates['tasks/' + taskId + '/dueDate'] = newDate
    updates['tasks/' + taskId + '/isNewTask/'] = false;

    Firebase.database().ref().update(updates).then(() => {
      this.setState({ 
        isAwaitingFirebase: false,
        openCalendarId: -1,
       });
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  getLockScreen() {
    if (this.state.IsLockScreenDisplayed) {
      return (
        <LockScreen onAccessGranted={this.handleLockScreenAccessGranted}
          backupMessage={this.state.lastBackupMessage} onQuitButtonClick={this.handleQuitButtonClick} />
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

export default App;
