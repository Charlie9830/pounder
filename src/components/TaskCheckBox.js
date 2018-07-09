import React from 'react';

class TaskCheckBox extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        var currentStyle = this.props.isChecked ? "TaskCheckBoxIsChecked" : "TaskCheckBoxIsNotChecked";

        return (
            <div className={currentStyle} data-disableanimations={this.props.disableAnimations} onClick={this.handleClick}>
            </div>
        )
    }

    handleClick(e) {
        var incomingValue = !this.props.isChecked;
        this.props.onCheckBoxClick(e, incomingValue);
    }
}

export default TaskCheckBox;