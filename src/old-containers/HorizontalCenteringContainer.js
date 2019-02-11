import React from 'react';
import '../assets/css/Containers/HorizontalCenteringContainer.css';

class HorizontalCenteringContainer extends React.Component {
    render() {
        return (
            <div className="HorizontalCenteringContainer">
                {this.props.children}
            </div>
        )

    }
}

export default HorizontalCenteringContainer;