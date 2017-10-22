import * as ActionTypes from '../actions/index';
import { PROJECTS, PROJECTLAYOUTS, TASKS, TASKLISTS } from '../firebase/index';

import TaskListStore from "../stores/TaskListStore";
import TaskListSettingsStore from "../stores/TaskListSettingsStore";
import ProjectStore from "../stores/ProjectStore";
import ProjectLayoutStore from "../stores/ProjectLayoutStore";
import TaskStore from "../stores/TaskStore";
import Moment from 'moment';

// Standard Action Creators.
export function changeFocusedTaskList(id) {
    return {
        type: ActionTypes.CHANGE_FOCUSED_TASKLIST,
        id: id
    }
}

export function selectTask(taskListWidgetId, taskId) {
    return {
        type: ActionTypes.SELECT_TASK,
        taskListWidgetId: taskListWidgetId,
        taskId: taskId,
    }
}

export function openTask(taskListWidgetId, taskId) {
    return {
        type: ActionTypes.OPEN_TASK,
        taskListWidgetId: taskListWidgetId,
        taskId: taskId
    }
}

export function closeTask(taskListWidgetId, taskId) {
    return {
        type: ActionTypes.CLOSE_TASK,
        taskListWidgetId: taskListWidgetId,
        taskId: taskId
    }
}

export function startTaskMove(movingTaskId, sourceTaskListWidgetId) {
    return {
        type: ActionTypes.START_TASK_MOVE,
        movingTaskId: movingTaskId,
        sourceTaskListWidgetId: sourceTaskListWidgetId
    }
}

export function startTaskMoveInDatabase() {
    return {
        type: ActionTypes.START_TASK_MOVE_IN_DATABASE
    }
}

export function startProjectsFetch() {
    return {
        type: ActionTypes.START_PROJECTS_FETCH,
    }
}

export function receiveProjects(projects) {
    return {
        type: ActionTypes.RECEIVE_PROJECTS,
        projects: projects
    }
}

export function startTasksFetch() {
    return {
        type: ActionTypes.START_TASKS_FETCH
    }
}

export function receiveTasks(tasks) {
    return {
        type: ActionTypes.RECEIVE_TASKS,
        tasks: tasks
    }
}

export function lockApp() {
    return {
        type: ActionTypes.LOCK_APP,
    }
}

export function unlockApp() {
    return {
        type: ActionTypes.UNLOCK_APP,
    }
}

export function setLastBackupMessage(message) {
    return {
        type: ActionTypes.SET_LAST_BACKUP_MESSAGE,
        message: message
    }
}

export function setOpenTaskListSettingsMenuId(id) {
    return {
        type: ActionTypes.SET_OPEN_TASKLIST_SETTINGS_MENU_ID,
        id: id
    }
}

export function openCalendar(taskListWidgetId, taskId) {
    return {
        type: ActionTypes.OPEN_CALENDAR,
        taskListWidgetId: taskListWidgetId,
        taskId: taskId
    }
}

export function startTasklistAdd() {
    return {
        type: ActionTypes.START_TASKLIST_ADD
    }
}

export function startTaskAdd() {
    return {
        type: ActionTypes.START_TASK_ADD
    }
}

export function startTaskListsFetch() {
    return {
        type: ActionTypes.START_TASKLISTS_FETCH
    }
}

export function receiveTaskLists(taskLists) {
    return {
        type: ActionTypes.RECEIVE_TASKLISTS,
        taskLists: taskLists
    }
}

export function startProjectLayoutsFetch() {
    return {
        type: ActionTypes.START_PROJECTLAYOUTS_FETCH
    }
}

export function receiveProjectLayout(projectLayout) {
    return {
        type: ActionTypes.RECEIVE_PROJECTLAYOUT,
        projectLayout: projectLayout
    }
}

export function selectProject(projectId) {
    return {
        type: ActionTypes.SELECT_PROJECT,
        projectId: projectId
    }
}

export function closeCalendar() {
    return {
        type: ActionTypes.CLOSE_CALENDAR
    }
}

// Private Actions.
// Should only be dispatched by moveTaskAsync(), as moveTaskAsync() gets the movingTaskId from the State. Calling this from elsewhere
// could create a race Condition.
function endTaskMove(movingTaskId, destinationTaskListWidgetId) {
    return {
        type: ActionTypes.END_TASK_MOVE,
        movedTaskId: movingTaskId,
        destinationTaskListWidgetId: destinationTaskListWidgetId,
    }
}

// Thunks
export function updateTaskDueDateAsync(taskId, newDate) {
    return (dispatch, getState, getFirestore) => {
        dispatch(closeCalendar());

        // Update Firestore.
        var taskRef = getFirestore().collection(TASKS).doc(taskId);
        taskRef.update({
            dueDate: newDate,
            isNewTask: false
        }).then(() => {
            // TODO: Dispatch Something.
        })
    }
}

export function updateTaskListSettingsAsync(taskListWidgetId, newValue) {
    return (dispatch, getState, getFirestore) => {
        dispatch(setOpenTaskListSettingsMenuId(-1));

        // Update Firestore.
        var taskListRef = getFirestore().collection(TASKLISTS).doc(taskListWidgetId);

        taskListRef.update({
            settings: Object.assign({}, newValue)
        }).then(() => {
            // TODO: Dispatch Something.
        })
    }
}

export function removeTaskListAsync(taskListWidgetId) {
    return (dispatch, getState, getFirestore) => {
        // Update Firestore.
        // Collect related TaskIds.
        var taskIds = collectTaskListRelatedTaskIds(getState().tasks, taskListWidgetId);

        // Build Batch.
        var batch = getFirestore().batch();

        // Task lists
        batch.delete(getFirestore().collection(TASKLISTS).doc(taskListWidgetId));

        // Tasks.
        taskIds.forEach(id => {
            batch.delete(getFirestore().collection(TASKS).doc(id));
        })

        batch.commit().then(() => {
            // TODO: Dispatch Something.
        })
    }
}


export function updateProjectNameAsync(projectId, newValue) {
    return (dispatch, getState, getFirestore) => {
        // Update Firestore.
        var projectRef = getFirestore().collection(PROJECTS).doc(projectId);
        projectRef.update({ projectName: newValue }).then(() => {
            // TODO: Dispatch something.
        })
    }
}

export function removeProjectAsync(projectId) {
    return (dispatch, getState, getFirestore) => {
        // Get a List of Task List Id's . It's Okay to collect these from State as associated taskLists have already
        // been loaded in via the handleProjectSelectorClick method. No point in querying Firebase again for this data.
        var taskListIds = getState().taskLists.filter(item => {
            return item.project === projectId;
        }).map(taskList => { return taskList.uid });

        var taskIds = collectProjectRelatedTaskIds(getState().tasks, projectId);

        // Build Updates.
        var batch = getFirestore().batch();

        // Tasklists.
        taskListIds.forEach(id => {
            batch.delete(getFirestore().collection(TASKLISTS).doc(id));
        })

        // Tasks
        taskIds.forEach(id => {
            batch.delete(getFirestore().collection(TASKS).doc(id));
        })

        // Project Layout
        var projectLayoutId = getState().projectLayout.uid;
        if (projectLayoutId !== -1) {
            batch.delete(getFirestore().collection(PROJECTLAYOUTS).doc(projectLayoutId));
        }
        
        // Project.
        batch.delete(getFirestore().collection(PROJECTS).doc(projectId));

        // Execute the Batch.
        batch.commit().then(() => {
            // TODO: Dispatch something.
        })
    }
}


export function addNewProjectAsync() {
    return (dispatch, getState, getFirestore) => {
        // Update Firestore.    
        var newProjectName = "New Project";
        var batch = getFirestore().batch();

        // Project.
        var newProjectRef = getFirestore().collection(PROJECTS).doc();
        var newProjectKey = newProjectRef.id;

        var newProject = new ProjectStore(newProjectName, newProjectKey);
        batch.set(newProjectRef, Object.assign({}, newProject));

        // Layout
        var newLayoutRef = getFirestore().collection(PROJECTLAYOUTS).doc(newProjectKey);

        var newProjectLayout = new ProjectLayoutStore({}, newProjectKey, newProjectKey);
        batch.set(newLayoutRef, Object.assign({}, newProjectLayout));

        // Execute Additions.
        batch.commit().then(() => {
            // TODO: Dispatch Succsess Thingy
        })
    }
}




export function updateTaskCompleteAsync(taskListWidgetId, taskId, newValue) {
    return (dispatch, getState, getFirestore) => {
        if (getState().selectedTask.taskListWidgetId !== taskListWidgetId &&
            getState().selectedTask.taskId !== taskId) {
            dispatch(selectTask(taskListWidgetId, taskId));
        }

        // Update Firestore.
        var taskRef = getFirestore().collection(TASKS).doc(taskId);

        taskRef.update({
            isComplete: newValue,
            isNewTask: false
        }).then(() => {
            // TODO: Sucsess Dispatch.
        })
    }
}

export function updateProjectLayoutAsync(layouts, projectId) {
    return (dispatch, getState, getFirestore) => {
        var newTrimmedLayouts = trimLayoutsHelper(layouts);
        
        // Update Firestore.
        var projectLayoutsRef = getFirestore().collection(PROJECTLAYOUTS).doc(projectId);
        projectLayoutsRef.update({ layouts: newTrimmedLayouts }).then(() => {
            // TODO: Add Sucsess Dispatch
        })
    }
}


export function updateTaskNameAsync(taskListWidgetId, taskId, newData) {
    return (dispatch, getState, getFirestore) => {
        dispatch(closeTask(taskListWidgetId, taskId));

        // TODO: Notify of Firebase Request.
        // Update Firestore.
        var taskRef = getFirestore().collection(TASKS).doc(taskId);
        taskRef.update({
          taskName: newData,
          isNewTask: false // Reset new Task Property.
        }).then(() => {
          // TODO: Add Sucsess Notification.
        })
    }
}

export function removeSelectedTaskAsync() {
    return (dispatch, getState, getFirestore) => {
        var taskId = getState().selectedTask.taskId;
        if (taskId !== -1) {
            // Update Firestore.    
            // Build Batch and Execute.
            var batch = getFirestore().batch();
            var taskRef = getFirestore().collection(TASKS).doc(taskId);
            batch.delete(taskRef);

            batch.commit().then(() => {
                // TODO: Add succsess Action.
            });
        }
    }
}


export function updateTaskListWidgetHeaderAsync(taskListWidgetId, newName) {
    return (dispatch, getState, getFirestore) => {
        var taskListRef = getFirestore().collection(TASKLISTS).doc(taskListWidgetId);
        taskListRef.update({ taskListName: newName }).then(() => {
            // Todo: Dispatch Something.
        })
    }
}


export function moveTaskAsync(destinationTaskListId) {
    return (dispatch, getState, getFirestore) => {
        dispatch(startTaskMoveInDatabase());

        var movingTaskId = getState().movingTaskId;
        var taskRef = getFirestore().collection(TASKS).doc(movingTaskId);
        taskRef.update({
          taskList: destinationTaskListId
        }).then(() => {
          dispatch(endTaskMove(movingTaskId, destinationTaskListId));
        })
    }
}


export function addNewTaskAsync() {
    return (dispatch, getState, getFirestore) => {
        if (getState().focusedTaskListId !== -1) {

            const { selectedProjectId, focusedTaskListId } = getState();

            // Add a new Task.
            dispatch(startTaskAdd());

            var newTaskRef = getFirestore().collection(TASKS).doc();
            var newTaskKey = newTaskRef.id;
      
            var newTask = new TaskStore(
              "",
              "",
              false,
              selectedProjectId,
              focusedTaskListId,
              newTaskKey,
              new Moment().toISOString(),
              true
            )
      
            newTaskRef.set(Object.assign({}, newTask)).then(() => {
            })

            dispatch(openTask(newTask.taskList, newTask.uid)); // Opening a Task by convention Selects it.
        }    
    }
}

export function addNewTaskListAsync() {
    return (dispatch, getState, getFirestore) => {
        dispatch(startTasklistAdd());

        // Add to Firestore.
        var newTaskListRef = getFirestore().collection(TASKLISTS).doc();
        
        var newTaskList = new TaskListStore(
          "New Task List",
          getState().selectedProjectId,
          newTaskListRef.id,
          newTaskListRef.id,
          Object.assign({}, new TaskListSettingsStore(true, "completed"))
        )

        newTaskListRef.set(Object.assign({},newTaskList)).then(() => {
            // TODO: Add a Dispatch Here.
        })
    }
}

export function getProjectsAsync() {
    return (dispatch, getState, getFirestore) => {
        dispatch(startProjectsFetch());

        // Get Projects from Firestore.
        getFirestore().collection("projects").onSnapshot(snapshot => {
            var projects = [];
            snapshot.forEach( doc => {
                projects.push(doc.data());
            })

            dispatch(receiveProjects(projects));
        })
    }
}

export function getTasksAsync() {
    return (dispatch, getState, getFirestore) => {
        dispatch(startTasksFetch());

        // Get Tasks from Firestore.
        getFirestore().collection(TASKS).orderBy("project").onSnapshot( snapshot => {
            var tasks = [];
            snapshot.forEach(doc => {
                tasks.push(doc.data());
            })
            dispatch(receiveTasks(tasks));
        })
    }
}

export function getTaskListsAsync(projectId) {
    return (dispatch, getState, getFirestore) => {
        dispatch(startTaskListsFetch());

        // Get Tasklists from Firestore.
        getFirestore().collection(TASKLISTS).where("project", "==", projectId).onSnapshot(snapshot => {
            var taskLists = [];
            snapshot.forEach(doc => {
              taskLists.push(doc.data());
            })

            dispatch(receiveTaskLists(taskLists));
        });
    }
}

export function getProjectLayoutsAsync(projectId) {
    return (dispatch, getState, getFirestore) => {
        dispatch(startProjectLayoutsFetch());

        getFirestore().collection(PROJECTLAYOUTS).where("project", "==", projectId).onSnapshot(snapshot => {
            var projectLayouts = [];

            if (snapshot.empty !== true) {
                snapshot.forEach(doc => {
                    projectLayouts.push(doc.data());
                })
            }

            else {
                projectLayouts[0] = new ProjectLayoutStore({}, -1, -1);
            }

            dispatch(receiveProjectLayout(projectLayouts[0]));
        });
    }
}

export function unsubscribeProjectsAsync() {
    return (dispatch, getState, getFirestore) => {
        var projectUnsubscribe = getFirestore().collection(PROJECTS).onSnapshot( () => {});
        projectUnsubscribe();
    }
}

export function unsubscribeTaskListsAsync() {
    return (dispatch, getState, getFirestore) => {
        var taskListsUnsubscribe = getFirestore().collection(TASKLISTS).onSnapshot( () => {});
        taskListsUnsubscribe();
    }
}

export function unsubscribeTasksAsync() {
    return (dispatch, getState, getFirestore) => {
        var tasksUnsubscribe = getFirestore().collection(TASKS).onSnapshot( () => {});
        tasksUnsubscribe();
    }
}

export function unsubscribeProjectLayoutsAsync() {
    return (dispatch, getState, getFirestore) => {
        if (getState().selectedProjectId !== -1) {
            var projectLayoutsUnsubscribe = getFirestore().collection(PROJECTLAYOUTS).doc(getState().selectedProjectId).onSnapshot( () => {});
            projectLayoutsUnsubscribe();
          }
    }
}

// Helper Functions.
function collectProjectRelatedTaskIds(tasks, projectId) {
    return tasks.filter(task => {
        return task.project === projectId
    }).map(task => { return task.uid});
}

function collectTaskListRelatedTaskIds(tasks, taskListWidgetId) {
    // Collect related TaskIds.
    var taskIds = tasks.filter(task => {
        return task.taskList === taskListWidgetId;
    }).map(task => { return task.uid });

    return taskIds;
}


function trimLayoutsHelper(layouts) {
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

