import React, { Component } from 'react';
import { List, ListItem, FormControlLabel, Switch, ListSubheader, Button } from '@material-ui/core';
import MuiColorSelector from './MuiColorSelector';
import ColorPicker from '../ColorPicker';

import AddIcon from '@material-ui/icons/Add';

class ThemeEditor extends Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleIsDarkChange = this.handleIsDarkChange.bind(this);
        this.handleCustomColorChange = this.handleCustomColorChange.bind(this);
        this.handleHideTaskEditIconChange = this.handleHideTaskEditIconChange.bind(this);
    }
    
    render() {
        let buttonJSX = (
            <Button
                variant="text"
                onClick={this.props.onCreate}
                color="secondary">
                <AddIcon /> Add
                </Button>
        )

        let editorJSX = (
            <List
                style={{ width: '100%' }}>
                <ListItem>
                    <FormControlLabel
                        label='Go dark'
                        control={<Switch
                            checked={this.props.muiTheme.type === 'dark'}
                            onChange={(e) => { this.handleIsDarkChange(e.target.checked) }}
                        />} />
                </ListItem>

                <ListSubheader disableSticky={true}> Primary Colour </ListSubheader>
                <ListItem style={{ maxWidth: '100%' }}>
                    <MuiColorSelector
                        muiColors={this.props.muiColors}
                        colorId={this.props.muiTheme.palette.primaryColor.id}
                        shadeIndex={this.props.muiTheme.palette.primaryColor.shadeIndex}
                        onChange={(colorId, shadeIndex) => { this.handleColorChange(colorId, shadeIndex, 'primary') }}
                    />
                </ListItem>

                <ListSubheader disableSticky={true}> Secondary Colour </ListSubheader>
                <ListItem style={{ maxWidth: '100%' }}>
                    <MuiColorSelector
                        muiColors={this.props.muiColors}
                        colorId={this.props.muiTheme.palette.secondaryColor.id}
                        shadeIndex={this.props.muiTheme.palette.secondaryColor.shadeIndex}
                        onChange={(colorId, shadeIndex) => { this.handleColorChange(colorId, shadeIndex, 'secondary') }}
                    />
                </ListItem>

                <ListSubheader disableSticky={true}> Background Colour </ListSubheader>
                <ListItem style={{ maxWidth: '100%' }}>
                    <MuiColorSelector
                        muiColors={this.props.muiColors}
                        colorId={this.props.muiTheme.palette.backgroundColor.id}
                        shadeIndex={this.props.muiTheme.palette.backgroundColor.shadeIndex}
                        onChange={(colorId, shadeIndex) => { this.handleColorChange(colorId, shadeIndex, 'background') }}
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Enable high Density"
                        control={
                            <Switch
                                checked={this.props.muiTheme.isDense}
                                onChange={(e) => { this.handleisDenseChange(e.target.checked) }} />
                        } />
                </ListItem>

                <ListItem>
                
                <FormControlLabel
                    label="Hide Task edit icon"
                    control={
                        <Switch
                            checked={this.props.muiTheme.hideTaskEditIcon}
                            onChange={(e) => { this.handleHideTaskEditIconChange(e.target.checked) }} />
                    } />
                </ListItem>

                <ListSubheader disableSticky={true}> Indicator Colours </ListSubheader>
                <ListItem>
                    <FormControlLabel
                        label="Due later"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.later}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'later') }} />
                        }
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Due soon"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.soon}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'soon') }} />
                        }
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Due Today"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.today}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'today') }} />
                        }
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Overdue"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.overdue}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'overdue') }} />
                        }
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Unread item"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.unreadItem}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'unreadItem') }} />
                        }
                    />
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        label="Important"
                        control={
                            <ColorPicker
                                value={this.props.muiTheme.palette.custom.highPriority}
                                onChange={(newColor) => { this.handleCustomColorChange(newColor, 'highPriority') }} />
                        }
                    />
                </ListItem>
            </List>
        )

        if (this.props.isOpen === true) {
            return (
                <React.Fragment>
                    {buttonJSX}
                    {editorJSX}
                </React.Fragment>
            )
        }

        else {
            return (
                <React.Fragment>
                    {buttonJSX}
                </React.Fragment>
            )
        }

        
    }

    handleCustomColorChange(newValue, type) {
        let theme = { ...this.props.muiTheme }
        theme.palette.custom[type] = newValue;

        this.props.onThemeChange(theme);
    }

    handleHideTaskEditIconChange(newValue) {
        let theme= { ...this.props.muiTheme }
        theme.hideTaskEditIcon = newValue;

        this.props.onThemeChange(theme);
    }

    handleisDenseChange(newValue) {
        let theme = { ...this.props.muiTheme }
        theme.isDense = newValue;

        this.props.onThemeChange(theme);
    }

    handleIsDarkChange(newValue) {
        let theme = { ...this.props.muiTheme }
        theme.type = newValue === true ? 'dark' : 'light';

        this.props.onThemeChange(theme);
    }

    handleColorChange(colorId, shadeIndex, type) {
        let theme = { ...this.props.muiTheme };
        
        switch (type) {
            case 'primary':
                theme.palette.primaryColor = {
                    id: colorId,
                    shadeIndex: shadeIndex,
                }
                break;

            case 'secondary':
                theme.palette.secondaryColor = {
                    id: colorId,
                    shadeIndex: shadeIndex,
                }
                break;

            case 'background':
                theme.palette.backgroundColor = {
                    id: colorId,
                    shadeIndex: shadeIndex,
                }
                break;

            default:
                break;
        }

        this.props.onThemeChange(theme);
    }
}

export default ThemeEditor;