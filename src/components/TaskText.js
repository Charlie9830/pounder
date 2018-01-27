import React from 'react';
import TaskTextInput from "../components/TaskTextInput";
import '../assets/css/TaskText.css';

class TaskText extends React.Component {
    constructor(props){
        super(props);

        this.forwardKeyPress = this.forwardKeyPress.bind(this);
        this.handleInputUnmounting = this.handleInputUnmounting.bind(this);
    }


    render() {
        if (this.props.isInputOpen) {
            return (
                <div className='TaskText'>
                    <TaskTextInput defaultValue={this.props.text} onKeyPress={this.forwardKeyPress}
                    onComponentUnmounting={this.handleInputUnmounting}/>  
                </div>
            )
        }

        else {
            var currentClassName = this.props.isComplete ? "TaskText Fade" : "TaskText";

            return (
                <div className={currentClassName} data-ishighpriority={this.props.isHighPriority}>
                    <label>{this.props.text}</label>
                </div>
            )
        }    
    }

    handleInputUnmounting(data) {
        this.props.onInputUnmounting(data);
    }

    forwardKeyPress(e, newData) {
        this.props.onKeyPress(e, newData);
    }
}

export default TaskText;