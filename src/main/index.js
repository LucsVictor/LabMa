import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exportData } from './utill/ExportUtill.js'
const { machineIdSync } = require('node-machine-id');

// IPC test
ipcMain.on('ping', () => {
  const currentWorkingDirectory = process.cwd()
  console.log('当前工作目录:', currentWorkingDirectory)
  console.log('pong')
})

// 处理打开保存对话框的 IPC 通信
// ipcMain.handle('show-save-dialog', async (event, options) => {
//   const result = await dialog.showSaveDialog(mainWindow, options)
//   return result
// })

ipcMain.handle('show-save-dialog', async (event, columns, data, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options)
  if (result.canceled) {
    console.log('用户取消保存:')
    return false
  } else {
    let result1111 = exportData(columns, data, result.filePath)
    console.log('exportData', result1111)
    return result1111
  }
})

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false, // 开启上下文隔离
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 获取设备 ID
  const deviceId = machineIdSync();
  console.log('设备唯一标识:', deviceId);

  // 将设备 ID 发送到渲染进程
  ipcMain.handle('get-device-id', () => deviceId);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.fykj')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
