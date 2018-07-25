import React from 'react';
import { render } from 'react-dom';
import VisibleApp from './components/App';
import Path from 'path';
import { setupBackend, appStore, setupFirebase } from 'pounder-redux';
import { Provider } from 'react-redux';

// Load Open Sans typeface
require('typeface-open-sans');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Setup Backend.
setupBackend("development", "desktop");

// Now we can render our application into it
render( <Provider store={appStore}><VisibleApp/></Provider>, document.getElementById('root') );
