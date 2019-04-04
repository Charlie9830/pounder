import React from 'react';
import MarkdownViewer from '../MarkdownViewer';

const ShortcutsPage = (props) => {
    let platform = process.platform;
    let source = null;

    if (platform === 'darwin') {
        source = require('../../assets/support-pages/ShortcutsDarwin.md');
    }

    if (platform === 'win32') {
        source = require('../../assets/support-pages/ShortcutsWin32.md');
    }

    source = source === null ? '' : source;

    let style = {
        width: '100%',
        height: '100%',
    }

    return (
        <div
        style={style}>
            <MarkdownViewer
            source={source}/>
        </div>
    );
};

export default ShortcutsPage;