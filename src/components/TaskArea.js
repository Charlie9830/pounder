import React from 'react';
import '../assets/css/TaskArea.css';
import { DropTarget } from 'react-dnd';

class TaskArea extends React.Component {
    render() {
        return this.props.connectDropTarget(
            <div className='TaskArea nonDraggable'>
                {this.props.children}
            </div>
        )
    }
}

let types = "task";

let spec = {
    drop: (props, monitor, component) => {
        return {
            targetTaskListWidgetId: props.taskListWidgetId,
        }
    }
}

let collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

let DropTargetTaskArea = DropTarget(types, spec, collect)(TaskArea);
export default DropTargetTaskArea;