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


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      taskLists: [],
      focusedTaskListId: -1,
      selectedProjectId: -1,
      isAwaitingFirebase: false,
      isConnectedToFirebase: false,
      layouts: [],
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
    
    // Firebase Seeding.
    // var newProjectKey = Firebase.database().ref('projects/').push().key;
    // Firebase.database().ref('projects/' + newProjectKey).set({
    //   uid: newProjectKey,
    //   projectName: "The Boobyguard",
    // });

    // var newTaskListKey = Firebase.database().ref('taskLists/').push().key;
    // Firebase.database().ref('taskLists/' + newTaskListKey).set({
    //   uid: newTaskListKey,
    //   project: newProjectKey,
    //   taskListName: "Main",
    // });

    // var newTaskKey = Firebase.database().ref('tasks/').push().key;
    // Firebase.database().ref('tasks/' + newTaskKey).set({
    //   uid: newTaskKey,
    //   taskList: newTaskListKey,
    //   taskName: "Finish Him!",
    //   dueDate: "Today!"
    // })

    // MouseTrap.
    MouseTrap.bind(['mod+n', 'mod+shift+n'], this.handleKeyboardShortcut);


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

    // Get Projects
    this.setState({isAwaitingFirebase: true});
    Firebase.database().ref('projects/').once('value').then(snapshot => {
      var projects = snapshot.val() == null ? [] : Object.values(snapshot.val())
      this.setState({
        projects: projects,
        isAwaitingFirebase: false});
    }).catch(error => {
      this.postFirebaseError(error);
    })
  }

  componentWillUnmount(){
    MouseTrap.unBind(['ctrl+n', 'ctrl+shift+n'], this.handleKeyboardShortcut);
  }

  render() { 
    return (
      <div>
        <StatusBar isAwaitingFirebase={this.state.isAwaitingFirebase} isConnectedToFirebase={this.state.isConnectedToFirebase}/>
        <Sidebar className="Sidebar" projects={this.state.projects} selectedProjectId={this.state.selectedProjectId}
         onProjectSelectorClick={this.handleProjectSelectorClick} onAddProjectClick={this.handleAddProjectClick}
         onRemoveProjectClick={this.handleRemoveProjectClick} onProjectNameSubmit={this.handleProjectNameSubmit}/>
        <Project className="Project" taskLists={this.state.taskLists} focusedTaskListId={this.state.focusedTaskListId}
         projectId={this.state.selectedProjectId} onTaskListWidgetRemoveButtonClick={this.handleTaskListWidgetRemoveButtonClick}
         onTaskChanged={this.handleTaskChanged} onTaskListWidgetFocusChanged={this.handleTaskListWidgetFocusChange}
         onTaskListWidgetHeaderChanged={this.handleTaskListWidgetHeaderChanged} onLayoutChange={this.handleLayoutChange}
         layouts={this.state.layouts} onTaskCheckBoxClick={this.handleTaskCheckBoxClick} onTaskMoved={this.handleTaskMoved}
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
    var taskListIndex = this.state.taskLists.findIndex(item => {
      return item.uid === taskListWidgetId;
    });

    var taskList = this.state.taskLists[taskListIndex];
    var taskIndex = taskList.tasks.findIndex(item => {
      return item.uid === taskId;
    })
    
    taskList.tasks.splice(taskIndex, 1);
    var newTaskLists = this.state.taskLists;
    newTaskLists[taskListIndex] = taskList;

    this.setState({taskLists: newTaskLists});
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
    // Pull task from Source Task list into Temporory Storage then insert into Destination TaskList.
    // Source Task List
    var sourceTaskListIndex = this.state.taskLists.findIndex( item => {
      return item.uid === sourceTaskListId;
    })

    var newSourceTaskList = this.state.taskLists[sourceTaskListIndex];
    var taskIndex = newSourceTaskList.tasks.findIndex(item => {
      return item.uid === taskId;
    });

    var taskBuffer = newSourceTaskList.tasks[taskIndex];
    newSourceTaskList.tasks.splice(taskIndex, 1);

    // Destination Task List.
    var newDestinationTaskListIndex = this.state.taskLists.findIndex( item => {
      return item.uid === destinationTaskListId;
    })
    
    var newDestinationTaskList = this.state.taskLists[newDestinationTaskListIndex];
    newDestinationTaskList.tasks.push(taskBuffer);

    // Build both Tasklists into new TaskLists Array ready to be sent back to the State.
    var newTaskLists = this.state.taskLists.map( (item, index) => {
      if (item.uid === sourceTaskListId) {
        return newSourceTaskList;
      }

      if (item.uid === destinationTaskListId) {
        return newDestinationTaskList;
      }

      return item;
    })

    this.setState({taskLists: newTaskLists});
  }

  handleTaskChanged(taskListWidgetId, taskId, newData) {
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
    // Get the TaskList in question.
    var taskListIndex = -1;
    var taskList = this.state.taskLists.find( (item, index) => {
      if (item.uid === taskListWidgetId) {
        taskListIndex = index;
        return true;
      }
      else {
        return false;
      }
    })
    
    var currentTaskIndex = -1;
    var currentTask = taskList.tasks.find( (item, index) => {
      if (item.uid === taskId) {
        currentTaskIndex = index;
        return true;
      }
      else {
        return false;
      }   
    });
    
    // Modify replace the Task.
    taskList.tasks[currentTaskIndex] = {
      taskName: newData,
      dueDate: currentTask.dueDate,
      isComplete: currentTask.isComplete,
      uid: currentTask.uid
    };

    // Merge modified taskList back into State.
    var newTaskLists = this.state.taskLists;
    newTaskLists[taskListIndex] = taskList;
    this.setState({taskLists: newTaskLists});
  }

  handleKeyDown(e) {
    console.log("Shift Down");
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
    var newFirebaseTaskList = {
      project: this.state.selectedProjectId,
      uid: newTaskListKey,
      taskListName: "New Task List"
    }

    Firebase.database().ref('taskLists/' + newTaskListKey).set(newFirebaseTaskList).then(result => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Add to React.
    // TODO: Homogenise the Use of taskListId and uid across the App.
    var newTaskList = {
      taskListId: newFirebaseTaskList.uid,
      taskListName: newFirebaseTaskList.taskListName,
      uid: newTaskListKey,
      tasks: []
    }

    var taskLists = this.state.taskLists;
    taskLists.push(newTaskList)

    var newLayouts = this.state.layouts;
    newLayouts.push(this.makeNewLayoutEntry(newTaskListKey));

    this.setState({
      taskLists: taskLists,
      layouts: newLayouts,
    });
  }

  addNewTask() {
    // Add a new Task.
    // Find the TaskList that currently has Focus retrieve it's Index in state.taskLists array.
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

      var newFirebaseTask = {
        dueDate: "Today!",
        taskList: targetTaskList.uid,
        taskName: "",
        isComplete: "",
        uid: newTaskKey,
      }

      Firebase.database().ref('tasks/' + newTaskKey).set(newFirebaseTask).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })

      // Update React.
      var newReactTask = {
        taskName: newFirebaseTask.taskName,
        dueDate: newFirebaseTask.dueDate,
        isComplete: newFirebaseTask.isComplete,
        uid: newFirebaseTask.uid
      }

      targetTaskList.tasks.push(newReactTask);

      // Pass into a new taskLists Array.
      var newTaskListsArray = this.state.taskLists;
      newTaskListsArray[targetIndex] = targetTaskList;

      this.setState({ taskLists: newTaskListsArray });
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
    var targetTaskList = this.state.taskLists.find(item => {
      return item.uid === taskListWidgetId;
    })

    targetTaskList.taskListName = newData;

    var taskLists = this.state.taskLists;
    taskLists[taskListWidgetId] = targetTaskList;

    this.setState({taskLists: taskLists});
  }

  handleProjectSelectorClick(e, projectSelectorId) {
    // Select the Project and Load into Project Space.
    // Collect Tasklists by the Project ID, then collect together Tasks by TaskList uid.
    var taskLists = [];
    this.setState({ isAwaitingFirebase: true });
    var taskListsRef = Firebase.database().ref('taskLists');
    taskListsRef.orderByChild('project').equalTo(projectSelectorId).once('value').then(snapshot => {
      taskLists = snapshot.val() == null ? [] : Object.values(snapshot.val());

      var tasksRef = Firebase.database().ref('tasks');

      // What the Hell? - Collects tasks from Firebase and adds them to their respective taskLists, but does so in a way that
      // builds a list of Promises, then only updates the state once all promsises are fullfilled. Means you aren't spamming setState
      // and the isAwaitingFirebase state value can be toggled once all promises have been fullfiled.
      var firebaseRequests = taskLists.map((item, index, array) => {
        return new Promise(resolve => {
          tasksRef.orderByChild('taskList').equalTo(item.uid).once('value').then(snapshot => {
            array[index].tasks = snapshot.val() == null ? [] : (Object.values(snapshot.val())).sort(this.taskSortHelper);
            resolve();
          })
        })
      })

      // Load Layouts Query into firebaseRequest
      var layouts = [];
      var layoutsRef = Firebase.database().ref('projects/' + projectSelectorId + '/layouts/');
      firebaseRequests.push(new Promise(resolve => {
        layoutsRef.once('value', snapshot => {
          layouts = snapshot.val() == null ? [] : Object.values(snapshot.val());
          resolve();
        })
      }))

      Promise.all(firebaseRequests).then(() => {
        this.setState({
          taskLists: taskLists,
          layouts: layouts,
          isAwaitingFirebase: false
        })
      })
    }).catch(error => {
      this.postFirebaseError(error);
    })

    this.setState({ selectedProjectId: projectSelectorId });
  }

  handleLayoutChange(layouts, projectId) {
    var newTrimmedLayouts = this.trimLayouts(layouts);
    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });
    var updates = {};
    updates['/projects/' + projectId + '/layouts/'] = newTrimmedLayouts;

    Firebase.database().ref().update(updates).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    this.setState({ layouts: newTrimmedLayouts });

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
    // Get the TaskList in question.
    var taskListIndex = -1;
    var taskList = this.state.taskLists.find((item, index) => {
      if (item.uid === taskListWidgetId) {
        taskListIndex = index;
        return true;
      }
      else {
        return false;
      }
    })

    var currentTaskIndex = -1;
    var currentTask = taskList.tasks.find((item, index) => {
      if (item.uid === taskId) {
        currentTaskIndex = index;
        return true;
      }
      else {
        return false;
      }
    });

    // Modify replace the Task.
    taskList.tasks[currentTaskIndex] = {
      taskName: currentTask.taskName,
      dueDate: currentTask.dueDate,
      isComplete: incomingValue,
      uid: currentTask.uid
    };

    taskList.tasks.sort(this.taskSortHelper);

    // Merge modified taskList back into State.
    var newTaskLists = this.state.taskLists;
    newTaskLists[taskListIndex] = taskList;
    this.setState({ taskLists: newTaskLists });
  }

  handleAddProjectClick() {
    var newProjectName = "New Project";
    // Update Firebase.
    this.setState({ isAwaitingFirebase: true });
    var newProjectKey = Firebase.database().ref('projects/').push().key;
    Firebase.database().ref('projects/' + newProjectKey).set({
      uid: newProjectKey,
      projectName: newProjectName,
      layouts: []
    }).then(() => {
      this.setState({ isAwaitingFirebase: false });
    }).catch(error => {
      this.postFirebaseError(error);
    })

    // Update React.
    var newProjects = this.state.projects;
    newProjects.push({uid: newProjectKey, projectName: newProjectName, layouts: []});
    this.setState({projects: newProjects});
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
      var taskIds = [];
      this.state.taskLists.forEach(item => {
        item.tasks.forEach(task => {
          taskIds.push(task.uid);
        })
      })

      // Build Updates (Deletes).
      var updates = {};

      taskIds.forEach(id => {
        updates["/tasks/" + id] = null;
      })

      taskListIds.forEach(id => {
        updates["/taskLists/" + id] = null;
      })

      updates["/projects/" + projectId] = null;

      // Execute Updates (Deletes).
      Firebase.database().ref().update(updates).then(() => {
        this.setState({ isAwaitingFirebase: false });
      }).catch(error => {
        this.postFirebaseError(error);
      })

      // Update React.
      var newProjects = this.state.projects;
      var index = -1;

      newProjects.find((item, itemIndex) => {
        if (item.uid === projectId) {
          index = itemIndex;
          return true;
        }
        else {
          return false;
        }
      })

      newProjects.splice(index, 1);
      this.setState({
        projects: newProjects,
        taskLists: []
      });
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
    var projectIndex = 0;
    var projects = this.state.projects;
    var project = projects.find((item, index) => {
      if (item.uid === projectSelectorId) {
        projectIndex = index;
        return true;
      }
      else {
        return false;
      }
    });

    project.projectName = newName
    projects[projectIndex] = project;

    this.setState({projects: projects});
    
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
      var taskIds = [];
      this.state.taskLists.forEach(item => {
        item.tasks.forEach(task => {
          taskIds.push(task.uid);
        })
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
      var taskLists = this.state.taskLists;
      var index = 0;
      taskLists.find((item, itemIndex) => {
        if (item.uid === taskListWidgetId) {
          index = itemIndex;
          return true;
        }
        else {
          return false;
        }
      })

      taskLists.splice(index, 1);
      this.setState({ taskLists: taskLists });
  }

  taskSortHelper(a, b) {
    return a.isComplete - b.isComplete;
  }

  postFirebaseError(error) {
    this.setState({
      isAwaitingFirebase: false,
      currentErrorMessage: error});
  }
}


export default App;
