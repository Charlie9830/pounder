class TaskListStore {
    constructor(taskListName, project, uid, taskListId, settings) {
        this.taskListName = taskListName;
        this.project = project;
        this.uid = uid;
        this.taskListId = taskListId;
        this.settings = settings;
    }
}

export default TaskListStore;