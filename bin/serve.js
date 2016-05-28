const serve = require('../serve')
const log = require('../log')
  .child({ command: 'serve' })

module.exports = {
  name: 'serve',
  options: [{
    name: 'port',
    default: process.env.PORT || 5000,
    abbr: 'p'
  }],
  command: function (args) {
    serve(args, function (err, server) {
      const address = server.address()
      const port = address.port

      if (err) {
        log.error(err)
      } else {
        log.info({
          url: `http://localhost:${port}`,
          address
        })
      }
    })
  }
}
