# SpectronDialogAddon

Mock electron dialog and provide return values.

## Installation

```bash
npm install --save-dev spectron-dialog-addon
```

## Usage

```TypeScript
import { Application } from 'spectron'
import * as electron from 'electron'
import * as path from 'path'
import dialogAddon from '../src/index'
import { expect } from 'chai'

const app = new Application({
  args: [path.join(__dirname, '.')],
  path: (electron as any) as string
})
dialogAddon.apply(app)

describe('mock showOpenDialog', function() {
  this.timeout(10000)

  beforeEach(async () => {
    await app.start()
    dialogAddon.mock([{ method: 'showOpenDialog', value: ['faked.txt'] }])
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
})
```

## API

### apply(application: Application)

initialize dialogAddon

### mock(params: Array<{ method: string, value: any }>)

NOTE: You must call this after Electron app started.

* method: dialog module's method name. ex) showOpenDialog, showSaveDialog...
* value: mocked method return value.

## License

MIT
