const subcommand = require('subcommand')
const cliopts = require('cliclopts')
const Child = require('superchild')
const dargs = require('dargs')
const resolve = require('resolve')
const pkgConf = require('pkg-conf')
const fs = require('fs')
const Path = require('path')

const log = require('../log')

module.exports.run = run

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
      } else {
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
    require('./start'),
    //require('./deploy'),
    require('./build'),
    //require('./push'),
    require('./serve'),
    require('./live'),
  ]
}

const match = subcommand(config)

if (!module.parent) {
  const packageOpts = pkgConf.sync('uify')
  const packageArgs = dargs(packageOpts)
  const cliArgs = process.argv.slice(2)
  const args = cliArgs.concat(packageArgs)

  match(args)
}

function run (scripts) {
  return Object.keys(scripts)
  .map(function (name) {
    const args = dargs(scripts[name])
    const commandLine = ['node', __dirname, name].concat(args).join(' ')
    const child = Child(commandLine)

    log.info({
      type: 'spawn',
      command: name,
      args: args,
      childPid: child.pid,
    })

    child
    .on('stdout', function (data) {
      process.stdout.write(data)
    })
    .on('stderr_data', function (data) {
      process.stderr.write(data)
    })
    .on('exit', function (code, signal) {
      log.error({
        msg: 'child at pid '+child.pid+' exited with '+code+' '+signal,
      })
      process.exit(code, signal)
    })

    return child
  })
}
