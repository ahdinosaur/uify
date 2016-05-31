#!/usr/bin/env node

const subcommand = require('subcommand')
const cliopts = require('cliclopts')
const Child = require('superchild')
const dargs = require('dargs')
const pkgConf = require('pkg-conf')
const setBlocking = require('set-blocking')
const fs = require('fs')
const Path = require('path')

const log = require('../log')

module.exports.run = run

const pkgPath = Path.join(__dirname, '../package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

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
  },
  none: function noCommand (args) {
    if (!args.version) {
      usageAll()
    }
  },
  all: function allCommands (args) {
    var commandName = args._[0]
    var command = config.commands.find(function (command) {
      return command.name === commandName
    })
    if (args.version) {
      console.log(pkg.version)
    } else if (args.help) {
      if (command) {
        usageOne(command)
      } else {
        usageAll()
      }
    } else {
      return
    }
    // use setBlocking because of weirdness in node 6
    // where stdout might be cut off due to async
    // that doesn't play well with process.exit()
    setBlocking(true)
    process.exit(0)
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

function usageAll () {
  console.log('Usage: uify <subcommand> [options]')
  console.log('  uify')
  cliopts(config.root.options).print()
  config.commands.forEach(function (sub) {
    console.log('  uify ' + sub.name)
    cliopts(sub.options).print()
  })
}

function usageOne (command) {
  console.log('Usage: uify '+command.name+' [options]')
  console.log('  uify '+command.name)
  cliopts(command.options).print()
}

