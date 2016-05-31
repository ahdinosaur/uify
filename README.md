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
- exposes your entry file as `require('app')`
- flattens configuration from many sources as `require('config')`
- applies [`es2020`](https://github.com/yoshuawuyts/es2020), a transpiler for the better subset of ES6
- provides source maps for improved debugging
- live reloads your app whenever you change a file
- applies compression when in minify mode

## usage

```shell
uify <subcommand> [options]
  --version, -v         print version
  --help, -h            print help
```

```js
uify[subcommand](options, callback)
```

### create

TODO create new `uify` project.

```shell
uify create my-super-cool-project
? Version: (0.0.0) 1.0.0
? Description: () Some description of your app
? License: (Use arrow keys)
> Apache-2.0
  ISC
  AGPL-3.0
? App directory: (app)
? Build directory: (build)
```

```js
uify.create(options, callback)
```

### start

[live](#live) [development](#build) [server](#serve) for your front-end app.

in your JavaScript code,

- `require('app')` will return the entry module.
- `require('config')` will return your [config](https://github.com/ahdinosaur/simple-rc)

```shell
uify start [options]
  --entry, -e           path to the entry source file for browserify (default: ".")
  --output, -o          path to the output directory where files are built to (default: "build")
  --plugin, -p          name or path to any additional browserify plugin(s) (default: [])
```

```js
uify.start(options, callback)
```

### deploy

TODO [build](#build) and [`git push`](#push) to a remote server, like Github pages.

```shell
uify deploy
```

```js
uify.deploy(options, callback)
```


### build

build project with [`browserify`](https://github.com/substack/node-browserify).

if watch enabled, use [`watchify`](https://github.com/substack/watchify).

in your JavaScript code,

- `require('app')` will return the entry module.
- `require('config')` will return your [config](https://github.com/ahdinosaur/simple-rc)

```shell
uify build [options]
  --entry, -e           path to the entry source file for browserify (default: ".")
  --output, -o          path to the output directory where files are built to (default: "build")
  --watch, -w           watch source tree and rebuild using watchify (default: false)
  --minify, -m          compress bundle using uglifyify, exorcist, and bundle-collapser (default: false)
  --plugin, -p          name or path to any additional browserify plugin(s) (default: [])
```

```js
uify.build(options, callback)
```

`build` accepts the following options:

- `entry` (`e`): entry source file that [browserify](https://github.com/substack/node-browserify) uses to recursively walk `require`'d modules, resulting in a source tree. (default: resolved entry file of current working directory.)
- `output` (`o`): output directory where files are built to. (default: directory of entry source file.)
- `watch` (`w`): watch source tree and rebuild using [`watchify`](https://github.com/substack/watchify). (default: `false`)
- `minify` (`m`): compress bundle using [`uglifyify`](https://github.com/hughsk/uglifyify), [exorcist](https://github.com/thlorenz/exorcist), and [bundle-collapser](https://github.com/substack/bundle-collapser). (default: `false`)

`callback(err)` is called if bundle process fails.

`callback(null, stats)` is called on build (or re-build) with a `stats` object:

- `time`: milliseconds to bundle
- `bytes`: bytes in bundle

### serve

serve static assets with [`serve-static`](https://github.com/expressjs/serve-static).

`serve` accepts the following options:

- `directory` (`d`): directory to serve
- `watch` (`w`): inject livereload script into html with [`inject-lr-script`](https://github.com/mattdesl/inject-lr-script)
- `minify` (`m`): compress assets using [`compression`](https://github.com/expressjs/compression)

```shell
uify serve
  --directory, -d       directory to serve static assets (default: "build")
  --port, -p            port of http server (default: 5000)
  --watch, -w           inject LiveReload script into html files (default: false)
  --minify, -m          compress assets with gzip (default: false)
```

```js
uify.serve(options, callback)
```

`callback(err)` is called if bundle process fails.

`callback(null, server)` is called with [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) instance [once server is listening](https://nodejs.org/api/net.html#net_event_listening)

### live

see [`watch-lr`](https://github.com/ahdinosaur/watch-lr) docs

### push

TODO `git push` to a remote server (like GitHub pages).

```shell
uify push
```

```js
uify.push(options, callback)
```

## inspiration

- [slush-pages](https://github.com/ahdinosaur/slush-pages)
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
