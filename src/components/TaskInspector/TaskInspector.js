import React, { Component } from 'react';
import { Toolbar, IconButton, List, Paper} from '@material-ui/core';
import FullScreenView from '../../layout-components/FullScreenView';
import PriorityToggle from './PriorityToggle';
import { connect } from 'react-redux';

import { updateTaskDueDateAsync, updateTaskPriorityAsync, updateTaskAssignedToAsync,
    postNewCommentAsync, paginateTaskCommentsAsync, deleteTaskCommentAsync,
    updateTaskNoteAsync, closeTaskInspectorAsync, getTaskCommentsAsync, updateTaskNameAsync } from 'handball-libs/libs/pounder-redux/action-creators';

import { GetProjectMembers } from 'handball-libs/libs/pounder-utilities';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DateInputListItem from '../DateInputListItem';
import ExpandingNoteInputListItem from './ExpandingNoteInputListItem';
import ExpandingCommentPanel from '../CommentPanel/ExpandingCommentPanel';
import ExpandingMetadataListItem from './ExpandingMetadataListItem';
import ExpandingAssignmentSelectorListItem from './ExpandingAssignmentSelectorListItem';
import { GetDisplayNameFromLookup } from 'handball-libs/libs/pounder-utilities';
import EditableTextInput from '../EditableTextInput';


let toolbarStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
}

let paperStyle = {
    marginLeft: '8px',
    marginRight: '8px',
    marginBottom: '16px'
}

let NoTaskEntityFallback = (props) => {
    return (
        <FullScreenView>
            <Toolbar>
                <div style={toolbarStyle}>
                    <IconButton onClick={props.onBackArrowClick}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </FullScreenView>
    )
}

class TaskInspector extends Component {  
    render() {
        let task = this.props.openTaskInspectorEntity;

        if (task === null || task === undefined) {
            return (
                <NoTaskEntityFallback
                onBackArrowClick={ () => {this.props.dispatch(closeTaskInspectorAsync())}}/>
            )
        }

        let assignmentInput = (
            <ExpandingAssignmentSelectorListItem
                        members={GetProjectMembers(this.props.members, task.project)}
                        value={GetDisplayNameFromLookup(task.assignedTo, this.props.memberLookup)}
                        onChange={(newValue) => { this.props.dispatch(updateTaskAssignedToAsync(newValue, task.assignedTo, task.uid))}}
                        />
        )

        return (
            <FullScreenView>
                <Toolbar>
                    <div style={toolbarStyle}>
                        <IconButton onClick={ () => { this.props.dispatch(closeTaskInspectorAsync())}}>
                            <ArrowBackIcon />
                        </IconButton>
                        <PriorityToggle 
                        isHighPriority={task.isHighPriority}
                        onToggle={ (newValue) => { this.props.dispatch(updateTaskPriorityAsync(task.uid, newValue, task.isHighPriority))}} />
                    </div>
                </Toolbar>

                <div style={{padding: '8px 8px 16px 8px '}}>
                    <EditableTextInput
                    typographyVariant="body1"
                    defaultValue={task.taskName}
                    onChange={(newValue) => { this.props.dispatch(updateTaskNameAsync(task.uid, newValue, task.taskName, task.metadata))}}/>
                </div>

                <Paper style={paperStyle}>
                    <List>
                        <DateInputListItem 
                        clearable={true}
                        autoOk={true}
                        placeholder="Add due date"
                        value={task.dueDate}
                        onChange={(newValue) => { this.props.dispatch(updateTaskDueDateAsync(task.uid, newValue, task.dueDate))}}
                        />
                        
                        <ExpandingNoteInputListItem
                        placeholder="Add details"
                        value={task.note}
                        onChange={ (newValue) => { this.props.dispatch(updateTaskNoteAsync(newValue, task.note, task.uid))} }/>

                        { this.props.isSelectedProjectRemote && assignmentInput }
                        
                    </List>
                </Paper>

                <Paper style={paperStyle}>
                    <div>
                        <ExpandingCommentPanel
                            previewComments={task.commentPreview}
                            comments={this.props.taskComments}
                            onOpen={ () => { this.props.dispatch(getTaskCommentsAsync(task.uid))}}
                            isLoadingComments={this.props.isGettingTaskComments}
                            isPaginating={this.props.isTaskCommentsPaginating}
                            isAllLoaded={this.props.isAllTaskCommentsFetched}
                            onCommentPost={(text) => { this.props.dispatch(postNewCommentAsync(task.uid, text)) }}
                            onCommentDelete={(commentId) => { this.props.dispatch(deleteTaskCommentAsync(task.uid, commentId)) }}
                            onPaginateComments={() => { this.props.dispatch(paginateTaskCommentsAsync(task.uid)) }}
                        />
                    </div>
                </Paper>

                <Paper style={paperStyle}>
                    <List>
                        <ExpandingMetadataListItem metadata={task.metadata}/>
                    </List>
                </Paper>
            </FullScreenView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        openTaskInspectorId: state.openTaskInspectorId,
        openTaskInspectorEntity: state.openTaskInspectorEntity,
        taskComments: state.taskComments,
        isGettingTaskComments: state.isGettingTaskComments,
        memberLookup: state.memberLookup,
        members: state.members,
        isSelectedProjectRemote: state.isSelectedProjectRemote,
        isAllTaskCommentsFetched: state.isAllTaskCommentsFetched,
        isTaskCommentsPaginating: state.isTaskCommentsPaginating,
    }
}

let VisibleTaskInspector = connect(mapStateToProps)(TaskInspector);
export default VisibleTaskInspector;