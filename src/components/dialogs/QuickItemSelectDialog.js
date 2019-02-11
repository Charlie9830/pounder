import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, List, ListItem, ListItemText } from '@material-ui/core';

class QuickItemSelectDialog extends Component {
    constructor(props) {
        super(props);
        
        // Method Bindings.
        this.getItemsJSX = this.getItemsJSX.bind(this);
    }

    render() {
        return (
            <Dialog open={this.props.isOpen}>
                <DialogTitle> {this.props.title} </DialogTitle>
                <DialogContent>
                    <DialogContentText> {this.props.text} </DialogContentText>
                    <List>
                        { this.getItemsJSX() }
                    </List>
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.props.onNegative}> {this.props.negativeButtonText} </Button>
                </DialogActions>
            </Dialog>
        )
    }
    
    getItemsJSX() {
        if (this.props.items === undefined) {
            return null;
        }

        let jsx = this.props.items.map( (item, index) => {
            return (
                <ListItem
                button
                onClick={() => { this.props.onSelect(item.value) }}
                key={index}>
                    <ListItemText 
                    primary={item.primaryText}
                    secondary={item.secondaryText}/>
                </ListItem>
            )
        })

        return jsx;
    }
}
export default QuickItemSelectDialog;