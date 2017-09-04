import React from 'react';
import '../assets/css/ProjectSelector.css';

class ProjectSelector extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render(){
        var currentClassName = this.props.isSelected ? "ProjectSelectorActiveStyle" : "ProjectSelectorInactiveStyle";
        var projectLabelJSX = this.getProjectLabelJSX(this.props);

        return (
            <div className={currentClassName} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
                {projectLabelJSX}
            </div>
        )
    }

    getProjectLabelJSX(props) {
        if (this.props.isInputOpen) {
            return (
                <input id="projectSelectorInput" type="text" defaultValue={props.projectName} onKeyPress={this.handleKeyPress}/>
            )
        }

        else {
            return (
                <label className="ProjectSelectorText">{props.projectName}</label>
            )
        }
    }

    handleClick(e) {
        this.props.onClick(e, this.props.projectSelectorId);
    }

    handleDoubleClick(e) {
        this.props.onDoubleClick(e, this.props.projectSelectorId);
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.props.onProjectNameSubmit(this.props.projectSelectorId, document.getElementById("projectSelectorInput").value);
        }
    }


}

export default ProjectSelector;