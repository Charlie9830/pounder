import React from 'react';
import '../assets/css/TaskListSettingsMenu.css'
import { TaskListSettingsStore } from 'pounder-stores';

class TaskListSettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleShowCompletedTasksCheckboxClick = this.handleShowCompletedTasksCheckboxClick.bind(this);
        this.handleSortByCompletedTasksItemClick = this.handleSortByCompletedTasksItemClick.bind(this);
        this.handleSortByDateAddedItemClick = this.handleSortByDateAddedItemClick.bind(this);
        this.handleSortByDueDateItemClick = this.handleSortByDueDateItemClick.bind(this);
    }

    render() {
        var selectableItems = this.getSelectableMenuItems(this.props);

        return (
            <div className="TaskListSettingsMenuPopup">
                <div className="TaskListSettingMenuContainer">
                    <div className="TaskListSettingsMenuItemContainer">
                        <input ref="showCompleteTasksCheckbox" type="checkbox"
                            defaultChecked={this.props.settings.isCompleteTasksShown}
                            onClick={this.handleShowCompletedTasksCheckboxClick} />
                        <label> Show Completed Tasks </label>
                    </div>
                    {selectableItems}
                </div>
            </div>
        )
    }
    
    
    handleShowCompletedTasksCheckboxClick(e) {
        var isCompleteTasksShown = this.refs.showCompleteTasksCheckbox.checked;
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, this.props.settings.sortBy));
    }

    handleSortByCompletedTasksItemClick(e) {
        var isCompleteTasksShown = this.refs.showCompleteTasksCheckbox.checked;
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "completed"));
    }

    handleSortByDueDateItemClick(e) {
        var isCompleteTasksShown = this.refs.showCompleteTasksCheckbox.checked;
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "due date"));
    }

    handleSortByDateAddedItemClick(e) {
        var isCompleteTasksShown = this.refs.showCompleteTasksCheckbox.checked;
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "date added"));
    }

    getSelectableMenuItems(props) {
        var jsx = [];
        var selectedClassSuffix = "IsSelected";
        
        // Sort by Completed.
        var completedClassName = this.props.settings.sortBy === "completed" ?
         "TaskListSettingsMenuItemContainer" + selectedClassSuffix : "TaskListSettingsMenuItemContainer";
        jsx.push((
            <div key="0" className={completedClassName} onClick={this.handleSortByCompletedTasksItemClick}>
                <label className="TaskListSettingsMenuItemContainer"> Sort by Completed </label>
            </div>
        ))

        // Sort by Due Date.
        var dueDateClassName = this.props.settings.sortBy === "due date" ?
            "TaskListSettingsMenuItemContainer" + selectedClassSuffix : "TaskListSettingsMenuItemContainer";
        jsx.push((
            <div key="1" className={dueDateClassName} onClick={this.handleSortByDueDateItemClick}>
                <label className="TaskListSettingsMenuItemContainer"> Sort by Due Date </label>
            </div>
       ))

        // Sort by Date Added.
        var dateAddedClassName = this.props.settings.sortBy === "date added" ?
            "TaskListSettingsMenuItemContainer" + selectedClassSuffix : "TaskListSettingsMenuItemContainer";
        jsx.push((
            <div key="2" className={dateAddedClassName} onClick={this.handleSortByDateAddedItemClick}>
                <label className="TaskListSettingsMenuItemContainer"> Sort by Date Added </label>
            </div>
        ))

        return jsx;
    }
}

export default TaskListSettingsMenu;