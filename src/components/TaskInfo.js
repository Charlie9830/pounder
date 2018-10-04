import React from 'react';
import MenuSubtitle from './MenuSubtitle';
import CommentPanel from './CommentPanel/CommentPanel';
import TaskMetadata from './TaskMetadata';
import '../assets/css/TaskInfo.css';

class TaskInfo extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.noteInputTextAreaRef = React.createRef();

        // Method Bindings.
        this.handleNoteInputBlur = this.handleNoteInputBlur.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handlePaginateTaskCommentsRequest = this.handlePaginateTaskCommentsRequest.bind(this);
        this.handleTaskCommentDelete = this.handleTaskCommentDelete.bind(this);
    }

    render() {
        var note = this.props.note === undefined ? "" : this.props.note;

        return (
            <div className="TaskInfoContainer">
                <div className="TaskInfoGrid">
                    {/* Notes  */} 
                    <div className="TaskInfoNoteContainer">
                        <MenuSubtitle text="Notes" showDivider={false}/>
                        <textarea className="TaskInfoNote" ref={this.noteInputTextAreaRef} onBlur={this.handleNoteInputBlur}
                         defaultValue={note} placeholder="Enter a note"/>
                    </div>

                    {/* Comments  */} 
                    <div className="TaskInfoCommentsContainer">
                        <MenuSubtitle text="Comments" showDivider={false}/>
                        <CommentPanel taskComments={this.props.taskComments} onNewComment={this.handleNewComment}
                        isGettingTaskComments={this.props.isGettingTaskComments}
                        projectMembersLookup={this.props.projectMembersLookup}
                        projectMembers={this.props.projectMembers}
                        onPaginateCommentsRequest={this.handlePaginateTaskCommentsRequest}
                        isAllTaskCommentsFetched={this.props.isAllTaskCommentsFetched}
                        onDeleteButtonClick={this.handleTaskCommentDelete}/>
                    </div>
                    {/* Metadata  */} 
                    
                    <div className="TaskInfoMetadataContainer">
                        <MenuSubtitle text="Metadata" showDivider={false}/>
                        <TaskMetadata metadata={this.props.metadata}/>
                    </div>
                    
                </div>
            </div>
        )
    }

    handleTaskCommentDelete(commentId) {
        this.props.onTaskCommentDelete(commentId);
    }

    handlePaginateTaskCommentsRequest() {
        this.props.onPaginateTaskCommentsRequest();
    }

    handleNewComment(value) {
        this.props.onNewComment(value);
    }

    handleNoteInputBlur() {
        var newValue = this.noteInputTextAreaRef.current.value;
        this.props.onTaskNoteChange(newValue, this.props.taskNote);
    }
}

export default TaskInfo;