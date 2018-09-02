import React from 'react';
import Moment from 'moment';
import MenuSubtitle from './MenuSubtitle';
import TaskCommentInput from './TaskCommentInput';
import TaskComment from './TaskComment';
import CenteringContainer from '../containers/CenteringContainer';
import Spinner from './Spinner';
import { getDisplayNameFromLookup } from 'handball-libs/libs/pounder-utilities';
import { getUserUid } from 'handball-libs/libs/pounder-firebase';
import '../assets/css/TaskCommentPanel.css';

class TaskCommentPanel extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getTaskCommentsJSX = this.getTaskCommentsJSX.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
    }

    render() {
        var taskCommentsJSX = this.getTaskCommentsJSX();

        return (
            <div className="TaskCommentPanelGrid">
                <div className="TaskCommentPanelCommentsContainer">
                    {taskCommentsJSX}
                </div>
                <div className="TaskCommentPanelInputContainer">
                    <TaskCommentInput projectMembers={this.props.projectMembers} onNewComment={this.handleNewComment}/>
                </div>
            </div>
        )
    }

    getTaskCommentsJSX() {
        if (this.props.isGettingTaskComments === true) {
            return (
                <div className="TaskCommentPanelSpinnerContainer">
                    <CenteringContainer>
                        <Spinner size="small"/>
                    </CenteringContainer>
                </div>
            )
        }

        var taskComments = [];
        if (this.props.taskComments !== undefined) { taskComments = this.props.taskComments };

        var sortedTaskComments = taskComments.sort(this.taskCommentSorter);

        var taskCommentsJSX = sortedTaskComments.map(item => {
            var displayName = getDisplayNameFromLookup(this.props.projectMembersLookup, item.createdBy);
            var timeAgo = Moment(item.created).fromNow();
            var isUnread = !item.seenBy.some(item => { return item === getUserUid()})

            return (
                <TaskComment key={item.uid} text={item.text} timeAgo={timeAgo} createdBy={item.createdBy}
                displayName={displayName} isUnread={isUnread}/>
            )
        })

        return taskCommentsJSX;
    }

    taskCommentSorter(a,b) {
        var createdA = new Date(a.created);
        var createdB = new Date(b.created);
        return createdB - createdA;
    }

    handleNewComment(value) {
        this.props.onNewComment(value);
    }
}

export default TaskCommentPanel;