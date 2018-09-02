import React from 'react';
import '../assets/css/TaskComment.css';

class TaskComment extends React.Component {
    render() {
        return (
            <div className="TaskCommentContainer" data-isunread={this.props.isUnread}>
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
                                {this.props.timeAgo}
                            </div>
                        </div>
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
}

export default TaskComment;