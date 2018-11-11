import React from 'react';
import Moment from 'moment';
import CommentPanelInput from './CommentPanelInput';
import Comment from './Comment';
import ShowMoreButton from './ShowMoreButton';
import CenteringContainer from '../../containers/CenteringContainer';
import Spinner from '../Spinner';
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
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.taskComments !== undefined &&
            prevProps.taskComments.length !== this.props.taskComments.length &&
            this.props.taskComments.length !== 0) {
            // Scroll Latest Message into View.
            this.latestCommentScrollTarget.current.scrollIntoView();
        }
    }

    render() {
        var taskCommentsJSX = this.getTaskCommentsJSX();

        return (
            <div className="CommentPanelGrid">
                <div className="CommentPanelCommentsContainer">
                    {taskCommentsJSX}
                </div>
                
                <div className="CommentPanelInputContainer">
                    <CommentPanelInput onNewComment={this.handleNewComment}/>
                </div>
            </div>
        )
    }

    getTaskCommentsJSX() {
        var taskComments = this.props.taskComments === undefined ? [] : [...this.props.taskComments];

        if (this.props.isGettingTaskComments === false && taskComments.length === 0) {
            return (
                <CenteringContainer>
                    <div className="CommentPanelNote">
                        No Comments
                    </div>
                </CenteringContainer>
            )
        }

        if (this.props.isGettingTaskComments === true) {
            return (
                <div className="CommentPanelSpinnerContainer">
                    <CenteringContainer>
                        <Spinner size="medium"/>
                    </CenteringContainer>
                </div>
            )
        }

        
        var sortedTaskComments = taskComments.sort(this.taskCommentSorter);
        
        var taskCommentsJSX = sortedTaskComments.map(item => {
            var canDelete = item.createdBy === getUserUid();
            var timeAgo = Moment(item.created).fromNow();
            var isUnread = !item.seenBy.some(item => { return item === getUserUid() })

            return (
                <Comment key={item.uid} uid={item.uid} text={item.text} timeAgo={timeAgo} createdBy={item.createdBy}
                displayName={item.displayName} isUnread={isUnread} canDelete={canDelete} isSynced={item.isSynced}
                onDeleteButtonClick={this.handleDeleteButtonClick}/>
            )
        })

        // Append a scroll Target invisible Component.
        taskCommentsJSX.push((<div key="scroll" ref={this.latestCommentScrollTarget}/>))

        // Prepend the Show More button.
        taskCommentsJSX.unshift((<ShowMoreButton key="0" onClick={this.handleShowMoreButtonClick}
        isAllCommentsFetched={this.props.isAllTaskCommentsFetched} isPaginating={this.props.isPaginating}/>));
        
        return taskCommentsJSX;
    }

    handleDeleteButtonClick(commentId) {
        this.props.onDeleteButtonClick(commentId);
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