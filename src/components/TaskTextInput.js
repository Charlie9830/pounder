import React from 'react';
import '../assets/css/TaskText.css'

class TaskTextInput extends React.Component {
    constructor(props) {
        super(props);

        this.hasEnterKeyBeenPressed = false;

        // Method Bindings
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        // Pull Keyboard Focus.
        this.refs.input.focus();
    }

    componentWillUnmount() {
        if (this.hasEnterKeyBeenPressed === false) {
            this.props.onComponentUnmounting(this.refs.input.value); // Data change would have already have been handled.
        }
    }

    render() {
        return (
            <input className="TaskTextInput" ref="input" type='text' defaultValue={this.props.defaultValue}
             onKeyPress={this.handleKeyPress}/>
        )
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.hasEnterKeyBeenPressed = true;
        }
        
        this.props.onKeyPress(e, this.refs.input.value);
    }


}

export default TaskTextInput;