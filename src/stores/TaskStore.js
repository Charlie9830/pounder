class TaskStore {
    constructor(taskName, dueDate, isComplete, project, taskList, uid, dateAdded, isNewTask) {
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.isComplete = isComplete;
        this.project = project;
        this.taskList = taskList;
        this.uid = uid;
        this.dateAdded = dateAdded;
        this.isNewTask = isNewTask;
    }
}

export default TaskStore;