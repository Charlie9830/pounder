import React from 'react';
import sizeMe from 'react-sizeme';
import { withStyles } from '@material-ui/core';
import '../assets/css/react-grid-layout/styles.css';
var ReactGridLayout = require('react-grid-layout');

let styles = theme => {
    return {
        rgl: {
            width: '100%',
            height: '100%',
        }
    }
}


class RGLWrapper extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
    }

    render() {
        let { classes } = this.props;

        return (
            <ReactGridLayout
            className={classes['rgl']}
            draggableHandle=".rgl-drag-handle"
            layout={this.props.layout}
            autoSize={false}
            draggableCancel=".nonDraggable"
            cols={20} 
            rows={11}
            rowHeight={60}
            width={this.props.size.width} /* Size Prop passed from sizeMeHOC */ 
            onDragStop={this.handleLayoutChange}
            onResizeStop={this.handleLayoutChange}
            isDraggable={this.props.rglDragEnabled}
            isResizable={this.props.rglDragEnabled}>
                {this.props.children}
            </ReactGridLayout>
        )
    }

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts);
    }
}

// Set refreshMode to debounce otherwise Sidebar animations dont trigger width changes correctly.
const sizeMeHOC = sizeMe({ refreshMode: "debounce", noPlaceholder: true});
const TaskListGrid = sizeMeHOC(RGLWrapper);

export default withStyles(styles)(TaskListGrid);