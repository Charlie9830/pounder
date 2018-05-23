import React from 'react';
import '../assets/css/ProjectSelector.css';

class ProjectSelector extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.getDueDateCountsJSX = this.getDueDateCountsJSX.bind(this);
    }

    render(){
        var projectLabelJSX = this.getProjectLabelJSX(this.props);
        var dueDateCounts = this.getDueDateCountsJSX(this.props);

        return (
            <div>
                <div className="ProjectSelectorContainer" onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
                    <div className="ProjectSelectorFlexContainer">
                        <div className="ProjectSelectorLabelContainer">
                            {projectLabelJSX}
                        </div>
                        <div className="ProjectSelectorIconContainer">
                            {dueDateCounts}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getDueDateCountsJSX(props) {
        if (props.dueDateDisplay == undefined || props.dueDateDisplay == {}) {
            return ( <div/>)
        }
        
        return (
            <div>
                <div className="ProjectSelectorIcon" data-colour="Red" data-count={props.dueDateDisplay.reds}>
                    <label className="ProjectSelectorIconText"> {props.dueDateDisplay.reds} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Blue" data-count={props.dueDateDisplay.reds}>
                    <label className="ProjectSelectorIconText"> {props.dueDateDisplay.reds} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Yellow" data-count={props.dueDateDisplay.yellows}>
                    <label className="ProjectSelectorIconText"> {props.dueDateDisplay.yellows} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Green" data-count={props.dueDateDisplay.greens}>
                    <label className="ProjectSelectorIconText"> {props.dueDateDisplay.greens} </label>
                </div>
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
                <label className="ProjectSelectorText" data-isselected={this.props.isSelected}>{props.projectName}</label>
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