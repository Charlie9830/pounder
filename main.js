'use strict';

// Import parts of electron to use
const {app, BrowserWindow, Menu} = require('electron');
const electron = require('electron');
const path = require('path')
const url = require('url')
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isClosing = false;
let readyToClose = false;
let updateDownloaded = false;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

// Logging
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('App starting...');



// function installReactDevtools() {
//   const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

//   installExtension(REACT_DEVELOPER_TOOLS)
//     .then((name) => console.log(`Added Extension:  ${name}`))
//     .catch((err) => console.log('An error occurred: ', err));
// }

function createWindow() {
  // Install Devtools.
  // installReactDevtools();

  // Disable Security Warnings.
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

  // Setup Application Menu. (Without this, Copy/Paste/Undo/Redo/etc shortcuts won't work on MacosX)
  if (process.platform === "darwin") {
    setupApplicationMenu();
  }
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize()

    // Auto Updater.
    setupAutoUpdater();

    // Power Monitor Event Listener.
    electron.powerMonitor.on('resume', () => {
      mainWindow.webContents.send('resume');
    })

    // Window Closing Event Listener.
    mainWindow.addListener('close', event => {
      // Check that we won't fire this code multiple times.
      if (readyToClose === false && isClosing === false) {
        event.preventDefault();
        isClosing = true; // Set this flag incase the user smashes the Exit button multiple times, stops us triggering multiple backups.
        mainWindow.webContents.send('window-closing');
      }
    })

    // Window 'ready-to-close' Listener.
    electron.ipcMain.on('ready-to-close', event => {
      // Pounder Process is ready to close.
      readyToClose = true;
      app.quit();
    })

    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function setupAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-downloaded', (info) => {
    updateDownloaded = true;
    mainWindow.webContents.send('update-downloaded');
  })

  autoUpdater.on('error', (error) => {
    log.log(error);
    if (updateDownloaded === true) {
      // Only inform the user if something has gone wrong after the update has been downloaded. This supresses errors that are
      // thrown when autoUpdater can't reach the update server. Eg: Starting without an internet connection.
      mainWindow.webContents.send('update-error');
    }
    
  })
}

function setupApplicationMenu() {
  var template = [{
    label: "Handball",
    submenu: [
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]},
    { label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
