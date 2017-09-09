import '../assets/css/App.css';
import React, { Component } from 'react';
import MouseTrap from 'mousetrap';
import Sidebar from './Sidebar';
import Project from './Project';
import StatusBar from './StatusBar';
import '../assets/css/TaskListWidget.css'
import '../assets/css/Sidebar.css'
import '../assets/css/Project.css'
import Firebase from 'firebase';
import TaskListStore from '../stores/TaskListStore';
import TaskStore from '../stores/TaskStore';
import ProjectLayoutStore from '../stores/ProjectLayoutStore';
import ProjectStore from '../stores/ProjectStore';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      taskLists: [],
      tasks: [],
      projectLayout: new ProjectLayoutStore({}, -1, -1),
      focusedTaskListId: -1,
      selectedProjectId: -1,
      isAwaitingFirebase: false,
      isConnectedToFirebase: false,
      currentErrorMessage: ""
    }; 
    
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
    this.handleTaskMoved = this.handleTaskMoved.bind(this);
    this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
    this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
    this.addNewTaskList = this.addNewTaskList.bind(this);
    this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
    this.onIncomingTaskLists = this.onIncomingTaskLists.bind(this);
    this.onIncomingTasks = this.onIncomingTasks.bind(this);
    this.onIncomingLayouts = this.onIncomingLayouts.bind(this);
  }

  componentDidMount(){
    console.log("+++++++++ Component Re Mounted ++++++++++++++++");
    // TODO: Tasks and probably TaskLists need to have their Firebase Value event listeners split up into Value Change
    // listeners and Collection Changed Listeners. Right now, When making a new Task, it gets added to React Twice. Once on
    // addNewTask and again on OnIncomingTasks. OnIncomingTasks can't reliably tell if a Task has already been Added if it also has
    // to respond to Data changing Events. If you split up these Events then you can tell more reliably what is happening.


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
    
    // TODO Database Migrations.
    /*
      1. Move Layouts from Underneath Projects to their own Node. Scaffold in uid and layouts nodes.
      2. Scaffold a 'project' Id into Tasks.
    */

    // MouseTrap.
    MouseTrap.bind(['mod+n', 'mod+shift+n'], this.handleKeyboardShortcut);

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
  }
  
  componentWillUnmount(){
    MouseTrap.unBind(['ctrl+n', 'ctrl+shift+n'], this.handleKeyboardShortcut);

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

    return (
      <div>
        <StatusBar isAwaitingFirebase={this.state.isAwaitingFirebase} isConnectedToFirebase={this.state.isConnectedToFirebase}/>
        <Sidebar className="Sidebar" projects={this.state.projects} selectedProjectId={this.state.selectedProjectId}
         onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
         onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}/>
        <Project className="Project" taskLists={this.state.taskLists} tasks={this.state.tasks} focusedTaskListId={this.state.focusedTaskListId}
         projectId={this.state.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
         onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
         onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
         layouts={layouts} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
         onAddTaskButtonClick={this.handleAddTaskButtonClick} onRemoveTaskButtonClick={this.handleRemoveTaskButtonClick}
         onAddTaskListButtonClick={this.handleAddTaskListButtonClick} onRemoveTaskListButtonClick={this.handleRemoveTaskListButtonClick}/>
      </div>
    );
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

  handleRemoveTaskButtonClick(taskListWidgetId, taskId) {
    // TODO: Make this not crash out if nothing is selected.
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});
    var updates = {};
    updates["tasks/" + taskId] = null;

    // Execute Updates (Deletes).
    Firebase.database().ref().update(updates).then( () => {
      this.setState({isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    // var newTasks = this.state.tasks.filter(item => {
    //   return item.uid !== taskId;
    // })

    // this.setState({tasks: newTasks});
  }

  handleTaskMoved(projectId, taskId, sourceTaskListId, destinationTaskListId) {
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});
    var updates = {};
    updates["tasks/" + taskId + "/taskList/"] = destinationTaskListId;
    Firebase.database().ref().update(updates).then( () => {
      this.setState({isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    // var taskIndex = this.state.tasks.findIndex(item => {
    //   return item.uid === taskId;
    // })
    // var task = this.state.tasks[taskIndex];

    // // Fine Example of a New Task.
    // var newTasks = this.state.tasks;
    // newTasks[taskIndex] = new TaskStore(
    //   task.taskName,
    //   task.dueDate,
    //   task.isComplete,
    //   task.project,
    //   destinationTaskListId,
    //   task.uid
    // );

    // this.setState({newTasks});
    
  }

  handleTaskChanged(projectId, taskListWidgetId, taskId, newData) {
    // Update Firebase.
    this.setState({isAwaitingFirebase: true});
    
    var updates = {};
    updates['/tasks/' + taskId + "/taskName/"] = newData;

    Firebase.database().ref().update(updates).then( () => {
      this.setState({isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    // Modify replace the Task.
    // var currentTaskIndex = this.state.tasks.findIndex(item => {
    //   return item.uid === taskId;
    // })

    // var currentTask = this.state.tasks[currentTaskIndex];
    // var newTasks = this.state.tasks;

    // newTasks[currentTaskIndex] = new TaskStore(
    //   newData,
    //   currentTask.dueDate,
    //   currentTask.isComplete,
    //   projectId,
    //   taskListWidgetId,
    //   currentTask.uid
    // )

    // this.setState({tasks: newTasks});

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
  }

  addNewTaskList() {
    // Add to Firebase.
    this.setState({ isAwaitingFirebase: true });
    var newTaskListKey = Firebase.database().ref('taskLists/').push().key;

    var newTaskList = new TaskListStore(
      "New Task List",
      this.state.selectedProjectId,
      newTaskListKey,
      newTaskListKey
    )

    Firebase.database().ref('taskLists/' + newTaskListKey).set(newTaskList).then(result => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // // Add to React.
    // // TODO: Homogenise the Use of taskListId and uid across the App.
    // var taskLists = this.state.taskLists;
    // taskLists.push(newTaskList)

    // newProjectLayout = this.state.projectLayout;
    // newProjectLayout.layouts.push(this.makeNewLayoutEntry(newTaskListKey));

    // this.setState({
    //   taskLists: taskLists,
    //   projectLayout: newProjectLayout,
    // });
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
        newTaskKey
      )

      Firebase.database().ref('tasks/' + newTaskKey).set(newTask).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })

      // Update React.
      // var newTasks = this.state.tasks;
      // newTasks.push(newTask);

      // this.setState({tasks: newTasks});
    }
  }

  makeNewLayoutEntry(taskListId) {
    return {i: taskListId, x: 0, y: 0, w: 3, h: 5 };
  }

  handleTaskListWidgetFocusChange(taskListWidgetId) {
    this.setState({focusedTaskListId: taskListWidgetId});
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

    // Update React.
    // var targetTaskList = this.state.taskLists.find(item => {
    //   return item.uid === taskListWidgetId;
    // })

    // targetTaskList.taskListName = newData;

    // var taskLists = this.state.taskLists;
    // taskLists[taskListWidgetId] = targetTaskList;

    // this.setState({taskLists: taskLists});
  }

  handleProjectSelectorClick(e, projectSelectorId) {
    this.setState({isAwaitingFirebase: true});

    var taskListsRef = Firebase.database().ref('taskLists');
    var tasksRef = Firebase.database().ref('tasks');
    var projectLayoutsRef = Firebase.database().ref('projectLayouts');
    
    // Disconnect Old Listeners.
    var outgoingProjectId = this.state.selectedProjectId;
    if (outgoingProjectId !== -1) {
      // Task Lists.
      taskListsRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
      tasksRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
      projectLayoutsRef.orderByChild('project').equalTo(outgoingProjectId).off('value');
    }

    // Collect Task Lists, Tasks and Layouts. Connect value Listeners.
    taskListsRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingTaskLists);
    tasksRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingTasks);
    projectLayoutsRef.orderByChild('project').equalTo(projectSelectorId).on('value', this.onIncomingLayouts)

    this.setState({ selectedProjectId: projectSelectorId })
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
      tasks: tasks
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
    

    // Update React.
    // this.setState({
    //   projectLayout: new ProjectLayoutStore(newTrimmedLayouts, projectId, projectId)
    // });

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
    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });

    var updates = {};
    updates['/tasks/' + taskId + "/isComplete/"] = incomingValue;

    Firebase.database().ref().update(updates).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    // var taskIndex = this.state.tasks.findIndex(item => {
    //   return item.uid === taskId;
    // })

    // var task = this.state.tasks[taskIndex];
    // var newTasks = this.state.tasks;
    
    // // Modify replace the Task.
    // newTasks[taskIndex] = new TaskStore(
    //   task.taskName,
    //   task.dueDate,
    //   incomingValue,
    //   task.project,
    //   task.taskList,
    //   task.uid
    // );

    // // Merge modified taskList back into State.
    // this.setState({tasks: newTasks});
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

    // Update React.
    // // Project
    // var newProjects = this.state.projects;
    // newProjects.push(newProject);

    // // Layout
    // this.setState({
    //   projects: newProjects,
    //   projectLayout: newProjectLayout
    // });
  }

  handleRemoveProjectClick(projectId) {
    if (confirm("Are you sure?") === true) {
      // Update Firebase.
      this.setState({ isAwaitingFirebase: true });

      // Get a List of Task List Id's and Task Id's. It's Okay to collect these from State as associated taskLists and tasks have already
      // been loaded in via the handleProjectSelectorClick method. No point in querying Firebase again for this data.
      var taskListIds = this.state.taskLists.map(item => {
        return item.uid;
      })

      // TODO: Refactor the following Code, you are doing the same thing Here as well as within the Task List Widget Removal Code.
      // could be refactored into something like collectTaskId's.
      var taskIds = this.state.tasks.map(item => {
        return item.uid;
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

      // Update React.
      // var newProjects = this.state.projects;
      // var index = -1;

      // newProjects.find((item, itemIndex) => {
      //   if (item.uid === projectId) {
      //     index = itemIndex;
      //     return true;
      //   }
      //   else {
      //     return false;
      //   }
      // })

      // newProjects.splice(index, 1);
      // this.setState({
      //   projects: newProjects,
      //   taskLists: [],
      //   tasks: [],
      // });
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

    // Update React.
    // var projectIndex = 0;
    // var projects = this.state.projects;
    // var project = projects.find((item, index) => {
    //   if (item.uid === projectSelectorId) {
    //     projectIndex = index;
    //     return true;
    //   }
    //   else {
    //     return false;
    //   }
    // });

    // project.projectName = newName
    // projects[projectIndex] = project;

    // this.setState({projects: projects});
    
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
        return item.uid;
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

      // Update React.
      // var taskLists = this.state.taskLists;
      // var index = 0;
      // taskLists.find((item, itemIndex) => {
      //   if (item.uid === taskListWidgetId) {
      //     index = itemIndex;
      //     return true;
      //   }
      //   else {
      //     return false;
      //   }
      // })

      // taskLists.splice(index, 1);

      // // Remove Tasks.
      // var newTasks = this.state.tasks.filter(item => {
      //   return item.taskList != taskListWidgetId;
      // })

      // this.setState({
      //   taskLists: taskLists,
      //   tasks: newTasks
      // });
  }

  taskSortHelper(a, b) {
    return a.isComplete - b.isComplete;
  }

  postFirebaseError(error) {
    console.error(error);
    this.setState({
      isAwaitingFirebase: false,
      currentErrorMessage: error});
  }
}


export default App;
