import React, { Component } from 'react';
import CommentPanel from './CommentPanel';
import Expander from '../Expander';

class ExpandingCommentPanel extends Component {
    constructor(props) {
        super(props);
        // State
        this.state = {
            isOpen: false,
        }

        // Method Bindings.
        this.handleContainerClick = this.handleContainerClick.bind(this);
    }
    

    render() {
        // Comment Preview
        let closedComponent = (
            <CommentPanel
                onCommentPost={ () => {} }
                disableInteraction={true}
                disableSyncStatus={true}
                comments={this.props.previewComments}
                isLoadingComments={false}
                isPaginating={false}
                disableShowMoreButton={true}
                disableCommentDelete={true}/>
        )

        let openComponent = (
            <CommentPanel
                autoFocus={true}
                {...this.props} />
        )

        return (
            <div
            style={{padding: '8px'}}
            onClick={this.handleContainerClick}>
                <Expander
                    open={this.state.isOpen}
                    onClose={() => { this.setState({ isOpen: false }) }}
                    closedComponent={closedComponent}
                    openComponent={openComponent}/>
            </div>
        );
    }

    handleContainerClick(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.state.isOpen === false) {
            this.setState({ isOpen: true })
            
            if (this.props.onOpen !== undefined) {
                this.props.onOpen();
            }
        }  
    }
}

export default ExpandingCommentPanel;