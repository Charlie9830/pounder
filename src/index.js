import React from 'react';
import { render } from 'react-dom';
import VisibleApp from './components/App';
import Path from 'path';
import { setupBackend, appStore, setupFirebase } from 'pounder-redux';
import { Provider } from 'react-redux';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Set Document Background Style.
document.body.style.background = "rgba(37,37,37,255)";

// Setup Backend.
setupBackend("production", "desktop");

// Now we can render our application into it
render( <Provider store={appStore}><VisibleApp/></Provider>, document.getElementById('root') );
