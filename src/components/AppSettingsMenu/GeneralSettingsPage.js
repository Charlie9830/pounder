import React from 'react';
import { List, ListItem, Select, ListItemText, ListItemSecondaryAction, Paper, Typography } from '@material-ui/core';
import VisibleThemeSettings from './ThemeSettings';


let paperStyle = {
    padding: '8px',
    margin: '8px',
}


class GeneralSettingsPage extends React.Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.disableAnimationsCheckboxRef = React.createRef();
        
        // Method Bindings.
        this.getFavouriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.getSortProjectsBySelectorJSX = this.getSortProjectsBySelectorJSX.bind(this);
        this.handleSortProjectsBySelectorChange = this.handleSortProjectsBySelectorChange.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Paper style={paperStyle}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Favourite Project"
                                secondary="Auto select on launch" />
                            <ListItemSecondaryAction>
                                {this.getFavouriteProjectSelectorJSX()}
                            </ListItemSecondaryAction>

                        </ListItem>

                        <ListItem>
                            <ListItemText primary="Sort projects by" />
                            <ListItemSecondaryAction>
                                {this.getSortProjectsBySelectorJSX()}
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>

                <Paper style={paperStyle}>

                    <Typography variant="subtitle1"> Themes </Typography>
                    <VisibleThemeSettings />
                </Paper>
            </React.Fragment>
        )
    }

    handleSortProjectsBySelectorChange(e) {
        var value = e.target.value;

        this.props.onSortProjectsBySelectorChange(value);
    }

    getFavouriteProjectSelectorJSX() {
        // Build Projects into HTML Option Elements.
        var optionsJSX = this.props.projects.map((project, index) => {
            return (
                <option key={index + 1} value={project.uid}> {project.projectName} </option>
            )
        })

        // Append a "None" option.
        optionsJSX.unshift((<option key={0} value="-1"> None </option>))

        let favouriteProjectId = this.props.accountConfig.favouriteProjectId === undefined ?
         "-1" : this.props.accountConfig.favouriteProjectId;

        // Build options into HTML select Element.
        return (
            <Select
            native
            value={favouriteProjectId}
            onChange={this.handleFavouriteProjectSelectChange}>
                {optionsJSX}
            </Select>
        )
    }

    getSortProjectsBySelectorJSX() {
        var sortProjectsBy = this.props.generalConfig.sortProjectsBy === undefined ? 'alphabetically' : this.props.generalConfig.sortProjectsBy;

        return (
            <Select 
            native
            value={sortProjectsBy}
            onChange={this.handleSortProjectsBySelectorChange}>
                <option key={0} value='alphabetically'> Alphabetically </option>
                <option key={1} value='created'> Date created </option>
                <option key={2} value='updated'> Updated </option>
            </Select>
        )
    }
    
    handleFavouriteProjectSelectChange(e) {
        let id = e.target.value;
        this.props.onFavouriteProjectSelectChange(id);
    }
}

export default GeneralSettingsPage;