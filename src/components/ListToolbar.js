import React from 'react';
import '../assets/css/ListToolbar.css';
import TaskListSettingsMenu from './TaskListSettingsMenu';

class ListToolbar extends React.Component{
    constructor(props) {
        super(props);

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
    }

    render() {
        var listToolbarHeader = this.getListToolbarHeader(this.props);
        var settingsMenu = this.getSettingsMenu(this.props);

        return (
            <div className="ListToolbar">
                <div className="SortingMenu">
                    <img id="ListToolbarSettingsIcon" src="SettingsIcon.svg" onClick={this.handleSettingsClick}/>
                    {settingsMenu}
                </div>
                {listToolbarHeader}
                <label className="DeleteButton" onClick={this.handleRemoveButtonClick}>X</label>
            </div>
        )
    }

    getSettingsMenu(props) {
        if (props.isSettingsMenuOpen) {
            return (
                <TaskListSettingsMenu settings={this.props.settings}
                 onSettingsChanged={this.handleTaskListSettingsChanged}/>
            ) 
        }
    }

    handleTaskListSettingsChanged(newSettings) {
        this.props.onTaskListSettingsChanged(newSettings);
    }

    handleSettingsClick(e) {
        this.props.onSettingsButtonClick();
    }

    getListToolbarHeader(props) {
        if (props.isHeaderOpen) {
            return (
                <input id="headerInput" className="ListToolbarHeaderInput nonDraggable" type='text' defaultValue={props.headerText} onKeyPress={this.handleKeyPress}/>
            )
        }

        else {
            return (
                <label className="ListToolbarHeader" onDoubleClick={this.handleDoubleClick}>
                    {this.props.headerText}  
                 </label>
            )
        }
    }

    handleDoubleClick(e) {
        this.props.onHeaderDoubleClick();
    }

    handleRemoveButtonClick(e) {
        this.props.onRemoveButtonClick(e);
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.props.onHeaderSubmit(document.getElementById('headerInput').value);
        }
    }
}

export default ListToolbar;