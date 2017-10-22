import { createStore, applyMiddleware } from 'redux';
import { appReducer } from '../reducers/appReducer';
import Logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { getFirestore } from '../firebase/index';
import ProjectLayoutStore from '../stores/ProjectLayoutStore';

let initialState = {
    projects: [],
    taskLists: [],
    tasks: [],
    focusedTaskListId: -1,
    projectLayout: new ProjectLayoutStore({}, -1, -1),
    selectedTask: {taskListWidgetId: -1, taskId: -1, isInputOpen: false},
    selectedProjectId: -1,
    isATaskMoving: false,
    movingTaskId: -1,
    sourceTaskListId: -1,
    openCalendarId: -1,
    openTaskListSettingsMenuId: -1,
    isAwaitingFirebase: false,
    projectSelectorDueDateDisplays: [],
    isLockScreenDisplayed: false,
    lastBackupMessage: "",
    openTaskListSettingsMenuId: -1
}

var appStore = createStore(
    appReducer,
    initialState,
    applyMiddleware(ReduxThunk.withExtraArgument(getFirestore), Logger)
);

export default appStore;