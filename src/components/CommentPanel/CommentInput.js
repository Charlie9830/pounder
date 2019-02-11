import React, { Component } from 'react';
import { TextField, IconButton } from '@material-ui/core';

import CommentIcon from '@material-ui/icons/Comment';

let gridStyle = {
    display: 'grid',
    gridTemplateColumns: '[TextInput]1fr [Button]64px',
}

class NakedCommentInput extends Component {
    constructor(props) {
        super(props);
        
        // Refs
        this.textFieldRef = React.createRef();

        // Method Bindings.
        this.handlePostComment = this.handlePostComment.bind(this);

    }
    
    render() {
        return (
            <div 
            ref={this.props.forwardedRef} 
            style={gridStyle}>
                <div style={{gridColumn: 'TextInput', placeSelf: 'stretch stretch'}}>
                    <TextField
                    autoFocus={this.props.autoFocus}
                    style={{width: '100%', marginLeft: '8px', marginRight: '8px'}}
                    variant="outlined"
                    inputRef={this.textFieldRef}
                    multiline
                    placeholder="Add a comment"
                    onKeyUp={(e) => { if (e.key === "Enter") this.handlePostComment() }}
                    />
                </div>

                <div style={{gridColumn: 'Button', placeSelf: 'center center'}}>
                    <IconButton onClick={this.handlePostComment}>
                        <CommentIcon/>
                    </IconButton>
                </div>
                
            </div>
        );
    }

    handlePostComment() {
        let value = this.textFieldRef.current.value;
        this.textFieldRef.current.value = "";
        
        this.props.onPost(value);
    }
}

const CommentInput = React.forwardRef( (props, ref) => {
    return <NakedCommentInput { ...props } forwardedRef={ref}/> 
})

export default CommentInput;