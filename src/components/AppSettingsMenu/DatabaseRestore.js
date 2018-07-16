import React from 'react';
import Button from '../Button';
import Spinner from '../Spinner';
import Moment from 'moment';
import { getUserUid } from 'pounder-firebase';
import '../../assets/css/AppSettingsMenu/DatabaseRestore.css';

class DatabaseRestore extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            localProjectIds: [],
            remoteProjectIds: [],
        }

        // Method Bindings.
        this.getRestoreButtonJSX = this.getRestoreButtonJSX.bind(this);
        this.handleSelectFileClick = this.handleSelectFileClick.bind(this);
        this.getProjectsTableJSX = this.getProjectsTableJSX.bind(this);
        this.handleRestoreProjectChanged = this.handleRestoreProjectChanged.bind(this);
        this.handleRestoreButtonClick = this.handleRestoreButtonClick.bind(this);
        this.getDateJSX = this.getDateJSX.bind(this);
    }

    render() {
        var projectsTableJSX = this.getProjectsTableJSX();
        var dateJSX = this.getDateJSX();
        var restoreButtonJSX = this.getRestoreButtonJSX();

        if (this.props.isReadingBackupFile === true) {
            return (
                <div className="DatabaseRestore">
                    <Spinner size="medium"/>
                </div>
            )
        }


        else {
            return (
                <div className="DatabaseRestore">
                    <div className="DatabaseRestoreHeaderContainer">
                        <div className="DatabaseRestoreButtonGroup">
                            <div className="DatabaseRestoreButtonLabel"> Select file </div>
                            <Button text="Go" size="small" onClick={this.handleSelectFileClick} />
                        </div>
                    </div>
                    
                    {dateJSX}
                    {projectsTableJSX}
                    <div className="DatabaseRestoreFooterContainer">
                        {restoreButtonJSX}
                    </div>
                    
                </div>
            )
        }
    }

    getDateJSX() {
        if (this.props.backupData !== undefined && this.props.backupData !== null) {
            var backupData = this.props.backupData;

            var humanFriendlyDate = Moment(backupData.createdAt).format("dddd, MMMM Do YYYY, h:mm a");
            var timeAgo = Moment(backupData.createdAt).fromNow();

            return (
                <div className="DatabaseRestoreDateContainer">
                    <div className="DatabaseRestoreDate"> {`Created ${timeAgo} on ${humanFriendlyDate}`} </div>
                </div>
            )
        }

    }

    getRestoreButtonJSX() {
        if (this.props.backupData !== null) {
            var isEnabled = this.state.localProjectIds.length > 0 || this.state.remoteProjectIds.length > 0;
            return (
                <React.Fragment>
                    <div className="DatabaseRestoreButtonGroup">
                        <div className="DatabaseRestoreButtonLabel"> Restore </div>
                        <Button text="Go" size="small" isEnabled={isEnabled} onClick={this.handleRestoreButtonClick} />
                    </div>
                </React.Fragment>
            )
        }
    }

    getFilteredRemoteProjects(remoteProjects) {
        // Filter out any projects the current user isn't an Owner of.
        return remoteProjects.filter(project => {
            var memberIndex = project.members.findIndex(member => {
                return member.userId === getUserUid() && member.role === 'owner';
            })

            return memberIndex !== -1;
        })
    }

    getProjectsTableJSX() {
        var data = this.props.backupData;
        if (data !== null) {
            var localProjects = data.localProjectData.projects;

            var remoteProjects = this.getFilteredRemoteProjects(data.remoteProjects)

            var localProjectsJSX = localProjects.map((item, index, array) => {
                var showDivider = array.length !== 1 && index !== (array.length - 1);

                return (
                    <React.Fragment key={index}>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="DatabaseRestoreCheckboxContainer" data-showdivider={showDivider}>
                                        <input type="checkbox" className="DatabaseRestoreCheckbox" defaultChecked={false}
                                            onClick={(event) => { this.handleRestoreProjectChanged(event, 'local', item.uid) }} />
                                    </div>
                                </td>
                                <td>
                                    <div className="DatabaseRestoreProjectNameContainer" data-showdivider={showDivider}>
                                        <div className="DatabaseRestoreProjectName"> {item.projectName} </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </React.Fragment>
                )
            })

            var remoteProjectsJSX = remoteProjects.map((item, index, array) => {
                var showDivider = array.length !== 1 && index !== (array.length - 1);

                return (
                    <React.Fragment key={index}>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="DatabaseRestoreCheckboxContainer" data-showdivider={showDivider}>
                                    <input type="checkbox" className="DatabaseRestoreCheckbox" defaultChecked={false}
                                    onClick={(event) => { this.handleRestoreProjectChanged(event, 'remote', item.uid) }}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="DatabaseRestoreProjectNameContainer" data-showdivider={showDivider}>
                                    <div className="DatabaseRestoreProjectName"> {item.projectName} </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </React.Fragment>
                )
            })           

            return (
                <div className="DatabaseRestoreTablesContainer">
                    {/* Local Projects  */} 
                    <div className="DatabaseRestoreTableContainer">
                        <div className="DatabaseRestoreTableHeader">
                            Personal Projects
                        </div>
                        <table className="DatabaseRestoreTable">
                            {localProjectsJSX}
                        </table>
                    </div>
                    

                    {/* Remote Projects  */} 
                    <div className="DatabaseRestoreTableContainer">
                        <div className="DatabaseRestoreTableHeader">
                            Shared Projects
                        </div>
                        <table className="DatabaseRestoreTable">
                            {remoteProjectsJSX}
                        </table>
                    </div>
                </div>
            )
        }
    }

    handleRestoreProjectChanged(event, type, uid) {
        var isChecked = event.currentTarget.checked;

        // Local.
        if (type === 'local') {
            var localProjectIds = this.state.localProjectIds;

            if (isChecked) {
                localProjectIds.push(uid);
                this.setState({ localProjectIds: localProjectIds });
            }

            else {
                var index = localProjectIds.findIndex(item => {
                    return item === uid;
                })

                if (index !== -1) {
                    localProjectIds.splice(index, 1);
                    this.setState({ localProjectIds: localProjectIds });
                }
            }
        }

        // Remote.
        if (type === 'remote') {
            var remoteProjectIds = this.state.remoteProjectIds;

            if (isChecked) {
                remoteProjectIds.push(uid);
                this.setState({ remoteProjectIds: remoteProjectIds });
            }

            else {
                var index = remoteProjectIds.findIndex(item => {
                    return item === uid;
                })

                if (index !== -1) {
                    remoteProjectIds.splice(index, 1);
                    this.setState({ remoteProjectIds: remoteProjectIds });
                }
            }
        }
    }

    handleSelectFileClick() {
        this.props.onSelectFileClick();
    }

    handleRestoreButtonClick() {
        this.props.onRestoreButtonClick(this.state.localProjectIds, this.state.remoteProjectIds);
    }
}

export default DatabaseRestore;