import React from 'react';
import '../../assets/css/CommentPanel/Comment.css';
import DeleteCommentIcon from '../../assets/icons/DeleteCommentIcon.svg';

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
            <div className="CommentContainer" data-isunread={this.props.isUnread}
            onMouseEnter={this.handleContainerMouseEnter} onMouseLeave={this.handleContainerMouseLeave} >
                {/* Header  */} 
                <div className="CommentHeaderContainer">
                    <div className="CommentHeaderGrid">
                        {/* Display Name  */} 
                        <div className="CommentDisplayNameContainer">
                            <div className="CommentDisplayName">
                                {this.props.displayName}
                            </div>
                        </div>

                        {/* Time Ago  */} 
                        <div className="CommentTimeAgoContainer">
                            <div className="CommentTimeAgo">
                                {timeAgo}
                            </div>
                        </div>

                        {/* Delete Button */}
                        {deleteButtonJSX}
                    </div>
                </div>

                {/* Comment Text  */} 
                <div className="CommentTextContainer">
                    <div className="CommentText">
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }

    getDeleteButtonJSX() {
        if (this.props.canDelete && this.state.isMouseOver) {
            return (
                <div className="CommentDeleteButtonContainer" onClick={this.handleDeleteButtonClick}>
                    <img className="CommentDeleteButton" src={DeleteCommentIcon}/>
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