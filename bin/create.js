const create = require('../create')

const config = {
  name: 'create',
  options: [{
    name: 'name',
    abbr: 'n',
    default: 'The App',
    help: 'name of your app'
  }, {
    name: 'description',
    abbr: 'd',
    default: 'this app is the best :)',
    help: 'description of your app'
  }, {
    name: 'author',
    abbr: 'w',
    help: 'the online name for you, the author'
  }, {
    name: 'license',
    default: 'Apache-2.0',
    abbr: 'm',
    help: 'SPDX identifier of source code license'
  }],
  command: function (args) {
  }
}

module.exports = config
