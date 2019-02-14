import React, { Component } from 'react';
import Divider from './Divider';
import { withTheme } from '@material-ui/core';
import withMouseOver from '../Hocs/withMouseOver';
import TaskSecondaryActions from './TaskSecondaryActions';
import { DragSource } from 'react-dnd';

class TaskBase extends Component { 
    render() {
        let { theme } = this.props;
        let ContainerGridStyle = {
            width: '100%',
            height: 'fit-content',
            display: 'grid',
            gridTemplateRows: '[Content]1fr [IndicatorPanel]auto [Divider]auto',
            gridTemplateColumns: '[PriorityIndicator]auto [Checkbox]auto [Text]1fr [SecondaryActions]auto [DueDate]auto',
            gridTemplateAreas: `'PriorityIndicator Checkbox       Text           SecondaryActions   DueDate'
                                'PriorityIndicator IndicatorPanel IndicatorPanel IndicatorPanel     IndicatorPanel'
                                '       .               .         Divider        Divider            Divider'`,
            background: this.props.isSelected ? theme.palette.action.selected : 'unset',
        }

        // Override if moving.
        ContainerGridStyle.background = this.props.isMoving ? theme.palette.primary.dark : ContainerGridStyle.background;
        
        let TextContainerStyle = {
            gridArea: 'Text',
            placeSelf: 'center flex-start',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: `${theme.spacing.unit}px 0px ${theme.spacing.unit}px 0px`,
        }

        return this.props.connectDragSource(
            <div
            style={ContainerGridStyle}
            onClick={() => { this.props.onClick('container')}}>
                {/* Priority Indicator  */} 
                <div 
                style={{gridArea: 'PriorityIndicator'}}>
                    { this.props.priorityIndicator }
                </div>

                {/* Checkbox  */} 
                <div
                style={{gridArea: 'Checkbox', placeSelf: 'center'}}>
                    { this.props.checkbox }
                </div>

                {/* Text  */}
                <div 
                 style={TextContainerStyle}>
                    { this.props.taskText }
                </div> 

                {/* Secondary Actions  */} 
                <div
                style={{gridArea: 'SecondaryActions', placeSelf: 'center flex-end'}}>
                    { this.props.mouseOver && 
                        <TaskSecondaryActions
                        onDeleteTaskButtonClick={this.props.onDeleteTaskButtonClick}/> }
                </div>

                {/* DueDate  */}
                <div 
                onClick={() => { this.props.onClick('dueDate')}}
                style={{gridArea: 'DueDate', placeSelf: 'center'}}>
                    { this.props.dueDate }
                </div>
                
                {/* Indicator Panel  */}
                <div style={{gridArea: 'IndicatorPanel'}}>
                    { this.props.indicatorPanel }
                </div>

                {/* Divider  */} 
                <div
                style={{gridArea: 'Divider'}}>
                    <Divider
                    show={this.props.showDivider}/>
                </div>
            </div>
        );
    }
}

let type = 'task';

let spec = {
    canDrag: (props, monitor) => {
        return true;
    },

    beginDrag: (props, monitor, component) => {
        return {
            taskId: props.taskId,
        }
    },

    endDrag: (props, monitor, component) => {
        if (monitor.didDrop()) {
            props.onDragDrop(props.taskId, monitor.getDropResult().targetTaskListId);
        }
    }
}

let collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

export default DragSource(type, spec, collect)(withMouseOver(withTheme()(TaskBase)));