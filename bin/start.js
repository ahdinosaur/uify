const start = require('../start')

module.exports = {
  name: 'start',
  options: [{
    name: 'entry',
    abbr: 'e',
    default: '.',
    help: 'path to the entry source file for browserify'
  }, {
    name: 'port',
    abbr: 'o',
    default: process.env.PORT || 5000,
    help: 'port to serve http with budo'
  }, {
    name: 'plugin',
    abbr: 'p',
    default: [],
    help: 'name or path to any additional browserify plugin(s)'
  }],
  command: start
}
