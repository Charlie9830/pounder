import React from 'react';
import sizeMe from 'react-sizeme';
var ReactGridLayout = require('react-grid-layout');

class RGLWrapper extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
    }

    render() {
        return (
            <ReactGridLayout className={this.props.rglClassName} layout={this.props.layout} autoSize={false} draggableCancel=".nonDraggable"
                cols={20} rows={11} rowHeight={60} width={this.props.size.width} /* Size Prop passed from sizeMeHOC */ 
                onDragStop={this.handleLayoutChange} onResizeStop={this.handleLayoutChange}
                isDraggable={this.props.rglDragEnabled} isResizable={this.props.rglDragEnabled}
                >
                {this.props.children}
            </ReactGridLayout>
        )
    }

    handleLayoutChange(layouts, oldItem, newItem, e, element) {
        this.props.onLayoutChange(layouts);
    }
}

const sizeMeHOC = sizeMe({ refreshMode: "debounce", noPlaceholder: true}); // refreshMode set to debounce other Sidebar anitations dont trigger 
// width changes correctly.
const TaskListWidgetGrid = sizeMeHOC(RGLWrapper);

export default TaskListWidgetGrid;