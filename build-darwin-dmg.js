var createDMG = require('electron-installer-dmg');

var opts = {
    appPath: './builds/Handball-darwin-x64/Handball.app',
    name: 'Handball',
    debug: true,
}

createDMG(opts, function done(err) { console.log("Finished") });