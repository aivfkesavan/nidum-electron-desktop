import { app, ipcMain, shell } from 'electron';
// import { autoUpdater } from 'electron-updater';
import serve from 'electron-serve';
import path from 'path';

import { createWindow } from './helpers';
import startServer from '../server';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1200,
    height: 600,
    minWidth: 800,
    minHeight: 300,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      height: 44
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

  startServer()
})()

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

app.on('ready', () => {
  console.log('App ready event triggered.');
  // autoUpdater.checkForUpdatesAndNotify();
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