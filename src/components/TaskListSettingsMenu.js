import React from 'react';
import '../assets/css/TaskListSettingsMenu.css'
import { TaskListSettingsStore, ChecklistSettingsFactory } from 'pounder-stores';
import { getNormalizedDate } from 'pounder-utilities';
import ChecklistSettings from './ChecklistSettings';
import Moment from 'moment';

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
        this.handleChecklistModeChange = this.handleChecklistModeChange.bind(this);
        this.handleInitialStartDayPick = this.handleInitialStartDayPick.bind(this);
        this.handleRenewIntervalChange = this.handleRenewIntervalChange.bind(this);
        this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
    }

    render() {
        var selectableItems = this.getSelectableMenuItems(this.props);

        return (
            <div className="TaskListSettingsMenuContainer nonDraggable">
                <div className="TaskListSettingsSortingOptionsContainer">
                    {selectableItems}
                </div>
                <div className="TaskListSettingsChecklistOptionsContainer">
                    <ChecklistSettings onChecklistModeChange={this.handleChecklistModeChange} settings={this.props.settings.checklistSettings}
                        onInitialStartDayPick={this.handleInitialStartDayPick} onRenewNowButtonClick={this.handleRenewNowButtonClick}
                        onRenewIntervalChange={this.handleRenewIntervalChange} />
                </div>
                
            </div>
        )
    }

    handleRenewNowButtonClick() {
        this.props.onRenewNowButtonClick();
    }

    handleRenewIntervalChange(renewInterval) {
        var newChecklistSettings = {
            ...this.props.settings.checklistSettings,
            renewInterval: renewInterval,
        };

        this.props.onSettingsChanged(new TaskListSettingsStore(
            isCompleteTasksShown,
            this.props.settings.sortBy,
            newChecklistSettings
        ))
    }

    handleInitialStartDayPick(isoStartDate) {
        var newChecklistSettings = {
            ...this.props.settings.checklistSettings,
            initialStartDate: isoStartDate,
        }

        this.props.onSettingsChanged(new TaskListSettingsStore(
            isCompleteTasksShown,
            this.props.settings.sortBy,
            newChecklistSettings,
        ))
    }
    
    handleChecklistModeChange(newValue) {
        var checklistSettings = {};

        if (newValue === true) {
            var initialStartDate = Moment().add(1, 'day');
            var renewInterval = 1;
            var lastRenewDate = "";

            checklistSettings = ChecklistSettingsFactory(
                newValue,
                getNormalizedDate(initialStartDate),
                lastRenewDate,
                renewInterval
            );
        }

        else {
            checklistSettings = ChecklistSettingsFactory(false,"", "", 1);
        }

        this.props.onSettingsChanged(new TaskListSettingsStore(
            isCompleteTasksShown,
            this.props.settings.sortBy,
            checklistSettings,
        ))
    }
    
    handleSortByCompletedTasksItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "completed", this.props.settings.checklistSettings), true);
    }

    handleSortByDueDateItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "due date", this.props.settings.checklistSettings), true);
    }

    handleSortByDateAddedItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "date added", this.props.settings.checklistSettings), true);
    }

    handleSortByPriorityItemClick(e) {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "priority", this.props.settings.checklistSettings), true);
    }

    handleSortByAssigneeItemClick() {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "assignee", this.props.settings.checklistSettings), true);
    }

    handleSortByAlphabeticalItemClick() {
        this.props.onSettingsChanged(new TaskListSettingsStore(isCompleteTasksShown, "alphabetical", this.props.settings.checklistSettings), true);
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