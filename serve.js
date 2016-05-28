const http = require('http')

module.exports = serve

function serve (options, cb) {
  const ecstatic = config.livereload ?
    require('ecstatic-lr') : require('ecstatic')

  const server = http.createServer(
    // https://www.npmjs.com/package/ecstatic#ecstaticopts
    ecstatic({
      root: options.destination,
      port: options.port,
    })
  )
}
  
}
