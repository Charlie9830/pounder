import React from 'react';
import '../assets/css/ProjectMessageDisplay.css';

class ProjectMessageDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ProjectMessageDisplayContainer">
                <div className="ProjectMessageDisplayOuter">
                    <div className="ProjectMessageDisplayInner">
                        <div className="ProjectMessageDisplayCentered">
                            <label className="ProjectMessageDisplayMessage">
                                {this.props.message}
                            </label>  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectMessageDisplay;