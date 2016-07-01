const create = require('../create')

const config = {
  name: 'create',
  options: noDefaults(create.options),
  command: function (args) {
    create(args, function (err) {
      if (err) {
        console.error(err)
      }
      console.log('done')
    })
  }
}

module.exports = config

// util
function noDefaults (options) {
  return options.map(function (option) {
    return Object.keys(option).reduce(function (sofar, nextKey) {
      if (nextKey !== 'default') {
        sofar[nextKey] = option[nextKey]
      }
      return sofar
    }, {})
  })
}
