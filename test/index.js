const test = require('tape')

const uify = require('../')

test('uify', function (t) {
  t.ok(uify, 'module is require-able')
  t.end()
})
