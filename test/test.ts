import { Application } from 'spectron'
import * as electron from 'electron'
import * as path from 'path'
import dialogAddon from '../dist'
import { expect } from 'chai'

const app = new Application({
  args: [path.join(__dirname, '..', 'test-app')],
  path: electron.toString()
})
dialogAddon.apply(app)

describe('mock showOpenDialog', () => {
  beforeEach(async () => {
    await app.start()
    await app.client.waitUntilWindowLoaded()
    dialogAddon.mock([
      { method: 'showOpenDialog', value: { filePaths: ['faked.txt'] } },
      { method: 'showMessageBoxSync', value: 2 }
    ])
  })

  afterEach(async () => {
    await app.stop()
  })

  it('should return faked.txt', async () => {
    await app.client.waitForExist('#show-open-dialog-button')
    await app.client.click('#show-open-dialog-button')
    const text: any = await app.client.getText('#return-value')
    expect(text).to.equal(JSON.stringify(['faked.txt']))
  })

  it('should return 2', async () => {
    await app.client.waitForExist('#show-message-box-sync-button')
    await app.client.click('#show-message-box-sync-button')
    const text: any = await app.client.getText('#return-value')
    expect(text).to.equal('2')
  })
})
