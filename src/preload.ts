import { dialog, ipcMain, IpcMainEvent } from 'electron'
import { DialogAddonOption } from './index'

function fake(options: ReadonlyArray<DialogAddonOption>) {
  options.forEach(option => {
    if (dialog[option.method]) {
      dialog[option.method] = option.method.toLowerCase().endsWith('sync')
        ? () => option.value
        : async () => option.value
    } else {
      throw new Error(`can't find ${option.method} on dialog module.`)
    }
  })
}

ipcMain.on('SPECTRON_FAKE_DIALOG/SEND', (e: IpcMainEvent, options: ReadonlyArray<DialogAddonOption>) => {
  fake(options)
  e.returnValue = true
})
