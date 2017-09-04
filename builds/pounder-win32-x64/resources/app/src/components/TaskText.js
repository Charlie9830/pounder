import React from 'react';
import '../assets/css/TaskText.css';

class TaskText extends React.Component{
    constructor(props){
        super(props);

        this.forwardKeyPress = this.forwardKeyPress.bind(this);
    }
    render() {
        if (this.props.isInputOpen) {
            return (
                <div className='TaskText'>
                    <input id="taskTextInput" type='text' defaultValue={this.props.text} onKeyPress={this.forwardKeyPress}/>  
                </div>
            )
        }

        else{
            return (
                <div className='TaskText'>
                    <label>{this.props.text}</label>
                </div>
            )
        }    
    }

    forwardKeyPress(e) {
        var newData = document.getElementById("taskTextInput").value;
        this.props.onKeyPress(e, newData);
    }
}

export default TaskText;