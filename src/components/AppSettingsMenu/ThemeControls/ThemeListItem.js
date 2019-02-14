import React, { Component } from 'react';
import Hammer from 'hammerjs';
import { ListItem, ListItemText } from '@material-ui/core';
import withMouseOver from '../../Hocs/withMouseOver';
import DeleteButton from './DeleteButton';

import MuiColorChit from './MuiColorChit';

let grid = {
    width: '100%',
    minHeight: '48px',
    display: 'grid',
    gridTemplateColumns: '[Text]1fr [Chits]auto'
}

let chitContainer = {
    gridColumn: 'Chits',
    placeSelf: 'center stretch',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
}

class ThemeListItem extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.containerRef = React.createRef();
    }
    
    componentDidMount() {
        let containerHammer = new Hammer(this.containerRef.current);
        containerHammer.on('press', (e) => {
            this.props.onPress();
        })

        containerHammer.on('tap', (e) => {
            this.props.onClick();
        })
    }

    componentWillUnmount() {
        Hammer.off(this.containerRef.current, 'press');
        Hammer.off(this.containerRef.current, 'tap');
    }

    render() {
        let colorPreview = (
            <div style={chitContainer}>
                <MuiColorChit
                    size="small"
                    color={this.props.primaryColor} />
                <MuiColorChit
                    size="small"
                    color={this.props.secondaryColor} />
                <MuiColorChit
                    size="small"
                    color={this.props.backgroundColor} />
            </div>
        )

        return (
            <div
                ref={this.containerRef}>
                <ListItem
                    selected={this.props.isSelected}>
                    <div
                        style={grid}>
                        <div style={{ gridColumn: 'Text', placeSelf: 'center flex-start' }}>
                            <ListItemText
                                primary={this.props.name}
                            />
                        </div>

                        { this.props.mouseOver && this.props.canDelete ? 
                        <DeleteButton onClick={this.props.onDeleteButtonClick}/> :
                        colorPreview }
                    </div>
                </ListItem>
            </div>
        );
    }
}

    

export default withMouseOver(ThemeListItem);