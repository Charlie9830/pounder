import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class AccountSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        
    }

    render() {
        return (
            <div className="AppSettingsVerticalFlexContainer">
                {/* Application startup Fullscreen Mode*/}
                <div className="AppSettingsVerticalFlexItem">
                    <AppSettingsMenuSubtitle text="Account Support not implemented yet"/>
                </div>
            </div>
        )
    }
}

export default AccountSettingsPage;