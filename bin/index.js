const subcommand = require('subcommand')
const cliopts = require('cliclopts')
const maximist = require('maximist')
const resolve = require('resolve')
const pkgConf = require('pkg-conf')
const fs = require('fs')
const Path = require('path')

const log = require('../log')

const packageOpts = getPackageOpts()
const cwd = getCwd(packageOpts)
const packageArgs = maximist(packageOpts)
const cliArgs = process.argv.slice(2)
const args = cliArgs.concat(packageArgs)

module.exports.cwd = cwd

const config = {
  root: {
    options: [{
      name: 'version',
      boolean: true,
      abbr: 'v',
      help: 'print version'
    }, {
      name: 'help',
      boolean: true,
      abbr: 'h',
      help: 'print help'
    }],
    command: function noCommand (args) {
      if (args.version) {
        const pkgPath = Path.join(__dirname, '../package.json')
        const pkg = fs.readFileSync(pkgPath, 'utf8')
        console.log(pkg.version)
      } else if (args.help) {
        console.log('Usage: uify <subcommand> [options]')
        console.log('  uify')
        cliopts(config.root.options).print()
        config.commands.forEach(function (sub) {
          console.log('  uify ' + sub.name)
          cliopts(sub.options).print()
        })
      }
    }
  },
  defaults: [{
    name: 'basedir',
    abbr: 'b',
    default: process.cwd(),
    help: 'base directory from which the relative paths are resolved'
  }],
  commands: [
    require('./build'),
    require('./serve'),
    require('./live'),
    //require('./start'),
    //require('./push'),
    //require('./deploy'),
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
