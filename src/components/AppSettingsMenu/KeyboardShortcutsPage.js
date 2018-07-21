import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class KeyboardShortcutsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="AppSettingsIFrameContainer">
                <iframe className="AppSettingsIFrame" src="./help-pages/keyboardshortcuts.html"></iframe>
            </div>
        )
    }
}

export default KeyboardShortcutsPage;