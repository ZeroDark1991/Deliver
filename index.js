'use strict'

const koa = require('koa')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const timeout = require('koa-timeout')(15000)
const router = require(path.join(__dirname,'/config/routes'))

const interval = require('./interval')
const AV = require('leanengine')

const app = koa()
// to generate session
app.keys = ['secret-session', 'gas-delivery']

app.use(logger())

// session
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 365*24*3600*1000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
}

app.use(session(CONFIG, app))
app.use(bodyParser())
// 静态文件
app.use(serve(path.join(__dirname, '/static')))

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.koa())
app.use(AV.Cloud.CookieSession({
	framework: 'koa',
	secret: 'my secret',
	maxAge: 365*24*3600*1000,
	fetchUser: true
}))

// error handle middleware
app.use(function*(next) {
  if (this.path === '/favicon.ico') return

  try {
    yield next
  } catch(error) {
    this.body = error
  }
})

// 超时处理
app.use(timeout)

// 加载router
app
  .use(router.routes())
  .use(router.allowedMethods())

interval()

module.exports = app