import React from 'react';
import '../assets/css/ProjectMessageDisplay.css';
import CenteringContainer from '../containers/CenteringContainer';

class ProjectMessageDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ProjectMessageDisplayContainer">
                <CenteringContainer>
                    <label className="ProjectMessageDisplayMessage">
                        {this.props.message}
                    </label>
                </CenteringContainer>
            </div>
        )
    }
}

export default ProjectMessageDisplay;