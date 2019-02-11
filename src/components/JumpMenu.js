import React, { Component } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, ListSubheader } from '@material-ui/core';
import JumpMenuIcon from '@material-ui/icons/ArrowDropDownCircle'

class JumpMenu extends Component {
    constructor(props) {
        super(props);

        // Refs.
        this.buttonRef = React.createRef();

        // Method Bindings.
        this.getMenuItemsJSX = this.getMenuItemsJSX.bind(this);
    }


    render() {
        return (
            <React.Fragment>
                <IconButton
                    buttonRef={this.buttonRef}
                    onClick={this.props.onOpen}>
                    <JumpMenuIcon />
                </IconButton>

                <Menu
                    open={this.props.isOpen}
                    onClose={this.props.onClose}
                    anchorEl={this.buttonRef.current}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                        <ListSubheader
                            key="listsubheader"
                            disableSticky={true}>
                            Jump to list
                        </ListSubheader>
                        {this.getMenuItemsJSX()}
                </Menu>
            </React.Fragment>
        )
    }

    getMenuItemsJSX() {
        if (this.props.taskLists === undefined) {
            return null;
        }

        let jsx = this.props.taskLists.map( (item) => {
            return (
                <MenuItem
                onClick={ () => { this.props.onItemClick(item.uid)}}
                key={item.uid}>
                    <ListItemText primary={item.taskListName}/>
                </MenuItem>
            )
        })

        return jsx;
    }
}

export default JumpMenu;