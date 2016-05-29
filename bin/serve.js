const serve = require('../serve')

module.exports = {
  name: 'serve',
  options: [{
    name: 'directory',
    default: 'build',
    abbr: 'd',
    alias: ['o'],
    help: 'directory to serve static assets'
  }, {
    name: 'port',
    default: process.env.PORT || 5000,
    abbr: 'p',
    help: 'port of http server'
  }, {
    name: 'watch',
    boolean: true,
    default: false,
    abbr: 'w',
    help: 'inject LiveReload script into html files'
  }, {
    name: 'minify',
    boolean: true,
    default: false,
    abbr: 'm',
    help: 'compress assets with gzip'
  }],
  command: function (args) {
    serve(args, function (err, server) {
      if (err) {
        serve.log.error(err)
      } else {
        const address = server.address()
        const port = address.port

        serve.log.info({
          type: 'listen',
          url: `http://localhost:${port}`,
          address
        })
      }
    })
  }
}
