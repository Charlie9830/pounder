import React, { Component } from 'react';
import { withTheme } from '@material-ui/core';

class FullScreenView extends Component {
    render() {
        let { theme } = this.props;

        let containerStyle = {
            width: '100vw',
            height: '100vh',
            background: theme.palette.background.default,
            overflowY: 'scroll'
        }

        return (
            <div style={containerStyle}>
                { this.props.children }
            </div>
        );
    }
}

export default withTheme()(FullScreenView);