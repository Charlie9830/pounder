import React from 'react';
import '../assets/css/ShutdownScreen.css';


class ShutdownScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ShutdownScreenContainer">
                <div className="ShutdownScreenOuter">
                    <div className="ShutdownScreenInner">
                        <div className="ShutdownScreenCentered">
                            <div className="ShutdownScreenSpinner"/>
                            <label className="ShutdownScreenTitle">
                                Exiting
                            </label>  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShutdownScreen;