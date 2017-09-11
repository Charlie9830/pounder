import React from 'react';
import '../assets/css/TaskListMenu.css'
import MenuItem from './MenuItem';

class TaskListMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="TaskListMenuDropdown">
                <span> = </span>
                <div className="TaskListMenuContent">
                    <MenuItem text="Sort by Completion"/>
                    <MenuItem text="Hide Completed Tasks"/>
                </div>
            </div>
        )
    }
}

export default TaskListMenu;