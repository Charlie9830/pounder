import React, { Component } from 'react';
import CommentPanel from './CommentPanel';
import Expander from '../Expander';

class ExpandingCommentPanel extends Component {
    constructor(props) {
        super(props);
        
        // Refs
        this.anchorRef = React.createRef();

        // State
        this.state = {
            isOpen: false,
        }

        // Method Bindings.
        this.handleContainerClick = this.handleContainerClick.bind(this);
    }
    

    render() {
        return (
            <div 
            ref={this.anchorRef}
            style={{padding: '8px'}}
            onClick={this.handleContainerClick}>
                {/* Preview Comment */} 
                <CommentPanel
                onCommentPost={ () => {} }
                disableInteraction={true}
                disableSyncStatus={true}
                comments={this.props.previewComments}
                isLoadingComments={false}
                isPaginating={false}
                disableShowMoreButton={true}/>

                <Expander
                    open={this.state.isOpen}
                    anchorEl={this.anchorRef.current}
                    onClose={() => { this.setState({ isOpen: false }) }}>
                    {/* Full Comments  */} 
                    <CommentPanel 
                    autoFocus={true}
                    {...this.props} />
                </Expander>
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