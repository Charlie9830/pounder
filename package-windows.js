const path = require('path');
const packager = require('electron-packager');

var options = {
    dir: '../dist',
    icon: '../src/assets/icons/icon.ico',
    out: `../builds/`,
    platform: 'win32',
    arch: 'x64',
    derefSymlinks: false,
}

packager(options)
  .then(appPaths => { 
      console.log("Complete?");
    })