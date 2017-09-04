import React from 'react';

class TaskTextInput extends React.Component {
    constructor(props) {
        super(props);

        this.hasEnterKeyBeenPressed = false;

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentWillUnmount() {
        if (this.hasEnterKeyBeenPressed === false) {
            this.props.onComponentUnmounting(this.refs.input.value); // Data change would have already have been handled.
        }
    }

    render() {
        return (
            <input ref="input" type='text' defaultValue={this.props.defaultValue} onKeyPress={this.handleKeyPress}/>
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