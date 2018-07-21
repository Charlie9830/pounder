import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="AppSettingsIFrameContainer">
                <iframe className="AppSettingsIFrame" src="./help-pages/welcome.html"></iframe>
            </div>
        )
    }
}

export default WelcomePage;