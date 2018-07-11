import React from 'react';
import '../assets/css/ListToolbar.css';
import TaskListSettingsMenu from './TaskListSettingsMenu';
import TaskListSettingsIcon from '../assets/icons/SettingsIcon.svg';

class ListToolbar extends React.Component{
    constructor(props) {
        super(props);

        // Refs.
        this.headerInputRef = React.createRef();

        // Method Bindings.
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isHeaderOpen !== this.props.isHeaderOpen) {
            if (this.props.isHeaderOpen) {
                this.headerInputRef.current.focus();
            }
        }
    }

    componentDidMount() {
        if (this.props.isHeaderOpen) {
            this.headerInputRef.current.focus();
        }
    }

    render() {
        var listToolbarHeader = this.getListToolbarHeader(this.props);
        var settingsMenu = this.getSettingsMenu(this.props);

        return (
            <div className="ListToolbar" data-isfocused={this.props.isFocused}>
                <div className="SortingMenu">
                    <img id="ListToolbarSettingsIcon" src={TaskListSettingsIcon} onClick={this.handleSettingsClick}/>
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
                <input id="headerInput" className="ListToolbarHeaderInput nonDraggable" ref={this.headerInputRef}
                 type='text' defaultValue={props.headerText} onKeyPress={this.handleKeyPress}/>
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