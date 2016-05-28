const pino = require('pino')

module.exports = pino({
  name: 'uify',
  serializers: {
    err: pino.stdSerializers.err
  }
})
