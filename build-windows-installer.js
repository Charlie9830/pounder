var electronInstaller = require('electron-winstaller');
var path = require('path');

var iconPath = path.join(__dirname, 'src', 'assets', 'icons', 'icon.ico');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './builds/Handball-win32-x64/',
    outputDirectory: './builds/installers/windows/',
    authors: 'Charlie Hall',
    exe: 'Handball.exe',
    noMsi: true,
    iconUrl: iconPath,
    setupIcon: `./src/assets/icons/icon.ico`,
    loadingGif: `./src/assets/icons/Handball-Icon-Animated.gif`
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

