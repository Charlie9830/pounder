import React from 'react'; 
import '../assets/css/Containers/CenteringContainer.css';

class CenteringContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="CenteringContainerOuter">
                <div className="CenteringContainerInner">
                    <div className="CenteringContainerCentered">
                        <div className="CenteringContainerFinalCentering">

                        {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CenteringContainer;