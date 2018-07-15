var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './builds/Pounder-win32-x64/',
    outputDirectory: './installers/windows/',
    authors: 'Charlie Hall',
    exe: 'pounder.exe',
    noMsi: true,
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

