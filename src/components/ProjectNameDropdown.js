import React, { Component } from 'react';
import { Typography, Menu } from '@material-ui/core';
import ProjectListItem from './ProjectListItem/ProjectListItem';

let SelectMenu = (props) => {
    return (
        <Menu
        open={props.open}
        onBackdropClick={props.onClickAway}
        anchorEl={props.anchorEl}>
            {props.children}
        </Menu>
    )
}

class ProjectNameDropdown extends Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isOpen: false,
        }

        // Refs.
        this.anchorElRef = React.createRef();

        // Method Bindings.
        this.handleProjectListItemClick = this.handleProjectListItemClick.bind(this);

    }

    render() {
            let selectMenuItemsJSX = this.props.projects.map( item => {
                return (
                    <ProjectListItem
                    key={item.uid}
                    name={item.projectName}
                    disableSecondaryActions={true}
                    indicators={this.props.projectSelectorIndicators[item.uid]}
                    isSelected={item.uid === this.props.selectedProjectId}
                    isFavourite={item.uid === this.props.favouriteProjectId}
                    onClick={() => { this.handleProjectListItemClick(item.uid) }}/>
                )
            })

            return (
                <React.Fragment>
                    <div
                        ref={this.anchorElRef}>
                        <Typography
                            onClick={() => { this.setState({ isOpen: true }) }}
                            variant="h6"
                            style={{ paddingLeft: '8px', paddingRight: '16px' }}>
                            {this.props.name}
                        </Typography>
                    </div>
                
                    <SelectMenu
                        anchorEl={this.anchorElRef.current}
                        open={this.state.isOpen}
                        onClickAway={() => { this.setState({ isOpen: false }) }}>
                        <div
                        style={{width: '280px'}}>
                            {selectMenuItemsJSX}
                        </div>
                        
                    </SelectMenu>

                </React.Fragment>
            );
    }

    handleProjectListItemClick(uid) {
        this.setState({
            isOpen: false,
        })

        this.props.onProjectSelect(uid);
    }
}

export default ProjectNameDropdown;