import * as path from 'path'

import { Application, AppConstructorOptions } from 'spectron'
import { MenuItem } from 'electron'

export interface DialogAddonOption {
  method: string
  value: any
}

export class DialogAddon {
  private app: Application

  apply(app: Application) {
    this.app = app
    // tslint:disable-next-line:no-string-literal
    this.app['args'].unshift(path.join(__dirname, 'preload.js'))
    // tslint:disable-next-line:no-string-literal
    this.app['args'].unshift('--require')
    return this.app
  }

  mock(options: ReadonlyArray<DialogAddonOption>) {
    return this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', options)
  }
}

const dialogAddon = new DialogAddon()
export default dialogAddon
