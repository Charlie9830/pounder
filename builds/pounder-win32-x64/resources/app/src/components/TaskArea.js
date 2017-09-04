import React from 'react';
import '../assets/css/TaskArea.css';

class TaskArea extends React.Component {
    render() {
        return (
            <div className='TaskArea nonDraggable'>
                {this.props.children}
            </div>
        )
    }
}

export default TaskArea;