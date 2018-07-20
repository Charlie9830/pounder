import React from 'react';
import '../assets/css/ToolBarButton.css';
import NewTaskIcon from '../assets/icons/NewTaskIcon.svg';
import RemoveTaskIcon from '../assets/icons/RemoveTaskIcon.svg';
import NewTaskListIcon from '../assets/icons/NewTaskListIcon.svg';
import RemoveTaskListIcon from '../assets/icons/RemoveTaskListIcon.svg';
import LockIcon from '../assets/icons/LockIcon.svg';
import SettingsIcon from '../assets/icons/SettingsIcon.svg';
import Button from './Button';

class ProjectToolBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
        this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
        this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
        this.handleRemoveTaskListButtonClick = this.handleRemoveTaskListButtonClick.bind(this);
        this.handleLockButtonClick = this.handleLockButtonClick.bind(this);
        this.handleAppSettingsButtonClick = this.handleAppSettingsButtonClick.bind(this);
        this.getLockButtonJSX = this.getLockButtonJSX.bind(this);

    }

    render() {
        var lockButtonJSX = this.getLockButtonJSX();

        return (
            <div>
                <div className="ToolBarFlexContainer">
                    <Button iconSrc={NewTaskIcon} onClick={this.handleAddTaskButtonClick}
                    isEnabled={this.props.buttonEnableStates.isAddTaskButtonEnabled}
                    tooltip="Add new Task"/>

                    <Button iconSrc={RemoveTaskIcon} onClick={this.handleRemoveTaskButtonClick}
                    isEnabled={this.props.buttonEnableStates.isRemoveTaskButtonEnabled}
                    tooltip="Delete selected Task"/>

                    <span className="ToolBarButtonSeparator" />

                    <Button iconSrc={NewTaskListIcon} onClick={this.handleAddTaskListButtonClick}
                    isEnabled={this.props.buttonEnableStates.isAddTaskListButtonEnabled}
                    tooltip="Add new Task List"/>

                    <Button iconSrc={RemoveTaskListIcon} onClick={this.handleRemoveTaskListButtonClick}
                    isEnabled={this.props.buttonEnableStates.isRemoveTaskListButtonEnabled}
                    tooltip="Delete selected Task List"/>

                    <div className="ToolBarFlexDivider"/>

                    <Button iconSrc={SettingsIcon} onClick={this.handleAppSettingsButtonClick}
                    tooltip="Settings"/>
                    {lockButtonJSX}
                </div>
            </div>
        )
    }

    getLockButtonJSX() {
        var hideLockButton = this.props.hideLockButton === undefined ? false : this.props.hideLockButton;

        if (!hideLockButton) {
            return (
                <React.Fragment>
                    <span className="ToolBarButtonSeparator" />
                    <Button iconSrc={LockIcon} onClick={this.handleLockButtonClick}
                    tooltip="Lock Application"/>
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