import React from 'react';
import '../assets/css/ListToolbar.css';

class ListToolbar extends React.Component{
    constructor(props) {
        super(props);

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleShowCompletedTasksCheckboxClick = this.handleShowCompletedTasksCheckboxClick.bind(this);
    }

    render() {
        var listToolbarHeader = this.getListToolbarHeader(this.props);

        return(
            <div className="ListToolbar">
                <div className="SortingMenu">
                    <input ref="showCompleteTasksCheckbox" type="checkbox" defaultChecked={this.props.isCompleteTasksShown}
                     onClick={this.handleShowCompletedTasksCheckboxClick}/>
                    <label> Show Completed Tasks </label>
                </div>
                {listToolbarHeader}
                <label className="DeleteButton" onClick={this.handleRemoveButtonClick}>X</label>
            </div>
        )
    }

    handleShowCompletedTasksCheckboxClick(e) {
        this.props.onShowCompleteTasksChanged(this.refs.showCompleteTasksCheckbox.checked);
    }

    getListToolbarHeader(props) {
        if (props.isHeaderOpen) {
            return (
                <input id="headerInput" className="nonDraggable" type='text' defaultValue={props.headerText} onKeyPress={this.handleKeyPress}/>
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