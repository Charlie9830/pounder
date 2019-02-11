import React, { Component } from 'react';
import { Typography, List, Button } from '@material-ui/core';
import Expander from '../Expander';
import MemberListItem from './MemberListItem';

let grid = {
    height: '100%',
    padding: '8px',
    display: 'grid',
    gridTemplateRows: '[Members]1fr [ClearButton]auto'
}

class ExpandingAssignmentSelector extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.anchorRef = React.createRef();

        // State.
        this.state = {
            isOpen: false,
        }

        // Method Bindings.
        this.getMembersJSX = this.getMembersJSX.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMemberSelect = this.handleMemberSelect.bind(this);
    }

    render() {
        // Controlled or Uncontrolled Mode.
        let isExpanded = this.props.isOpen === undefined ? this.state.isOpen : this.props.isOpen

        let hasValue = this.props.value !== undefined && this.props.value.trim() !== "";
        let closedValue = hasValue ?  this.props.value : this.props.placeholder || "";
        let typographyColor = hasValue ? "textPrimary" : "textSecondary";
        
        return (
            <React.Fragment>
                <div ref={this.anchorRef}>
                    <Typography
                        style={{ width: '100%', minHeight: '1em' }}
                        color={typographyColor}
                        onClick={() => { this.setState({ isOpen: true }) }}>
                        {closedValue}
                    </Typography>
                </div>
                    
                <Expander
                    anchorEl={this.anchorRef.current}
                    open={isExpanded}
                    onClose={this.handleClose}>
                    <div style={grid}>
                        <div style={{ gridRow: 'Members', placeSelf: 'flex-start center' }}>
                            <List style={{overflowY: 'scroll'}}>
                                {this.getMembersJSX()}
                            </List>                            
                        </div>

                        <div style={{ gridRow: 'ClearButton', placeSelf: 'flex-end flex-start' }}>
                            <Button variant="text" color="primary" onClick={() => { this.handleMemberSelect(-1) }}>
                                Clear
                         </Button>
                    </div>
                    </div>
                </Expander>
            </React.Fragment>
        );
    }

    getMembersJSX() {
        let jsx = this.props.members.map( item => {
            return (
                <MemberListItem
                key={item.userId}
                onClick={() => { this.handleMemberSelect(item.userId) }}
                selected={ item.userId === this.props.selectedMember }
                displayName={ item.displayName } />
            )
        })

        return jsx;
    }

    handleClose() {
        this.props.onClose();

        if (this.props.isExpanded === undefined) {
            // Uncontrolled Mode.
            this.setState({ isOpen: false });
        }
    }

    handleMemberSelect(userId) {

        this.props.onChange(userId);

        if (this.props.isExpanded === undefined) {
            // Uncontrolled Mode.
            this.setState({ isOpen: false });
        }
        
    }
}

export default ExpandingAssignmentSelector;