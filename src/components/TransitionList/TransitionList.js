import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { List } from '@material-ui/core';

class TransitionList extends Component {
    render() {
        return (
            <List
            style={{padding: '0px'}}
            {...this.props}>
                <TransitionGroup>
                    {this.props.children}
                </TransitionGroup>
            </List>
            
        );
    }
}

export default TransitionList;