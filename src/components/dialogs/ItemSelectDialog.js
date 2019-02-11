import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, List, ListItem, ListItemText } from '@material-ui/core';

class ItemSelectDialog extends Component {
    constructor(props) {
        super(props);
        
        // State.
        this.state = {
            selectedIndex: -1,
            selectedValue: null,
        }

        // Method Bindings.
        this.getItemsJSX = this.getItemsJSX.bind(this);
        this.handleAffirmativeButtonClick = this.handleAffirmativeButtonClick.bind(this);
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
                    <Button
                        disabled={ this.state.selectedIndex === -1 }
                        onClick={this.handleAffirmativeButtonClick}
                        color="secondary">
                        {this.props.affirmativeButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    handleAffirmativeButtonClick() {
        this.props.onAffirmative(this.state.selectedValue);
    }
    
    getItemsJSX() {
        if (this.props.items === undefined) {
            return null;
        }

        let jsx = this.props.items.map( (item, index) => {
            return (
                <ListItem
                onClick={() => { this.setState({selectedIndex: index, selectedValue: item.value })}}
                key={index}
                selected={index === this.state.selectedIndex}>
                    <ListItemText 
                    primary={item.primaryText}
                    secondary={item.secondaryText}/>
                </ListItem>
            )
        })

        return jsx;
    }
}
export default ItemSelectDialog;