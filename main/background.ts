import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import { app, ipcMain } from 'electron'
import logger from 'electron-log'
import serve from 'electron-serve'
import path from 'path'

import { createWindow } from './helpers'
import startServer from '../server'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }

  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: "https://github.com/aivfkesavan/nidum-electron-desktop.git",
    },
    updateInterval: "1 day",
    logger,
  })

  startServer()
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
