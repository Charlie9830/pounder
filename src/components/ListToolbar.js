import React from 'react';
import Hammer from 'hammerjs';
import { CSSTransition } from 'react-transition-group';
import VerticalCenteringContainer from '../containers/VerticalCenteringContainer';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import '../assets/css/ListToolbar.css';
import TaskListSettingsMenu from './TaskListSettingsMenu';
import TaskListSettingsIcon from '../assets/icons/SettingsIcon.svg';
import DeleteTaskListIcon from '../assets/icons/DeleteTaskListIcon.svg';

class ListToolbar extends React.Component{
    constructor(props) {
        super(props);

        // State.
        this.state = {
            lastSettingsClickPos: { x: 0, y: 0 }
        }

        // Refs.
        this.headerInputRef = React.createRef();
        this.headerContainerRef = React.createRef();

        // Hammer.
        this.hammer = {};

        // Method Bindings.
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleTaskListSettingsChanged = this.handleTaskListSettingsChanged.bind(this);
        this.handleDoubleTap = this.handleDoubleTap.bind(this);
        this.handleHeaderInputBlur = this.handleHeaderInputBlur.bind(this);
        this.handleOverlayMenuOutsideChildBoundsClick = this.handleOverlayMenuOutsideChildBoundsClick.bind(this);
        this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
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

        this.hammer = new Hammer(this.headerContainerRef.current);
        this.hammer.on('tap', this.handleDoubleTap);
        this.hammer.get('tap').set({taps: 2});
    }

    componentWillUnmount() {
        this.hammer.off('tap', this.headerContainerRef.current, this.handleDoubleTap);
    }

    render() {
        var listToolbarHeader = this.getListToolbarHeader(this.props);
        var settingsMenu = this.getSettingsMenu(this.props);
        var typeText = this.props.settings.checklistSettings.isChecklist ? "Checklist" : "";

        return (
                <div className="ListToolbar" data-isfocused={this.props.isFocused}>
                    <div className="ListToolbarSettingsMenuContainer" onClick={this.handleSettingsClick}>
                        <img className="ListToolbarSettingsIcon" src={TaskListSettingsIcon} />
                        {settingsMenu}
                    </div>

                    <div className="ListToolbarTypeContainer">
                        <VerticalCenteringContainer>
                            <div className="ListToolbarTypeLabel"> {typeText} </div>
                        </VerticalCenteringContainer>
                    </div>

                    <div className="ListToolbarHeaderContainer" ref={this.headerContainerRef}>
                        {listToolbarHeader}
                    </div>

                    <div className="ListToolbarDeleteButtonContainer" onClick={this.handleRemoveButtonClick}>
                        <img className="DeleteButton" src={DeleteTaskListIcon} />
                    </div>
                </div>
        )
    }

    handleOverlayMenuOutsideChildBoundsClick() {
        this.props.onSettingsMenuClose();
    }

    handleDoubleTap(event) {
        this.props.onHeaderDoubleClick();
    }

    getSettingsMenu(props) {
        if (props.isSettingsMenuOpen) {
            return (
                <OverlayMenuContainer onOutsideChildBoundsClick={this.handleOverlayMenuOutsideChildBoundsClick}>
                    <TaskListSettingsMenu settings={this.props.settings}
                    onSettingsChanged={this.handleTaskListSettingsChanged}
                    onRenewNowButtonClick={this.handleRenewNowButtonClick}/>
                </OverlayMenuContainer>
            ) 
        }
    }

    handleRenewNowButtonClick() {
        this.props.onRenewNowButtonClick();
    }

    handleTaskListSettingsChanged(newSettings, closeMenu) {
        this.props.onTaskListSettingsChanged(newSettings, closeMenu);
    }

    handleSettingsClick(e) {
        this.setState({lastSettingsClickPos: {x: e.clientX, y: e.clientY} })
        this.props.onSettingsButtonClick();
    }

    getListToolbarHeader(props) {
        if (props.isHeaderOpen) {
            return (
                <input id="headerInput" className="ListToolbarHeaderInput nonDraggable" ref={this.headerInputRef}
                 type='text' defaultValue={props.headerText} onKeyPress={this.handleKeyPress} onBlur={this.handleHeaderInputBlur}/>
            )
        }

        else {
            return (
                <label className="ListToolbarHeader" data-isfocused={this.props.isFocused} onDoubleClick={this.handleDoubleClick} ref={this.headerLabelRef}>
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

    handleHeaderInputBlur() {
        this.props.onHeaderSubmit(document.getElementById('headerInput').value);
    }
}

export default ListToolbar;