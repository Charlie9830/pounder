import React from 'react';
import '../assets/css/ToolBarButton.css';
import '../assets/icons/NewTaskIcon.svg';

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
                <img className="ToolBarButton" src="NewTaskIcon.svg" onClick={this.handleAddTaskButtonClick}/>
                <img className="ToolBarButton" src="RemoveTaskIcon.svg" onClick={this.handleRemoveTaskButtonClick}/>
                <span className="ToolBarButtonSeparator"/>
                <img className="ToolBarButton" src="NewTaskListIcon.svg" onClick={this.handleAddTaskListButtonClick}/>
                <img className="ToolBarButton" src="RemoveTaskListIcon.svg" onClick={this.handleRemoveTaskListButtonCLick}/>
                <img className="LockButton" src="LockIcon.svg" onClick={this.handleLockButtonClick}/>
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