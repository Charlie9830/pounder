import React from 'react';
import '../assets/css/ToolBarButton.css';
import NewTaskIcon from '../assets/icons/NewTaskIcon.svg';
import RemoveTaskIcon from '../assets/icons/RemoveTaskIcon.svg';
import NewTaskListIcon from '../assets/icons/NewTaskListIcon.svg';
import RemoveTaskListIcon from '../assets/icons/RemoveTaskListIcon.svg';
import LockIcon from '../assets/icons/LockIcon.svg';

class ProjectToolBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddTaskButtonClick = this.handleAddTaskButtonClick.bind(this);
        this.handleRemoveTaskButtonClick = this.handleRemoveTaskButtonClick.bind(this);
        this.handleAddTaskListButtonClick = this.handleAddTaskListButtonClick.bind(this);
        this.handleRemoveTaskListButtonCLick = this.handleRemoveTaskListButtonCLick.bind(this);
        this.handleLockButtonClick = this.handleLockButtonClick.bind(this);

    }

    render() {
        return (
            <div>
                <div className="ToolBarFlexContainer">
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src={NewTaskIcon} onClick={this.handleAddTaskButtonClick} />
                    </div>
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src={RemoveTaskIcon} onClick={this.handleRemoveTaskButtonClick} />
                    </div>
                    <span className="ToolBarButtonSeparator" />
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src={NewTaskListIcon} onClick={this.handleAddTaskListButtonClick} />
                    </div>
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src={RemoveTaskListIcon} onClick={this.handleRemoveTaskListButtonCLick} />
                    </div>
                    <div className="ToolBarFlexDivider">
                    </div>
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src={LockIcon} onClick={this.handleLockButtonClick} />
                    </div>
                </div>
            </div>
        )
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

    handleRemoveTaskListButtonCLick(e) {
        this.props.onRemoveTaskListButtonClick();
    } 
}

export default ProjectToolBar;