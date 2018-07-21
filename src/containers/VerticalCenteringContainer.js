import React from 'react';
import '../assets/css/Containers/VerticalCenteringContainer.css';

class VerticalCenteringContainer extends React.Component {
    render() {
        return (
            <div className="VerticalCenteringContainer">
                {this.props.children}
            </div>
        )

    }
}

export default VerticalCenteringContainer;