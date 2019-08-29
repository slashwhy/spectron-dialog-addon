const { app, Menu, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win
let count = 0

async function showOpenDialog() {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [
      {
        extensions: ['txt'],
        name: 'text file'
      }
    ],
    properties: ['openFile'],
    title: 'open'
  })
  return filePaths
}

function showMessageBoxSync() {
  const response = dialog.showMessageBoxSync(
    {
      buttons: ['0', '1', '2'],
      message: 'message'
    }
  )
  return response
}

function createWindow() {
  win = new BrowserWindow({
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
    width: 800
  })
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  win.on('closed', () => {
    win = null
  })
  ipcMain.on('show-open-dialog', async e => {
    e.returnValue = await showOpenDialog()
  })
  ipcMain.on('show-message-box-sync', e => {
    e.returnValue = showMessageBoxSync()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
