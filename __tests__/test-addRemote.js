/* eslint-env node, browser, jasmine */
const { makeFixture } = require('./__helpers__/FixtureFS.js')
const snapshots = require('./__snapshots__/test-addRemote.js.snap')
const registerSnapshots = require('./__helpers__/jasmine-snapshots')
const { plugins, addRemote, listRemotes } = require('isomorphic-git')

describe('addRemote', () => {
  beforeAll(() => {
    registerSnapshots(snapshots)
  })
  it('addRemote', async () => {
    // Setup
    let { fs, dir, gitdir } = await makeFixture('test-addRemote')
    plugins.set('fs', fs)
    const remote = 'baz'
    const url = 'git@github.com:baz/baz.git'
    // Test
    await addRemote({ dir, gitdir, remote, url })
    const a = await listRemotes({ dir, gitdir })
    expect(a).toEqual([
      { remote: 'foo', url: 'git@github.com:foo/foo.git' },
      { remote: 'bar', url: 'git@github.com:bar/bar.git' },
      { remote: 'baz', url: 'git@github.com:baz/baz.git' }
    ])
  })
  it('missing argument', async () => {
    // Setup
    let { fs, dir, gitdir } = await makeFixture('test-addRemote')
    plugins.set('fs', fs)
    const remote = 'baz'
    const url = undefined
    // Test
    let error = null
    try {
      await addRemote({ dir, gitdir, remote, url })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
  it('invalid remote name', async () => {
    // Setup
    let { fs, dir, gitdir } = await makeFixture('test-addRemote')
    plugins.set('fs', fs)
    const remote = '@{HEAD~1}'
    const url = 'git@github.com:baz/baz.git'
    // Test
    let error = null
    try {
      await addRemote({ dir, gitdir, remote, url })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
    expect(error.toJSON()).toMatchSnapshot()
  })
})
