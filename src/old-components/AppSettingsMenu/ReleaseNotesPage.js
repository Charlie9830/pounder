import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class ReleaseNotesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="AppSettingsIFrameContainer">
                <iframe className="AppSettingsIFrame" src="./help-pages/releasenotes.html"></iframe>
            </div>
        )
    }
}

export default ReleaseNotesPage;