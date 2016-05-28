const build = require('../build')
const log = require('../log')
  .child({ command: 'build' })


module.exports = {
  name: 'build',
  options: [{
    name: 'plugin',
    default: [],
    abbr: 'p'
  }],
  command: function (args) {
    if (args.plugin && !Array.isArray(args.plugin)) {
      args.plugin = [args.plugin]
    }

    build(opts, function (err, stats) {
      if (err) {
        log.error(err)
      } else {
        log.info(
          stats.bytes + " bytes written to " +
          opts.destination + " (" +
          (stats.time / 1000).toFixed(2) + " seconds)"
        )
      }
    })
  }
}

