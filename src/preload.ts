import { dialog, Event, ipcMain, BrowserWindow } from 'electron'
import { DialogAddonOption } from './index'

const parseArgs = (...args) => {
  let window = args[0]
  let options = args[1]
  let callback = args[2]
  if (window != null && window.constructor !== BrowserWindow) {
    callback = options
    options = window
    window = null
  }
  if (callback == null && typeof options === 'function') {
    callback = options
    options = null
  }
  const lastArgument = args[args.length - 1]
  if (callback == null && typeof lastArgument === 'function') {
    callback = lastArgument
  }
  return [window, options, callback]
}

function mockFunction(value: any, ...args: any[]) {
  const [window, options, callback] = parseArgs(...args)
  if (callback) {
    setTimeout(() => callback(value), 0)
    return
  }
  return value
}

function fake(options: ReadonlyArray<DialogAddonOption>) {
  options.forEach(option => {
    if (dialog[option.method]) {
      // set this to null
      dialog[option.method] = mockFunction.bind(null, option.value)
    } else {
      throw new Error(`can't find ${option.method} on dialog module.`)
    }
  })
}

ipcMain.on('SPECTRON_FAKE_DIALOG/SEND', (e: Event, options: ReadonlyArray<DialogAddonOption>) => {
  fake(options)
  e.returnValue = true
})
