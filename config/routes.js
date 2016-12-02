'use strict'
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const App = require('../controllers/app')
const User = require('../controllers/user')

router.get('/test', App.test)

router.post('/user/login', User.login)

module.exports = router