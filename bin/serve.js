const summary = require('server-summary')

const serve = require('../serve')
const log = require('../log')
  .child({ command: 'build' })

module.exports = {
  name: 'serve',
  options: [{
    name: 'port',
    default: process.env.PORT || 5000,
    abbr: 'p'
  }],
  command: function (args) {
    serve(args, function (err, server) {
      if (err) {
        log.error(err)
      } else {
        summary(server, log.info)()
      }
    })
  }
}
