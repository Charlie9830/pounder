import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class HelpPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="AppSettingsIFrameContainer">
                <iframe className="AppSettingsIFrame" src="./help-pages/help.html"></iframe>
            </div>
        )
    }
}

export default HelpPage;