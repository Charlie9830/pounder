import React from 'react';
import Moment from 'moment';
import CommentPanelInput from './CommentPanelInput';
import Comment from './Comment';
import ShowMoreButton from './ShowMoreButton';
import CenteringContainer from '../../containers/CenteringContainer';
import Spinner from '../Spinner';
import { getDisplayNameFromLookup } from 'handball-libs/libs/pounder-utilities';
import { getUserUid, TaskCommentQueryLimit } from 'handball-libs/libs/pounder-firebase';
import '../../assets/css/CommentPanel/CommentPanel.css';

class CommentPanel extends React.Component {
    constructor(props) {
        super(props);

        // Refs
        this.latestCommentScrollTarget = React.createRef();

        // Method Bindings.
        this.getTaskCommentsJSX = this.getTaskCommentsJSX.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handleShowMoreButtonClick = this.handleShowMoreButtonClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.taskComments.length !== this.props.taskComments.length) {
            // Scroll Latest Message into View.
            this.latestCommentScrollTarget.current.scrollIntoView();
        }
    }

    render() {
        var taskCommentsJSX = this.getTaskCommentsJSX();

        return (
            <div className="TaskCommentPanelGrid">
                <div className="TaskCommentPanelCommentsContainer">
                    {taskCommentsJSX}
                </div>
                <div className="TaskCommentPanelInputContainer">
                    <CommentPanelInput projectMembers={this.props.projectMembers} onNewComment={this.handleNewComment}/>
                </div>
            </div>
        )
    }

    getTaskCommentsJSX() {
        if (this.props.isGettingTaskComments === true) {
            return (
                <div className="TaskCommentPanelSpinnerContainer">
                    <CenteringContainer>
                        <Spinner size="medium"/>
                    </CenteringContainer>
                </div>
            )
        }

        var taskComments = this.props.taskComments === undefined ? [] : [...this.props.taskComments];
        var sortedTaskComments = taskComments.sort(this.taskCommentSorter);
        
        var taskCommentsJSX = sortedTaskComments.map(item => {
            var canDelete = item.createdBy === getUserUid();
            var displayName = getDisplayNameFromLookup(this.props.projectMembersLookup, item.createdBy);
            var timeAgo = Moment(item.created).fromNow();
            var isUnread = !item.seenBy.some(item => { return item === getUserUid()})

            return (
                <Comment key={item.uid} text={item.text} timeAgo={timeAgo} createdBy={item.createdBy}
                displayName={displayName} isUnread={isUnread} canDelete={canDelete}/>
            )
        })

        // Append a scroll Target invisible Component.
        taskCommentsJSX.push((<div key="scroll" ref={this.latestCommentScrollTarget}/>))

        // Prepend the Show More button.
        taskCommentsJSX.unshift((<ShowMoreButton key="0" onClick={this.handleShowMoreButtonClick}
        isAllCommentsFetched={this.props.isAllTaskCommentsFetched}/>));
        
        return taskCommentsJSX;
    }

    handleShowMoreButtonClick() {
        this.props.onPaginateCommentsRequest();
    }

    taskCommentSorter(a,b) {
        var createdA = new Date(a.created);
        var createdB = new Date(b.created);
        return createdA - createdB;
    }

    handleNewComment(value) {
        this.props.onNewComment(value);
    }
}

export default CommentPanel;