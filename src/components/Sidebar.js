import React from 'react';
import ProjectSelector from './ProjectSelector';
import '../assets/css/Sidebar.css';
import '../assets/css/ToolBarButton.css';

class Sidebar extends React.Component{
    constructor(props) {
        super(props);

        this.handleProjectSelectorClick = this.handleProjectSelectorClick.bind(this);
        this.handleProjectSelectorDoubleClick = this.handleProjectSelectorDoubleClick.bind(this);
        this.handleAddProjectClick = this.handleAddProjectClick.bind(this);
        this.handleRemoveProjectClick = this.handleRemoveProjectClick.bind(this);
        this.handleProjectNameSubmit = this.handleProjectNameSubmit.bind(this);

        this.state = {
            openProjectSelectorInputId: -1
        }
    }

    render() {
        var projectSelectors = this.props.projects.map((item, index) => {
            var isSelected = this.props.selectedProjectId === item.uid;
            var isInputOpen = item.uid === this.state.openProjectSelectorInputId;
            var dueDateDisplay = this.props.projectSelectorDueDateDisplays[item.uid];

            return (
                <ProjectSelector key={index} projectSelectorId={item.uid} projectName={item.projectName} isSelected={isSelected}
                isInputOpen={isInputOpen} onClick={this.handleProjectSelectorClick} onDoubleClick={this.handleProjectSelectorDoubleClick}
                onProjectNameSubmit={this.handleProjectNameSubmit} dueDateDisplay={dueDateDisplay}/>
            )
        })
            return (
                <div className="Sidebar">
                    <div className="SideBarToolbar">
                        <img className="ToolBarButton" src="NewProjectIcon.svg" onClick={this.handleAddProjectClick}/>
                        <img className="ToolBarButton" src="RemoveProjectIcon.svg" onClick={this.handleRemoveProjectClick}/>
                    </div>
                    <div>
                        {projectSelectors}
                    </div>
                </div>
            ) 
    }

    handleProjectSelectorClick(e, projectSelectorId) {
        this.props.onProjectSelectorClick(e, projectSelectorId);
    }

    handleProjectSelectorDoubleClick(e, projectSelectorId) {
        this.setState({openProjectSelectorInputId: projectSelectorId});
    }

    handleAddProjectClick(e) {
        this.props.onAddProjectClick();
    }

    handleRemoveProjectClick(e) {
        this.props.onRemoveProjectClick(this.props.selectedProjectId);
    }

    handleProjectNameSubmit(projectSelectorId, newProjectName) {
        // Close Input and Forward on Event.
        this.setState({openProjectSelectorInputId: -1})
        this.props.onProjectNameSubmit(projectSelectorId, newProjectName);
    }
}

export default Sidebar;