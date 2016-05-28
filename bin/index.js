const subcommand = require('subcommand')
const maximist = require('maximist')
const resolve = require('resolve')
const pkgConf = require('pkg-conf')
const Path = require('path')

const log = require('../log')

const packageOpts = getPackageOpts()
const cwd = getCwd(packageOpts)
const packageArgs = maximist(packageOpts)
const cliArgs = process.argv.slice(2)
const args = cliArgs.concat(packageArgs)

const config = {
  all: function (args) {
    log.info({
      env: process.env.NODE_ENV || 'undefined',
    })
  },
  none: function (args) {
    log.debug('none', args)
  },
  defaults: [{
    name: 'source',
    default: defaultSource(cwd),
    abbr: 's'
  }, {
    name: 'destination',
    default: defaultDest(cwd),
    abbr: 'd',
    alias: ['dest']
  }],
  commands: [
    require('./build'),
    require('./serve'),
  ]
}

const match = subcommand(config)

match(args)

function getPackageOpts () {
  return pkgConf.sync('uify', {
    cwd: process.cwd()
  })
}

function getCwd (pkgOptions) {
  return Path.dirname(pkgConf.filepath(pkgOptions))
}

function defaultSource (cwd) {
  return resolve.sync(cwd)
}

function defaultDest (cwd) {
  return Path.dirname(defaultSource(cwd))
}
