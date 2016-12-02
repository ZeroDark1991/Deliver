'use strict'
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const App = require('../controllers/app')

router.get('/test', App.test)

module.exports = router