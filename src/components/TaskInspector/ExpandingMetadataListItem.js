import React, { Component } from 'react';
import { Typography, ListItem, List, ListSubheader, Divider, ListItemIcon, ListItemText } from '@material-ui/core';
import Expander from '../Expander';

import PersonIcon from '@material-ui/icons/Person';
import ClockIcon from '@material-ui/icons/AccessTime';

const MetadataItem = (props) => {
    return (
        <React.Fragment>
            <ListSubheader> {props.title} </ListSubheader>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>

                <ListItemText primary={props.by} />
            </ListItem>

            <ListItem>
                <ListItemIcon>
                    <ClockIcon />
                </ListItemIcon>

                <ListItemText primary={props.on} />
            </ListItem>
        </React.Fragment>
    )
}

class ExpandingMetadataListItem extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.anchorRef = React.createRef();

        // State.
        this.state = {
            isOpen: false,
        }
    }
    

    render() {
        let { metadata } = this.props;

        return (
            <ListItem onClick={() => { this.setState({ isOpen: true })}}>
            
                <div ref={this.anchorRef}>
                    <Typography color="textSecondary"> Created {metadata.createdOn} </Typography>
                    <Typography color="textSecondary"> by {metadata.createdBy} </Typography>
                </div>

                <Expander
                    open={this.state.isOpen}
                    anchorEl={this.anchorRef.current}
                    onClose={() => { this.setState({ isOpen: false }) }}>
                    <List>
                        <MetadataItem title="Created" on={metadata.createdOn} by={metadata.createdBy} />
                        <MetadataItem title="Updated" on={metadata.updatedOn} by={metadata.updatedBy} />
                        <MetadataItem title="Completed" on={metadata.completedOn} by={metadata.completedBy} />
                    </List>
                </Expander>
            </ListItem>
        );
    }
}

export default ExpandingMetadataListItem;