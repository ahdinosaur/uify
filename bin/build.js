const Path = require('path')

const build = require('../build')

module.exports = {
  name: 'build',
  options: [{
    name: 'entry',
    abbr: 'e',
    default: '.',
    help: 'path to the entry source file for browserify'
  }, {
    name: 'output',
    abbr: 'o',
    alias: ['directory'],
    default: 'build',
    help: 'path to the output directory where files are built to'
  }, {
    name: 'watch',
    abbr: 'w',
    boolean: true,
    default: false,
    help: 'watch source tree and rebuild using watchify'
  }, {
    name: 'minify',
    abbr: 'm',
    boolean: true,
    default: false,
    help: 'compress bundle using uglifyify, exorcist, and bundle-collapser'
  }, {
    name: 'plugin',
    abbr: 'p',
    default: [],
    help: 'name or path to any additional browserify plugin(s)'
  }],
  command: function (args) {
    if (args.plugin && !Array.isArray(args.plugin)) {
      args.plugin = [args.plugin]
    }

    build(args, function (err, stats) {
      // TODO receive fs stat objects
      // for when we want to build multiple files
      if (err) {
        build.log.error(err)
      } else {
        build.log.info({
          msg: stats.bytes + " bytes written to " + args.output
            + " (" + (stats.time / 1000).toFixed(2) + " seconds)",
        })
      }
    })
  }
}
