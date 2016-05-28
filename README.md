# uify

**work in progress**

the end of javascript fatigue: an opinionated set of tools for front-end apps

```shell
# npm install -g ahdinosaur/uify
```

## what

you want to build a front-end app, but which tool should you use?

i've written, copied, and re-written my front-end tools over and over again. i've learned heaps along the journey and am settling into preferred patterns.

here's a grab bag of documented tools to get you building apps again. :)

## features

- generate new projects with ease
- uses the cutting-edge [`browserify`](https://github.com/substack/node-browserify) compiler
- live reloads your app while you develop

## usage

### create

create new `uify` project.

```shell
uify create my-super-cool-project
```

```js
uify.create('my-super-cool-project', (err) => {
  if (err) { throw err }
})
```

### build

build project with [`browserify`](https://github.com/substack/node-browserify).

if watch enabled, use [`watchify`](https://github.com/substack/watchify).

in your code,

- `require('app')` will return the entry module.
- `require('config')` will return your [config](https://github.com/ahdinosaur/simple-rc)

```shell
uify bundle -e app -d build -w
```

```js
uify.bundle({
  entry: 'app',
  destination: 'build'
}, (err, stats) => {
  if (err) { throw err }
  console.log('time', stats.time)
  console.log('bytes', stats.bytes)
})
```

#### options

#### source [s]

default: resolved entry file.

#### destination [d]

default: directory of resolved entry file.

#### watch [w]

default: `false`

#### minify [m]

default: `false`

### callback(err, stats)

`stats` is an object with the following keys:

- `time`: milliseconds to bundle
- `bytes`: bytes in bundle

### serve

serve static assets with [`ecstatic`](https://github.com/jfhbrook/node-ecstatic).

if watch enabled, use [`ecstatic-lr`](https://github.com/ahdinosaur/ecstatic-lr) and [`watch-lr`](https://github.com/ahdinosaur/watch-lr).

```shell
uify serve -w
```

```js
uify.serve({
  watch: true
}, function (err, server) {
  if (err) { throw err }
  // ...
})
```

server returned is `http` server.

### start

bundle javascript and serve assets.

```shell
uify deploy -s 
```

```js
uify.deploy({}, function (err, server) {
  if (err) { throw err }
  // ...
})
```

### deploy

deploy app 

## inspiration

- [bundleify](https://github.com/bendrucker/bundleify)
- [bankai](https://github.com/yoshuawuyts/bankai)
- [browserify for webpack users](https://gist.github.com/substack/68f8d502be42d5cd4942)

## license

The Apache License

Copyright &copy; 2016 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
