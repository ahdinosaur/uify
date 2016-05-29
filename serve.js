const http = require('http')
const Stack = require('stacked')
const serveStatic = require('serve-static')
const pushState = require('connect-pushstate')
const liveReload = require('inject-lr-script')
const Watch = require('watch-lr')
const Log = require('pino-http')

const log = require('./log').child({ name: 'uify/serve'})

module.exports = serve
module.exports.log = log

function serve (options, callback) {
  const stack = Stack()

  stack.use(Log({
    name: 'uify/serve'
  }))

  if (options.watch) {
    stack.use(liveReload())
  }

  // TODO server-side rendering
  
  // if not server-side rendering,
  // to serving for apps using pushState.
  if (!options.render && options.pushState) {
    stack.use(pushState({
      root: '/' // TODO option
    }))
  }

  stack.use(serveStatic(options.destination, {}))

  const server = http.createServer(stack)

  server.listen(options.port, function () {
    callback(null, server)
  })
  .on('error', callback)
}
