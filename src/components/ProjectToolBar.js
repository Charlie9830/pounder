import React from 'react';
import '../assets/css/ToolBarButton.css';
import NewTaskIcon from '../assets/icons/NewTaskIcon.svg';
import RemoveTaskIcon from '../assets/icons/RemoveTaskIcon.svg';
import NewTaskListIcon from '../assets/icons/NewTaskListIcon.svg';
import RemoveTaskListIcon from '../assets/icons/RemoveTaskListIcon.svg';
import LockIcon from '../assets/icons/LockIcon.svg';
import SettingsIcon from '../assets/icons/SettingsIcon.svg';
import KeyboardIcon from '../assets/icons/KeyboardIcon.svg';
import EyeOpenIcon from '../assets/icons/EyeOpenIcon.svg';
import EyeClosedIcon from '../assets/icons/EyeClosedIcon.svg';
import Button from './Button';

class ProjectToolBar extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.showCompletedTasksCheckboxRef = React.createRef();

        this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
        this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
        this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
        this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
        this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
        this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
        this.getLockButtonJSX = this.getLockButtonJSX.bind(this);
        this.handleKeyboardShortcutsButtonClick = this.handleKeyboardShortcutsButtonClick.bind(this);
        this.handleShowCompletedTasksCheckboxChanged = this.handleShowCompletedTasksCheckboxChanged.bind(this);
        this.getShowCompletedTasksButtonJSX = this.getShowCompletedTasksButtonJSX.bind(this);
        this.handleShowCompletedTasksButtonClick = this.handleShowCompletedTasksButtonClick.bind(this);

    }

    render() {
        var lockButtonJSX = this.getLockButtonJSX();
        var showCompletedTasksButtonJSX = this.getShowCompletedTasksButtonJSX();

        return (
            <div>
                <div className="ToolBarFlexContainer">
                    <Button iconSrc={NewTaskListIcon} onClick={this.handleAddTaskListButtonClick}
                        isEnabled={this.props.buttonEnableStates.isAddTaskListButtonEnabled}
                        tooltip="Add new Task List" />

                    <Button iconSrc={RemoveTaskListIcon} onClick={this.handleRemoveTaskListButtonClick}
                        isEnabled={this.props.buttonEnableStates.isRemoveTaskListButtonEnabled}
                        tooltip="Delete selected Task List" />


                    <span className="ToolBarButtonSeparator" />

                    <Button iconSrc={NewTaskIcon} onClick={this.handleAddTaskButtonClick}
                        isEnabled={this.props.buttonEnableStates.isAddTaskButtonEnabled}
                        tooltip="Add new Task" />

                    <Button iconSrc={RemoveTaskIcon} onClick={this.handleRemoveTaskButtonClick}
                        isEnabled={this.props.buttonEnableStates.isRemoveTaskButtonEnabled}
                        tooltip="Delete selected Task" />

                    <div className="ShowCompletedTasksContainer">
                        {showCompletedTasksButtonJSX}
                    </div>

                    <div className="ToolBarFlexDivider" />

                    <Button iconSrc={KeyboardIcon} onClick={this.handleKeyboardShortcutsButtonClick}
                        tooltip="View keyboard shortcuts" />

                    <Button iconSrc={SettingsIcon} onClick={this.handleAppSettingsButtonClick}
                        tooltip="Settings" />
                    {lockButtonJSX}
                </div>
            </div>
        )
    }

    getShowCompletedTasksButtonJSX() {
        var iconSrc = this.props.showCompletedTasks ? EyeClosedIcon : EyeOpenIcon;
        var tooltipText = this.props.showCompletedTasks ? "Hide completed tasks" : "Show completed tasks";
        return (
            <Button iconSrc={iconSrc}  onClick={this.handleShowCompletedTasksButtonClick}
            tooltip={tooltipText} isEnabled={this.props.buttonEnableStates.isShowCompletedTasksButtonEnabled} />
        )
    }

    handleShowCompletedTasksButtonClick() {
        this.props.onShowCompletedTasksChanged(!this.props.showCompletedTasks);
    }

    handleShowCompletedTasksCheckboxChanged() {
        var value = this.showCompletedTasksCheckboxRef.current.checked;
        this.props.onShowCompletedTasksChanged(value);
    }

    handleKeyboardShortcutsButtonClick() {
        this.props.onKeyboardShortcutsButtonClick();
    }

    getLockButtonJSX() {
        var hideLockButton = this.props.hideLockButton === undefined ? false : this.props.hideLockButton;

        if (!hideLockButton) {
            return (
                <React.Fragment>
                    <span className="ToolBarButtonSeparator" />
                    <Button iconSrc={LockIcon} onClick={this.handleLockButtonClick}
                        tooltip="Lock Application" />
                </React.Fragment>
            )
        }
    }

    handleAppSettingsButtonClick() {
        this.props.onAppSettingsButtonClick();
    }

    handleLockButtonClick(e) {
        this.props.onLockButtonClick();
    }

    handleAddTaskButtonClick(e) {
        this.props.onAddTaskButtonClick();
    }

    handleRemoveTaskButtonClick(e) {
        this.props.onRemoveTaskButtonClick();
    }

    handleAddTaskListButtonClick(e) {
        this.props.onAddTaskListButtonClick();
    }

    handleRemoveTaskListButtonClick(e) {
        this.props.onRemoveTaskListButtonClick();
    }
}

export default ProjectToolBar;