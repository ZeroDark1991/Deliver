'use strict'
const koa = require('koa')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const timeout = require('koa-timeout')(15000)
const router = require(path.join(__dirname,'/config/routes'))

const AV = require('leanengine')

const app = koa()
// to generate session
app.keys = ['secret-session', 'gas-delivery']
app.use(logger())
app.use(session(app))
app.use(bodyParser())
// 超时处理
app.use(timeout)
// 静态文件
app.use(serve(path.join(__dirname, '/static')))

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.koa())

// error handle middleware
app.use(function*(next) {
  try {
    yield next
  } catch (e) {
    this.body = e
  }
})
// 加载router
app
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app