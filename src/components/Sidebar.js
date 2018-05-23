import React from 'react';
import ProjectSelector from './ProjectSelector';
import '../assets/css/Sidebar.css';
import '../assets/css/ToolBarButton.css';

class Sidebar extends React.Component{
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleProjectSelectorClick = this.handleProjectSelectorClick.bind(this);
        this.handleProjectSelectorDoubleClick = this.handleProjectSelectorDoubleClick.bind(this);
        this.handleAddProjectClick = this.handleAddProjectClick.bind(this);
        this.handleRemoveProjectClick = this.handleRemoveProjectClick.bind(this);
        this.handleProjectNameSubmit = this.handleProjectNameSubmit.bind(this);
        this.handleSidebarCollapseButtonClick = this.handleSidebarCollapseButtonClick.bind(this);
        this.getSidebarToolbarJSX = this.getSidebarToolbarJSX.bind(this);

        this.state = {
            openProjectSelectorInputId: -1,
            isCollapsed: false,
        }
    }

    render() {
        var sidebarClassName = this.state.isCollapsed ? "SidebarCollapsed" : "SidebarOpen";
        var projectSelectorsContainerClassName = this.state.isCollapsed ? "ProjectSelectorsContainerCollapsed" : "ProjectSelectorsContainerOpen";
        var sidebarCollapseButtonClassName = this.state.isCollapsed ? "SidebarCollapseButtonCollapsed" : "SidebarCollapseButtonOpen";

        var projectSelectorsJSX = this.props.projects.map((item, index) => {
            var isSelected = this.props.selectedProjectId === item.uid;
            var isInputOpen = item.uid === this.state.openProjectSelectorInputId;
            var dueDateDisplay = this.props.projectSelectorDueDateDisplays[item.uid];

            return (
                <ProjectSelector key={index} projectSelectorId={item.uid} projectName={item.projectName} isSelected={isSelected}
                    isInputOpen={isInputOpen} onClick={this.handleProjectSelectorClick} onDoubleClick={this.handleProjectSelectorDoubleClick}
                    onProjectNameSubmit={this.handleProjectNameSubmit} dueDateDisplay={dueDateDisplay} />
            )
        })

        var sidebarToolbarJSX = this.getSidebarToolbarJSX();

        return (
            <div className={sidebarClassName}>
                <div className="sidebarToolbarContainer">
                    {sidebarToolbarJSX}
                </div>
                <div className={projectSelectorsContainerClassName}>
                    {projectSelectorsJSX}
                </div>
                <div className="SidebarCollapseButtonContainer">
                    <div className={sidebarCollapseButtonClassName} onClick={this.handleSidebarCollapseButtonClick}>
                        <img className="SidebarCollapseButtonIcon" src="SidebarIcon.svg"/>
                    </div>
                </div>
            </div>
        )
    }

    getSidebarToolbarJSX() {
        if (this.state.isCollapsed !== true) {
            return (
                <div className="SidebarToolbarFlexContainer">
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src="NewProjectIcon.svg" onClick={this.handleAddProjectClick} />
                    </div>
                    <div className="ToolBarButtonContainer">
                        <img className="ToolBarButton" src="RemoveProjectIcon.svg" onClick={this.handleRemoveProjectClick} />
                    </div>
                </div>
            )     
        }

        else {
            return (<div/>)
        }
    }

    handleSidebarCollapseButtonClick(e) {
        this.setState({isCollapsed: !this.state.isCollapsed});
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