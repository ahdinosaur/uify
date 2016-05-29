const Child = require('superchild')

const run = require('./').run

module.exports = {
  name: 'start',
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
    name: 'plugin',
    abbr: 'p',
    default: [],
    help: 'name or path to any additional browserify plugin(s)'
  }],
  command: function (args) {
    const children = run({
      build: {
        entry: args.entry,
        output: args.output,
        plugin: args.plugin,
        watch: true
      },
      serve: {
        directory: args.output,
        watch: true
      },
      live: {
        files: args.output+"/**/*.{js,html,css}"
      }
    })
  }
}
