import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { registerLlmRpc } from "./rpc/llmRpc";
import server from './server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let serverApp: any;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ragdrive', process.execPath, [path.resolve(process.argv[1] as string)])
  }
} else {
  app.setAsDefaultProtocolClient('ragdrive')
}

function createWindow() {
  serverApp = server.listen(4000, () => {
    console.log("connected")
  })
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.icns"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 300,
    autoHideMenuBar: process.platform === "win32" ? true : false,
    titleBarStyle: process.platform === "win32" ? "hiddenInset" : "hidden",
    titleBarOverlay: {
      height: process.platform === "win32" ? 12 : 44
    },
  });
  registerLlmRpc(win);

  // open external links in the default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("file://"))
      return { action: "allow" };

    void shell.openExternal(url);
    return { action: "deny" };
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (new Date).toLocaleString());
  });
  if (process.env.NODE_ENV) {
    win.webContents.openDevTools()
  }

  if (VITE_DEV_SERVER_URL)
    void win.loadURL(VITE_DEV_SERVER_URL);
  else
    void win.loadFile(path.join(RENDERER_DIST, "index.html"));

  function sendWindowState() {
    const isFullScreen = win?.isFullScreen()
    win?.webContents.send('window:state', isFullScreen);
  }

  win.on('enter-full-screen', sendWindowState);
  win.on('leave-full-screen', sendWindowState);
  win.on('maximize', sendWindowState);
  win.on('unmaximize', sendWindowState);
  win.on('resize', sendWindowState);

  ipcMain.on('window:getState', sendWindowState);

  // win.on("close", () => {
  //     serverApp?.close?.()
  // })
}


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }

    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine?.pop()?.slice(0, -1)}`)
  })

  app.whenReady().then(() => {
    createWindow()

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

      // Remove the default "Help" menu (if it exists)
      const filteredMenuItems = menuItems.filter(item => item.label !== 'Help');

      // Add the custom Help menu at the end
      const updatedMenu = Menu.buildFromTemplate([
        ...filteredMenuItems,    // All items except the default Help
        ...helpMenuTemplate,     // Add the custom Help menu
      ]);

      // Set the updated menu
      Menu.setApplicationMenu(updatedMenu);
    }
  })

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// app.whenReady().then(createWindow);

app.on("before-quit", () => {
  serverApp?.close?.()
  console.log("closeed")
})

ipcMain.on('app:restart', () => {
  app.relaunch()
  app.exit(0)
})