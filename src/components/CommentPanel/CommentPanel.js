import React, { Component } from 'react';
import Moment from 'moment';
import CommentInput from './CommentInput';
import ShowMoreButton from './ShowMoreButton';
import Comment from './Comment';
import SwipeableListItem from '../SwipeableListItem/SwipeableListItem';
import TransitionList from '../TransitionList/TransitionList';
import ListItemTransition from '../TransitionList/ListItemTransition';
import { getUserUid } from 'handball-libs/libs/pounder-firebase';
import { withTheme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from './Panel';


let gridStyle = {
    width: '100%',
    height: 'calc(100% - 16px)',
    display: 'grid',
    gridTemplateRows: '[Panel]1fr [Input]auto',
    marginTop: '8px',
    marginBotom: '8px',
}

let commentContainerStyle = {
    gridRow: 'Panel',
    placeSelf: 'stretch stretch',
    overflowY: 'scroll',
    padding: '0px 8px 0px 8px',
}

let spinnerContainerStyle = {
    ...commentContainerStyle,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}

class CommentPanel extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.panelRef = React.createRef();

        // Method Bindings.
        this.getCommentsJSX = this.getCommentsJSX.bind(this);
    }

    render() {
        return (
            <div style={gridStyle}>
                <Panel 
                spinnerContainerStyle={spinnerContainerStyle}
                commentContainerStyle={commentContainerStyle}
                isLoadingComments={this.props.isLoadingComments}>
                    <TransitionList>
                        {this.getCommentsJSX()}
                    </TransitionList>
                </Panel>
                    

                <div style={{gridRow: 'Input', placeSelf: 'stretch stretch'}}>
                    <CommentInput 
                    autoFocus={this.props.autoFocus}
                    onPost={this.props.onCommentPost}/>
                </div>
            </div>
        );
    }

    getCommentsJSX() {
        let sortedComments = this.props.comments.slice().sort(this.commentSorter);

        let jsx = sortedComments.map( item => {
            let canDelete = item.createdBy === getUserUid();
            let timeAgo = Moment(item.created).fromNow();
            let isUnread = !item.seenBy.some(item => { return item === getUserUid() })

            let rightActions = canDelete === true && !this.props.disableInteraction ?
            [ { value: 'delete', background: this.props.theme.palette.error.dark, icon: <DeleteIcon/> }] :
            null;

            return (
                <ListItemTransition
                key={item.uid}>
                    <SwipeableListItem
                        rightActions={rightActions}
                        onActionClick={(action) => { this.props.onCommentDelete(item.uid) }}>
                        <Comment
                            disableSyncStatus={this.props.disableSyncStatus}
                            text={item.text}
                            timeAgo={timeAgo}
                            displayName={item.displayName}
                            isUnread={isUnread}
                            isSynced={item.isSynced}
                        />
                    </SwipeableListItem>
                </ListItemTransition>
            )
        })

        if (this.props.disableShowMoreButton !== true) {
            jsx.unshift(
                <ListItemTransition
                key="showmorebutton">
                    <ShowMoreButton
                        isLoadingMore={this.props.isPaginating}
                        hasMoreComments={!this.props.isAllLoaded}
                        onClick={this.props.onPaginateComments} />
                </ListItemTransition>
            )
        }
        
        return jsx;
    }

    commentSorter(a,b) {
        var createdA = new Date(a.created);
        var createdB = new Date(b.created);
        return createdA - createdB;
    }
}

export default withTheme()(CommentPanel);