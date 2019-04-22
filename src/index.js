import '@babel/polyfill'; // Stops renerator runtime error when using async/await.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupBackend ,appStore } from 'handball-libs/libs/pounder-redux';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import VisibleAppThemeInjector from './components/AppThemeInjector';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
// require('typeface-roboto');

if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    const handballVersion = HANDBALL_VERSION;

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
            platform: 'desktop',
        }
    })
}

require('typeface-open-sans');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

setupBackend("production", "desktop");

let DragSourcedApp = DragDropContext(HTML5Backend)(VisibleAppThemeInjector);

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={appStore}>
                <DragSourcedApp/>
        </Provider>
    </MuiPickersUtilsProvider>,
    document.getElementById('root'));