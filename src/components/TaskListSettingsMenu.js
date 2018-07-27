import React from 'react';
import '../assets/css/TaskListSettingsMenu.css'
import { TaskListSettingsStore } from 'pounder-stores';

var isCompleteTasksShown = false; // To Preserve backwards compatability of pre Show Complete Tasks change versions when using current Task lists.

class TaskListSettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleSortByCompletedTasksItemClick = this.handleSortByCompletedTasksItemClick.bind(this);
        this.handleSortByDateAddedItemClick = this.handleSortByDateAddedItemClick.bind(this);
        this.handleSortByDueDateItemClick = this.handleSortByDueDateItemClick.bind(this);
        this.handleSortByPriorityItemClick = this.handleSortByPriorityItemClick.bind(this);
        this.handleSortByAssigneeItemClick = this.handleSortByAssigneeItemClick.bind(this);
        this.handleSortByAlphabeticalItemClick = this.handleSortByAlphabeticalItemClick.bind(this);
    }

    render() {
        var selectableItems = this.getSelectableMenuItems(this.props);

        return (
            <div className="TaskListSettingsMenuContainer">
                {selectableItems}
            </div>
        )
    }
    
    
    handleSortByCompletedTasksItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "completed"));
    }

    handleSortByDueDateItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "due date"));
    }

    handleSortByDateAddedItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "date added"));
    }

    handleSortByPriorityItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "priority"));
    }

    handleSortByAssigneeItemClick() {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "assignee"));
    }

    handleSortByAlphabeticalItemClick() {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "alphabetical"));
    }

    getSelectableMenuItems(props) {
        var jsx = [];
        
        // Sort by Completed.
        jsx.push((
            <div key="0" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByCompletedTasksItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "completed" }/>
                    <label className="TaskListSettingsMenuItemLabel"> Sort by Completed </label>
                </div>
                <div className="TaskListSettingsMenuItemBottomBorder"/>
            </div>
        ))

        // Sort by Due Date.
        jsx.push((
            <div key="1" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByDueDateItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                    <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "due date" }/>
                    <label className="TaskListSettingsMenuItemLabel"> Sort by Due Date </label>
                </div>
                <div className="TaskListSettingsMenuItemBottomBorder"/>
            </div>
       ))

       // Sort by Priority.
        jsx.push((
            <div key="2" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByPriorityItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                    <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "priority" }/>
                    <label className="TaskListSettingsMenuItemLabel"> Sort by Priority </label>
                </div>
                <div className="TaskListSettingsMenuItemBottomBorder" />
            </div>
        ))

        // Sort by Date Added.
        jsx.push((
            <div key="3" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByDateAddedItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                    <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "date added" } />
                    <label className="TaskListSettingsMenuItemLabel"> Sort by Date Added </label>
                </div>
                <div className="TaskListSettingsMenuItemBottomBorder" />
            </div>
        ))

        // Sort by Date Added.
        jsx.push((
            <div key="4" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByAssigneeItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                    <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "assignee" } />
                    <label className="TaskListSettingsMenuItemLabel"> Sort by Assignee </label>
                </div>
                <div className="TaskListSettingsMenuItemBottomBorder" />
            </div>
        ))

        // Sort Alphabetically.
        jsx.push((
            <div key="5" className="TaskListSettingsMenuItemContainer" onClick={this.handleSortByAlphabeticalItemClick}>
                <div className="TaskListSettingsMenuItemFlexContainer">
                    <div className="TaskListSettingsMenuSelectedItemChit"  data-isselected={ this.props.settings.sortBy === "alphabetical" } />
                    <label className="TaskListSettingsMenuItemLabel"> Sort Alphabetically </label>
                </div>
                {/* No Bottom Border here because it's the bottom of the Menu */}
            </div>
        ))

        return jsx;
    }
}

export default TaskListSettingsMenu;