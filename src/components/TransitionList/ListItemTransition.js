import React, { Component } from 'react';
import { Collapse } from '@material-ui/core';

class ListItemTransition extends Component {
    render() {
        return (
            <Collapse
                in={this.props.in}
                mountOnEnter={true}
                unmountOnExit={true}>
                {this.props.children}
            </Collapse>

        );
    }
}

export default ListItemTransition;