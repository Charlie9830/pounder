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

    }

    render() {
        return (
            <div>
                <div className="ToolBarFlexContainer">
                    <Button iconSrc={NewTaskIcon} onClick={this.handleAddTaskButtonClick}/>
                    <Button iconSrc={RemoveTaskIcon} onClick={this.handleRemoveTaskButtonClick}/>
                    <span className="ToolBarButtonSeparator" />
                    <Button iconSrc={NewTaskListIcon} onClick={this.handleAddTaskListButtonClick}/>
                    <Button iconSrc={RemoveTaskListIcon} onClick={this.handleRemoveTaskListButtonClick}/>
                    <div className="ToolBarFlexDivider"/>
                    <Button iconSrc={SettingsIcon} onClick={this.handleAppSettingsButtonClick}/>
                    <span className="ToolBarButtonSeparator" />
                    <Button iconSrc={LockIcon} onClick={this.handleLockButtonClick}/>
                </div>
            </div>
        )
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