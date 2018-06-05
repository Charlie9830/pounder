import React from 'react';
import '../assets/css/ShutdownScreen.css';
import CenteringContainer from '../containers/CenteringContainer';
import Spinner from './Spinner';


class ShutdownScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ShutdownScreenContainer">
                <CenteringContainer>
                    <Spinner size="big"/>
                    <div className="ShutdownScreenTitle">
                        Exiting
                    </div>
                </CenteringContainer>
            </div>
        )
    }
}

export default ShutdownScreen;