import React from 'react';
import '../../assets/css/AppSettingsMenu/HelpPage.css';

var webViewStyle = {
    'width': '100%',
    'height': '100%'
}

class HelpPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="HelpPageWebViewContainer">
                <webview style={webViewStyle} src="https://www.google.com"></webview>
            </div>
        )
    }
}

export default HelpPage;