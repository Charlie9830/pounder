import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ProjectSelector from './ProjectSelector';
import Button from './Button';
import '../assets/css/Sidebar.css';
import '../assets/css/ToolBarButton.css';
import NewProjectIcon from '../assets/icons/NewProjectIcon.svg';
import RemoveProjectIcon from '../assets/icons/RemoveProjectIcon.svg';
import ShareIcon from '../assets/icons/ShareIcon.svg';
import AcceptIcon from '../assets/icons/AcceptIcon.svg';
import DenyIcon from '../assets/icons/DenyIcon.svg';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        // Refs
        this.sidebarGridContainerRef = React.createRef();

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
        this.handleShareMenuButtonClick = this.handleShareMenuButtonClick.bind(this);
        this.getSplitProjects = this.getSplitProjects.bind(this);
        this.projectMapper = this.projectMapper.bind(this);
        this.getLocalProjectsTitleJSX = this.getLocalProjectsTitleJSX.bind(this);
        this.getRemoteProjectsTitleJSX = this.getRemoteProjectsTitleJSX.bind(this);
        this.getProjectInvitesTitleJSX = this.getProjectInvitesTitleJSX.bind(this);
        this.getSidebarFullBleedDividerJSX = this.getSidebarFullBleedDividerJSX.bind(this);
        this.getInvitesJSX = this.getInvitesJSX.bind(this);
        this.handleDenyInviteButtonClick = this.handleDenyInviteButtonClick.bind(this);
        this.handleAcceptInviteButtonClick = this.handleAcceptInviteButtonClick.bind(this);
        this.getIsInviteUpdating = this.getIsInviteUpdating.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.setSidebarGridContainerHeight = this.setSidebarGridContainerHeight.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    render() {
        var sidebarClassName = this.props.isOpen ? "SidebarOpen" : "SidebarCollapsed";
        var splitProjects = this.getSplitProjects();
        var localProjectsCount = splitProjects.localProjects.length;
        var remoteProjectsCount = splitProjects.remoteProjects.length;
        var localProjectsTitleJSX = this.getLocalProjectsTitleJSX(localProjectsCount > 0 && remoteProjectsCount > 0);
        var remoteProjectsTitleJSX = this.getRemoteProjectsTitleJSX(splitProjects.remoteProjects.length > 0);
        var projectInvitesTitleJSX = this.getProjectInvitesTitleJSX(this.props.invites.length > 0);
        var invitesJSX = this.getInvitesJSX();
        var localAndRemoteDividerJSX = this.getSidebarFullBleedDividerJSX(localProjectsCount > 0 && remoteProjectsCount > 0);
        var invitesDividerJSX = this.getSidebarFullBleedDividerJSX((localProjectsCount > 0 || remoteProjectsCount > 0) &&
            this.props.invites.length > 0);
        var localProjectSelectorsJSX = splitProjects.localProjects.map(this.projectMapper);
        var remoteProjectSelectorsJSX = splitProjects.remoteProjects.map(this.projectMapper);
        var sidebarToolbarJSX = this.getSidebarToolbarJSX();
        var collapsedProjectTitleJSX = this.getCollapsedProjectTitleJSX();
        var isShareButtonEnabled = this.props.selectedProjectId !== -1;

        return (
            <div className={sidebarClassName} data-disableanimations={this.props.disableAnimations} onClick={this.handleSidebarClick}>

                {/* Collapsed Project Title  */} 
                {collapsedProjectTitleJSX}    

                { /* Grid - Toolbar, Selectors and Footer */}
                <div className="SidebarGridContainer" ref={this.sidebarGridContainerRef} data-isclosed={!this.props.isOpen}>
                    <div className="SidebarToolbarContainer">
                        {sidebarToolbarJSX}
                    </div>
                    <div className="SidebarSelectablesContainer">
                        {/* Invites */}
                        {projectInvitesTitleJSX}
                        <div className="ProjectInvitesContainer">
                            <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                                {invitesJSX}
                            </TransitionGroup>
                        </div>
                        {invitesDividerJSX}

                        {/* Local Projects  */}
                        {localProjectsTitleJSX}
                        <div className="LocalProjectSelectorsContainer">
                        <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                            {localProjectSelectorsJSX}
                        </TransitionGroup>
                        </div>

                        {localAndRemoteDividerJSX}

                        {/* Remote Projects  */}
                        {remoteProjectsTitleJSX}
                        <div className="RemoteProjectSelectorsContainer">
                        <TransitionGroup enter={!this.props.disableAnimations} exit={!this.props.disableAnimations}>
                            {remoteProjectSelectorsJSX}
                        </TransitionGroup>
                        </div>
                    </div>

                    {/* Footer  */}
                    <div className="SidebarFooter">
                        <Button iconSrc={ShareIcon} onClick={this.handleShareMenuButtonClick} isEnabled={isShareButtonEnabled}
                        tooltip="Invite users to selected project"/>
                    </div>
                    {collapsedProjectTitleJSX}
                </div>
            </div>
        )
    }

    handleWindowResize(event) {
        this.setSidebarGridContainerHeight(event.target.innerHeight);
    }

    setSidebarGridContainerHeight(newHeight) {
        this.sidebarGridContainerRef.current.style.height = `${newHeight - 30 - 1}px`; // newHeight - StatusBar Height - 1 (Flooring).
    }

    handleDenyInviteButtonClick(projectId) {
        this.props.onDenyInviteButtonClick(projectId);
    }

    handleAcceptInviteButtonClick(projectId) {
        this.props.onAcceptInviteButtonClick(projectId);
    }


    getInvitesJSX() {
        var jsx = this.props.invites.map((item, index) => {
            
            var isEnabled = !this.getIsInviteUpdating(item.projectId);
            return (
                <CSSTransition key={index} classNames="InviteContainer" timeout={250}>
                    <div className="InviteContainer" key={index} data-isenabled={isEnabled}>
                        {/* Project and Display Name  */}
                        <div className="InviteProjectAndDisplayName">
                            <div className="InviteProjectName"> {item.projectName} </div>
                            <div className="InviteDisplayName"> {item.sourceDisplayName} </div>
                        </div>

                        {/* Buttons  */}
                        <div className="InviteButtons">
                            <Button size='verysmall' iconSrc={AcceptIcon} onClick={() => { this.handleAcceptInviteButtonClick(item.projectId) }} />
                            <Button size='verysmall' iconSrc={DenyIcon} onClick={() => { this.handleDenyInviteButtonClick(item.projectId) }} />
                        </div>
                    </div>
                </CSSTransition>
            )
        })

        return jsx;
    }

    getIsInviteUpdating(inviteId) {
        return this.props.updatingInviteIds.includes(inviteId);
    }

    getSidebarFullBleedDividerJSX(shouldRender) {
        if (shouldRender) {
            return (
                <div className="SidebarFullBleedDivider" />
            )
        }
    }

    getRemoteProjectsTitleJSX(shouldRender) {
        if (shouldRender) {
            return (
                <div className="SidebarProjectsTitleFlexContainer">
                    <div className="SidebarProjectsTitle"> Shared </div>
                </div>
            )
        }
    }

    getProjectInvitesTitleJSX(shouldRender) {
        if (shouldRender) {
            return (
                <div className="SidebarProjectsTitleFlexContainer">
                    <div className="SidebarProjectsTitle"> Invites </div>
                </div>
            )
        }
    }

    getLocalProjectsTitleJSX(shouldRender) {
        if (shouldRender) {
            return (
                <div className="SidebarProjectsTitleFlexContainer">
                    <div className="SidebarProjectsTitle"> Personal </div>
                </div>
            )
        }
    }

    projectMapper(item, index) {
        var isSelected = this.props.selectedProjectId === item.uid;
        var isInputOpen = item.uid === this.props.openProjectSelectorId;
        var dueDateDisplay = this.props.projectSelectorDueDateDisplays[item.uid];
        var isFavouriteProject = this.props.favouriteProjectId === item.uid;

        return (
            <CSSTransition key={item.uid} timeout={250} classNames="ProjectSelectorContainer">
                <ProjectSelector key={index} projectSelectorId={item.uid} projectName={item.projectName} isSelected={isSelected}
                    isInputOpen={isInputOpen} onClick={this.handleProjectSelectorClick} onDoubleClick={this.handleProjectSelectorDoubleClick}
                    onProjectNameSubmit={this.handleProjectNameSubmit} dueDateDisplay={dueDateDisplay}
                    isFavouriteProject={isFavouriteProject} />
            </CSSTransition>
        )
    }

    getSplitProjects() {
        var localProjects = [];
        var remoteProjects = [];

        this.props.projects.forEach(item => {
            if (item.isRemote) {
                remoteProjects.push(item);
            }
            else {
                localProjects.push(item);
            }
        })

        return { localProjects: localProjects, remoteProjects: remoteProjects }
    }

    handleShareMenuButtonClick() {
        this.props.onShareMenuButtonClick();
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
            var isRemoveProjectButtonEnabled = this.props.selectedProjectId !== -1 && this.props.projects.length > 0 &&
            this.props.isSelectedProjectRemote !== true;

            return (
                <div className="SidebarToolbarFlexContainer">
                    <Button iconSrc={NewProjectIcon} isEnabled={this.props.isLoggedIn} onClick={this.handleAddProjectClick}
                    tooltip="Create new Project" />
                    <Button iconSrc={RemoveProjectIcon} isEnabled={isRemoveProjectButtonEnabled} onClick={this.handleRemoveProjectClick}
                    tooltip="Remove personal project"/>
                </div>
            )
        }

        else {
            return (<div />)
        }
    }

    handleSidebarCollapseButtonClick(e) {
        this.props.onRequestIsSidebarOpenChange(!this.props.isOpen);
    }

    handleProjectSelectorClick(e, projectSelectorId) {
        this.props.onProjectSelectorClick(e, projectSelectorId);
    }

    handleProjectSelectorDoubleClick(e, projectSelectorId) {
        this.props.onProjectSelectorInputDoubleClick(projectSelectorId);
    }

    handleAddProjectClick(e) {
        this.props.onAddProjectClick();
    }

    handleRemoveProjectClick(e) {
        this.props.onRemoveProjectClick(this.props.selectedProjectId);
    }

    handleProjectNameSubmit(projectSelectorId, newProjectName, oldProjectName) {
        this.props.onProjectNameSubmit(projectSelectorId, newProjectName, oldProjectName);
    }
}

export default Sidebar;