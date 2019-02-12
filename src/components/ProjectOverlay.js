import React from 'react';
import { Typography, Button } from '@material-ui/core';
import AddNewTaskListButton from './AddNewTaskListButton';

const ProjectOverlay = (props) => {
    let machinedState = stateMachine(props);

    if (machinedState === 'no-overlay') {
        return null;
    }

    return (
        <div
        style={container}>

        { machinedState === 'logged-out' && <Button variant="outlined"> Log in </Button> }
        { machinedState === 'no-project-selected' && <Typography> Select a project to start </Typography> }
        { machinedState === 'no-projects' && <Button variant="outlined"> Create Project </Button> }
        { machinedState === 'no-task-lists' && <AddNewTaskListButton/>}
        </div>
    );
};

let stateMachine = (props) => {
    if (props.isLoggedIn === false) {
        return 'logged-out';
    } 

    if (props.selectedProjectId === -1) {
        return 'no-project-selected';
    }

    if (props.projects.length === 0) {
        return 'no-projects';
    }

    if (props.taskLists.length === 0) {
        return 'no-task-lists';
    }

    return 'no-overlay';
}

export default ProjectOverlay;