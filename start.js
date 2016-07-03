const Path = require('path')
const budo = require('budo')

module.exports = start

function start (options) {
  const plugin = options.plugin
    .concat([requireAppPlugin(options.entry)])

  const server = budo(options.entry, {
    live: true,
    port: options.port,
    serve: 'bundle.js',
    dir: Path.dirname(options.entry),
    host: 'localhost',
    pushState: true,
    verbose: true,
    stream: process.stdout,
    browserify: {
      plugin
    }
  })
}

function requireAppPlugin (entry) {
  return function (browserify) {
    browserify.require(entry, { expose: 'app' })
  }
}
