import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';

class Panel extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.scrollContainerRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isLoadingComments === true && this.props.isLoadingComments === false && this.scrollContainerRef.current !== null) {
            setTimeout(() => {
                let element = this.scrollContainerRef.current;
                element.scroll({
                    top: element.scrollHeight,
                    left: 0,
                    behaviour: 'smooth'
                })
            }, 0);
        }
    }
    
    render() {
        if (this.props.isLoadingComments) {
            return (
                <div style={this.props.spinnerContainerStyle}>
                    <CircularProgress />
                </div>
            )
        }
    
        return (
            <div
            ref={this.scrollContainerRef}
             style={this.props.commentContainerStyle}>
                {this.props.children}
            </div>
        );
    }
}

export default Panel;