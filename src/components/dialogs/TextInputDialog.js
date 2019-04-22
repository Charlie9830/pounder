import React, { Component } from 'react';
import { Modal, TextField, DialogActions, Button, withTheme, Collapse, Typography, Dialog, DialogContent, Slide } from '@material-ui/core';

const Transition = (props) => {
    return <Slide direction="down" {...props}/>
}

class TextInputDialog extends Component {
    constructor(props) {
        super(props);

        // Refs.
        this.textInputRef = React.createRef();

        // Method Bindings.
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    }    
    
    componentDidMount() {
        document.addEventListener('keydown', this.handleDocumentKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

    render() {
        let { theme } = this.props;

        const gridStyle = {
            display: 'grid',
            gridTemplateRows: '[Title]auto [Input]1fr',
            width: '65vw',
            height: 'fit-content',
            background: theme.palette.background.paper,
            padding: '8px'
        }

        const titleContainer = {
            gridRow: 'Title',
            placeSelf: 'center flex-start',
        }

        const inputContainer = {
            gridRow: 'Input',
            placeSelf: 'center stretch',
        }

        return (
                <Dialog
                maxWidth="xl"
                open={this.props.isOpen}
                TransitionComponent={Transition}>
                <DialogContent>
                    <div style={gridStyle}>
                        <div style={titleContainer}>
                            <Typography style={{ marginBottom: '16px' }} color="textSecondary"> {this.props.title} </Typography>
                        </div>
                        <div style={inputContainer}>
                            <TextField
                                fullWidth
                                inputRef={this.textInputRef}
                                autoFocus
                                multiline
                                label={this.props.label}
                                defaultValue={this.props.text}
                                onKeyPress={this.handleInputKeyPress}
                            />
                        </div>
                    </div>
                </DialogContent>

                        <DialogActions>
                        <Button variant="text" color="default" 
                        onClick={() => { this.props.onCancel()}}> Cancel </Button>
                        <Button variant="text" color="secondary"
                        onClick={() => { this.props.onOkay(this.textInputRef.current.value)}}> Okay </Button>
                        </DialogActions>

                </Dialog>
        );
    }

    handleDocumentKeyDown(e) {
        if (e.key === 'Escape') {
            this.props.onCancel();
        }
    }

    handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onOkay(this.textInputRef.current.value);
        }
    } 
}

export default withTheme()(TextInputDialog);