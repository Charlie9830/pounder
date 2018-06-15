import React from 'react';
import ProjectSelector from './ProjectSelector';
import Button from './Button';
import '../assets/css/Sidebar.css';
import '../assets/css/ToolBarButton.css';
import NewProjectIcon from '../assets/icons/NewProjectIcon.svg';
import RemoveProjectIcon from '../assets/icons/RemoveProjectIcon.svg';
import SidebarIcon from '../assets/icons/SidebarIcon.svg';

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
        this.getCollapsedProjectTitleJSX = this.getCollapsedProjectTitleJSX.bind(this);
        this.handleSidebarClick = this.handleSidebarClick.bind(this);

        this.state = {
            openProjectSelectorInputId: -1,
        }
    }

    render() {
        var sidebarClassName = this.props.isOpen ? "SidebarOpen" : "SidebarCollapsed";
        var projectSelectorsContainerClassName = this.props.isOpen ? "ProjectSelectorsContainerOpen" : "ProjectSelectorsContainerCollapsed";
        var sidebarCollapseButtonClassName = this.props.isOpen ? "SidebarCollapseButtonOpen" : "SidebarCollapseButtonCollapsed";

        var projectSelectorsJSX = this.props.projects.map((item, index) => {
            var isSelected = this.props.selectedProjectId === item.uid;
            var isInputOpen = item.uid === this.state.openProjectSelectorInputId;
            var dueDateDisplay = this.props.projectSelectorDueDateDisplays[item.uid];
            var isFavouriteProject = this.props.favouriteProjectId === item.uid;

            return (
                <ProjectSelector key={index} projectSelectorId={item.uid} projectName={item.projectName} isSelected={isSelected}
                    isInputOpen={isInputOpen} onClick={this.handleProjectSelectorClick} onDoubleClick={this.handleProjectSelectorDoubleClick}
                    onProjectNameSubmit={this.handleProjectNameSubmit} dueDateDisplay={dueDateDisplay}
                    isFavouriteProject={isFavouriteProject} />
            )
        })

        var sidebarToolbarJSX = this.getSidebarToolbarJSX();
        var collapsedProjectTitleJSX = this.getCollapsedProjectTitleJSX();

        return (
            <div className={sidebarClassName} onClick={this.handleSidebarClick}>
                <div className="sidebarToolbarContainer">
                    {sidebarToolbarJSX}
                </div>
                <div className={projectSelectorsContainerClassName}>
                    {projectSelectorsJSX}
                </div>
                <div className="SidebarCollapseButtonContainer">
                    <div className={sidebarCollapseButtonClassName} onClick={this.handleSidebarCollapseButtonClick}>
                        <img className="SidebarCollapseButtonIcon" src={SidebarIcon}/>
                    </div>
                </div>
                {collapsedProjectTitleJSX}
            </div>
        )
    }

    handleSidebarClick() {
        if (!this.props.isOpen) {
            this.props.onRequestIsSidebarOpenChange(true)
        }
    }

    getCollapsedProjectTitleJSX() {
        if (!this.props.isOpen) {
            // Determine Selected Project Name.
            var selectedProject = this.props.projects.find(item => {
                return item.uid === this.props.selectedProjectId;
            })
            var projectTitle = selectedProject === undefined ? "" : selectedProject.projectName;

            return (
                <div className="CollapsedProjectTitle">
                    {projectTitle}
                </div>
            )
        }
    }

    getSidebarToolbarJSX() {
        if (this.props.isOpen) {
            return (
                <div className="SidebarToolbarFlexContainer">
                    <Button iconSrc={NewProjectIcon} onClick={this.handleAddProjectClick}/>
                    <Button iconSrc={RemoveProjectIcon} onClick={this.handleRemoveProjectClick}/>
                </div>
            )     
        }

        else {
            return (<div/>)
        }
    }

    handleSidebarCollapseButtonClick(e) {
        this.props.onRequestIsSidebarOpenChange(!this.props.isOpen);
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