import React from 'react';
import VisibleThemeSettings from './AppSettingsMenu/ThemeSettings';

const ThemeBuilderDashboard = () => {
    return (
        <div style={{
            position: "absolute",
            width: '100%',
            height: '25%',
            overflowY: 'scroll',
            bottom: 0, left: 0,
            background: this.props.theme.palette.background.paper,
            zIndex: 5000
        }}>
                <VisibleThemeSettings/>
            </div>
    );
};

export default ThemeBuilderDashboard;