import React from 'react';
import { connect } from 'react-redux';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import Calendar from './Calendar';
import CommentPanel from './CommentPanel/CommentPanel';
import TaskMetadata from './TaskMetadata';
import MenuSubtitle from './MenuSubtitle';
import '../assets/css/TaskInspector.css';
import { updateTaskDueDateAsync, updateTaskPriorityAsync, updateTaskAssignedToAsync,
postNewCommentAsync, paginateTaskCommentsAsync, deleteTaskCommentAsync,
updateTaskNoteAsync, 
setOpenTaskInspectorId} from 'handball-libs/libs/pounder-redux/action-creators';

class TaskInspector extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.noteInputTextAreaRef = React.createRef();

        // Method Bindings.
        this.extractSelectedTask = this.extractSelectedTask.bind(this);
        this.getProjectMembers = this.getProjectMembers.bind(this);
        this.buildProjectMembersLookup = this.buildProjectMembersLookup.bind(this);
        this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
        this.handleTaskPriorityToggleClick = this.handleTaskPriorityToggleClick.bind(this);
        this.handleAssignToMember = this.handleAssignToMember.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handlePaginateTaskCommentsRequest = this.handlePaginateTaskCommentsRequest.bind(this);
        this.handleNoteInputBlur = this.handleNoteInputBlur.bind(this);
        this.handleOutsideChildBoundsClick = this.handleOutsideChildBoundsClick.bind(this);
        this.updateNote = this.updateNote.bind(this);
    }

    render() {        
        var selectedTaskEntity = this.extractSelectedTask();
        
        var dueDate = selectedTaskEntity.dueDate;
        var isHighPriority = selectedTaskEntity.isHighPriority;
        var note = selectedTaskEntity.note === undefined ? "" : selectedTaskEntity.note;
        var metadata = selectedTaskEntity.metadata;

        var projectMembers = this.getProjectMembers();
        var projectMembersLookup = this.buildProjectMembersLookup(projectMembers);

        return (
            <OverlayMenuContainer onOutsideChildBoundsClick={this.handleOutsideChildBoundsClick}>
                <div className="TaskInspector">
                    <div className="TaskInspectorGrid">
                        {/* Calendar  */}
                        <div className="TaskInspectorCalendarContainer">
                            <MenuSubtitle text="Properties"/>
                            <Calendar dueDate={dueDate} onNewDateSubmit={this.handleNewDateSubmit} projectMembers={projectMembers}
                                isHighPriority={isHighPriority} onPriorityToggleClick={this.handleTaskPriorityToggleClick}
                                onAssignToMember={this.handleAssignToMember} assignedTo={this.props.assignedTo} />
                        </div>

                        {/* Comments  */}
                        <div className="TaskInspectorCommentPanelContainer">
                            <MenuSubtitle text="Comments"/>
                            <CommentPanel taskComments={this.props.taskComments} onNewComment={this.handleNewComment}
                                isGettingTaskComments={this.props.isGettingTaskComments}
                                projectMembersLookup={projectMembersLookup}
                                projectMembers={projectMembers}
                                onPaginateCommentsRequest={this.handlePaginateTaskCommentsRequest}
                                isAllTaskCommentsFetched={this.props.isAllTaskCommentsFetched}
                                onDeleteButtonClick={this.handleTaskCommentDelete} />
                        </div>

                        {/* Notes */}
                        <div className="TaskInspectorNotesPanelContainer">
                            <MenuSubtitle text="Notes"/>
                            <textarea className="TaskNotePanel" ref={this.noteInputTextAreaRef} onBlur={this.handleNoteInputBlur}
                                defaultValue={note} placeholder="Enter a note" />
                        </div>

                        {/* Metadata */}
                        <div className="TaskInspectorMetadataContainer">
                            <MenuSubtitle text="Info"/>
                            <TaskMetadata metadata={metadata} />
                        </div>
                    </div>
                </div>
            </OverlayMenuContainer>
        )
    }

    handleOutsideChildBoundsClick() {
        this.props.dispatch(setOpenTaskInspectorId(-1));
    }

    getProjectMembers() {
        if (this.props.isSelectedProjectRemote) {
            // Filter Members.
            return this.props.members.filter(item => {
                return item.project === this.props.selectedProjectId;
            })
        }

        else {
            return [];
        }
    }

    buildProjectMembersLookup(filteredMembers) {
        var lookup = {};
        filteredMembers.forEach(member => {
            lookup[member.userId] = member.displayName;
        })

        return lookup;
    }

    extractSelectedTask() {
        return this.props.tasks.find(item => {
            return item.uid === this.props.openTaskInspectorId;
        })
    }

    handleNewDateSubmit(newDate, oldDate) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskDueDateAsync(taskId, newDate, oldDate));
    }

    handleTaskPriorityToggleClick(newValue, oldValue) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskPriorityAsync(taskId, newValue, oldValue));
    }

    handleAssignToMember(newUserId, oldUserId, taskId) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(updateTaskAssignedToAsync(newUserId, oldUserId, taskId));
    }

    handleNewComment(value) {
        var taskId = this.props.openTaskInspectorId;
        var projectMembers = this.getProjectMembers();

        this.props.dispatch(postNewCommentAsync(taskId, value, projectMembers));
    }

    handlePaginateTaskCommentsRequest(taskId) {
        var taskId = this.props.openTaskInspectorId;

        this.props.dispatch(paginateTaskCommentsAsync(taskId));
    }

    handleTaskCommentDelete(taskId, commentId) {
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