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
                    <div className="ShutdownScreenContentContainer">
                        <Spinner size="big" />
                        <div className="ShutdownScreenTitle"> Exiting </div>
                        <div className="ShutdownScreenSubTitle"> Just backing up your work first </div>
                    </div>
                </CenteringContainer>
            </div>
        )
    }
}

export default ShutdownScreen;