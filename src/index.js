import '@babel/polyfill'; // Stops renerator runtime error when using async/await.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupBackend ,appStore } from 'handball-libs/libs/pounder-redux';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import VisibleAppThemeInjector from './components/AppThemeInjector';
// require('typeface-roboto');

if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    const handballVersion = HANDBALL_VERSION;
    const { detect } = require('detect-browser');
    const browser = detect();
    var browserName = "Unknown";
    if (browser) { browserName = browser.name + " " + browser.version; }

    var Rollbar = require("rollbar");
    var rollbar = new Rollbar({
        accessToken: '9ec475a3202f424f942fbc3d02a3e7c6',
        captureUncaught: true,
        captureUnhandledRejections: true,
    });

    rollbar.configure({
        codeVersion: handballVersion,
        captureIp: false,
        payload: {
            environment: "production",
            platform: browserName,
        }
    })
}

require('typeface-open-sans');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

setupBackend("development", "desktop");

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={appStore}>
                <VisibleAppThemeInjector />
        </Provider>
    </MuiPickersUtilsProvider>,
    document.getElementById('root'));