import React from 'react';
import VisibleAccountSettingsPage from '../AppSettingsMenu/AccountSettingsPage';
import FullScreenView from '../../layout-components/FullScreenView';
import { withTheme } from '@material-ui/core';

const AccountStep = (props) => {
    let style = {
        width: '100%',
        height: '100%',
        background: props.theme.palette.background.default,
    }

    return (
        <FullScreenView>
            <div
            style={style}>
                <VisibleAccountSettingsPage/>
            </div>
            
        </FullScreenView>
    );
};

export default withTheme()(AccountStep);