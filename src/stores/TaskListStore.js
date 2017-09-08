class TaskListStore {
    constructor(taskListName, project, uid, taskListId) {
        this.taskListName = taskListName;
        this.project = project;
        this.uid = uid;
        this.taskListId = taskListId;
    }
}

export default TaskListStore;