import React from 'react';
import '../assets/css/TaskText.css'
import TextareaAutosize from 'react-autosize-textarea';

class TaskTextInput extends React.Component {
    constructor(props) {
        super(props);

        this.hasEnterKeyBeenPressed = false;
        this.isEscaping = false;

        // Method Bindings
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        // Pull Keyboard Focus.
        this.textarea.focus();
    }

    componentWillUnmount() {
        if (this.hasEnterKeyBeenPressed === false && this.isEscaping === false) {
            // Ensure the new data will be forwarded when the user elects to Click away from the input as opposed to pressing Enter.
            this.props.onComponentUnmounting(this.textarea.value); 
        }
    }

    render() {
        return (
            <TextareaAutosize className="TaskTextInput" innerRef={ref => this.textarea = ref} type='text' defaultValue={this.props.defaultValue}
             onKeyPress={this.handleKeyPress} onBlur={this.handleInputBlur} onKeyDown={this.handleKeyDown}/>
        )
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.hasEnterKeyBeenPressed = true;
        }
        this.props.onKeyPress(e, this.textarea.value);
    }

    handleKeyDown(e) {
        if (e.key === "Escape") {
            this.isEscaping = true;
            this.props.onComponentUnmounting(this.props.defaultValue);
        }
    } 

    handleInputBlur() {
        this.props.onComponentUnmounting(this.textarea.value);
    }
}

export default TaskTextInput;