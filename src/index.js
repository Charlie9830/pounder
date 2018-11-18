import React from 'react';
import { render } from 'react-dom';
import VisibleApp from './components/App';
import Path from 'path';
import { setupBackend, appStore, setupFirebase } from 'handball-libs/libs/pounder-redux';
import { Provider } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

if (process.env.NODE_ENV !== 'development') {
  var Rollbar = require("rollbar");
  var rollbar = new Rollbar({
    accessToken: '9c728629baff4e7480314f39a5c4f12e',
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  rollbar.configure({
    codeVersion: HANDBALL_VERSION,
    captureIp: false,
    payload: {
      environment: "production",
      platform: process.platform,
    }
  })
}

// Load Open Sans typeface
require('typeface-open-sans');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Setup Backend.
setupBackend("production", "desktop");

let DragSourcedApp = DragDropContext(HTML5Backend)(VisibleApp);

// Now we can render our application into it
render( <Provider store={appStore}><DragSourcedApp/></Provider>, document.getElementById('root') );
