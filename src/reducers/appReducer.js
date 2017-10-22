import * as ActionTypes from '../actions/index'
import ParseDueDate from '../utilities/ParseDueDate';


export function appReducer(state, action) {
    switch (action.type) {
        case ActionTypes.CHANGE_FOCUSED_TASKLIST:
            return { 
                ...state,
                focusedTaskListId: action.id,
                openCalendarId: -1,
                openTaskListSettingsMenuId: -1,
            };
        
        case ActionTypes.SELECT_TASK:
            const openCalendarId = state.openCalendarId === action.taskId ? action.taskId : -1; // Keep calender open if Open already.

            return {
                ...state,
                selectedTask: { taskListWidgetId: action.taskListWidgetId, taskId: action.taskId, isInputOpen: false },
                focusedTaskListId: action.taskListWidgetId,
                isATaskMoving: false,
                movingTaskId: -1,
                sourceTaskListId: -1,
                openCalendarId: openCalendarId,
                openTaskListSettingsMenuId: -1
            };
        
        case ActionTypes.OPEN_TASK:
            return {
                ...state,
                selectedTask: { taskListWidgetId: action.taskListWidgetId, taskId: action.taskId, isInputOpen: true },
                isATaskMoving: false,
                movingTaskId: -1,
                sourceTaskListId: -1,
                openCalendarId: -1,
                openTaskListSettingsMenuId: -1
            }

        case ActionTypes.CLOSE_TASK:
            return {
                ...state,
                selectedTask: { taskListWidgetId: action.taskListWidgetId, taskId: action.taskId, isInputOpen: false }
            }

        case ActionTypes.START_TASK_MOVE:
            return {
                ...state,
                isATaskMoving: true,
                selectedTask: { taskListWidgetId: action.sourceTaskListWidgetId, taskId: action.taskId, isInputOpen: false },
                focusedTaskListId: action.sourceTaskListWidgetId,
                movingTaskId: action.movingTaskId,
                sourceTaskListId: action.sourceTaskListWidgetId,
                openCalendarId: -1,
                openTaskListSettingsMenuId: -1,
            }

        case ActionTypes.START_TASK_MOVE_IN_DATABASE:
            return {
                ...state,
                isAwaitingFirebase: true
            }
        
        case ActionTypes.END_TASK_MOVE:
            return {
                ...state,
                isAwaitingFirebase: false,
                isATaskMoving: false,
                sourceTaskListId: -1,
                movingTaskId: -1,
                selectedTask: { taskListWidgetId: action.destinationTaskListWidgetId, taskId: action.movedTaskId, isInputOpen: false }
            }
        case ActionTypes.START_PROJECTS_FETCH:
            return {
                ...state,
                isAwaitingFirebase: true
            }
        
        case ActionTypes.RECEIVE_PROJECTS:
            return {
                ...state,
                projects: action.projects,
                isAwaitingFirebase: false,
            }

        case ActionTypes.START_TASKS_FETCH:
            return {
                ...state,
                isAwaitingFirebase: true
            }

        case ActionTypes.RECEIVE_TASKS:
            return {
                ...state,
                isAwaitingFirebase: false,
                tasks: action.tasks,
                projectSelectorDueDateDisplays: getProjectSelectorDueDateDisplaysHelper(action.tasks)
            }
        
        case ActionTypes.LOCK_APP:
            return {
                ...state,
                isLockScreenDisplayed: true,
            }
        
        case ActionTypes.SET_LAST_BACKUP_MESSAGE:
            return {
                ...state,
                lastBackupMessage: action.message
            }

        case ActionTypes.SET_OPEN_TASKLIST_SETTINGS_MENU_ID: 
            return {
                ...state,
                openTaskListSettingsMenuId: action.id
            }
        
        case ActionTypes.OPEN_CALENDAR: 
            return {
                ...state,
                selectedTask: { taskListWidgetId: action.taskListWidgetId, taskId: action.taskId, isInputOpen: false },
                openCalendarId: action.taskId
            }

        case ActionTypes.UNLOCK_APP: 
            return {
                ...state,
                isLockScreenDisplayed: false,
            }

        case ActionTypes.START_TASKLIST_ADD: 
            return {
                ...state,
                isAwaitingFirebase: true
            }
        

        case ActionTypes.START_TASK_ADD:
            return {
                ...state,
                isAwaitingFirebase: true
            }
        
        case ActionTypes.START_TASKLISTS_FETCH:
            return {
                ...state,
                isAwaitingFirebase: true
            }

        case ActionTypes.RECEIVE_TASKLISTS:
            return {
                ...state,
                isAwaitingFirebase: false,
                taskLists: action.taskLists
            }
        
        case ActionTypes.START_PROJECTLAYOUTS_FETCH:
            return {
                ...state,
                isAwaitingFirebase: true,
            }

        case ActionTypes.RECEIVE_PROJECTLAYOUT:
            return {
                ...state,
                isAwaitingFirebase: false,
                projectLayout: action.projectLayout
            }
        
        case ActionTypes.SELECT_PROJECT:
            return {
                ...state,
                selectedProjectId: action.projectId,
                openCalendarId: -1,
                selectedTask: { taskListWidgetId: -1, taskId: -1, isInputOpen: false },
                isATaskMoving: false,
                movingTaskId: -1,
                sourceTaskListId: -1,
                focusedTaskListId: -1,
                openTaskListSettingsMenuId: -1
            }
        
        case ActionTypes.CLOSE_CALENDAR:
            return {
                ...state,
                openCalendarId: -1
            }
        
        default:
            console.log("App Reducer is missing a Case for action:  " + action.type);
            return state;
    }
}

// Helper Methods.
var getProjectSelectorDueDateDisplaysHelper = function(tasks) {
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