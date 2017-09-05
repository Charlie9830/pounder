import React from 'react';
import '../assets/css/TaskListMenu.css'

class TaskListMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="TaskListMenuDropdown">
                <div className="TaskListMenuContent">
                    Hello!
                </div>
            </div>
        )
    }
}

export default TaskListMenu;