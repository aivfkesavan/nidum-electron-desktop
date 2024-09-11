import { app, ipcMain, shell, dialog, Menu } from 'electron';
import serve from 'electron-serve';
import path from 'path';

import { createWindow } from './helpers';
import startServer from '../server';

let mainWindow;
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ragdrive', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('ragdrive')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })

  app.whenReady().then(() => {
    createWindowHelper()

    // Add the custom "Help" menu only for macOS (darwin)
    if (process.platform === 'darwin') {
      // Define a custom Help menu
      const helpMenuTemplate = [
        {
          label: 'Help',
          submenu: [
            {
              label: 'Help Information',
              click: () => {
                // Display help message with a description, email, and link
                dialog.showMessageBox({
                  type: 'info',
                  title: 'Help',
                  message: 'For assistance, you can reach us at info@nidum.ai or visit our website.',
                  detail: 'Visit https://ragdrive.com/ for more information.',
                  buttons: ['Open Website', 'Close'],
                }).then((result) => {
                  // If the user clicks 'Open Website', open the URL
                  if (result.response === 0) {
                    shell.openExternal('https://ragdrive.com/');
                  }
                });
              },
            },
          ],
        },
      ];

      // Get the current application menu
      const defaultMenu = Menu.getApplicationMenu();
      const menuItems = defaultMenu ? defaultMenu.items : [];

      // Merge Help menu into the default menu items
      const updatedMenu = Menu.buildFromTemplate([
        ...menuItems,         // Keep all existing items
        ...helpMenuTemplate,  // Add Help menu at the end
      ]);

      // Set the updated menu
      Menu.setApplicationMenu(updatedMenu);
    }
  })

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}

async function createWindowHelper() {
  mainWindow = createWindow('main', {
    width: 1200,
    height: 600,
    minWidth: 800,
    minHeight: 300,
    autoHideMenuBar: process.platform === "win32" ? true : false,
    titleBarStyle: process.platform === "win32" ? "hiddenInset" : "hidden",
    titleBarOverlay: {
      height: process.platform === "win32" ? 12 : 44
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }

  function sendWindowState() {
    const isFullScreen = mainWindow.isFullScreen()
    mainWindow.webContents.send('window:state', isFullScreen);
  }

  mainWindow.on('enter-full-screen', sendWindowState);
  mainWindow.on('leave-full-screen', sendWindowState);
  mainWindow.on('maximize', sendWindowState);
  mainWindow.on('unmaximize', sendWindowState);
  mainWindow.on('resize', sendWindowState);

  ipcMain.on('window:getState', sendWindowState);

  startServer()
}

app.on('ready', () => {
  console.log('App ready event triggered.');
});

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.on('app:restart', () => {
  app.relaunch()
  app.exit(0)
})

// autoUpdater.setFeedURL({
//   provider: 'generic',
//   url: 'https://production.haive.in:5000/download/nidum_executables/',
// });

// autoUpdater.on('checking-for-update', () => {
//   console.log('Checking for updates...');
// });

// autoUpdater.on('update-available', (info) => {
//   // console.log('Update available.');
//   // console.log(`Latest version available: ${info.version}`);
//   // console.log('Prompting user to download the update...');

//   dialog.showMessageBox({
//     type: 'info',
//     title: 'Update Available',
//     message: 'A new version is available. Do you want to download it now?',
//     buttons: ['Download', 'Cancel']
//   }).then((result) => {
//     const buttonIndex = result.response;

//     if (buttonIndex === 0) {
//       // console.log('User chose to download the update.');
//       autoUpdater.downloadUpdate()
//     } else {
//       console.log('User canceled the update download.');
//     }
//   });
// });

// autoUpdater.on('update-not-available', (info) => {
//   console.log('No updates available.');
//   console.log(`Checked version: ${info.version}`);
// });

// autoUpdater.on('error', (err) => {
//   console.log('Error in auto-updater:', err);
// });

// autoUpdater.on('download-progress', (progressObj) => {
//   console.log(`Download speed: ${progressObj.bytesPerSecond} B/s`);
//   console.log(`Downloaded ${progressObj.percent}%`);
//   console.log(`${progressObj.transferred} bytes out of ${progressObj.total} bytes.`);
// });

// autoUpdater.on('update-downloaded', (info) => {
//   console.log('Update downloaded.');
//   console.log(`Downloaded version: ${info.version}`);
//   console.log('Prompting user to restart the application...');

//   dialog.showMessageBox({
//     type: 'info',
//     title: 'Update Ready',
//     message: 'A new version has been downloaded. Restart the application to apply the updates.',
//     buttons: ['Restart', 'Later']
//   }).then((returnValue) => {
//     if (returnValue.response === 0) {
//       console.log('User chose to restart the application to install the update.');
//       autoUpdater.quitAndInstall(false, true);
//     } else {
//       console.log('User chose to install the update later.');
//     }
//   });
// });
