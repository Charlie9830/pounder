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

        // State.
        this.state = {
            isOpen: false,
        }
    }
    

    render() {
        let { metadata } = this.props;

        let closedComponent = (
            <div>
                <Typography color="textSecondary"> Created {metadata.createdOn} </Typography>
                <Typography color="textSecondary"> by {metadata.createdBy} </Typography>
            </div>
        )

        let openComponent = (
            <List>
                <MetadataItem title="Created" on={metadata.createdOn} by={metadata.createdBy} />
                <MetadataItem title="Updated" on={metadata.updatedOn} by={metadata.updatedBy} />
                <MetadataItem title="Completed" on={metadata.completedOn} by={metadata.completedBy} />
            </List>
        )

        return (
            <ListItem 
            onClick={() => { this.setState({ isOpen: true })}}>    
                <Expander
                    open={this.state.isOpen}
                    onClose={() => { this.setState({ isOpen: false }) }}
                    closedComponent={closedComponent}
                    openComponent={openComponent}/>
            </ListItem>
        );
    }
}

export default ExpandingMetadataListItem;