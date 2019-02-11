import React from 'react';
import Button from '../Button';
import TextareaAutosize from 'react-autosize-textarea';
import '../../assets/css/CommentPanel/CommentPanelInput.css';
import PostCommentIcon from '../../assets/icons/PostCommentIcon.svg';

class CommentPanelInput extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isPostCommentButtonEnabled: false,
        }

        // Refs.
        this.textareaRef = null;

        // Method Bindings.
        this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this);
        this.handleCommentInputKeyPress = this.handleCommentInputKeyPress.bind(this);
        this.postComment = this.postComment.bind(this);
        this.handleCommentInputChange = this.handleCommentInputChange.bind(this);
    }

    render() {
        return (
                <div className="TaskCommentInputGrid">
                    <div className="TaskCommentInputTextContainer">
                        <TextareaAutosize className="TaskCommentInputTextArea"
                        innerRef={(textArea) => { this.textareaRef = textArea }}
                        placeholder="Add a comment..."
                        maxRows={6}
                        onKeyPress={this.handleCommentInputKeyPress}
                        onChange={this.handleCommentInputChange}/>
                    </div>

                    <div className="TaskCommentInputButtonContainer">
                        <Button iconSrc={PostCommentIcon} size="small" onClick={this.handleCommentButtonClick}
                        isEnabled={this.state.isPostCommentButtonEnabled}/>
                    </div>
                </div>
        )
    }

    handleCommentInputKeyPress(e) {
        if (e.key === "Enter" && e.shiftKey !== true) {
            this.postComment();
        }
    }

    handleCommentInputChange(e) {
        var value = this.textareaRef.value;
        this.setState({ isPostCommentButtonEnabled: value.trim().length > 0 });
    }

    handleCommentButtonClick() {
        this.postComment();
    }

    postComment() {
        if (this.autocompleteTextAreaRefTextAreaRef !== null) {
            var value = this.textareaRef.value;
            if (value.trim() !== "") {
                this.props.onNewComment(value);
                this.textareaRef.blur();
                this.textareaRef.value = "";
            }
        }
    }
}

export default CommentPanelInput;