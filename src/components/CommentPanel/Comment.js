import React from 'react';
import '../../assets/css/CommentPanel/Comment.css';

class Comment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
        }

        // Method Bindings.
        this.handleContainerMouseEnter = this.handleContainerMouseEnter.bind(this);
        this.handleContainerMouseLeave = this.handleContainerMouseLeave.bind(this);
        this.getDeleteButtonJSX = this.getDeleteButtonJSX.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    render() {
        var deleteButtonJSX = this.getDeleteButtonJSX();
        var timeAgo = this.props.isSynced ? this.props.timeAgo : "Not Synced";

        return (
            <div className="TaskCommentContainer" data-isunread={this.props.isUnread}
            onMouseEnter={this.handleContainerMouseEnter} onMouseLeave={this.handleContainerMouseLeave} >
                {/* Header  */} 
                <div className="TaskCommentHeaderContainer">
                    <div className="TaskCommentHeaderGrid">
                        {/* Display Name  */} 
                        <div className="TaskCommentDisplayNameContainer">
                            <div className="TaskCommentDisplayName">
                                {this.props.displayName}
                            </div>
                        </div>

                        {/* Time Ago  */} 
                        <div className="TaskCommentTimeAgoContainer">
                            <div className="TaskCommentTimeAgo">
                                {timeAgo}
                            </div>
                        </div>

                        {/* Delete Button */}
                        {deleteButtonJSX}
                    </div>
                </div>

                {/* Comment Text  */} 
                <div className="TaskCommentTextContainer">
                    <div className="TaskCommentText">
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }

    getDeleteButtonJSX() {
        if (this.props.canDelete && this.state.isMouseOver) {
            return (
                <div className="TaskCommentDeleteButtonContainer" onClick={this.handleDeleteButtonClick}>
                    <div className="TaskCommentDeleteButton"> X </div>
                </div>
            )
        }
    }

    handleDeleteButtonClick() {
        this.props.onDeleteButtonClick(this.props.uid);
    }

    handleContainerMouseEnter() {
        this.setState({isMouseOver: true});
    }

    handleContainerMouseLeave() {
        this.setState({isMouseOver: false});
    }
}

export default Comment;