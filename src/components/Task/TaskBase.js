import React, { Component } from 'react';
import Hammer from 'hammerjs';
import Divider from './Divider';
import { withTheme } from '@material-ui/core';

class TaskBase extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.taskContainerRef = React.createRef();
        this.textContainerRef = React.createRef();
        this.dueDateContainerRef = React.createRef();
    }

    componentDidMount() {
        let taskContainerHammer = new Hammer(this.taskContainerRef.current);
        taskContainerHammer.on('press', event => {
            this.props.onPress();
        })

        let textContainerHammer = new Hammer(this.textContainerRef.current);
        textContainerHammer.on('tap', event => {
            this.props.onTextContainerTap();
        })

        let dueDateContainerHammer = new Hammer(this.dueDateContainerRef.current);
        dueDateContainerHammer.on('tap', event => {
            this.props.onDueDateContainerTap();
        })
    }

    componentWillUnmount() {
        Hammer.off(this.taskContainerRef.current, 'press');
        Hammer.off(this.textContainerRef.current, 'tap');
        Hammer.off(this.dueDateContainerRef.current, 'tap');
    }
    
    render() {
        let { theme } = this.props;

        let ContainerGridStyle = {
            width: '100%',
            height: 'fit-content',
            display: 'grid',
            gridTemplateRows: '[Content]1fr [IndicatorPanel]auto [Divider]auto',
            gridTemplateColumns: '[PriorityIndicator]auto [Checkbox]auto [Text]1fr [DueDate]auto',
            gridTemplateAreas: `'PriorityIndicator Checkbox       Text           DueDate'
                                'PriorityIndicator IndicatorPanel IndicatorPanel IndicatorPanel'
                                '       .               .         Divider        Divider        '`,
            background: this.props.isMoving ? theme.palette.primary.dark : 'unset',
        }
        
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

        return (
            <div
            style={ContainerGridStyle}
            ref={this.taskContainerRef}>
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
                ref={this.textContainerRef}
                 style={TextContainerStyle}>
                    { this.props.taskText }
                </div> 

                {/* DueDate  */}
                <div 
                ref={this.dueDateContainerRef}
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

export default withTheme()(TaskBase);