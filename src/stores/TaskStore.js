class TaskStore {
    constructor(taskName, dueDate, isComplete, project, taskList, uid, dateAdded) {
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.isComplete = isComplete;
        this.project = project;
        this.taskList = taskList;
        this.uid = uid;
        this.dateAdded = dateAdded;
    }
}

export default TaskStore;