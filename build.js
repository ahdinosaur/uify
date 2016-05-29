'use strict'

const assert = require('assert')
const fs = require('fs')
const extend = require('xtend')
const Path = require('path')
const browserify = require('browserify')
const watchify = require('watchify')
const envify = require('envify')
const uglifyify = require('uglifyify')
const collapser = require('bundle-collapser/plugin')
const exorcist = require('exorcist')
const Stream = require('readable-stream')

const log = require('./log').child({ name: 'uify/build'})

module.exports = build
module.exports.log = log

const defaults = {
  basedir: process.cwd(),
  filename: 'bundle.js',
  plugins: [],
  watch: false,
  minify: false
}

const config = Path.join(__dirname, './config.js')

function build (options, callback) {
  assert.equal(typeof options, 'object', 'options are required')
  assert.equal(typeof callback, 'function', 'callback is required')
  assert.equal(typeof options.entry, 'string', 'entry is required')
  assert.equal(typeof options.output, 'string', 'output is required')

  options = extend(defaults, options)
  const entry = Path.resolve(options.basedir, options.entry)
  const compress = Compressor(options)

  var stats = {}
  var bundler = browserify(extend(
    { debug: true },
    options.watch ? watchify.args : null
  ))
  .add(entry)
  .require(entry, { expose: 'app' })
  .require(config, { expose: 'config' })
  .plugin(customize, options)
  .transform(envify)
  .transform(compress(uglifyify), {
    global: true
  })
  .plugin(options.compress ? collapser : noop)

  if (options.watch) {
    bundler = bundler.plugin(
      watchify,
      typeof options.watch === 'object'
        ? options.watch : undefined
    )

    bundler.on('update', bundle)
  }

  bundle()

  bundler.on('bytes', function (b) { stats.bytes = b });
  bundler.on('time', function (t) { stats.time = t });

  function bundle () {
    bundler
    .bundle()
    .on('error', error)
    .pipe(compress(Exorcise(options))())
    .pipe(WriteStream(options))
    .on('finish', done)
  }

  function done () {
    callback(null, stats)
  }

  function error (err) {
    callback(err)
  }
}

function customize (browserify, options) {
  options.plugins.forEach(plugin => browserify.plugin(plugin))
}

function Compressor (options) {
  return function compress (fn) {
    return options.compress ? fn : Stream.PassThrough
  }
}

function Exorcise (options) {
  return function exorcise () {
    return exorcist(
      Path.resolve(options.output, options.filename + '.map'), // output
      null, // uri
      null, // root
      options.basedir // base
    )
  }
}

function WriteStream (options) {
  return fs.createWriteStream(Path.resolve(options.output, options.filename))
}

function noop () {}
