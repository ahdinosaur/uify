#!/usr/bin/env node

const subcommand = require('subcommand')
const dargs = require('dargs')
const cliopts = require('cliclopts')
const pkgConf = require('pkg-conf')

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
    }]
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
      args.abort = true
      console.log('uify v' + require('../package.json').version)
      console.log('browserify v' + require('browserify/package.json').version)
      console.log('watchify v' + require('watchify/package.json').version)
    } else if (args.help) {
      args.abort = true
      if (command) {
        usageOne(command)
      } else {
        usageAll()
      }
    }
  },
  defaults: [{
    name: 'cwd',
    default: process.cwd(),
    help: 'base directory from which the relative paths are resolved'
  }, {
    name: 'verbose',
    default: true,
    help: 'log noisy debug messages to the console'
  }],
  commands: [
    // require('./create'),
    require('./server')
    // require('./build'),
    // require('./deploy')
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

function usageAll () {
  console.log(`Usage: uify <subcommand> [options]`)
  console.log(`  uify`)
  cliopts(config.root.options).print()
  config.commands.forEach(function (sub) {
    console.log(`  uify ${sub.name}`)
    cliopts(sub.options).print()
  })
}

function usageOne (command) {
  console.log(`Usage: uify ${command.name} [options]`)
  console.log(`  uify ${command.name}`)
  cliopts(command.options).print()
}
