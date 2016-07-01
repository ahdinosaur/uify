const install = require('npm-install-package')
const copy = require('copy-template-dir')
const prompt = require('inquirer').prompt
const today = require('dates-of-today')
const assign = require('xtend/mutable')
const series = require('run-series')
const gitInit = require('git-init')
const mkdirp = require('mkdirp')
const path = require('path')
const rc = require('rc')

const log = require('./log').child({ name: 'uify/create'})

const options = [
  {
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
    name: 'authorName',
    abbr: 'w',
    help: 'your personal name'
  }, {
    name: 'authorGithub',
    abbr: 'w',
    help: 'your GitHub username'
  }, {
    name: 'license',
    default: 'Apache-2.0',
    abbr: 'm',
    help: 'SPDX identifier for source code license'
  }
]

module.exports = create
module.exports.log = log
module.exports.options = options

// create a fresh `uify` project
function create (args, cb) {
  args.date = today()
  args.devDeps = [
    'uify',
    'garnish',
    'dependency-check',
    'standard',
    'tape'
  ]
  args.deps = [
  ]

  const tasks = [
    runPrompt,
    getUser,
    chdir,
    copyFiles,
    createGit,
    devDeps,
    deps
  ]

  series(
    tasks.map(function (task) {
      return function (next) {
        task(args, next)
      }
    }),
    cb
  )
}

// query user for values
function runPrompt (args, cb) {
  const questions = []
  if (!args.name) {
    questions.push(cliOptToQuestion(options, 'name'))
  }

  if (!args.description) {
    questions.push(cliOptToQuestion(options, 'description'))
  }

  if (!questions.length) return cb()
  prompt(questions, function (res) {
    assign(args, res)
    cb()
  })
}

// get the current author if no author was specified
function getUser (args, cb) {
  if (args.author) return cb()
  args.author = {}

  const conf = rc('npm')
  if (!conf) return cb('no npm config found')

  const github = conf['init.author.github']
  if (!github) return cb('no init.author.github set')
  args.author.github = github

  const name = conf['init.author.name']
  if (!name) return cb('no init.author.name set')
  args.author.name = name

  cb()
}

// change the output directory
function chdir (args, cb) {
  const dir = path.join(args.directory, args.name)
  mkdirp(dir, function (err) {
    if (err) return cb(err)
    process.chdir(dir)
    cb()
  })
}

// copy files from dir to dist
function copyFiles (args, cb) {
  const inDir = path.join(__dirname, 'template')
  copy(inDir, process.cwd(), args, cb)
}

// create git repository
function createGit (args, cb) {
  const path = args.path
  gitInit(path, cb)
}

// install dev dependencies from npm, pull from cache by default
function devDeps (args, cb) {
  const opts = { saveDev: true, cache: true }
  install(args.devDeps, opts, function (err) {
    if (err) return cb(err)
    cb()
  })
}

// install dependencies from npm, pull from cache by default
function deps (args, cb) {
  const opts = { save: true, cache: true }
  install(args.deps, opts, function (err) {
    if (err) return cb(err)
    cb()
  })
}

// util
function cliOptToQuestion (options, name) {
  for (var i = 0; i < options.length; i++) {
    const option = options[i]
    if (option.name === name) {
      return {
        name: option.name,
        default: option.default,
        message: option.help
      }
    }
  }
  return null
}
