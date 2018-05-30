import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsMenuSubtitle.css';

class AppSettingsMenuSubtitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="AppSettingsMenuSubtitleContainer">
                <label className="AppSettingsMenuSubtitle">{this.props.text}</label>
            </div>
        )
    }
}

export default AppSettingsMenuSubtitle;