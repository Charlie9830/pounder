import React from 'react';
import { connect } from 'react-redux';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import Calendar from './Calendar';
import CommentPanel from './CommentPanel/CommentPanel';
import TaskMetadata from './TaskMetadata';
import MenuSubtitle from './MenuSubtitle';
import '../assets/css/TaskInspector.css';
import CrossIcon from '../assets/icons/CrossIcon.svg';
import { updateTaskDueDateAsync, updateTaskPriorityAsync, updateTaskAssignedToAsync,
postNewCommentAsync, paginateTaskCommentsAsync, deleteTaskCommentAsync,
updateTaskNoteAsync, closeTaskInspectorAsync} from 'handball-libs/libs/pounder-redux/action-creators';

class TaskInspector extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.noteInputTextAreaRef = React.createRef();

        // Method Bindings.
        this.extractSelectedTask = this.extractSelectedTask.bind(this);
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
        this.handleTaskPriorityToggleClick = this.handleTaskPriorityToggleClick.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handlePaginateTaskCommentsRequest = this.handlePaginateTaskCommentsRequest.bind(this);
        this.handleNoteInputBlur = this.handleNoteInputBlur.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
        this.handleTaskCommentDelete = this.handleTaskCommentDelete.bind(this);
    }

    render() {
        var selectedTaskEntity = this.extractSelectedTask();
        
        var dueDate = selectedTaskEntity.dueDate;
        var isHighPriority = selectedTaskEntity.isHighPriority;
        var note = selectedTaskEntity.note === undefined ? "" : selectedTaskEntity.note;
        var metadata = selectedTaskEntity.metadata;
        var assignedTo = selectedTaskEntity.assignedTo === undefined ? "" : selectedTaskEntity.assignedTo;

        var selectedProjectMembers = this.props.members.filter(item => {
            return item.project === this.props.selectedProjectId
        });

        return (
            <OverlayMenuContainer onOutsideChildBoundsClick={this.handleOutsideChildBoundsClick}>
                <div className="TaskInspector">
                    <div className="TaskInspectorGrid">
                        {/* Toolbar  */}
                        <div className="TaskInspectorToolbarContainer">
                            <img className="TaskInspectorCloseIcon" src={CrossIcon} onClick={this.handleCloseButtonClick} />
                        </div>

                        {/* Calendar  */}
                        <div className="TaskInspectorCalendarContainer">
                            <MenuSubtitle text="Properties" showDivider={false}/>
                            <Calendar dueDate={dueDate} onNewDateSubmit={this.handleNewDateSubmit} projectMembers={selectedProjectMembers}
                                isHighPriority={isHighPriority} onPriorityToggleClick={this.handleTaskPriorityToggleClick}
                                onAssignToMember={this.handleAssignToMember} assignedTo={assignedTo} />
                        </div>

                        {/* Comments  */}
                        <div className="TaskInspectorCommentPanelContainer">
                            <MenuSubtitle text="Comments" showDivider={false}/>
                            <CommentPanel taskComments={this.props.taskComments} onNewComment={this.handleNewComment}
                                isGettingTaskComments={this.props.isGettingTaskComments}
                                onPaginateCommentsRequest={this.handlePaginateTaskCommentsRequest}
                                isAllTaskCommentsFetched={this.props.isAllTaskCommentsFetched}
                                onDeleteButtonClick={this.handleTaskCommentDelete} />
                        </div>

                        {/* Notes */}
                        <div className="TaskInspectorNotesContainer">
                            <MenuSubtitle text="Note" showDivider={false}/>
                            <textarea className="TaskNotePanel" ref={this.noteInputTextAreaRef} onBlur={this.handleNoteInputBlur}
                                defaultValue={note} placeholder="Add Details" />
                        </div>

                        {/* Metadata */}
                        <div className="TaskInspectorMetadataContainer">
                            <MenuSubtitle text="Info" showDivider={false}/>
                            <TaskMetadata metadata={metadata} />
                        </div>
                    </div>
                </div>
            </OverlayMenuContainer>
        )
    }

    handleCloseButtonClick() {
        this.props.dispatch(closeTaskInspectorAsync());
    }

    extractSelectedTask() {
        return this.props.tasks.find(item => {
            return item.uid === this.props.openTaskInspectorId;
        })
    }

    handleNewDateSubmit(newDate, oldDate) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskDueDateAsync(taskId, newDate, oldDate));
        this.props.dispatch(closeTaskInspectorAsync());
    }

    handleTaskPriorityToggleClick(newValue, oldValue) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskPriorityAsync(taskId, newValue, oldValue));
        this.props.dispatch(closeTaskInspectorAsync());
        
    }

    handleAssignToMember(newUserId, oldUserId, taskId) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskAssignedToAsync(newUserId, oldUserId, taskId));
        this.props.dispatch(closeTaskInspectorAsync());
    }

    handleNewComment(value) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(postNewCommentAsync(taskId, value));
    }

    handlePaginateTaskCommentsRequest(taskId) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(paginateTaskCommentsAsync(taskId));
    }

    handleTaskCommentDelete(commentId) {
        var taskId = this.props.openTaskInspectorId;
        this.props.dispatch(deleteTaskCommentAsync(taskId, commentId));
    }

    handleNoteInputBlur() {
        this.updateNote();
    }

    updateNote() {
        var newValue = this.noteInputTextAreaRef.current.value;
        var oldValue = this.extractSelectedTask().note;
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskNoteAsync(newValue, oldValue, taskId));
    }
}

let mapStateToProps = state => {
    return {
        openTaskInspectorId: state.openTaskInspectorId,
        selectedProjectId: state.selectedProjectId,
        isSelectedProjectRemote: state.isSelectedProjectRemote,
        members: state.members,
        tasks: state.tasks,
        taskComments: state.taskComments,
        isGettingTaskComments: state.isGettingTaskComments,
        isAllTaskCommentsFetched: state.isAllTaskCommentsFetched,
    }
}

let VisibleTaskInspector = connect(mapStateToProps)(TaskInspector);
export default VisibleTaskInspector;