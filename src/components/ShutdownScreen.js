import React from 'react';
import '../assets/css/ShutdownScreen.css';
import CenteringContainer from '../containers/CenteringContainer';


class ShutdownScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ShutdownScreenContainer">
                <CenteringContainer>
                    <div className="ShutdownScreenSpinner" />
                    <label className="ShutdownScreenTitle">
                        Exiting
                    </label>
                </CenteringContainer>
            </div>
        )
    }
}

export default ShutdownScreen;