const { createServer } = require('http')
const parseBundlerArgv = require('browserify/bin/args')
const Sender = require('http-sender')

const Handler = require('../server')
const Log = require('../log')

module.exports = {
  name: 'server',
  options: [{
    name: 'entry',
    abbr: 'e',
    default: './',
    help: 'path to the entry source file for bundler (browserify)'
  }, {
    name: 'host',
    abbr: 'H',
    default: 'localhost',
    help: 'the host to bind server'
  }, {
    name: 'port',
    abbr: 'p',
    default: '8080',
    help: 'the port to bind server'
  }, {
    name: 'debug',
    abbr: 'd',
    default: true,
    help: 'enable source maps'
  }, {
    name: 'watch',
    abbr: 'w',
    default: true,
    help: 'enable bundle watcher (watchify)'
  }, {
    name: 'live',
    abbr: 'l',
    default: true,
    help: 'enable live reload for development'
  }, {
    name: 'livePort',
    help: 'a custom port to bind LiveReload server'
  }, {
    name: 'optimize',
    abbr: 'o',
    default: false,
    help: 'optimize bundle for production'
  }, {
    name: 'cache',
    abbr: 'c',
    default: false,
    help: 'bundle once and cache for production'
  }, {
    name: 'script',
    default: 'bundle.js',
    help: 'the absolute path to serve the JavaScript bundle'
  }, {
    name: 'css',
    help: 'optional Cascading StyleSheet in default index.html'
  }, {
    name: 'title',
    help: 'optional title for the default index.html'
  }, {
    name: 'lang',
    default: 'en',
    help: 'optional language for the default index.html'
  }, {
    name: 'head',
    default: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    help: 'optional string to insert into the default index.html between <head> and </head>'
  }, {
    name: 'body',
    help: 'optional string to insert into the default index.html between <body> and </body>'
  }, {
    name: 'favicon',
    help: 'optional favicon url for default index.html page'
  }],
  command: function (args) {
    if (args.h || args.help || args.v || args.version) return

    const log = Log('server', args.verbose)
    args.log = log

    const bundlerArgvIndex = process.argv.indexOf('--')
    if (bundlerArgvIndex !== -1) {
      const bundlerArgv = process.argv.slice(bundlerArgvIndex)
      const bundlerArgs = parseBundlerArgv(bundlerArgv)
      args.bundlerArgs = bundlerArgs
    }

    const handler = Handler(args)
    const Send = Sender({ log })

    const server = createServer((req, res) => {
      handler(req, res, {}, Send(req, res))
    })

    const { host, port } = args
    return server.listen({ host, port }, () => {
      log.info({
        message: 'listening',
        port: server.address().port,
        env: process.env.NODE_ENV || 'undefined'
      })
    })
  }
}
