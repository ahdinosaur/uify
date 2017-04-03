const Logger = require('pino')

module.exports = Log

function Log (subname, verbose) {
  const name = `uify/${subname}`
  const level = verbose ? 'debug' : 'info'
  return Logger({ name, level })
}
