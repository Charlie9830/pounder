var createDMG = require('electron-installer-dmg');

var opts = {
    appPath: './builds/Handball-darwin-x64/Handball.app',
    name: 'Handballv203rc',
    debug: true,
}

createDMG(opts, function done(err) { console.log("Finished") });